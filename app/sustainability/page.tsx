import Link from 'next/link';

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-bf-green text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline mb-6">
              Sustainability at Bornfidis
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Committed to Protecting Our Planet
            </p>
          </div>
        </div>
      </section>

      {/* Why Sustainability Matters */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-6">
              Why Sustainability Matters
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              At Bornfidis, sustainability isn't just a buzzword; it's the foundation of everything we do. From the materials we source to the processes we employ, we aim to minimize our environmental footprint while creating activewear that empowers you to explore the world responsibly.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that the best adventures are those that leave the planet better than we found it. That's why every decision we make—from fabric selection to packaging—is guided by our commitment to environmental stewardship.
            </p>
          </div>
        </div>
      </section>

      {/* Our Sustainable Practices */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Our Sustainable Practices
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Eco-Friendly Materials</h3>
              <p className="text-gray-700 mb-4">
                We prioritize organic cotton, recycled polyester, and other sustainable fabrics that reduce environmental impact without compromising quality or performance.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>80% organic cotton</li>
                <li>20% recycled materials</li>
                <li>Water-based dyes</li>
                <li>Chemical-free processing</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Responsible Manufacturing</h3>
              <p className="text-gray-700 mb-4">
                We partner with manufacturers who share our values, ensuring fair labor practices and environmentally responsible production methods.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fair Trade certified facilities</li>
                <li>Carbon-neutral shipping options</li>
                <li>Renewable energy in production</li>
                <li>Water conservation practices</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Minimal Packaging</h3>
              <p className="text-gray-700 mb-4">
                Our packaging is designed to protect your purchase while minimizing waste. We use recycled and recyclable materials whenever possible.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>100% recyclable packaging</li>
                <li>Biodegradable mailers</li>
                <li>No plastic poly bags</li>
                <li>Reusable garment bags</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-headline text-bf-green mb-4">Carbon Offset Programs</h3>
              <p className="text-gray-700 mb-4">
                We invest in carbon offset programs to neutralize the environmental impact of shipping and operations.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Tree planting partnerships</li>
                <li>Clean energy investments</li>
                <li>Ocean cleanup initiatives</li>
                <li>Local environmental programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-6 text-center">
              Our Commitment to You and the Planet
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Sustainability is a journey, not a destination. We're constantly working to improve our practices and reduce our environmental footprint. Here's what we're committed to:
            </p>
            <div className="bg-gray-50 p-8 rounded-lg">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span>Transparency in our supply chain</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span>Continuous improvement in sustainability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span>Supporting local communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span>Educating customers about sustainable choices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span>Innovation in eco-friendly materials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">✓</span>
                  <span>Long-lasting, durable products over fast fashion</span>
                </li>
              </ul>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mt-6 text-center italic">
              We know we're not perfect, but we're committed to doing better every single day.
            </p>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="section-padding bg-gradient-to-r from-green-800 to-bf-green text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline mb-6">
              Join the Movement
            </h2>
            <p className="text-xl mb-6 leading-relaxed">
              Every purchase you make supports sustainable practices and helps us invest in better solutions for the future. Together, we can make a difference.
            </p>
            <p className="text-lg mb-8 text-gray-200">
              Here's how you can help:
            </p>
            <ul className="text-left max-w-md mx-auto mb-8 space-y-3">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Choose quality over quantity</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Care for your garments properly to extend their life</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Recycle or donate when you're done</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Spread the word about sustainable fashion</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Hold us accountable—we welcome your feedback</span>
              </li>
            </ul>
            <Link
              href="/shop"
              className="btn bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg"
            >
              SHOP SUSTAINABLE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

