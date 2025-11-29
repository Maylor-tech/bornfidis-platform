import Link from 'next/link'

export default function Footer() {
  const quickLinks = [
    { href: '/chef', label: 'Chef' },
    { href: '/mealprep', label: 'Meal Prep' },
    { href: '/classes', label: 'Classes' },
    { href: '/events', label: 'Events' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
  ]

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com', icon: '📷' },
    { name: 'Facebook', href: 'https://facebook.com', icon: '📘' },
    { name: 'Pinterest', href: 'https://pinterest.com', icon: '📌' },
    { name: 'YouTube', href: 'https://youtube.com', icon: '▶️' },
  ]

  return (
    <footer className="bg-bf-black text-white mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-headline text-bf-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm font-body text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-bf-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-headline text-bf-gold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm font-body text-gray-300">
              <li>
                <a
                  href="mailto:info@bornfidis.com"
                  className="hover:text-bf-gold transition-colors"
                >
                  info@bornfidis.com
                </a>
              </li>
              <li>
                <a
                  href="tel:802-733-5348"
                  className="hover:text-bf-gold transition-colors"
                >
                  802-733-5348
                </a>
              </li>
              <li className="text-gray-400">
                PO Box 161, Proctorsville, VT 05153
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-headline text-bf-gold mb-4">Newsletter</h4>
            <p className="text-sm font-body text-gray-300 mb-4">
              Stay updated with our latest news and offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-bf-gold"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-bf-gold text-bf-black font-body font-semibold rounded hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-headline text-bf-gold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:opacity-75 transition-opacity"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm font-body text-gray-400">
            <p>&copy; {new Date().getFullYear()} Bornfidis. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/legal"
                className="hover:text-bf-gold transition-colors"
              >
                Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

