import { NextRequest, NextResponse } from 'next/server';
import { fetchPrintfulProducts, createPrintfulOrder } from '@/utils/printful';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.PRINTFUL_API_KEY) {
      return NextResponse.json(
        { error: 'Printful API key not configured' },
        { status: 500 }
      );
    }

    const products = await fetchPrintfulProducts();
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching Printful products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Printful products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.PRINTFUL_API_KEY) {
      return NextResponse.json(
        { error: 'Printful API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { orderId, shippingAddress } = body;

    // Get order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Create Printful order
    const printfulOrder = await createPrintfulOrder({
      recipient: {
        name: shippingAddress.name,
        address1: shippingAddress.address1,
        city: shippingAddress.city,
        state_code: shippingAddress.state,
        country_code: shippingAddress.country,
        zip: shippingAddress.zip,
      },
      items: order.orderItems.map(item => ({
        variant_id: parseInt(item.product.printfulId || '0'),
        quantity: item.quantity,
      })),
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PROCESSING' },
    });

    return NextResponse.json({ success: true, printfulOrder });
  } catch (error: any) {
    console.error('Error creating Printful order:', error);
    return NextResponse.json(
      { error: 'Failed to create Printful order' },
      { status: 500 }
    );
  }
}




