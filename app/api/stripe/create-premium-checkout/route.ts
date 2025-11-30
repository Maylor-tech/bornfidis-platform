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
    // Try multiple methods to get the correct base URL
    const origin = request.headers.get('origin') || ''
    const referer = request.headers.get('referer') || ''
    const host = request.headers.get('host') || ''
    
    // Determine base URL with proper port detection
    let baseUrl: string
    
    // First, try to use NEXT_PUBLIC_BASE_URL if set
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')
    } else if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      // Use origin if it's localhost (preserves port like 3003)
      baseUrl = origin
    } else if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
      // Use host header with protocol
      const protocol = request.headers.get('x-forwarded-proto') || 'http'
      baseUrl = `${protocol}://${host}`
    } else if (referer) {
      // Extract from referer
      try {
        const refererUrl = new URL(referer)
        baseUrl = `${refererUrl.protocol}//${refererUrl.host}`
      } catch {
        baseUrl = config.app.baseUrl || 'http://localhost:3000'
      }
    } else {
      // Fallback to config or default
      baseUrl = config.app.baseUrl || 'http://localhost:3000'
    }

    // Ensure baseUrl is absolute and doesn't end with slash
    baseUrl = baseUrl.replace(/\/$/, '')
    
    // Build success and cancel URLs
    const successUrl = `${baseUrl}/mealplanner/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/mealplanner/upgrade?canceled=1`

    // Log for debugging
    console.log('🔍 Creating premium checkout session:', {
      userId: userId || 'anonymous',
      baseUrl,
      successUrl,
      cancelUrl,
      priceId: premiumPriceId,
      origin,
      host,
      referer,
    })

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: premiumPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || 'anonymous',
        productType: 'meal_planner_premium',
        baseUrl, // Store for debugging
      },
      customer_email: session?.user?.email || undefined,
      allow_promotion_codes: true,
    })

    console.log('✅ Checkout session created:', {
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      successUrl: checkoutSession.success_url,
      cancelUrl: checkoutSession.cancel_url,
    })

    return NextResponse.json({ 
      sessionId: checkoutSession.id, 
      url: checkoutSession.url,
      successUrl: checkoutSession.success_url,
    })
  } catch (error) {
    console.error('Error creating premium checkout session:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


