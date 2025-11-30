import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { config } from '@/lib/config'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    if (!resend) {
      console.warn('Resend not configured, skipping welcome email')
      return NextResponse.json({ sent: false, reason: 'Resend not configured' })
    }

    const body = await request.json()
    const { email, userName, sessionId } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      )
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@bornfidis.com'
    const baseUrl = config.app.baseUrl || 'https://bornfidis-platform.vercel.app'

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0A3D2F 0%, #0A3D2F 100%); color: white; padding: 40px; text-align: center;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Welcome to Premium! 🎉</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Bornfidis Smart Meal Planner</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 40px; background-color: #FAF8F2;">
      <p style="font-size: 18px; line-height: 1.6; color: #1A1A1A; margin: 0 0 20px 0;">
        Hi ${userName || 'there'},
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #1A1A1A; margin: 0 0 20px 0;">
        Welcome to Bornfidis Premium! We're thrilled to have you join our community of meal planners.
      </p>
      
      <div style="background-color: #E7EFE5; border-left: 4px solid #D4AF37; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h2 style="color: #0A3D2F; margin: 0 0 15px 0; font-size: 20px;">Your Premium Benefits:</h2>
        <ul style="color: #1A1A1A; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Full 7-day meal plans (vs 3-day free)</li>
          <li>Complete shopping lists</li>
          <li>PDF export capability</li>
          <li>Weekly AI meal drops via email</li>
        </ul>
      </div>

      <h2 style="color: #0A3D2F; margin: 30px 0 15px 0; font-size: 20px;">Getting Started:</h2>
      <ol style="color: #1A1A1A; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Visit your meal planner to create your first 7-day meal plan</li>
        <li>Explore all premium features - PDF export, complete shopping lists, and more</li>
        <li>Check your dashboard to manage your subscription</li>
        <li>Look forward to your first weekly meal drop next Monday!</li>
      </ol>
    </div>

    <!-- Scripture Divider -->
    <div style="border-top: 2px solid #D4AF37; padding: 20px; text-align: center; background-color: #E7EFE5;">
      <p style="font-style: italic; font-size: 16px; color: #0A3D2F; margin: 10px 0;">
        "Wisdom prepares the table." — Proverbs 9:1
      </p>
    </div>

    <!-- CTA Button -->
    <div style="padding: 30px; text-align: center;">
      <a href="${baseUrl}/mealplanner" style="display: inline-block; background-color: #0A3D2F; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Start Meal Planning →
      </a>
    </div>

    <!-- Support Section -->
    <div style="padding: 20px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
      <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">
        <strong>Need help?</strong> We're here for you!
      </p>
      <p style="font-size: 14px; color: #666; margin: 0;">
        Email us at <a href="mailto:support@bornfidis.com" style="color: #0A3D2F;">support@bornfidis.com</a> or visit your <a href="${baseUrl}/dashboard" style="color: #0A3D2F;">dashboard</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
      <p style="margin: 5px 0;">Bornfidis Smart Meal Planner</p>
      <p style="margin: 5px 0;">Adapt. Explore. Empower.</p>
    </div>
  </div>
</body>
</html>
    `

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '🎉 Welcome to Bornfidis Premium!',
      html: emailHtml,
    })

    console.log(`✅ Welcome email sent to ${email}`)

    return NextResponse.json({ sent: true })
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    // Don't fail the request if email fails
    return NextResponse.json({ sent: false, error: 'Email failed but subscription is active' })
  }
}

