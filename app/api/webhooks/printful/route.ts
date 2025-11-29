import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Verify Printful webhook signature
function verifySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(body).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!config.database.isConfigured()) {
      return NextResponse.json(
        { error: 'Database is not configured. Cannot process webhook.' },
        { status: 500 }
      );
    }

    const signature = request.headers.get('x-printful-signature');
    const body = await request.text();
    
    // Verify webhook signature if secret is configured
    const webhookSecret = config.printful.webhookSecret;
    if (webhookSecret && signature) {
      const isValid = verifySignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid Printful webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else if (config.env.isProduction) {
      // Require signature verification in production
      return NextResponse.json(
        { error: 'Webhook secret required in production' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);

    const { type, data: eventData } = data;

    console.log('Printful webhook received:', type, eventData);

    switch (type) {
      case 'order:created':
        // Order was created in Printful
        if (eventData?.order?.id) {
          const printfulOrderId = eventData.order.id.toString();
          // Find order by printfulOrderId
          const order = await prisma.order.findUnique({
            where: { printfulOrderId },
          });
          
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: { status: 'PROCESSING' },
            });
          } else {
            console.warn(`Order not found for Printful ID: ${printfulOrderId}`);
          }
        }
        break;

      case 'order:updated':
        // Order status was updated
        if (eventData?.order?.id) {
          const printfulOrderId = eventData.order.id.toString();
          const printfulStatus = eventData.order.status;
          
          let status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' = 'PROCESSING';
          
          // Map Printful status to our OrderStatus enum
          if (printfulStatus === 'fulfilled' || printfulStatus === 'inprocess') {
            status = 'PROCESSING';
          } else if (printfulStatus === 'canceled') {
            status = 'CANCELLED';
          } else if (printfulStatus === 'failed') {
            status = 'CANCELLED';
          }
          
          // Find and update order by printfulOrderId
          const order = await prisma.order.findUnique({
            where: { printfulOrderId },
          });
          
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: { status },
            });
          } else {
            console.warn(`Order not found for Printful ID: ${printfulOrderId}`);
          }
        }
        break;

      case 'package:shipped':
        // Package was shipped
        if (eventData?.shipment) {
          const printfulOrderId = eventData.shipment.order_id?.toString();
          const trackingNumber = eventData.shipment.tracking_number;
          
          // Find order by printfulOrderId and update
          const order = await prisma.order.findUnique({
            where: { printfulOrderId: printfulOrderId || '' },
          });
          
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: 'SHIPPED',
                trackingNumber: trackingNumber || null,
              },
            });
          } else {
            console.warn(`Order not found for Printful ID: ${printfulOrderId}`);
          }
        }
        break;

      case 'package:returned':
        // Package was returned
        if (eventData?.shipment) {
          const printfulOrderId = eventData.shipment.order_id?.toString();
          
          const order = await prisma.order.findUnique({
            where: { printfulOrderId: printfulOrderId || '' },
          });
          
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: { status: 'CANCELLED' },
            });
          }
        }
        break;

      case 'order:failed':
        // Order failed
        if (eventData?.order?.id) {
          const printfulOrderId = eventData.order.id.toString();
          
          const order = await prisma.order.findUnique({
            where: { printfulOrderId },
          });
          
          if (order) {
            await prisma.order.update({
              where: { id: order.id },
              data: { status: 'CANCELLED' },
            });
          }
        }
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Printful webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

