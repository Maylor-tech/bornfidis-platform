'use client'

import { useState } from 'react'
import { Product } from '@/lib/products'
import CheckoutButton from '@/components/CheckoutButton'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline text-bf-green mb-4">
        {product.name}
      </h1>

      <div className="mb-6">
        <span className="text-3xl md:text-4xl font-headline text-bf-green">
          ${product.price.toFixed(2)}
        </span>
      </div>

      <p className="text-base md:text-lg font-body text-gray-700 mb-8">
        {product.description}
      </p>

      {/* Size Selection */}
      {product.sizeOptions && product.sizeOptions.length > 0 && (
        <div className="mb-8">
          <label className="block text-sm font-body font-semibold text-bf-black mb-4">
            Select Size
          </label>
          <div className="flex flex-wrap gap-3">
            {product.sizeOptions.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => setSelectedSize(size.value)}
                disabled={size.available === false}
                className={`px-6 py-3 text-base font-body border-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-bf-green focus:ring-offset-2 ${
                  selectedSize === size.value
                    ? 'border-bf-green bg-bf-green text-white'
                    : size.available === false
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-bf-black hover:border-bf-green'
                }`}
                aria-pressed={selectedSize === size.value}
                aria-disabled={size.available === false}
              >
                {size.label}
              </button>
            ))}
          </div>
          {product.sizeOptions.length > 0 && !selectedSize && (
            <p className="mt-2 text-sm text-gray-600 font-body">
              Please select a size
            </p>
          )}
        </div>
      )}

      {/* Checkout Button */}
      <div className="mt-auto">
        <CheckoutButton 
          productId={product.id} 
          size={selectedSize || undefined}
        />
      </div>

      {/* Additional Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-headline text-bf-green mb-4">
          Product Details
        </h2>
        <ul className="space-y-2 text-sm font-body text-gray-700">
          <li>• Premium quality materials</li>
          <li>• Sustainable production</li>
          <li>• Free shipping on orders over $50</li>
          {product.isPreorder && (
            <li>• Preorder items ship within 2-3 weeks</li>
          )}
        </ul>
      </div>
    </div>
  )
}

