import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { prisma } from '@/lib/prisma';
import { config } from '@/lib/config';
import Stripe from 'stripe';

const webhookSecret = config.stripe.webhookSecret;

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!config.stripe.isConfigured() || !stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status
        const order = await prisma.order.update({
          where: { stripeSessionId: session.id },
          data: {
            status: 'PROCESSING',
            stripePaymentId: session.payment_intent as string,
          },
        });

        // Create Printful order
        if (order.shippingAddress && config.printful.isConfigured()) {
          const shipping = order.shippingAddress as any;
          try {
            await fetch(`${config.app.url}/api/printful`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.id,
                shippingAddress: shipping,
              }),
            });
          } catch (error) {
            console.error('Failed to create Printful order:', error);
            // Don't fail the webhook - order is already created
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
