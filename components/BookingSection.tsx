'use client'

import { useState } from 'react'
import { InlineWidget } from 'react-calendly'

interface BookingSectionProps {
  calendlyUrl?: string
  serviceTypes?: string[]
}

export default function BookingSection({
  calendlyUrl = 'https://calendly.com/your-username',
  serviceTypes = ['Private Chef', 'Meal Prep', 'Cooking Classes', 'Events'],
}: BookingSectionProps) {
  const [showFallback, setShowFallback] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      requested_date: formData.get('requested_date') as string,
      service_type: formData.get('service_type') as string,
      notes: formData.get('notes') as string,
    }

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit booking')
      }

      setSubmitStatus('success')
      e.currentTarget.reset()
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-padding bg-gray-50" id="booking">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline text-bf-green mb-4">
              Book a Service
            </h2>
            <p className="text-lg font-body text-gray-700">
              Schedule your consultation or service with us
            </p>
          </div>

          {/* Toggle between Calendly and Fallback Form */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setShowFallback(false)}
              className={`px-6 py-2 rounded font-body transition-colors ${
                !showFallback
                  ? 'bg-bf-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Calendar Booking
            </button>
            <button
              onClick={() => setShowFallback(true)}
              className={`px-6 py-2 rounded font-body transition-colors ${
                showFallback
                  ? 'bg-bf-green text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Request Form
            </button>
          </div>

          {/* Calendly Inline Widget */}
          {!showFallback && (
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
              <InlineWidget
                url={calendlyUrl}
                styles={{
                  height: '700px',
                  minWidth: '320px',
                }}
                pageSettings={{
                  backgroundColor: 'ffffff',
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: '013220',
                  textColor: '4d5055',
                }}
              />
            </div>
          )}

          {/* Fallback Booking Form */}
          {showFallback && (
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              {submitStatus === 'success' && (
                <div
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                  role="alert"
                >
                  <p className="text-green-800 font-body">
                    Thank you! Your booking request has been submitted. We'll get back to you soon.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                >
                  <p className="text-red-800 font-body">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-body font-semibold text-bf-black mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-green focus:border-transparent font-body"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-body font-semibold text-bf-black mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-green focus:border-transparent font-body"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-body font-semibold text-bf-black mb-2"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-green focus:border-transparent font-body"
                    placeholder="(802) 555-1234"
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label
                    htmlFor="service_type"
                    className="block text-sm font-body font-semibold text-bf-black mb-2"
                  >
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-green focus:border-transparent font-body bg-white"
                  >
                    <option value="">Select a service</option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Requested Date */}
                <div>
                  <label
                    htmlFor="requested_date"
                    className="block text-sm font-body font-semibold text-bf-black mb-2"
                  >
                    Requested Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="requested_date"
                    name="requested_date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-green focus:border-transparent font-body"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-body font-semibold text-bf-black mb-2"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-green focus:border-transparent font-body resize-vertical"
                    placeholder="Tell us about your event, dietary restrictions, or special requests..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary bg-bf-green text-white hover:bg-opacity-90 px-8 py-4 text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

