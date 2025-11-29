import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bf-green via-gray-800 to-black text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline mb-6">
              About Bornfidis
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Discover the Story Behind Bornfidis
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Bornfidis was born from a simple yet powerful idea: your activewear should empower you to live fully, explore fearlessly, and adapt effortlessly—all while making responsible choices for our planet.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Founded by Brian Maylor, Bornfidis bridges two worlds: the vibrant island culture of Jamaica and the rugged mountain landscapes of Vermont. This unique perspective shapes everything we create.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From the sun-soaked beaches of the Caribbean to the snow-capped peaks of New England, we understand what it means to adapt. Our clothing reflects that versatility—designed for people who refuse to be confined by a single environment or lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-4">
              Our Mission
            </h2>
            <p className="text-2xl text-gray-600 mb-6 italic">
              "Adapt, Explore, Empower"
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We're on a mission to empower individuals to embrace their active lifestyles while making conscious choices that benefit our planet. We believe in the fusion of adaptability, style, and sustainability in every product we craft.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our commitment goes beyond clothing—we're building a movement that encourages people to live their best lives while preserving the Earth for future generations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every garment we create is designed with intention, celebrating culture, community, and the gifts of the earth.
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We envision a world where active living and environmental stewardship coexist harmoniously. Our vision is to be a global leader in activewear, connecting outdoor exploration with urban lifestyles through innovative, sustainable, and versatile clothing.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We aspire to inspire millions to embrace their adventurous spirit while championing responsible choices for our planet. With our 'Adapt, Explore, Empower' ethos at the forefront, we aim to shape a future where every step taken, every adventure embarked upon, and every Bornfidis product worn contributes to a more sustainable and empowered world.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-headline text-bf-green text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-2xl font-headline text-bf-green mb-3">SUSTAINABILITY</h3>
              <p className="text-gray-700">
                From material sourcing to production, we prioritize eco-friendly practices that minimize our environmental footprint. We partner with suppliers who share our commitment to the planet.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-headline text-bf-green mb-3">INNOVATION</h3>
              <p className="text-gray-700">
                We continuously push boundaries in design and functionality, creating activewear that truly adapts to modern life. Our designs bridge outdoor performance with urban style.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-headline text-bf-green mb-3">COMMUNITY</h3>
              <p className="text-gray-700">
                We're building a global community of adventurers, urban explorers, and conscious consumers who share our values. Together, we're stronger.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-headline text-bf-green mb-3">QUALITY</h3>
              <p className="text-gray-700">
                We never compromise on craftsmanship, comfort, or durability—every piece is designed to last. Quality over quantity, always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Founder */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline text-bf-green mb-8 text-center">
              Meet Brian Maylor
            </h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Brian Maylor brings 20 years of culinary expertise and a passion for sustainable living to Bornfidis. His unique journey from Jamaican hospitality to Vermont entrepreneurship informs the brand's innovative approach to activewear.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                A Jamaica Observer Food Awards winner with television appearances and over 13 years with Royal Caribbean International, Brian understands excellence, service, and the importance of quality. These same principles guide Bornfidis.
              </p>
              <blockquote className="border-l-4 border-coral pl-6 my-6 italic text-lg text-gray-700">
                "I created Bornfidis because I believe we shouldn't have to choose between style, performance, and sustainability. We can have it all—and we should. Our clothing represents that philosophy—no compromises, only elevation."
              </blockquote>
              <p className="text-lg text-gray-700 leading-relaxed">
                When he's not designing the next Bornfidis collection, you'll find Brian in the kitchen creating culinary experiences or exploring the mountains of Vermont.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Movement */}
      <section className="section-padding bg-gradient-to-r from-bf-green to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-headline mb-6">
              Join Our Movement
            </h2>
            <p className="text-xl mb-8 leading-relaxed">
              Bornfidis isn't just a brand—it's a community of people who believe in living actively, exploring boldly, and making responsible choices.
            </p>
            <p className="text-lg mb-8 text-gray-300">
              Whether you're scaling mountains, navigating city streets, or charting your own path, we're here to support your journey with clothing that adapts to your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="btn bg-coral hover:bg-coral-dark text-white px-8 py-4 text-lg"
              >
                SHOP NOW
              </Link>
              <Link
                href="/contact"
                className="btn border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg"
              >
                SUBSCRIBE FOR UPDATES
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
