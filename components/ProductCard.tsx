'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SizeOption {
  value: string
  label: string
  available?: boolean
}

interface ProductCardProps {
  name: string
  description: string
  price: number
  image: string
  imageAlt: string
  href: string
  sizeOptions?: SizeOption[]
  isPreorder?: boolean
  currency?: string
}

export default function ProductCard({
  name,
  description,
  price,
  image,
  imageAlt,
  href,
  sizeOptions = [],
  isPreorder = false,
  currency = '$',
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')

  const formatPrice = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`
  }

  return (
    <article className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link
        href={href}
        className="block focus:outline-none focus:ring-2 focus:ring-bf-green focus:ring-offset-2 rounded-lg"
        aria-label={`View ${name} product details`}
      >
        {/* Image Container */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Preorder Badge */}
          {isPreorder && (
            <div
              className="absolute top-4 right-4 bg-bf-gold text-bf-black px-3 py-1 rounded-full text-xs font-body font-bold uppercase tracking-wide"
              aria-label="Preorder item"
            >
              Preorder
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-headline text-bf-green mb-2 group-hover:text-bf-gold transition-colors">
            {name}
          </h3>
          
          <p className="text-sm font-body text-gray-700 mb-4 line-clamp-2 flex-1">
            {description}
          </p>

          {/* Size Options */}
          {sizeOptions.length > 0 && (
            <div className="mb-4">
              <label
                htmlFor={`size-${name.replace(/\s+/g, '-').toLowerCase()}`}
                className="block text-sm font-body font-semibold text-bf-black mb-2"
              >
                Size
              </label>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Size options"
              >
                {sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedSize(size.value)
                    }}
                    disabled={size.available === false}
                    className={`px-4 py-2 text-sm font-body border-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-bf-green focus:ring-offset-1 ${
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
            </div>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
            <span className="text-2xl font-headline text-bf-green" aria-label={`Price: ${formatPrice(price)}`}>
              {formatPrice(price)}
            </span>
            <span className="text-sm font-body text-bf-green group-hover:text-bf-gold transition-colors flex items-center">
              View Details
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

