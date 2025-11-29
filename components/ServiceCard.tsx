import Link from 'next/link'
import Image from 'next/image'

interface ServiceCardProps {
  title: string
  description: string
  image: string
  imageAlt: string
  href: string
  ctaText?: string
}

export default function ServiceCard({
  title,
  description,
  image,
  imageAlt,
  href,
  ctaText = 'Learn More',
}: ServiceCardProps) {
  return (
    <article className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-bf-green focus:ring-offset-2 rounded-lg">
        {/* Image */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-headline text-bf-green mb-3 group-hover:text-bf-gold transition-colors">
            {title}
          </h3>
          <p className="text-base font-body text-gray-700 mb-4 line-clamp-3">
            {description}
          </p>
          <span className="inline-flex items-center text-bf-green font-body font-semibold group-hover:text-bf-gold transition-colors">
            {ctaText}
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  )
}

