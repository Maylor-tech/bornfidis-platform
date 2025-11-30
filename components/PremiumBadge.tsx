'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function PremiumBadge() {
  const { data: session } = useSession()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    const checkPremium = async () => {
      try {
        const response = await fetch('/api/mealplanner/premium-status')
        const data = await response.json()
        setIsPremium(data.isPremium || false)
      } catch (err) {
        console.error('Error checking premium status:', err)
        setIsPremium(false)
      } finally {
        setLoading(false)
      }
    }

    checkPremium()
  }, [session])

  if (!session || loading || !isPremium) {
    return null
  }

  return (
    <Link
      href="/mealplanner"
      className="inline-flex items-center gap-2 bg-bornfidis-gold text-bornfidis-green px-3 py-1.5 rounded-full text-xs font-bold hover:bg-bornfidis-green hover:text-white transition-colors"
      title="Premium Member"
    >
      <span>⭐</span>
      <span>Premium</span>
    </Link>
  )
}

