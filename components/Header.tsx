import Link from 'next/link'
import Logo from './Logo'
import PremiumBadge from './PremiumBadge'

export default function Header() {
  const navLinks = [
    { href: '/chef', label: 'Chef Services' },
    { href: '/sportswear', label: 'Sportswear' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Will show image if available, otherwise text */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body text-bf-black hover:text-bf-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="text-sm font-body text-bf-gold hover:text-bf-green transition-colors font-semibold"
            >
              Dashboard
            </Link>
            <PremiumBadge />
            <Link
              href="/login"
              className="text-sm font-body bg-bf-gold hover:bg-bf-gold/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-bf-black"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body text-bf-black hover:text-bf-green transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

