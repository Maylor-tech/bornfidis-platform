import Link from 'next/link';
import BookingSection from '@/components/BookingSection';

export default function MealPrepPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bf-green via-gray-800 to-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline mb-6">
              Weekly Meal Prep & Wellness Meals
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Chef-prepared meals designed to bring ease, nutrition, and flavor into your week.
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Receive */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-8 text-center">
              What You'll Receive
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">🍱</div>
                <h3 className="text-xl font-semibold text-bf-green mb-2">5–7 Ready-to-Enjoy Meals</h3>
                <p className="text-gray-700">
                  Freshly prepared meals ready to heat and enjoy throughout your week.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">🥗</div>
                <h3 className="text-xl font-semibold text-bf-green mb-2">Customized Nutrition-Focused Menus</h3>
                <p className="text-gray-700">
                  Menus tailored to your dietary needs, preferences, and health goals.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">♻️</div>
                <h3 className="text-xl font-semibold text-bf-green mb-2">Eco-Conscious Packaging</h3>
                <p className="text-gray-700">
                  Sustainable packaging that protects your meals and the planet.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-3">🚗</div>
                <h3 className="text-xl font-semibold text-bf-green mb-2">Delivery or Pickup</h3>
                <p className="text-gray-700">
                  Available in Ludlow / Okemo Valley area. Convenient delivery or pickup options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-6">
              Pricing
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-2xl font-semibold text-bf-green mb-4">
                Packages from $200–$400/week
              </p>
              <p className="text-gray-700 mb-6">
                Pricing varies based on number of meals, dietary requirements, and customization level. Contact us for a personalized quote.
              </p>
              <Link
                href="#booking"
                className="btn btn-primary bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg"
              >
                REQUEST QUOTE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Why Choose Our Meal Prep Service?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-bf-green mb-3">Save Time</h3>
              <p className="text-gray-700">
                Spend less time cooking and more time doing what you love. Your meals are ready when you need them.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-bf-green mb-3">Stay Healthy</h3>
              <p className="text-gray-700">
                Nutritious, balanced meals designed to fuel your active lifestyle and support your wellness goals.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold text-bf-green mb-3">Chef Quality</h3>
              <p className="text-gray-700">
                Restaurant-quality meals prepared by a professional chef with 20+ years of experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-8 text-center">
              Get Started
            </h2>
            <BookingSection />
          </div>
        </div>
      </section>
    </div>
  );
}
