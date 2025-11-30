import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ isPremium: false })
    }

    // Check database for active premium access
    const premiumAccess = await prisma.premiumAccess.findFirst({
      where: {
        userId: session.user.id,
        active: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({ 
      isPremium: !!premiumAccess,
      subscriptionId: premiumAccess?.stripeId || null,
      activatedAt: premiumAccess?.createdAt || null,
    })
  } catch (error) {
    console.error('Error checking premium status:', error)
    return NextResponse.json({ isPremium: false })
  }
}


