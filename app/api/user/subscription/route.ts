import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('Subscription API: Session check failed:', { session })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Fetching subscription for user:', session.user.email)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      console.log('User not found in database:', session.user.email)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Found user with subscriptions:', { 
      id: user.id, 
      email: user.email, 
      subscriptionCount: user.subscriptions.length,
      subscriptions: user.subscriptions
    })

    const activeSubscription = user.subscriptions.find(
      sub => sub.status === 'active' && new Date(sub.periodEnd) > new Date()
    )

    console.log('Active subscription:', activeSubscription)

    if (activeSubscription) {
      return NextResponse.json({
        hasSubscription: true,
        subscription: {
          id: activeSubscription.id,
          product: activeSubscription.product,
          status: activeSubscription.status,
          periodEnd: activeSubscription.periodEnd,
          cancelAt: activeSubscription.cancelAt
        },
        subscriptions: user.subscriptions // Include all subscriptions for detailed checking
      })
    }

    return NextResponse.json({
      hasSubscription: false,
      subscription: null,
      subscriptions: user.subscriptions // Include all subscriptions for detailed checking
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    )
  }
}