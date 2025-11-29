import Link from 'next/link';
import BookingSection from '@/components/BookingSection';

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bf-green via-gray-800 to-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline mb-6">
              Special Events & Seasonal Celebrations
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Bring flavor and intimacy to your most meaningful moments.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Event Services
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">💒</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Weddings & Rehearsal Dinners</h3>
              <p className="text-gray-700 mb-4">
                Create unforgettable wedding experiences with custom menus that reflect your style and celebrate your love story.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Custom menu design</li>
                <li>Rehearsal dinner catering</li>
                <li>Wedding reception service</li>
                <li>Dietary accommodations</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🎄</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Holiday Gatherings</h3>
              <p className="text-gray-700 mb-4">
                Make your holiday celebrations special with seasonal menus featuring local Vermont ingredients and Caribbean flair.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Thanksgiving dinners</li>
                <li>Christmas celebrations</li>
                <li>Ski season gatherings</li>
                <li>New Year's events</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Corporate Dinners & Retreats</h3>
              <p className="text-gray-700 mb-4">
                Elevate your corporate events with professional catering that impresses clients and energizes teams.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Corporate dinners</li>
                <li>Team retreats</li>
                <li>Client entertainment</li>
                <li>Conference catering</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Wellness & Retreat Catering</h3>
              <p className="text-gray-700 mb-4">
                Support wellness retreats and Airbnb experiences with nutritious, flavorful meals that align with your program goals.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Wellness retreat meals</li>
                <li>Airbnb experience catering</li>
                <li>Nutrition-focused menus</li>
                <li>Plant-based options</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🎂</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Birthday & Anniversary Dinners</h3>
              <p className="text-gray-700 mb-4">
                Celebrate life's milestones with intimate, personalized dining experiences in your home.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Intimate celebrations</li>
                <li>Custom menus</li>
                <li>Special occasion service</li>
                <li>Memorable experiences</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Custom Events</h3>
              <p className="text-gray-700 mb-4">
                Every event is unique. We work with you to create a dining experience that perfectly matches your vision.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fully customized</li>
                <li>Flexible service styles</li>
                <li>Any occasion</li>
                <li>Your vision, our expertise</li>
              </ul>
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
                Customized to Your Event
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Every event is unique, and so is our pricing. We'll work with you to create a package that fits your budget and exceeds your expectations.
              </p>
              <p className="text-gray-600 mb-6">
                Factors that influence pricing:
              </p>
              <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700 mb-6">
                <li>• Number of guests</li>
                <li>• Menu complexity</li>
                <li>• Service style (plated, buffet, family style)</li>
                <li>• Location and travel requirements</li>
                <li>• Special dietary accommodations</li>
              </ul>
              <Link
                href="#booking"
                className="btn btn-primary bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg"
              >
                CONTACT FOR QUOTE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-8 text-center">
              Plan Your Event
            </h2>
            <BookingSection />
          </div>
        </div>
      </section>
    </div>
  );
}
