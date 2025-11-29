'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MealPlan {
  id: string
  pdfUrl: string | null
  json: {
    plan: Array<{
      day: string
      meals: {
        breakfast: string
        lunch: string
        dinner: string
      }
      notes?: string
    }>
    shoppingList: Array<{
      category: string
      items: string[]
    }>
  }
  createdAt: string
}

export default function MealPlansPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchMealPlans()
    }
  }, [status, router])

  const fetchMealPlans = async () => {
    try {
      const response = await fetch('/api/dashboard/mealplans')
      const data = await response.json()
      setMealPlans(data.mealPlans || [])
    } catch (error) {
      console.error('Error fetching meal plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bornfidis-cream to-bornfidis-sage flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bornfidis-green"></div>
          <p className="mt-4 text-bornfidis-black/90 font-body">Loading meal plans...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="bg-gradient-to-b from-bornfidis-cream to-bornfidis-sage min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-bornfidis-green font-semibold flex items-center gap-2 hover:text-bornfidis-gold transition mb-4"
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
              Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-headline text-bornfidis-green mb-4 font-bold">
              My Meal Plans
            </h1>
            <p className="text-lg font-body text-bornfidis-black/90">
              View and download your weekly meal plans
            </p>
          </div>

          {/* Meal Plans List */}
          {mealPlans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border-t-4 border-bornfidis-gold">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-headline text-bornfidis-green mb-2">
                No Meal Plans Yet
              </h2>
              <p className="text-bornfidis-black/90 font-body mb-6">
                Your weekly meal plans will appear here once they're generated.
              </p>
              <Link
                href="/mealplanner"
                className="inline-block bg-bornfidis-green text-white rounded-xl px-6 py-3 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition"
              >
                Create Meal Plan
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-bornfidis-gold hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-headline text-bornfidis-green mb-2 font-bold">
                      Weekly Meal Plan
                    </h3>
                    <p className="text-sm font-body text-bornfidis-black/70">
                      {formatDate(plan.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full bg-bornfidis-green text-white rounded-lg px-4 py-2 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition text-sm"
                    >
                      View Plan
                    </button>
                    {plan.pdfUrl && (
                      <a
                        href={plan.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-bornfidis-gold text-bornfidis-black rounded-lg px-4 py-2 font-semibold hover:bg-bornfidis-green hover:text-white transition text-sm text-center"
                      >
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Meal Plan Detail Modal */}
          {selectedPlan && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-bornfidis-green/20 p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-headline text-bornfidis-green font-bold">
                    Meal Plan - {formatDate(selectedPlan.createdAt)}
                  </h2>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-bornfidis-black/70 hover:text-bornfidis-green transition"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  {/* Meal Plan */}
                  <div className="mb-8">
                    <h3 className="text-xl font-headline text-bornfidis-green mb-4 font-bold">
                      7-Day Meal Plan
                    </h3>
                    <div className="space-y-4">
                      {selectedPlan.json.plan.map((dayPlan, index) => (
                        <div
                          key={index}
                          className="bg-bornfidis-sage/30 rounded-lg p-4 border-l-4 border-bornfidis-gold"
                        >
                          <h4 className="text-lg font-headline text-bornfidis-green mb-3 font-bold">
                            {dayPlan.day}
                          </h4>
                          <div className="space-y-2 font-body text-bornfidis-black/90">
                            <div>
                              <span className="font-semibold text-bornfidis-green">Breakfast:</span>{' '}
                              {dayPlan.meals.breakfast}
                            </div>
                            <div>
                              <span className="font-semibold text-bornfidis-green">Lunch:</span>{' '}
                              {dayPlan.meals.lunch}
                            </div>
                            <div>
                              <span className="font-semibold text-bornfidis-green">Dinner:</span>{' '}
                              {dayPlan.meals.dinner}
                            </div>
                            {dayPlan.notes && (
                              <div className="mt-2 pt-2 border-t border-bornfidis-green/20 text-sm text-bornfidis-green/70 italic">
                                💡 {dayPlan.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shopping List */}
                  <div>
                    <h3 className="text-xl font-headline text-bornfidis-green mb-4 font-bold">
                      Shopping List
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPlan.json.shoppingList.map((category, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border-2 border-bornfidis-gold/20">
                          <h4 className="mb-3">
                            <span className="px-3 py-1 rounded-full bg-bornfidis-gold/20 text-bornfidis-gold font-semibold text-sm">
                              {category.category}
                            </span>
                          </h4>
                          <ul className="list-disc list-inside space-y-1 font-body text-bornfidis-green ml-2">
                            {category.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-bornfidis-black/90 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-4">
                    {selectedPlan.pdfUrl && (
                      <a
                        href={selectedPlan.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-bornfidis-gold text-bornfidis-black rounded-lg px-6 py-3 font-semibold hover:bg-bornfidis-green hover:text-white transition text-center"
                      >
                        Download PDF
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 bg-bornfidis-green text-white rounded-lg px-6 py-3 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


