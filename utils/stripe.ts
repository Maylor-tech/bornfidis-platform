import Stripe from 'stripe';
import { config } from '@/lib/config';

if (!config.stripe.secretKey) {
  console.warn('⚠️  STRIPE_SECRET_KEY is not set. Stripe functionality will not work.');
}

export const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  : null;

export async function createCheckoutSession(
  items: Array<{ priceId: string; quantity: number }>,
  userId?: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${config.app.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app.url}/cart`,
    client_reference_id: userId,
    metadata: {
      userId: userId || '',
    },
  });

  return session;
}



