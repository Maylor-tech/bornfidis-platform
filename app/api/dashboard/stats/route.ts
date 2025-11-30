import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get current month start
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Count meal plans generated this month
    const plansThisMonth = await prisma.weeklyMealPlan.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: monthStart,
        },
      },
    })

    // Count total meal plans
    const totalPlans = await prisma.weeklyMealPlan.count({
      where: {
        userId: session.user.id,
      },
    })

    // Get premium access info
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
      plansThisMonth,
      totalPlans,
      isPremium: !!premiumAccess,
      memberSince: premiumAccess?.createdAt || null,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

