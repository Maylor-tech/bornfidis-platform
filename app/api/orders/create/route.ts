import { NextRequest, NextResponse } from 'next/server';
import { createPrintfulOrder, uploadDesignFile, getVariantId } from '@/lib/printful';
import { config } from '@/lib/config';
import Stripe from 'stripe';

if (!config.stripe.secretKey) {
  console.warn('⚠️  Stripe secret key not configured.');
}

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  : null;

interface OrderRequest {
  designId: string;
  productType: string;
  size: string;
  quantity: number;
  shippingAddress: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone?: string;
    email?: string;
  };
  paymentIntentId: string;
  designData: {
    frontImageUrl?: string;
    backImageUrl?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    if (!config.printful.isConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Printful API key not configured. Please add PRINTFUL_API_KEY to your .env.local file.' 
        },
        { status: 500 }
      );
    }

    if (!config.stripe.isConfigured() || !stripe) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.' 
        },
        { status: 500 }
      );
    }

    const orderData: OrderRequest = await request.json();

    const {
      designId,
      productType,
      size,
      quantity,
      shippingAddress,
      paymentIntentId,
      designData,
    } = orderData;

    // Validate required fields
    if (!designId || !productType || !size || !quantity || !shippingAddress || !paymentIntentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Upload design files to Printful
    let frontFile, backFile;
    
    if (designData.frontImageUrl) {
      frontFile = await uploadDesignFile(designData.frontImageUrl);
    } else {
      return NextResponse.json(
        { success: false, error: 'Design file is required' },
        { status: 400 }
      );
    }

    if (designData.backImageUrl) {
      backFile = await uploadDesignFile(designData.backImageUrl);
    }

    // 2. Get variant ID
    const variantId = getVariantId(productType, size);

    // 3. Create Printful order
    const printfulOrder = await createPrintfulOrder({
      recipient: {
        name: shippingAddress.name,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2,
        city: shippingAddress.city,
        state_code: shippingAddress.state,
        country_code: shippingAddress.country,
        zip: shippingAddress.zip,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
      },
      items: [{
        variant_id: variantId,
        quantity: quantity,
        files: [
          { url: frontFile.url, type: 'front' as const },
          ...(backFile ? [{ url: backFile.url, type: 'back' as const }] : []),
        ],
      }],
      external_id: designId, // Link to our internal design ID
    });

    // 4. Confirm Stripe payment
    try {
      await stripe.paymentIntents.confirm(paymentIntentId);
    } catch (stripeError: any) {
      // If payment fails, we should cancel the Printful order
      console.error('Payment confirmation failed:', stripeError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment failed',
          details: stripeError.message 
        },
        { status: 402 }
      );
    }

    // 5. Save order to database
    const { prisma } = await import('@/lib/prisma');
    
    if (config.database.isConfigured()) {
      try {
        // Calculate total from Printful order response
        // Note: Printful order response should include pricing, but for now we'll use a default
        // In production, you should extract the actual price from printfulOrder response
        const total = printfulOrder.data?.total || 0;
        
        // Find or create product for this order
        // Note: You may need to create products in database first
        let product = await prisma.product.findFirst({
          where: { name: { contains: productType } },
        });
        
        if (!product) {
          // Create a placeholder product if it doesn't exist
          // TODO: Pre-populate products from Printful catalog
          product = await prisma.product.create({
            data: {
              name: `${productType} - Custom Design`,
              description: `Custom ${productType} with user design`,
              price: total,
              image: designData.frontImageUrl || '/images/placeholder.jpg',
              category: productType,
            },
          });
        }
        
        const dbOrder = await prisma.order.create({
          data: {
            printfulOrderId: printfulOrder.orderId?.toString(),
            status: 'PROCESSING',
            total: total,
            shippingAddress: shippingAddress,
            orderItems: {
              create: {
                productId: product.id,
                quantity: quantity,
                price: total / quantity,
              },
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
        
        console.log('Order saved to database:', dbOrder.id);
      } catch (dbError) {
        console.error('Failed to save order to database:', dbError);
        // Don't fail the request - Printful order was created successfully
      }
    } else {
      console.warn('Database not configured - order not saved to database');
    }

    // 6. Send confirmation email (optional - implement email service)
    // if (config.auth.email.enabled()) {
    //   try {
    //     await sendOrderConfirmationEmail(order);
    //   } catch (emailError) {
    //     console.error('Failed to send confirmation email:', emailError);
    //   }
    // }

    return NextResponse.json({
      success: true,
      orderId: printfulOrder.orderId,
      printfulOrderId: printfulOrder.orderId,
      status: printfulOrder.status,
      tracking: printfulOrder.tracking,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}

