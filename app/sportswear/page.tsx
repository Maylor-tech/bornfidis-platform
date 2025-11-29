'use client';

import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/products';

export default function SportswearPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bf-green via-bf-green/90 to-bf-green/80 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-headline mb-6">
              Bornfidis Sportswear
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Premium activewear designed for adventure
            </p>
            <p className="text-lg md:text-xl mb-10 text-white/80">
              Sustainable, versatile, and built to move with you.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-headline text-bf-green">
              All Products
            </h2>
            <div className="text-gray-600">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.imageAlt || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-bf-green mb-2 group-hover:text-bf-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-bf-gold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.isPreorder && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Preorder
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Why Choose Bornfidis Sportswear?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-headline text-bf-green mb-3">Sustainable Materials</h3>
              <p className="text-gray-600">
                Eco-friendly fabrics that don't compromise on performance or style.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-xl font-headline text-bf-green mb-3">Versatile Design</h3>
              <p className="text-gray-600">
                Seamlessly transition from outdoor adventures to urban exploration.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-headline text-bf-green mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Durable construction built to withstand your most challenging adventures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




