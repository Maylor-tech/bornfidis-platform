import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/utils/stripe';
import { prisma } from '@/lib/prisma';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Validate Stripe configuration
    if (!config.stripe.isConfigured()) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Calculate total from items
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Create Stripe checkout session
    const stripeSession = await createCheckoutSession(
      items.map((item: any) => ({
        priceId: item.priceId,
        quantity: item.quantity,
      })),
      session?.user?.id
    );

    // Create order in database (only if database is configured)
    let order;
    if (config.database.isConfigured()) {
      try {
        order = await prisma.order.create({
          data: {
            userId: session?.user?.id || null,
            stripeSessionId: stripeSession.id,
            status: 'PENDING',
            total: total,
            shippingAddress: shippingAddress || null,
            orderItems: {
              create: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        });
      } catch (dbError: any) {
        console.error('Failed to create order in database:', dbError);
        // Continue even if database save fails - Stripe session is created
        // The webhook will handle order creation on payment success
      }
    } else {
      console.warn('Database not configured - order will be created via webhook');
    }

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
      orderId: order?.id || null,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}



