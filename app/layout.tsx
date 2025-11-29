import type { Metadata } from 'next'
import { Montserrat, Abril_Fatface } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const abrilFatface = Abril_Fatface({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-abril',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bornfidis - Adapt. Explore. Empower.',
    template: '%s | Bornfidis',
  },
  description: 'Sustainable activewear and chef services. Born in Jamaica, built for the world. Premium quality clothing and culinary experiences.',
  keywords: ['activewear', 'sustainable fashion', 'chef services', 'custom clothing', 'Jamaica', 'Vermont', 'outdoor apparel'],
  authors: [{ name: 'Bornfidis' }],
  creator: 'Bornfidis',
  publisher: 'Bornfidis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    siteName: 'Bornfidis',
    title: 'Bornfidis - Adapt. Explore. Empower.',
    description: 'Sustainable activewear and chef services. Born in Jamaica, built for the world.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bornfidis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bornfidis - Adapt. Explore. Empower.',
    description: 'Sustainable activewear and chef services. Born in Jamaica, built for the world.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${abrilFatface.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Bornfidis',
              description: 'Sustainable activewear and chef services',
              url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
              logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/images/logo/logo.png`,
              sameAs: [
                // Add social media links here
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: process.env.ADMIN_EMAIL || 'admin@bornfidis.com',
              },
            }),
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <Providers>
            <Header />
            <main>{children}</main>
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

