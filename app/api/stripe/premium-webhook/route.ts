import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { config } from '@/lib/config'
import { prisma } from '@/lib/prisma'

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || config.stripe.webhookSecret

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Check if this is a premium meal planner purchase
      // For API-created sessions: check metadata
      // For Payment Links: check if it's a subscription (assume premium)
      const isPremiumPurchase = 
        session.metadata?.productType === 'meal_planner_premium' ||
        session.mode === 'subscription' // Payment Links with subscriptions

      if (!isPremiumPurchase) {
        return NextResponse.json({ received: true })
      }

      // Try to get userId from metadata first, then try to find by email
      let userId = session.metadata?.userId

      // If no userId in metadata (Payment Link scenario), try to find user by email
      if (!userId || userId === 'anonymous') {
        const customerEmail = session.customer_email || 
          (typeof session.customer === 'string' 
            ? null 
            : (session.customer as Stripe.Customer)?.email)
        
        if (customerEmail) {
          // Try to find user by email
          const user = await prisma.user.findUnique({
            where: { email: customerEmail },
            select: { id: true },
          })
          if (user) {
            userId = user.id
            console.log(`Found user by email: ${customerEmail} -> ${userId}`)
          }
        }
      }

      if (!userId || userId === 'anonymous') {
        console.warn('Premium webhook: Could not determine userId from metadata or email')
        // Still return success to avoid webhook retries
        return NextResponse.json({ received: true })
      }

      // Get or create customer
      let customerId = session.customer as string

      // If customer is a string ID, use it; if it's a Customer object, extract the ID
      if (typeof customerId !== 'string') {
        customerId = session.customer?.toString() || session.id
      }

      // Check if user already has premium access
      const existingAccess = await prisma.premiumAccess.findFirst({
        where: {
          userId: userId,
          active: true,
        },
      })

      if (existingAccess) {
        // Update existing access
        await prisma.premiumAccess.update({
          where: { id: existingAccess.id },
          data: {
            stripeId: customerId,
            active: true,
            updatedAt: new Date(),
          },
        })
      } else {
        // Create new premium access
        await prisma.premiumAccess.create({
          data: {
            userId: userId,
            stripeId: customerId,
            active: true,
          },
        })
      }

      console.log(`✅ Premium access granted for user: ${userId}, customer: ${customerId}`)
    }

    // Handle subscription updates
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription

      // Find premium access by Stripe customer ID
      const premiumAccess = await prisma.premiumAccess.findFirst({
        where: {
          stripeId: subscription.customer as string,
        },
      })

      if (premiumAccess) {
        // Update active status based on subscription status
        const isActive = subscription.status === 'active' || subscription.status === 'trialing'

        await prisma.premiumAccess.update({
          where: { id: premiumAccess.id },
          data: {
            active: isActive,
            updatedAt: new Date(),
          },
        })

        console.log(`✅ Premium access ${isActive ? 'activated' : 'deactivated'} for user: ${premiumAccess.userId}, subscription: ${subscription.id}`)
      } else {
        console.warn(`⚠️ Subscription ${subscription.id} found but no premium access record exists`)
      }
    }

    console.log(`✅ Webhook processed successfully: ${event.type}`)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Error processing premium webhook:', error)
    console.error('Event type:', event?.type)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}


