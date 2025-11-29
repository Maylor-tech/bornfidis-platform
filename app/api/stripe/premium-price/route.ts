import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { config } from '@/lib/config'

if (!config.stripe.secretKey) {
  console.warn('⚠️  Stripe secret key not configured. Price fetching will not work.')
}

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  : null

export async function GET(request: NextRequest) {
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

    // Fetch the price from Stripe
    const price = await stripe.prices.retrieve(premiumPriceId, {
      expand: ['product'],
    })

    // Format the price for display
    const amount = price.unit_amount ? price.unit_amount / 100 : 0
    const currency = price.currency.toUpperCase()
    const interval = price.recurring?.interval || 'month'
    const intervalCount = price.recurring?.interval_count || 1

    return NextResponse.json({
      priceId: premiumPriceId,
      amount,
      currency,
      interval,
      intervalCount,
      formatted: `$${amount.toFixed(2)}/${interval}`,
    })
  } catch (error) {
    console.error('Error fetching premium price:', error)

    // If Stripe error (like price not found), return fallback pricing
    if (error instanceof Stripe.errors.StripeError) {
      console.warn('Stripe error, using fallback pricing:', error.message)
      // Return fallback pricing instead of error
      return NextResponse.json({
        priceId: null,
        amount: 9.99,
        currency: 'USD',
        interval: 'month',
        intervalCount: 1,
        formatted: '$9.99/month',
        isFallback: true,
      })
    }

    // For other errors, also return fallback
    console.warn('Unknown error, using fallback pricing')
    return NextResponse.json({
      priceId: null,
      amount: 9.99,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      formatted: '$9.99/month',
      isFallback: true,
    })
  }
}

