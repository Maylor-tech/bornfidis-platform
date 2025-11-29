import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface BookingRequest {
  name: string
  email: string
  phone: string
  requested_date: string
  service_type: string
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.requested_date || !body.service_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create booking object
    const booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      submitted_at: new Date().toISOString(),
      status: 'pending',
    }

    // Save booking to JSON file (for staging)
    const dataDir = join(process.cwd(), 'data', 'bookings')
    
    // Create directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    const filePath = join(dataDir, `${booking.id}.json`)
    await writeFile(filePath, JSON.stringify(booking, null, 2), 'utf-8')

    // Send email notification
    try {
      await sendBookingEmail(booking)
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails, booking is still saved
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking request submitted successfully',
        bookingId: booking.id 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendBookingEmail(booking: BookingRequest & { id: string; submitted_at: string; status: string }) {
  // Try Resend first, fallback to SendGrid
  const useResend = process.env.RESEND_API_KEY
  const useSendGrid = process.env.SENDGRID_API_KEY

  if (useResend) {
    return await sendEmailViaResend(booking)
  } else if (useSendGrid) {
    return await sendEmailViaSendGrid(booking)
  } else {
    console.warn('No email service configured (RESEND_API_KEY or SENDGRID_API_KEY)')
    return Promise.resolve()
  }
}

async function sendEmailViaResend(booking: BookingRequest & { id: string; submitted_at: string; status: string }) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'admin@bornfidis.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  const emailContent = `
    New Booking Request Received

    Booking ID: ${booking.id}
    Submitted: ${new Date(booking.submitted_at).toLocaleString()}

    Contact Information:
    Name: ${booking.name}
    Email: ${booking.email}
    Phone: ${booking.phone}

    Service Details:
    Service Type: ${booking.service_type}
    Requested Date: ${new Date(booking.requested_date).toLocaleDateString()}
    ${booking.notes ? `Notes: ${booking.notes}` : ''}

    Please review and confirm this booking request.
  `

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Booking Request: ${booking.service_type} - ${booking.name}`,
    text: emailContent,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #004225;">New Booking Request Received</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Submitted:</strong> ${new Date(booking.submitted_at).toLocaleString()}</p>
        </div>
        <h3 style="color: #004225;">Contact Information</h3>
        <ul>
          <li><strong>Name:</strong> ${booking.name}</li>
          <li><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></li>
          <li><strong>Phone:</strong> <a href="tel:${booking.phone}">${booking.phone}</a></li>
        </ul>
        <h3 style="color: #004225;">Service Details</h3>
        <ul>
          <li><strong>Service Type:</strong> ${booking.service_type}</li>
          <li><strong>Requested Date:</strong> ${new Date(booking.requested_date).toLocaleDateString()}</li>
          ${booking.notes ? `<li><strong>Notes:</strong> ${booking.notes}</li>` : ''}
        </ul>
        <p style="margin-top: 30px; color: #666;">
          Please review and confirm this booking request.
        </p>
      </div>
    `,
  })

  // Send confirmation email to customer
  await resend.emails.send({
    from: fromEmail,
    to: booking.email,
    subject: `Booking Request Received - ${booking.service_type}`,
    text: `
      Thank you for your booking request!

      We've received your request for ${booking.service_type} on ${new Date(booking.requested_date).toLocaleDateString()}.

      We'll review your request and get back to you within 24 hours to confirm the details.

      Booking ID: ${booking.id}

      If you have any questions, please don't hesitate to contact us.

      Best regards,
      The Bornfidis Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #004225;">Thank you for your booking request!</h2>
        <p>We've received your request for <strong>${booking.service_type}</strong> on <strong>${new Date(booking.requested_date).toLocaleDateString()}</strong>.</p>
        <p>We'll review your request and get back to you within 24 hours to confirm the details.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p style="margin-top: 30px;">Best regards,<br>The Bornfidis Team</p>
      </div>
    `,
  })
}

async function sendEmailViaSendGrid(booking: BookingRequest & { id: string; submitted_at: string; status: string }) {
  const sgMailModule = await import('@sendgrid/mail')
  const sgMail = sgMailModule.default
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bornfidis.com'
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@bornfidis.com'

  const emailContent = `
    New Booking Request Received

    Booking ID: ${booking.id}
    Submitted: ${new Date(booking.submitted_at).toLocaleString()}

    Contact Information:
    Name: ${booking.name}
    Email: ${booking.email}
    Phone: ${booking.phone}

    Service Details:
    Service Type: ${booking.service_type}
    Requested Date: ${new Date(booking.requested_date).toLocaleDateString()}
    ${booking.notes ? `Notes: ${booking.notes}` : ''}

    Please review and confirm this booking request.
  `

  // Send to admin
  await sgMail.send({
    to: adminEmail,
    from: fromEmail,
    subject: `New Booking Request: ${booking.service_type} - ${booking.name}`,
    text: emailContent,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #004225;">New Booking Request Received</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Submitted:</strong> ${new Date(booking.submitted_at).toLocaleString()}</p>
        </div>
        <h3 style="color: #004225;">Contact Information</h3>
        <ul>
          <li><strong>Name:</strong> ${booking.name}</li>
          <li><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></li>
          <li><strong>Phone:</strong> <a href="tel:${booking.phone}">${booking.phone}</a></li>
        </ul>
        <h3 style="color: #004225;">Service Details</h3>
        <ul>
          <li><strong>Service Type:</strong> ${booking.service_type}</li>
          <li><strong>Requested Date:</strong> ${new Date(booking.requested_date).toLocaleDateString()}</li>
          ${booking.notes ? `<li><strong>Notes:</strong> ${booking.notes}</li>` : ''}
        </ul>
        <p style="margin-top: 30px; color: #666;">
          Please review and confirm this booking request.
        </p>
      </div>
    `,
  })

  // Send confirmation to customer
  await sgMail.send({
    to: booking.email,
    from: fromEmail,
    subject: `Booking Request Received - ${booking.service_type}`,
    text: `
      Thank you for your booking request!

      We've received your request for ${booking.service_type} on ${new Date(booking.requested_date).toLocaleDateString()}.

      We'll review your request and get back to you within 24 hours to confirm the details.

      Booking ID: ${booking.id}

      If you have any questions, please don't hesitate to contact us.

      Best regards,
      The Bornfidis Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #004225;">Thank you for your booking request!</h2>
        <p>We've received your request for <strong>${booking.service_type}</strong> on <strong>${new Date(booking.requested_date).toLocaleDateString()}</strong>.</p>
        <p>We'll review your request and get back to you within 24 hours to confirm the details.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p style="margin-top: 30px;">Best regards,<br>The Bornfidis Team</p>
      </div>
    `,
  })
}

