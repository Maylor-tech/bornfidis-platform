'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Link from 'next/link'

interface MealPlanRequest {
  householdSize: string
  budgetLevel: string
  kitchenSetup: string
  dietPreference: string
  notes?: string
}

interface Meal {
  breakfast: string
  lunch: string
  dinner: string
}

interface DayPlan {
  day: string
  meals: Meal
  notes?: string
}

interface ShoppingListItem {
  category: string
  items: string[]
}

interface MealPlanResponse {
  plan: DayPlan[]
  shoppingList: ShoppingListItem[]
}

function MealPlannerContent() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<MealPlanRequest>({
    householdSize: '',
    budgetLevel: '',
    kitchenSetup: '',
    dietPreference: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MealPlanResponse | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [checkingPremium, setCheckingPremium] = useState(true)
  const [premiumActivated, setPremiumActivated] = useState(false)

  // Check premium status on mount and after successful payment
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await fetch('/api/mealplanner/premium-status')
        const data = await response.json()
        setIsPremium(data.isPremium || false)
        console.log('Premium status:', data.isPremium ? '✅ Active' : '❌ Inactive')
      } catch (err) {
        console.error('Error checking premium status:', err)
        setIsPremium(false)
      } finally {
        setCheckingPremium(false)
      }
    }

    // Check if we have a session_id from Stripe checkout
    const sessionId = searchParams?.get('session_id')
    if (sessionId) {
      console.log('🔍 Verifying Stripe session:', sessionId)
      // Verify session and activate premium access immediately
      fetch('/api/stripe/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log('✅ Premium access activated via session verification')
            setIsPremium(true)
            setPremiumActivated(true)
            // Show success message
            setError(null)
            // Remove session_id from URL
            window.history.replaceState({}, '', '/mealplanner?premium=activated')
            // Hide success message after 5 seconds
            setTimeout(() => setPremiumActivated(false), 5000)
          } else {
            console.warn('⚠️ Session verification failed, will rely on webhook')
          }
          // Check status after verification attempt
          setTimeout(checkPremiumStatus, 1000)
        })
        .catch((err) => {
          console.error('Error verifying session:', err)
          // Still check status in case webhook already processed it
          setTimeout(checkPremiumStatus, 2000)
        })
    } else {
      checkPremiumStatus()
    }

    // If redirected from successful payment, refresh premium status
    if (searchParams?.get('premium') === 'activated') {
      setTimeout(checkPremiumStatus, 1000)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/mealplanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleExportPDF = () => {
    if (!result) return
    
    // Check premium status before allowing PDF export
    if (!isPremium) {
      setError('PDF export is a premium feature. Please upgrade to unlock this feature.')
      // Scroll to upgrade section or show upgrade modal
      return
    }

    // Brand colors (as tuples for jsPDF)
    const colors = {
      green: [10, 61, 47] as [number, number, number], // #0A3D2F
      gold: [212, 175, 55] as [number, number, number], // #D4AF37
      sage: [135, 169, 107] as [number, number, number], // #87A96B
      cream: [250, 248, 242] as [number, number, number], // #FAF8F2
      black: [26, 26, 26] as [number, number, number], // #1A1A1A
    }

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Page 1: Bornfidis Cover
    // Set cream background
    doc.setFillColor(...colors.cream)
    doc.rect(0, 0, 210, 297, 'F')

    // Add title
    doc.setFont('times', 'bold')
    doc.setTextColor(...colors.green)
    doc.setFontSize(32)
    doc.text('Bornfidis', 105, 80, { align: 'center' })
    
    doc.setFontSize(24)
    doc.text('Weekly Meal Plan', 105, 100, { align: 'center' })

    // Add subtitle
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(14)
    doc.setTextColor(...colors.black)
    doc.text('Personalized 7-Day Meal Plan & Shopping List', 105, 120, { align: 'center' })

    // Add scripture
    doc.setFont('times', 'italic')
    doc.setFontSize(16)
    doc.setTextColor(...colors.sage)
    doc.text('"Wisdom prepares the table."', 105, 150, { align: 'center' })
    doc.setFontSize(12)
    doc.text('— Proverbs 9:1', 105, 165, { align: 'center' })

    // Add decorative line
    doc.setDrawColor(...colors.gold)
    doc.setLineWidth(0.5)
    doc.line(50, 180, 160, 180)

    // Add date
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...colors.black)
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    doc.text(`Generated: ${today}`, 105, 200, { align: 'center' })

    // Add new page for meal plan
    doc.addPage()

    // Page 2+: 7-Day Meal Plan Table
    doc.setFont('times', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(...colors.green)
    doc.text('🌿 7-Day Meal Plan', 105, 20, { align: 'center' })

    // Prepare table data
    const tableData = result.plan.map((dayPlan) => [
      `🌿 ${dayPlan.day}`,
      dayPlan.meals.breakfast,
      dayPlan.meals.lunch,
      dayPlan.meals.dinner,
    ])

    // Create meal plan table
    autoTable(doc, {
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: colors.gold,
        textColor: colors.black,
        fontStyle: 'bold',
        fontSize: 11,
        font: 'helvetica',
      },
      bodyStyles: {
        textColor: colors.black,
        fontSize: 9,
        font: 'helvetica',
      },
      alternateRowStyles: {
        fillColor: colors.cream,
      },
      columnStyles: {
        0: {
          cellWidth: 30,
          fontStyle: 'bold',
          textColor: colors.green,
        },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
      },
      styles: {
        lineColor: colors.green,
        lineWidth: 0.1,
      },
      margin: { top: 30, left: 10, right: 10 },
    })

    // Add notes if available
    const notesDays = result.plan.filter((day) => day.notes)
    if (notesDays.length > 0) {
      let currentY = (doc as any).lastAutoTable.finalY + 15
      
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }

      doc.setFont('times', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(...colors.green)
      doc.text('Notes & Tips', 10, currentY)

      currentY += 8
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.setTextColor(...colors.black)

      notesDays.forEach((dayPlan) => {
        if (currentY > 270) {
          doc.addPage()
          currentY = 20
        }
        doc.text(`💡 ${dayPlan.day}: ${dayPlan.notes}`, 15, currentY)
        currentY += 7
      })
    }

    // Final Page: Shopping List
    doc.addPage()

    doc.setFont('times', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(...colors.green)
    doc.text('Shopping List', 105, 20, { align: 'center' })

    // Create shopping list tables (one per category)
    let startY = 30
    result.shoppingList.forEach((category) => {
      // Check if we need a new page
      if (startY > 250) {
        doc.addPage()
        startY = 20
      }

      // Prepare items for this category
      const categoryItems = category.items.map((item) => [item])

      autoTable(doc, {
        head: [[category.category]],
        body: categoryItems,
        startY: startY,
        theme: 'striped',
        headStyles: {
          fillColor: colors.gold,
          textColor: colors.black,
          fontStyle: 'bold',
          fontSize: 11,
          font: 'helvetica',
        },
        bodyStyles: {
          textColor: colors.green,
          fontSize: 9,
          font: 'helvetica',
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
        },
        styles: {
          lineColor: colors.green,
          lineWidth: 0.1,
        },
        margin: { top: startY, left: 10, right: 10 },
      })

      startY = (doc as any).lastAutoTable.finalY + 10
    })

    // Add footer on last page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...colors.black)
      doc.text(
        `Bornfidis Smart Meal Planner - Page ${i} of ${pageCount}`,
        105,
        290,
        { align: 'center' }
      )
    }

    // Save PDF
    doc.save('Bornfidis-Meal-Plan.pdf')
  }

  return (
    <div className="bg-gradient-to-b from-bornfidis-cream to-bornfidis-sage min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header Section */}
          <div className="text-center bg-bornfidis-cream rounded-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline text-bornfidis-green mb-4">
              Bornfidis Smart Meal Planner
            </h1>
            <p className="text-lg md:text-xl font-body text-bornfidis-black/90 max-w-2xl mx-auto mb-4">
              Create a personalized 7-day meal plan and shopping list tailored to your household, 
              budget, and kitchen setup. Perfect for Vermont winters and Jamaica's vibrant flavors.
            </p>
            <p className="text-base md:text-lg font-body italic text-bornfidis-sage font-light text-bornfidis-green/70">
              "Wisdom prepares the table." — Proverbs 9:1
            </p>
          </div>

          {/* Form */}
          {!result && (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 md:p-8 border-t-4 border-bornfidis-gold">
              <div className="space-y-6">
                {/* Household Size */}
                <div>
                  <label
                    htmlFor="householdSize"
                    className="block text-sm font-body font-semibold text-bornfidis-gold mb-2"
                  >
                    Household Size *
                  </label>
                  <select
                    id="householdSize"
                    name="householdSize"
                    value={formData.householdSize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-bornfidis-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bornfidis-gold focus:border-bornfidis-gold font-body text-bornfidis-black/90 bg-white"
                  >
                    <option value="">Select household size</option>
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3-4">3-4 people</option>
                    <option value="5+">5+ people</option>
                  </select>
                </div>

                {/* Budget Level */}
                <div>
                  <label
                    htmlFor="budgetLevel"
                    className="block text-sm font-body font-semibold text-bornfidis-gold mb-2"
                  >
                    Budget Level *
                  </label>
                  <select
                    id="budgetLevel"
                    name="budgetLevel"
                    value={formData.budgetLevel}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-bornfidis-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bornfidis-gold focus:border-bornfidis-gold font-body text-bornfidis-black/90 bg-white"
                  >
                    <option value="">Select budget level</option>
                    <option value="Tight">Tight</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Comfortable">Comfortable</option>
                  </select>
                </div>

                {/* Kitchen Setup */}
                <div>
                  <label
                    htmlFor="kitchenSetup"
                    className="block text-sm font-body font-semibold text-bornfidis-gold mb-2"
                  >
                    Kitchen Setup *
                  </label>
                  <select
                    id="kitchenSetup"
                    name="kitchenSetup"
                    value={formData.kitchenSetup}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-bornfidis-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bornfidis-gold focus:border-bornfidis-gold font-body text-bornfidis-black/90 bg-white"
                  >
                    <option value="">Select kitchen setup</option>
                    <option value="Microwave only">Microwave only</option>
                    <option value="Basic stove & oven">Basic stove & oven</option>
                    <option value="Fully equipped">Fully equipped</option>
                  </select>
                </div>

                {/* Diet Preference */}
                <div>
                  <label
                    htmlFor="dietPreference"
                    className="block text-sm font-body font-semibold text-bornfidis-gold mb-2"
                  >
                    Diet Preference *
                  </label>
                  <select
                    id="dietPreference"
                    name="dietPreference"
                    value={formData.dietPreference}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-bornfidis-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bornfidis-gold focus:border-bornfidis-gold font-body text-bornfidis-black/90 bg-white"
                  >
                    <option value="">Select diet preference</option>
                    <option value="No preference">No preference</option>
                    <option value="No pork">No pork</option>
                    <option value="No beef">No beef</option>
                    <option value="Vegetarian">Vegetarian</option>
                  </select>
                </div>

                {/* Optional Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-body font-semibold text-bornfidis-gold mb-2"
                  >
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Allergies, work schedule, special requests..."
                    className="w-full px-4 py-3 border-2 border-bornfidis-gold/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bornfidis-gold focus:border-bornfidis-gold font-body text-bornfidis-black/90 bg-white resize-none"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-bornfidis-green/20 my-6"></div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-bornfidis-green text-white rounded-xl px-6 py-3 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      <span>Generating Plan...</span>
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Generate Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Error Display */}
          {/* Premium Activated Success Message */}
          {premiumActivated && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-headline text-green-800 mb-2">
                    🎉 Premium Access Activated!
                  </h3>
                  <p className="text-green-700 font-body">
                    Your premium subscription is now active. You now have access to full 7-day meal plans, complete shopping lists, and PDF exports!
                  </p>
                </div>
                <button
                  onClick={() => setPremiumActivated(false)}
                  className="flex-shrink-0 text-green-600 hover:text-green-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-headline text-red-800 mb-2">Error</h3>
              <p className="text-red-700 font-body">{error}</p>
              <button
                onClick={() => {
                  setError(null)
                  setResult(null)
                }}
                className="mt-4 bg-bornfidis-green text-white rounded-xl px-6 py-3 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition"
              >
                Try again
              </button>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-10">
              {/* Back Button */}
              <button
                onClick={() => {
                  setResult(null)
                  setError(null)
                }}
                className="text-bornfidis-green font-semibold flex items-center gap-2 hover:text-bornfidis-gold transition"
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
                ← Create New Plan
              </button>

              {/* Divider */}
              <div className="border-t border-bornfidis-green/20"></div>

            {/* 7-Day Meal Plan */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-8 font-bold">
                7-Day Meal Plan
                {!isPremium && (
                  <span className="ml-4 text-sm font-body text-bornfidis-gold bg-bornfidis-gold/20 px-3 py-1 rounded-full">
                    Free: 3 Days Preview
                  </span>
                )}
              </h2>
              <div className="space-y-6">
                {result.plan.slice(0, isPremium ? result.plan.length : 3).map((dayPlan, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm border-t-4 border-bornfidis-gold p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-2xl md:text-3xl font-headline text-bornfidis-green mb-5 font-bold">
                        {dayPlan.day}
                      </h3>
                      <div className="space-y-4 font-body text-bornfidis-black/90">
                        <div className="flex items-start gap-2">
                          <span className="text-bornfidis-green text-lg mt-0.5">🌿</span>
                          <div>
                            <span className="font-semibold text-bornfidis-green">Breakfast:</span>{' '}
                            <span className="text-bornfidis-black/90">{dayPlan.meals.breakfast}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-bornfidis-green text-lg mt-0.5">🌿</span>
                          <div>
                            <span className="font-semibold text-bornfidis-green">Lunch:</span>{' '}
                            <span className="text-bornfidis-black/90">{dayPlan.meals.lunch}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-bornfidis-green text-lg mt-0.5">🌿</span>
                          <div>
                            <span className="font-semibold text-bornfidis-green">Dinner:</span>{' '}
                            <span className="text-bornfidis-black/90">{dayPlan.meals.dinner}</span>
                          </div>
                        </div>
                        {dayPlan.notes && (
                          <div className="mt-4 pt-4 border-t border-bornfidis-green/20 text-sm text-bornfidis-green/70 italic">
                            💡 {dayPlan.notes}
                          </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>
              
              {/* Premium Wall for Days 4-7 */}
              {!isPremium && result.plan.length > 3 && (
                <div className="relative mt-6">
                  <div className="blur-sm pointer-events-none select-none opacity-50">
                    {result.plan.slice(3).map((dayPlan, index) => (
                      <div
                        key={index + 3}
                        className="bg-white rounded-xl shadow-sm border-t-4 border-bornfidis-gold p-6 mb-6"
                      >
                        <h3 className="text-2xl md:text-3xl font-headline text-bornfidis-green mb-5 font-bold">
                          {dayPlan.day}
                        </h3>
                        <div className="space-y-4 font-body text-bornfidis-black/90">
                          <div className="flex items-start gap-2">
                            <span className="text-bornfidis-green text-lg mt-0.5">🌿</span>
                            <div>
                              <span className="font-semibold text-bornfidis-green">Breakfast:</span>{' '}
                              <span className="text-bornfidis-black/90">{dayPlan.meals.breakfast}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-bornfidis-green text-lg mt-0.5">🌿</span>
                            <div>
                              <span className="font-semibold text-bornfidis-green">Lunch:</span>{' '}
                              <span className="text-bornfidis-black/90">{dayPlan.meals.lunch}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-bornfidis-green text-lg mt-0.5">🌿</span>
                            <div>
                              <span className="font-semibold text-bornfidis-green">Dinner:</span>{' '}
                              <span className="text-bornfidis-black/90">{dayPlan.meals.dinner}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border-4 border-bornfidis-gold p-8 z-10">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🔒</div>
                      <h3 className="text-2xl font-headline text-bornfidis-green mb-2 font-bold">
                        Premium Feature
                      </h3>
                      <p className="text-bornfidis-black/90 font-body mb-6 max-w-md">
                        Upgrade to unlock full access to all 7 days
                      </p>
                      <Link
                        href="/mealplanner/upgrade"
                        className="inline-block bg-bornfidis-green text-white rounded-xl px-6 py-3 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition"
                      >
                        Upgrade to Unlock
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-bornfidis-green/20"></div>

            {/* Shopping List */}
            <div className="bg-bornfidis-sage rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-headline text-bornfidis-green mb-8 font-bold">
                Shopping List
                {!isPremium && (
                  <span className="ml-4 text-sm font-body text-bornfidis-gold bg-bornfidis-gold/20 px-3 py-1 rounded-full">
                    Free: Limited Items
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.shoppingList.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg p-5 shadow-sm">
                    <h3 className="mb-4">
                      <span className="px-3 py-1 rounded-full bg-bornfidis-gold/20 text-bornfidis-gold font-semibold text-sm">
                        {category.category}
                      </span>
                    </h3>
                    <ul className="list-disc list-inside space-y-2 font-body text-bornfidis-green ml-2">
                      {(isPremium ? category.items : category.items.slice(0, 3)).map((item, itemIndex) => (
                        <li key={itemIndex} className="text-bornfidis-black/90">{item}</li>
                      ))}
                      {!isPremium && category.items.length > 3 && (
                        <li className="text-bornfidis-gold font-semibold italic">
                          + {category.items.length - 3} more items (Premium)
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

              {/* PDF Export Button */}
              <div className="flex justify-center">
                {isPremium ? (
                  <button
                    onClick={handleExportPDF}
                    className="mt-6 bg-bornfidis-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition flex items-center gap-2"
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Bornfidis PDF
                  </button>
                ) : (
                  <Link
                    href="/mealplanner/upgrade"
                    className="mt-6 bg-bornfidis-gold text-bornfidis-black px-6 py-3 rounded-xl font-semibold hover:bg-bornfidis-green hover:text-white transition flex items-center gap-2 border-4 border-bornfidis-gold"
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Upgrade to Unlock PDF Export
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MealPlannerPage() {
  return (
    <Suspense fallback={
      <div className="bg-gradient-to-b from-bornfidis-cream to-bornfidis-sage min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bornfidis-green"></div>
          <p className="mt-4 text-bornfidis-black/90 font-body">Loading...</p>
        </div>
      </div>
    }>
      <MealPlannerContent />
    </Suspense>
  )
}
