import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { config } from '@/lib/config'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user's premium access to find Stripe customer ID
    const premiumAccess = await prisma.premiumAccess.findFirst({
      where: {
        userId: session.user.id,
        active: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    if (!premiumAccess) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Get the base URL
    const origin = request.headers.get('origin') || ''
    const host = request.headers.get('host') || ''
    let baseUrl: string

    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      baseUrl = origin
    } else if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
      const protocol = request.headers.get('x-forwarded-proto') || 'http'
      baseUrl = `${protocol}://${host}`
    } else {
      baseUrl = config.app.baseUrl || 'http://localhost:3000'
    }

    baseUrl = baseUrl.replace(/\/$/, '')

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: premiumAccess.stripeId,
      return_url: `${baseUrl}/dashboard`,
    })

    console.log(`✅ Created portal session for user: ${session.user.id}`)

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error) {
    console.error('❌ Error creating portal session:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}

