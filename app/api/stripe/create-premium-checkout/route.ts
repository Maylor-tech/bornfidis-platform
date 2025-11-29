import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { config } from '@/lib/config'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

if (!config.stripe.secretKey) {
  console.warn('⚠️  Stripe secret key not configured. Payment processing will not work.')
}

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!config.stripe.isConfigured() || !stripe) {
      return NextResponse.json(
        {
          error:
            'Stripe is not configured. Please add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.',
        },
        { status: 500 }
      )
    }

    // Check for premium price ID
    const premiumPriceId =
      process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID ||
      config.stripe.priceIds?.premium

    if (!premiumPriceId) {
      return NextResponse.json(
        {
          error:
            'Premium price ID not configured. Please add NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID to your .env.local file.',
        },
        { status: 500 }
      )
    }

    // Get user session
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    // Get the base URL for success/cancel URLs
    // For local development, always use localhost:3000
    // In production, use the configured base URL or origin
    const origin = request.headers.get('origin') || ''
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
    const baseUrl = isLocalhost 
      ? 'http://localhost:3000'
      : (config.app.baseUrl || origin || 'http://localhost:3000')

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: premiumPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Can be 'payment' for one-time or 'subscription' for recurring
      success_url: `${baseUrl}/mealplanner?premium=1`,
      cancel_url: `${baseUrl}/mealplanner/upgrade?canceled=1`,
      metadata: {
        userId: userId || 'anonymous',
        productType: 'meal_planner_premium',
      },
      customer_email: session?.user?.email || undefined,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating premium checkout session:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


