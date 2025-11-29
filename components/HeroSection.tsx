'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface CTA {
  label: string
  href: string
}

interface HeroSectionProps {
  headline: string
  subhead: string
  primaryCTA: CTA
  secondaryCTA?: CTA
  backgroundImage: string
}

export default function HeroSection({
  headline,
  subhead,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade-in animation on mount
    setIsVisible(true)

    // Parallax scroll effect
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const scrolled = window.scrollY
        setScrollY(scrolled)
      }
    }

    // Throttle scroll events for performance
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const parallaxOffset = scrollY * 0.5

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          willChange: 'transform',
        }}
      >
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div
        className={`relative z-20 container mx-auto px-4 text-center text-white transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Microcopy */}
        <p className="text-sm md:text-base font-body text-bf-gold mb-4 tracking-wider uppercase">
          Serving Ludlow, Okemo Valley — Private Chef & Seasonal Apparel
        </p>

        {/* Headline */}
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-headline mb-6 transition-all duration-1000 delay-200 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {headline}
        </h1>

        {/* Subhead */}
        <p
          className={`text-lg md:text-xl lg:text-2xl font-body mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {subhead}
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href={primaryCTA.href}
            className="btn btn-primary bg-bf-green text-white hover:bg-opacity-90 px-8 py-4 text-base md:text-lg"
          >
            {primaryCTA.label}
          </a>
          {secondaryCTA && (
            <a
              href={secondaryCTA.href}
              className="btn btn-secondary bg-bf-gold text-bf-black hover:bg-opacity-90 px-8 py-4 text-base md:text-lg"
            >
              {secondaryCTA.label}
            </a>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg
          className="w-6 h-6 text-white opacity-75"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

