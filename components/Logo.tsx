'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function Logo() {
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="flex items-center">
      {!logoError ? (
        <div className="relative h-10 w-32 md:h-12 md:w-40 mr-2">
          <Image
            src="/images/logo/logo.png"
            alt="Bornfidis Logo"
            fill
            className="object-contain"
            priority
            onError={() => setLogoError(true)}
            onLoad={() => setLogoError(false)}
          />
        </div>
      ) : null}
      <span className="text-2xl md:text-3xl font-headline text-bf-green">
        Bornfidis
      </span>
    </div>
  )
}


