'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

function PremiumSuccessContent() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [isPremium, setIsPremium] = useState(false)
  const [checking, setChecking] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Get session ID from URL
    const sessionIdParam = searchParams?.get('session_id')
    if (sessionIdParam) {
      setSessionId(sessionIdParam)
      console.log('✅ Payment successful! Session ID:', sessionIdParam)
    }

    const checkPremiumStatus = async () => {
      try {
        const response = await fetch('/api/mealplanner/premium-status')
        const data = await response.json()
        setIsPremium(data.isPremium || false)
        console.log('Premium status check:', data.isPremium ? '✅ Active' : '⏳ Processing...')
      } catch (err) {
        console.error('Error checking premium status:', err)
        setIsPremium(false)
      } finally {
        setChecking(false)
      }
    }

    // Check immediately and then again after delays (webhook might be processing)
    checkPremiumStatus()
    const timeout1 = setTimeout(checkPremiumStatus, 2000)
    const timeout2 = setTimeout(checkPremiumStatus, 5000)
    
    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [searchParams])

  return (
    <div className="bg-gradient-to-b from-bornfidis-cream to-bornfidis-sage min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-bornfidis-green rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline text-bornfidis-green mb-4">
              Welcome to Premium! 🎉
            </h1>
            <p className="text-xl md:text-2xl font-body text-bornfidis-black/90 mb-2">
              Your subscription is now active
            </p>
            {checking ? (
              <p className="text-bornfidis-green/70 font-body">Verifying your access...</p>
            ) : isPremium ? (
              <p className="text-bornfidis-green font-body font-semibold">
                ✓ Premium access confirmed!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-bornfidis-black/70 font-body">
                  Your payment is processing. Premium access will be activated shortly.
                </p>
                {sessionId && (
                  <p className="text-xs text-bornfidis-black/50 font-body">
                    Session: {sessionId.slice(0, 20)}...
                  </p>
                )}
                <p className="text-sm text-bornfidis-black/60 font-body">
                  If access doesn't activate within a few minutes, please contact support.
                </p>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border-t-4 border-bornfidis-gold mb-8">
            <h2 className="text-3xl font-headline text-bornfidis-green mb-6 font-bold">
              What's Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-bornfidis-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-bornfidis-green font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-headline text-bornfidis-green font-bold mb-1">
                    Generate Your First 7-Day Meal Plan
                  </h3>
                  <p className="text-bornfidis-black/80 font-body">
                    Head to the meal planner and create your complete weekly meal plan with all premium features unlocked.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-bornfidis-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-bornfidis-green font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-headline text-bornfidis-green font-bold mb-1">
                    Download Your PDF
                  </h3>
                  <p className="text-bornfidis-black/80 font-body">
                    Export your meal plans and shopping lists as beautiful PDFs for offline use.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-bornfidis-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-bornfidis-green font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-headline text-bornfidis-green font-bold mb-1">
                    Get Weekly Meal Drops
                  </h3>
                  <p className="text-bornfidis-black/80 font-body">
                    Starting next Monday, you'll receive personalized meal plans delivered to your inbox every week.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Benefits Reminder */}
          <div className="bg-bornfidis-sage/30 rounded-xl p-6 mb-8 border-2 border-bornfidis-gold/20">
            <h3 className="font-headline text-bornfidis-green font-bold mb-3 text-xl">
              Your Premium Benefits:
            </h3>
            <ul className="space-y-2 font-body text-bornfidis-black/90">
              <li className="flex items-center gap-2">
                <span className="text-bornfidis-green">✓</span>
                Full 7-day meal plans (vs 3-day free)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-bornfidis-green">✓</span>
                Complete shopping lists
              </li>
              <li className="flex items-center gap-2">
                <span className="text-bornfidis-green">✓</span>
                PDF export capability
              </li>
              <li className="flex items-center gap-2">
                <span className="text-bornfidis-green">✓</span>
                Weekly AI meal drops via email
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/mealplanner"
              className="bg-bornfidis-green text-white rounded-xl px-8 py-4 text-lg font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition-all duration-300 text-center"
            >
              Start Meal Planning
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-bornfidis-green text-bornfidis-green rounded-xl px-8 py-4 text-lg font-semibold hover:bg-bornfidis-green hover:text-white transition-all duration-300 text-center"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-bornfidis-black/70 mt-8 font-body">
            Questions? Contact us at{' '}
            <a href="mailto:support@bornfidis.com" className="text-bornfidis-green hover:underline">
              support@bornfidis.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bornfidis-green"></div>
          <p className="mt-4 text-bornfidis-black/70">Loading...</p>
        </div>
      </div>
    }>
      <PremiumSuccessContent />
    </Suspense>
  )
}

