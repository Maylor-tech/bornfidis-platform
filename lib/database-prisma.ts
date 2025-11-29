/**
 * Database functions using Prisma
 * This replaces the localStorage-based functions in lib/database.ts
 */

import { prisma } from './prisma';
import { config } from './config';
import type { Prisma } from '@prisma/client';

// Re-export types from Prisma
export type { User, Product, Order, OrderItem, Booking } from '@prisma/client';

/**
 * Design Functions
 */
export async function saveDesign(design: {
  userId?: string;
  productType: string;
  designData: any;
  previewImageUrl?: string;
  designFileUrl?: string;
}) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured. Please set DATABASE_URL in .env.local');
  }

  // Note: Design storage would need a Design model in Prisma schema
  // For now, we'll use a JSON field or create a separate designs table
  // This is a placeholder - you may need to add a Design model to schema.prisma
  throw new Error('Design storage with Prisma not yet implemented. Add Design model to schema.');
}

export async function getDesign(id: string) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }
  // Implementation depends on Design model
  return null;
}

export async function getDesigns(userId?: string) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }
  // Implementation depends on Design model
  return [];
}

/**
 * Order Functions
 */
export async function saveOrder(order: {
  userId?: string;
  stripeSessionId?: string;
  stripePaymentId?: string;
  total: number;
  shippingAddress?: any;
  status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured. Please set DATABASE_URL in .env.local');
  }

  const createdOrder = await prisma.order.create({
    data: {
      userId: order.userId || null,
      stripeSessionId: order.stripeSessionId || null,
      stripePaymentId: order.stripePaymentId || null,
      total: order.total,
      shippingAddress: order.shippingAddress || null,
      status: order.status || 'PENDING',
      orderItems: {
        create: order.orderItems.map(item => ({
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
      user: true,
    },
  });

  return createdOrder;
}

export async function getOrder(id: string) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  return order;
}

export async function getOrders(userId?: string) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  const orders = await prisma.order.findMany({
    where: userId ? { userId } : undefined,
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
  updates?: Partial<{
    stripePaymentId: string;
    shippingAddress: any;
    printfulOrderId: string;
    trackingNumber: string;
  }>
) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      ...updates,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
}

export async function updateOrderByPrintfulId(
  printfulOrderId: string,
  updates: {
    status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    trackingNumber?: string;
  }
) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  // Note: You may need to add printfulOrderId field to Order model
  // For now, we'll search by metadata or external_id
  // This is a placeholder - adjust based on your schema
  const order = await prisma.order.findFirst({
    where: {
      // Add search logic based on your schema
      // For example, if you store printfulOrderId in metadata
    },
  });

  if (!order) {
    return null;
  }

  return await prisma.order.update({
    where: { id: order.id },
    data: {
      status: updates.status,
      // Add tracking number to metadata or separate field
    },
  });
}

/**
 * Booking Functions
 */
export async function saveChefBooking(booking: {
  userId: string;
  serviceType: string;
  date: Date;
  time: string;
  guests: number;
  location?: string;
  specialRequests?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  calendlyEventId?: string;
}) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured. Please set DATABASE_URL in .env.local');
  }

  const createdBooking = await prisma.booking.create({
    data: {
      userId: booking.userId,
      serviceType: booking.serviceType,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      location: booking.location || null,
      specialRequests: booking.specialRequests || null,
      status: booking.status || 'PENDING',
      calendlyEventId: booking.calendlyEventId || null,
    },
    include: {
      user: true,
    },
  });

  return createdBooking;
}

export async function getChefBooking(id: string) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  return booking;
}

export async function getChefBookings(userId?: string) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  const bookings = await prisma.booking.findMany({
    where: userId ? { userId } : undefined,
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return bookings;
}

/**
 * Product Functions
 */
export async function getProduct(id: string) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  return product;
}

export async function getProducts(activeOnly: boolean = true) {
  if (!config.database.isConfigured()) {
    throw new Error('Database is not configured');
  }

  const products = await prisma.product.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products;
}

/**
 * Helper function to check if database is available
 */
export function isDatabaseAvailable(): boolean {
  return config.database.isConfigured();
}


