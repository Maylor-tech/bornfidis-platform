import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface PremiumFeatureProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgrade?: boolean
}

async function hasPremiumAccess(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return false
    }

    // Check database for active premium access
    const premiumAccess = await prisma.premiumAccess.findFirst({
      where: {
        userId: session.user.id,
        active: true,
      },
    })

    return !!premiumAccess
  } catch (error) {
    console.error('Error checking premium access:', error)
    return false
  }
}

export default async function PremiumFeature({
  children,
  fallback,
  showUpgrade = true,
}: PremiumFeatureProps) {
  const isPremium = await hasPremiumAccess()

  if (isPremium) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  // Default premium wall
  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>

      {/* Premium overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border-4 border-bornfidis-gold p-8 z-10">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-headline text-bornfidis-green mb-2 font-bold">
            Premium Feature
          </h3>
          <p className="text-bornfidis-black/90 font-body mb-6 max-w-md">
            Upgrade to unlock full access to this feature
          </p>
          {showUpgrade && (
            <Link
              href="/mealplanner/upgrade"
              className="inline-block bg-bornfidis-green text-white rounded-xl px-6 py-3 font-semibold hover:bg-bornfidis-gold hover:text-bornfidis-black transition"
            >
              Upgrade to Unlock
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}


