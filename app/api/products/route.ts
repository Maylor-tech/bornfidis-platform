import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchPrintfulProducts } from '@/utils/printful';

export async function GET(request: NextRequest) {
  try {
    // Fetch products from database
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    // If no products in DB, sync from Printful
    if (dbProducts.length === 0 && process.env.PRINTFUL_API_KEY) {
      const printfulProducts = await fetchPrintfulProducts();
      
      // Sync products to database (simplified - you'd want to map Printful data properly)
      for (const product of printfulProducts.slice(0, 20)) { // Limit to 20 for initial sync
        await prisma.product.upsert({
          where: { printfulId: product.id.toString() },
          update: {},
          create: {
            printfulId: product.id.toString(),
            name: product.name,
            description: product.description || 'Premium sportswear item',
            price: parseFloat(product.variants[0]?.price || '0'),
            image: product.images[0] || '/images/placeholder.jpg',
            category: product.type || 'sportswear',
          },
        });
      }

      // Fetch again after sync
      const syncedProducts = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ products: syncedProducts });
    }

    return NextResponse.json({ products: dbProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}




