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
            <div className="w-24 h-24 bg-bornfidis-green rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <svg
                className="w-12 h-12 text-white animate-checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ strokeDasharray: '0 50' }}
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/mealplanner"
              className="bg-bornfidis-green text-white rounded-xl px-10 py-5 text-xl font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Start Meal Planning
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-bornfidis-green text-bornfidis-green rounded-xl px-8 py-5 text-lg font-semibold hover:bg-bornfidis-green hover:text-white transition-all duration-300 text-center"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Social Sharing */}
          {isPremium && (
            <div className="bg-bornfidis-sage/20 rounded-xl p-6 mb-8 border-2 border-bornfidis-gold/30">
            <h3 className="font-headline text-bornfidis-green font-bold mb-3 text-center">
              Share Your Success! 🎉
            </h3>
            <p className="text-bornfidis-black/80 font-body text-center mb-4 text-sm">
              Let others know about your meal planning journey
            </p>
            <div className="flex justify-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Just upgraded to Bornfidis Premium Meal Planner! 🎉 Time to transform my meal planning!')}&url=${encodeURIComponent('https://bornfidis-platform.vercel.app/mealplanner')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
                Share on X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://bornfidis-platform.vercel.app/mealplanner')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Share on Facebook
              </a>
            </div>
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

