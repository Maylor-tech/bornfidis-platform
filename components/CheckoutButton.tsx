'use client'

import { useState } from 'react'

interface CheckoutButtonProps {
  productId: string
  size?: string
  className?: string
}

export default function CheckoutButton({
  productId,
  size,
  className = '',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          size: size || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`btn btn-primary bg-bf-green text-white hover:bg-opacity-90 px-8 py-4 text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={`Checkout with ${productId}`}
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-body" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

