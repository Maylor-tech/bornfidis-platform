'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface PriceInfo {
  amount: number
  currency: string
  interval: string
  formatted: string
  isFallback?: boolean
}

interface Testimonial {
  name: string
  role: string
  quote: string
  rating: number
  initials: string
}

interface FAQItem {
  question: string
  answer: string
}

export default function UpgradePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(true)
  const [showSticky, setShowSticky] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [timeSaved, setTimeSaved] = useState(0)
  const [moneyValue, setMoneyValue] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Fetch price information on mount
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const response = await fetch('/api/stripe/premium-price', {
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Always use the data if it has amount, even if it's fallback
        if (data && typeof data.amount === 'number') {
          setPriceInfo(data)
        } else {
          // Use fallback if response is invalid
          setPriceInfo({
            amount: 9.99,
            currency: 'USD',
            interval: 'month',
            intervalCount: 1,
            formatted: '$9.99/month',
            isFallback: true,
          })
        }
      } catch (err) {
        console.error('Error fetching price:', err)
        // Use fallback on error (including timeout)
        setPriceInfo({
          amount: 9.99,
          currency: 'USD',
          interval: 'month',
          intervalCount: 1,
          formatted: '$9.99/month',
          isFallback: true,
        })
      } finally {
        setLoadingPrice(false)
      }
    }
    fetchPrice()
  }, [])

  // Animate counters
  useEffect(() => {
    const animateCounter = (setter: (val: number) => void, target: number, duration: number = 2000) => {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }

    if (priceInfo) {
      animateCounter(setTimeSaved, 5)
      animateCounter(setMoneyValue, 500)
    }
  }, [priceInfo])

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetHeight
        setShowSticky(window.scrollY > heroBottom)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)

    try {
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

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah M.',
      role: 'Busy Mom of 3',
      quote: 'This has saved me so much time! No more last-minute meal decisions. The shopping lists are a game-changer.',
      rating: 5,
      initials: 'SM',
    },
    {
      name: 'James T.',
      role: 'Fitness Enthusiast',
      quote: 'The 7-day plans help me stay on track with my nutrition goals. The PDF export is perfect for meal prep Sundays.',
      rating: 5,
      initials: 'JT',
    },
    {
      name: 'Maria L.',
      role: 'Working Professional',
      quote: 'The weekly email drops are exactly what I needed. I wake up to a new meal plan every Monday. Worth every penny!',
      rating: 5,
      initials: 'ML',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes! You can cancel your subscription at any time from your dashboard. Your access will continue until the end of your current billing period.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and payment methods supported by Stripe, including Apple Pay and Google Pay.',
    },
    {
      question: 'Do I get the weekly drops immediately?',
      answer: 'Yes! Once you subscribe, you\'ll receive your first weekly meal plan email within 24 hours, and then every Monday morning thereafter.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your premium subscription, contact us within 30 days for a full refund.',
    },
    {
      question: 'Can I use this for meal prep?',
      answer: 'Absolutely! Our meal plans are designed with meal prep in mind. The PDF export feature makes it easy to take your plan to the grocery store and prep kitchen.',
    },
  ]

  const comparisonFeatures = [
    { feature: 'Meal Plan Duration', free: '3 days', premium: '7 days' },
    { feature: 'Shopping List', free: 'Limited items', premium: 'Complete list' },
    { feature: 'PDF Export', free: '✗', premium: '✓' },
    { feature: 'Weekly AI Drops', free: '✗', premium: '✓' },
    { feature: 'Recipe Variations', free: '✗', premium: '✓' },
    { feature: 'Priority Support', free: '✗', premium: '✓' },
  ]

  return (
    <div className="bg-gradient-to-b from-bornfidis-cream to-bornfidis-sage min-h-screen">
      {/* Sticky Pricing Bar */}
      {showSticky && priceInfo && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b-2 border-bornfidis-gold animate-slideDown">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <span className="text-bornfidis-green font-headline font-bold text-xl">
                  {priceInfo.formatted}
                </span>
                <span className="text-bornfidis-black/70 font-body text-sm hidden md:block">
                  Save {timeSaved}+ hours every week
                </span>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="bg-bornfidis-green text-white rounded-lg px-6 py-2 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div ref={heroRef} className="text-center space-y-6">
            {/* Test Mode Indicator */}
            {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ? (
              <div className="inline-block bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-2 animate-pulse">
                🧪 Test Mode Active - Use test card: 4242 4242 4242 4242
              </div>
            ) : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_') ? (
              <div className="inline-block bg-red-100 border-2 border-red-400 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-2">
                ⚠️ LIVE MODE - Test cards won't work! Switch to test keys for testing.
              </div>
            ) : null}
            <div className="inline-block bg-bornfidis-gold/20 text-bornfidis-green px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🏆 Most Popular
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline text-bornfidis-green mb-4">
              Transform Your Meal Planning
            </h1>
            <p className="text-xl md:text-2xl font-body text-bornfidis-black/90 max-w-3xl mx-auto mb-6">
              Join <span className="text-bornfidis-green font-bold">500+ meal planners</span> who save hours every week with our premium meal planning system.
            </p>
            <p className="text-base md:text-lg font-body italic text-bornfidis-green/70">
              "Wisdom prepares the table." — Proverbs 9:1
            </p>
          </div>

          {/* Value Proposition Calculator */}
          {priceInfo && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-bornfidis-gold">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-4 font-bold">
                  Your Time is Worth More
                </h2>
                <p className="text-lg font-body text-bornfidis-black/80">
                  See how much you'll save with premium meal planning
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-bornfidis-sage/30 rounded-xl">
                  <div className="text-5xl font-headline text-bornfidis-green mb-2">
                    {timeSaved}+
                  </div>
                  <div className="text-bornfidis-black/90 font-body font-semibold">
                    Hours Saved Per Week
                  </div>
                  <div className="text-sm text-bornfidis-black/70 mt-2">
                    No more meal planning stress
                  </div>
                </div>
                <div className="text-center p-6 bg-bornfidis-gold/20 rounded-xl border-2 border-bornfidis-gold">
                  <div className="text-5xl font-headline text-bornfidis-green mb-2">
                    ${moneyValue}
                  </div>
                  <div className="text-bornfidis-black/90 font-body font-semibold">
                    Monthly Value in Your Time
                  </div>
                  <div className="text-sm text-bornfidis-black/70 mt-2">
                    At $25/hour average
                  </div>
                </div>
                <div className="text-center p-6 bg-bornfidis-sage/30 rounded-xl">
                  <div className="text-5xl font-headline text-bornfidis-green mb-2">
                    {priceInfo.formatted}
                  </div>
                  <div className="text-bornfidis-black/90 font-body font-semibold">
                    Premium Subscription
                  </div>
                  <div className="text-sm text-bornfidis-green font-semibold mt-2">
                    {priceInfo.amount ? `Save ${Math.round((moneyValue - priceInfo.amount) / priceInfo.amount * 100)}%` : 'Incredible Value'}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block bg-bornfidis-green/10 border-2 border-bornfidis-green rounded-lg px-6 py-3">
                  <span className="text-bornfidis-green font-semibold">
                    💰 30-Day Money-Back Guarantee
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-bornfidis-gold">
            <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-8 font-bold text-center">
              Free vs Premium
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-bornfidis-green/20">
                    <th className="text-left py-4 px-4 font-headline text-bornfidis-green text-lg">Feature</th>
                    <th className="text-center py-4 px-4 font-headline text-bornfidis-black text-lg">Free</th>
                    <th className="text-center py-4 px-4 font-headline text-bornfidis-green text-lg bg-bornfidis-gold/10 border-2 border-bornfidis-gold rounded-lg">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-bornfidis-green/10 hover:bg-bornfidis-sage/20 transition-colors"
                    >
                      <td className="py-4 px-4 font-body text-bornfidis-black font-semibold">
                        {item.feature}
                      </td>
                      <td className="py-4 px-4 text-center font-body text-bornfidis-black/70">
                        {item.free}
                      </td>
                      <td className="py-4 px-4 text-center font-body text-bornfidis-green font-bold bg-bornfidis-gold/5">
                        {item.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Premium Benefits Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-bornfidis-gold">
            <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-8 font-bold text-center">
              Premium Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '📅',
                  title: 'Full 7-Day Meal Plans',
                  description: 'Access complete weekly meal plans with breakfast, lunch, and dinner for all 7 days (vs 3-day free plan).',
                },
                {
                  icon: '🛒',
                  title: 'Complete Shopping Lists',
                  description: 'Get full categorized shopping lists with all ingredients needed for your entire meal plan.',
                },
                {
                  icon: '📄',
                  title: 'PDF Export Capability',
                  description: 'Download beautifully formatted PDF meal plans and shopping lists for offline use.',
                },
                {
                  icon: '📧',
                  title: 'Weekly AI Meal Drops via Email',
                  description: 'Receive personalized meal plans delivered directly to your inbox every week.',
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-bornfidis-sage/30 rounded-lg p-6 border-2 border-bornfidis-gold/20 hover:border-bornfidis-gold transition-all duration-300 hover:shadow-md"
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

          {/* Social Proof */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-8 font-bold text-center">
              Loved by Meal Planners Everywhere
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 border-2 border-bornfidis-gold/20 hover:border-bornfidis-gold transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-bornfidis-green text-white flex items-center justify-center font-headline font-bold text-lg">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-headline text-bornfidis-green font-bold">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-bornfidis-black/70 font-body">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-bornfidis-gold text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-bornfidis-black/90 font-body italic">
                    "{testimonial.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-bornfidis-gold text-center">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <p className="text-red-700 font-body">{error}</p>
              </div>
            )}

            <h2 className="text-4xl md:text-5xl font-headline text-bornfidis-green mb-4 font-bold">
              Ready to Transform Your Meal Planning?
            </h2>
            <p className="text-xl font-body text-bornfidis-black/90 mb-8 max-w-2xl mx-auto">
              Join the Bornfidis community and unlock unlimited access to premium meal planning features.
            </p>

            {/* Pricing Display */}
            {loadingPrice ? (
              <div className="mb-8">
                <div className="inline-block animate-pulse bg-bornfidis-sage/30 rounded-lg px-6 py-3">
                  <span className="text-bornfidis-green font-body">Loading pricing...</span>
                </div>
              </div>
            ) : priceInfo ? (
              <div className="mb-8">
                <div className="inline-block bg-bornfidis-gold/20 rounded-lg px-8 py-6 border-2 border-bornfidis-gold">
                  <p className="text-sm font-body text-bornfidis-green/80 mb-2">Premium Subscription</p>
                  <p className="text-5xl font-headline text-bornfidis-green font-bold mb-2">
                    {priceInfo.formatted}
                  </p>
                  {priceInfo.interval === 'month' && (
                    <p className="text-sm font-body text-bornfidis-black/70">
                      Billed monthly • Cancel anytime
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="bg-bornfidis-green text-white rounded-xl px-10 py-5 text-xl font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6 text-white"
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
                      className="w-6 h-6"
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
                    <span>Subscribe Now</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm font-body text-bornfidis-black/70 mb-4">
              Secure payment powered by Stripe • 30-day money-back guarantee
            </p>
            <p className="text-xs font-body text-bornfidis-black/60">
              Join 500+ meal planners already saving time every week
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-bornfidis-gold">
            <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-8 font-bold text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-2 border-bornfidis-gold/20 rounded-lg overflow-hidden hover:border-bornfidis-gold transition-colors"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full text-left p-6 bg-bornfidis-sage/10 hover:bg-bornfidis-sage/20 transition-colors flex items-center justify-between"
                  >
                    <span className="font-headline text-bornfidis-green font-bold text-lg pr-4">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-6 h-6 text-bornfidis-green transition-transform flex-shrink-0 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openFAQ === index && (
                    <div className="p-6 pt-0">
                      <p className="text-bornfidis-black/90 font-body leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
