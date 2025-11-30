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

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Verifying Stripe session: ${sessionId} for user: ${session.user.id}`)

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    })

    // Verify this is a premium subscription
    const isPremiumPurchase =
      checkoutSession.metadata?.productType === 'meal_planner_premium' ||
      checkoutSession.mode === 'subscription'

    if (!isPremiumPurchase) {
      return NextResponse.json(
        { error: 'Not a premium subscription' },
        { status: 400 }
      )
    }

    // Verify payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Get customer ID
    const customerId =
      typeof checkoutSession.customer === 'string'
        ? checkoutSession.customer
        : checkoutSession.customer?.id || checkoutSession.id

    // Check if premium access already exists
    let premiumAccess = await prisma.premiumAccess.findFirst({
      where: {
        userId: session.user.id,
        active: true,
      },
    })

    if (premiumAccess) {
      // Update existing access
      premiumAccess = await prisma.premiumAccess.update({
        where: { id: premiumAccess.id },
        data: {
          stripeId: customerId,
          active: true,
          updatedAt: new Date(),
        },
      })
      console.log(`✅ Updated existing premium access for user: ${session.user.id}`)
    } else {
      // Create new premium access
      premiumAccess = await prisma.premiumAccess.create({
        data: {
          userId: session.user.id,
          stripeId: customerId,
          active: true,
        },
      })
      console.log(`✅ Created new premium access for user: ${session.user.id}`)
    }

    return NextResponse.json({
      success: true,
      isPremium: true,
      subscriptionId: customerId,
      message: 'Premium access activated',
    })
  } catch (error) {
    console.error('❌ Error verifying session:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}

