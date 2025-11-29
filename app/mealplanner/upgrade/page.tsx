'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function UpgradePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use API route to create checkout session (better control & user tracking)
      const response = await fetch('/api/stripe/create-premium-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id || null,
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

  const benefits = [
    {
      icon: '📅',
      title: 'Full 7-Day Meal Plan',
      description: 'Access to complete weekly meal plans with breakfast, lunch, and dinner for all 7 days.',
    },
    {
      icon: '🛒',
      title: 'Full Shopping List',
      description: 'Complete categorized shopping lists with all ingredients needed for your meal plan.',
    },
    {
      icon: '🌶️',
      title: 'Jamaican Flavor Packs',
      description: 'Exclusive access to authentic Jamaican-inspired meal variations and spice combinations.',
    },
    {
      icon: '📄',
      title: 'PDF Export',
      description: 'Download beautifully formatted PDF meal plans and shopping lists for offline use.',
    },
    {
      icon: '💾',
      title: 'Dashboard Storage',
      description: 'Save and access your meal plans from your personal dashboard anytime.',
    },
    {
      icon: '📧',
      title: 'Weekly Email Delivery',
      description: 'Get your personalized meal plan delivered to your inbox every week (coming soon).',
    },
  ]

  return (
    <div className="bg-gradient-to-b from-bornfidis-cream to-bornfidis-sage min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center bg-bornfidis-cream rounded-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline text-bornfidis-green mb-4">
              Unlock Premium Meal Planner
            </h1>
            <p className="text-lg md:text-xl font-body text-bornfidis-black/90 max-w-2xl mx-auto mb-4">
              Get full access to all meal planning features and unlock the complete Bornfidis experience.
            </p>
            <p className="text-base md:text-lg font-body italic text-bornfidis-sage font-light text-bornfidis-green/70">
              "Wisdom prepares the table." — Proverbs 9:1
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border-t-4 border-bornfidis-gold">
            <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-8 font-bold text-center">
              Premium Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-bornfidis-sage/30 rounded-lg p-6 border-2 border-bornfidis-gold/20 hover:border-bornfidis-gold transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{benefit.icon}</span>
                    <div>
                      <h3 className="text-xl font-headline text-bornfidis-green mb-2 font-bold">
                        {benefit.title}
                      </h3>
                      <p className="text-bornfidis-black/90 font-body">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border-t-4 border-bornfidis-gold text-center">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 font-body">{error}</p>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-4 font-bold">
              Ready to Transform Your Meal Planning?
            </h2>
            <p className="text-lg font-body text-bornfidis-black/90 mb-8 max-w-2xl mx-auto">
              Join the Bornfidis community and unlock unlimited access to premium meal planning features.
            </p>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="bg-bornfidis-green text-white rounded-xl px-8 py-4 text-lg font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>Unlock Full Meal Planner</span>
                </>
              )}
            </button>

            <p className="text-sm font-body text-bornfidis-black/70 mt-4">
              Secure payment powered by Stripe
            </p>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/mealplanner"
              className="text-bornfidis-green font-semibold flex items-center justify-center gap-2 hover:text-bornfidis-gold transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Meal Planner
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


