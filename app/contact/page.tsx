'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bf-green via-gray-800 to-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              We'd love to hear from you! Whether you have questions about our products, want to book chef services, or just want to say hello—reach out.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline text-bf-green mb-8 text-center">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <a href="mailto:info@bornfidis.com" className="text-coral hover:underline">
                  info@bornfidis.com
                </a>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Phone</h3>
                <a href="tel:802-733-5348" className="text-coral hover:underline">
                  802-733-5348
                </a>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold mb-2">Address</h3>
                <p className="text-gray-600">
                  PO Box 161<br />
                  Proctorsville, VT 05153
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-bf-green mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Online Store:</strong> 24/7</p>
                <p><strong>Customer Service:</strong> Monday-Friday, 9am-5pm EST</p>
                <p><strong>Chef Services:</strong> By appointment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline text-bf-green mb-8 text-center">
              Send Us a Message
            </h2>
            {submitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Thank you for your message! We'll respond within 24 hours.
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn btn-primary bg-coral hover:bg-coral-dark text-white py-3 px-6 text-lg"
                >
                  SEND MESSAGE
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Special Inquiries */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline text-bf-green mb-8 text-center">
            Special Inquiries
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-bf-green mb-3">Customer Support</h3>
              <p className="text-gray-700 mb-4">
                Our customer support team is ready to help with questions about your order, product information, or general inquiries.
              </p>
              <a href="mailto:support@bornfidis.com" className="text-coral hover:underline">
                📧 support@bornfidis.com
              </a>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-bf-green mb-3">Chef Services</h3>
              <p className="text-gray-700 mb-4">
                For private chef bookings, meal prep, or cooking classes:
              </p>
              <div className="space-y-2">
                <a href="mailto:chef@bornfidis.com" className="block text-coral hover:underline">
                  📧 chef@bornfidis.com
                </a>
                <a href="tel:802-733-5348" className="block text-coral hover:underline">
                  📱 802-733-5348
                </a>
                <p className="text-sm text-gray-600 mt-2">
                  Service Area: Claremont, NH and Upper Valley region
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-bf-green mb-3">Wholesale Inquiries</h3>
              <p className="text-gray-700 mb-4">
                Interested in carrying Bornfidis products in your retail store? Contact our dedicated wholesale team for more information.
              </p>
              <a href="mailto:wholesale@bornfidis.com" className="text-coral hover:underline">
                📧 wholesale@bornfidis.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Connect With Us */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-headline text-bf-green mb-6">
              Follow Our Journey
            </h2>
            <div className="flex justify-center gap-6 text-4xl">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
                📷
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
                📘
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
                📌
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
                💼
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75">
                🎵
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
