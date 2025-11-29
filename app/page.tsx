import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Hero image path - will use image if available, otherwise gradient
  const heroImage = '/images/hero/hero-homepage.jpg';
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 md:py-32 overflow-hidden">
        {/* Background Image (if available) */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Bornfidis Adventure"
              fill
              className="object-cover opacity-30"
              priority
              sizes="100vw"
            />
          </div>
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-headline mb-6">
              ADAPT. EXPLORE. EMPOWER.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Sustainable activewear that moves with you—from mountain trails to city streets.
            </p>
            <p className="text-lg md:text-xl mb-10 text-gray-400 italic">
              Born in Jamaica. Built for the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sportswear"
                className="btn btn-primary bg-bf-gold hover:bg-bf-gold/90 text-white px-8 py-4 text-lg rounded-lg font-semibold"
              >
                SHOP NOW
              </Link>
              <Link
                href="/chef"
                className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-bf-green px-8 py-4 text-lg rounded-lg font-semibold"
              >
                BOOK CHEF SERVICES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Bornfidis */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Why Choose Bornfidis?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-xl font-headline text-bf-green mb-3">VERSATILE DESIGN</h3>
              <p className="text-gray-600">
                Seamlessly transition from outdoor adventures to urban exploration in clothing that adapts to any environment.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">♻️</div>
              <h3 className="text-xl font-headline text-bf-green mb-3">SUSTAINABLE MATERIALS</h3>
              <p className="text-gray-600">
                We're committed to eco-friendly practices—from sourcing to production—because the planet is our ultimate adventure destination.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-xl font-headline text-bf-green mb-3">EMPOWERMENT THROUGH STYLE</h3>
              <p className="text-gray-600">
                Clothing that inspires confidence, encourages exploration, and celebrates your unique journey.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-headline text-bf-green mb-3">JAMAICA TO THE WORLD</h3>
              <p className="text-gray-600">
                Built on island innovation and global vision, we bring fresh perspective to activewear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-4">
              Discover Your Next Adventure Gear
            </h2>
            <p className="text-xl text-gray-600">
              Shop our high-quality, eco-friendly outdoor apparel collection.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Placeholder product cards - will be replaced with actual products */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-headline text-bf-green mb-2">Oversized Adventure Hoodie</h3>
                <p className="text-gray-600 mb-4">$68.00</p>
                <Link href="/sportswear" className="btn btn-primary bg-bf-gold hover:bg-bf-gold/90 text-white rounded-lg px-4 py-2">
                  View Product
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-headline text-bf-green mb-2">Sustainable Activewear</h3>
                <p className="text-gray-600 mb-4">Starting at $35.00</p>
                <Link href="/sportswear" className="btn btn-primary bg-bf-gold hover:bg-bf-gold/90 text-white rounded-lg px-4 py-2">
                  View Product
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-headline text-bf-green mb-2">Design Guides</h3>
                <p className="text-gray-600 mb-4">Digital Products</p>
                <Link href="/sportswear" className="btn btn-primary bg-bf-gold hover:bg-bf-gold/90 text-white rounded-lg px-4 py-2">
                  View Product
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/sportswear" className="btn btn-primary bg-bf-gold hover:bg-bf-gold/90 text-white px-8 py-4 text-lg rounded-lg font-semibold">
              EXPLORE NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-6">
              From Jamaica to Vermont
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              Bornfidis bridges two worlds: the vibrant island culture of Jamaica and the rugged mountain landscapes of Vermont. Founded by Chef Brian Maylor, we believe your activewear should empower you to live fully, explore fearlessly, and adapt effortlessly—all while making responsible choices for our planet.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Every piece tells a story of adventure, responsibility, and empowerment.
            </p>
            <Link href="/about" className="btn btn-outline border-2 border-bf-green text-bf-green hover:bg-bf-green hover:text-white px-8 py-4 text-lg">
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            What Our Customers Are Saying
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-yellow-400 mb-4 text-xl">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4 italic">
                "This jacket is my go-to for all outdoor adventures. The quality is unmatched, and it's eco-friendly too!"
              </p>
              <p className="text-gray-600 font-semibold">— Sarah M., Vermont</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-yellow-400 mb-4 text-xl">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4 italic">
                "Comfortable and durable. Great for hiking and everyday wear."
              </p>
              <p className="text-gray-600 font-semibold">— James K., New Hampshire</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-yellow-400 mb-4 text-xl">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4 italic">
                "Perfect fit and super cozy. I love wearing this hoodie on cool morning runs."
              </p>
              <p className="text-gray-600 font-semibold">— Maria L., Massachusetts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop The Look */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-4">
              Shop The Look
            </h2>
            <p className="text-xl text-gray-600">
              Jackets • Hoodies • Base Layers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Jackets</span>
            </div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Hoodies</span>
            </div>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Base Layers</span>
            </div>
          </div>
          <div className="text-center">
            <Link href="/sportswear" className="btn btn-primary bg-bf-gold hover:bg-bf-gold/90 text-white px-8 py-4 text-lg rounded-lg font-semibold">
              SHOP THIS LOOK
            </Link>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="section-padding bg-gradient-to-r from-bf-green to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline mb-4">
              JOIN THE MOVEMENT
            </h2>
            <p className="text-xl mb-2">
              Be the first to know about new collections, exclusive offers, and sustainability tips.
            </p>
            <p className="text-lg mb-8 text-gray-300">
              Plus, get 15% off your first order when you subscribe.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                required
              />
              <button
                type="submit"
                className="btn bg-bf-gold hover:bg-bf-gold/90 text-white px-8 py-3 rounded-lg font-semibold"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
