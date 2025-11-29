import Link from 'next/link';
import BookingSection from '@/components/BookingSection';

export default function ClassesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bf-green via-gray-800 to-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline mb-6">
              Cooking Classes & Workshops
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              For food lovers, private groups, Airbnb experiences, or team building.
            </p>
          </div>
        </div>
      </section>

      {/* Available Formats */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Available Formats
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Virtual Classes (Zoom)</h3>
              <p className="text-gray-700 mb-4">
                Learn from the comfort of your home. Interactive cooking classes via Zoom with live instruction and Q&A.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Live instruction</li>
                <li>Interactive Q&A</li>
                <li>Recipe handouts</li>
                <li>Recorded session available</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">In-Person Classes</h3>
              <p className="text-gray-700 mb-4">
                Small-group classes in your home or our kitchen. Hands-on learning in an intimate setting.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Small groups (2-8 people)</li>
                <li>Hands-on experience</li>
                <li>All ingredients provided</li>
                <li>Take home what you make</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Class Topics */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Class Topics
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🌴</div>
              <h3 className="text-xl font-semibold text-bf-green mb-3">Caribbean Cooking</h3>
              <p className="text-gray-700">
                Learn authentic Caribbean flavors and techniques. From jerk seasoning to plantain dishes, discover the vibrant cuisine of the islands.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-semibold text-bf-green mb-3">Mediterranean Wellness Cuisine</h3>
              <p className="text-gray-700">
                Healthy, flavorful dishes inspired by the Mediterranean. Learn to create nutritious meals that don't compromise on taste.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🔪</div>
              <h3 className="text-xl font-semibold text-bf-green mb-3">Knife Skills & Techniques</h3>
              <p className="text-gray-700">
                Master essential knife skills, sauce making, and cooking techniques that will elevate your home cooking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-6">
              Pricing
            </h2>
            <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <p className="text-2xl font-semibold text-bf-green mb-4">
                $75 per person
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Group rates available for 4+ participants
              </p>
              <p className="text-gray-600">
                Custom classes and private group sessions can be arranged. Contact us to discuss your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">❤️</div>
              <p className="font-semibold text-gray-800">Food Lovers</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">🏠</div>
              <p className="font-semibold text-gray-800">Airbnb Experiences</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">👔</div>
              <p className="font-semibold text-gray-800">Team Building</p>
            </div>
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">🎉</div>
              <p className="font-semibold text-gray-800">Special Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-8 text-center">
              Sign Up for a Class
            </h2>
            <BookingSection />
          </div>
        </div>
      </section>
    </div>
  );
}
