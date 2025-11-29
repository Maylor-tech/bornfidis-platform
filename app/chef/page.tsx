'use client';

import Link from 'next/link';
import { InlineWidget } from 'react-calendly';
import { useState } from 'react';

export default function ChefServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    requested_date: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        requested_date: '',
        notes: '',
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bf-green via-bf-green/90 to-bf-green/80 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-headline mb-6">
              Private Chef Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Experience culinary excellence with Chef Brian Maylor
            </p>
            <p className="text-lg md:text-xl mb-10 text-white/80">
              From intimate dinners to grand celebrations, we bring world-class cuisine to your table.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 border-2 border-bf-gold/20 rounded-lg">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-2xl font-headline text-bf-green mb-3">Private Dining</h3>
              <p className="text-gray-600">
                Intimate dinners tailored to your preferences, featuring locally-sourced ingredients and innovative techniques.
              </p>
            </div>
            <div className="text-center p-6 border-2 border-bf-gold/20 rounded-lg">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-headline text-bf-green mb-3">Event Catering</h3>
              <p className="text-gray-600">
                Memorable culinary experiences for weddings, corporate events, and special celebrations.
              </p>
            </div>
            <div className="text-center p-6 border-2 border-bf-gold/20 rounded-lg">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="text-2xl font-headline text-bf-green mb-3">Cooking Classes</h3>
              <p className="text-gray-600">
                Learn professional techniques and recipes in personalized cooking sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-gray-50" id="inquiry">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-4">
              Request a Quote
            </h2>
            <p className="text-center text-gray-600 mb-8 text-lg">
              Fill out the form below and we'll get back to you within 24 hours with a customized quote.
            </p>
            
            {submitStatus === 'success' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you!</h3>
                <p className="text-green-700">
                  We've received your inquiry and will get back to you within 24 hours with a customized quote.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{errorMessage || 'Failed to submit inquiry. Please try again.'}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-bf-green mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bf-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-gold focus:border-bf-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-bf-green mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bf-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-gold focus:border-bf-gold"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-bf-green mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bf-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-gold focus:border-bf-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="service_type" className="block text-sm font-semibold text-bf-green mb-2">
                      Service Type *
                    </label>
                    <select
                      id="service_type"
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-bf-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-gold focus:border-bf-gold"
                    >
                      <option value="">Select a service</option>
                      <option value="Private Dinner Party">Private Dinner Party</option>
                      <option value="Weekly Meal Prep">Weekly Meal Prep</option>
                      <option value="Cooking Class">Cooking Class</option>
                      <option value="Special Event">Special Event</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="requested_date" className="block text-sm font-semibold text-bf-green mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="requested_date"
                    name="requested_date"
                    value={formData.requested_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-bf-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-gold focus:border-bf-gold"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-bf-green mb-2">
                    Additional Details
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Number of guests, dietary requirements, budget range, special requests..."
                    className="w-full px-4 py-3 border-2 border-bf-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-bf-gold focus:border-bf-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-bf-green hover:bg-bf-green/90 text-white px-8 py-4 text-lg rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Calendly Booking Widget */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-8">
              Or Schedule Directly
            </h2>
            <p className="text-center text-gray-600 mb-8 text-lg">
              Select a date and time that works for you. We'll confirm your booking and discuss your preferences.
            </p>
            <div className="bg-gray-50 rounded-lg shadow-lg p-4">
              <InlineWidget
                url={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-username"}
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
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-8">
              What to Expect
            </h2>
            <div className="space-y-6 text-gray-700">
              <div className="flex items-start gap-4">
                <div className="text-bf-gold text-2xl font-bold">1.</div>
                <div>
                  <h3 className="text-xl font-semibold text-bf-green mb-2">Initial Consultation</h3>
                  <p>We'll discuss your preferences, dietary restrictions, and event details to create a customized menu.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-bf-gold text-2xl font-bold">2.</div>
                <div>
                  <h3 className="text-xl font-semibold text-bf-green mb-2">Menu Planning</h3>
                  <p>Receive a detailed menu proposal with options tailored to your taste and occasion.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-bf-gold text-2xl font-bold">3.</div>
                <div>
                  <h3 className="text-xl font-semibold text-bf-green mb-2">Culinary Experience</h3>
                  <p>Enjoy a world-class dining experience prepared fresh in your kitchen or venue.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-bf-gold to-bf-gold/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-headline mb-6">
            Ready to Elevate Your Dining Experience?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Book your consultation today and let's create something extraordinary together.
          </p>
          <Link
            href="#booking"
            className="inline-block bg-bf-green hover:bg-bf-green/90 text-white px-8 py-4 text-lg rounded-lg font-semibold transition-colors"
          >
            SCHEDULE NOW
          </Link>
        </div>
      </section>

    </div>
  );
}
