import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const batch = searchParams.get('batch')

    // MEGA OPTIMIZATION: Handle batch requests for multiple types at once
    if (batch) {
      const types = batch.split(',').filter(Boolean)
      const batchData: any = {}

      for (const batchType of types) {
        try {
          switch (batchType) {
            case 'assessments':
              const assessments = await prisma.assessment.findMany({
                where: { 
                  userId: user.id,
                  status: 'completed'
                },
                include: {
                  scoreOverall: true,
                  scoreCategory: true
                },
                orderBy: { createdAt: 'desc' }
              })
              batchData.assessments = { success: true, assessments }
              break

            case 'subscription':
              const userWithSubs = await prisma.user.findUnique({
                where: { email: session.user.email },
                include: {
                  subscriptions: {
                    orderBy: { createdAt: 'desc' }
                  }
                }
              })
              const activeSubscription = userWithSubs?.subscriptions.find(
                sub => sub.status === 'active' && new Date(sub.periodEnd) > new Date()
              )
              if (activeSubscription) {
                batchData.subscription = {
                  hasSubscription: true,
                  subscription: {
                    id: activeSubscription.id,
                    product: activeSubscription.product,
                    status: activeSubscription.status,
                    periodEnd: activeSubscription.periodEnd,
                    cancelAt: activeSubscription.cancelAt
                  },
                  subscriptions: userWithSubs?.subscriptions || []
                }
              } else {
                batchData.subscription = {
                  hasSubscription: false,
                  subscription: null,
                  subscriptions: userWithSubs?.subscriptions || []
                }
              }
              break

            case 'purchases':
              const purchases = await prisma.purchase.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
              })
              batchData.purchases = { purchases }
              break

            case 'settings':
              const userSettings = await prisma.user.findUnique({
                where: { id: user.id },
                select: {
                  language: true
                }
              })
              batchData.settings = { settings: userSettings }
              break

            case 'language':
              batchData.language = { language: user.language || 'en' }
              break
          }
        } catch (error) {
          console.error(`Error fetching ${batchType}:`, error)
          batchData[batchType] = { error: `Failed to fetch ${batchType}` }
        }
      }

      return NextResponse.json(batchData)
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter required' },
        { status: 400 }
      )
    }

    // CONSOLIDATED: User assessments (formerly /api/user/assessments)
    if (type === 'assessments') {
      const assessments = await prisma.assessment.findMany({
        where: { 
          userId: user.id,
          status: 'completed'
        },
        include: {
          scoreOverall: true,
          scoreCategory: true
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        success: true,
        assessments
      })
    }

    // CONSOLIDATED: User subscription (formerly /api/user/subscription)
    if (type === 'subscription') {
      const userWithSubs = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          subscriptions: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      const activeSubscription = userWithSubs?.subscriptions.find(
        sub => sub.status === 'active' && new Date(sub.periodEnd) > new Date()
      )

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
          subscriptions: userWithSubs?.subscriptions || []
        })
      }

      return NextResponse.json({
        hasSubscription: false,
        subscription: null,
        subscriptions: userWithSubs?.subscriptions || []
      })
    }

    // CONSOLIDATED: User purchases (formerly /api/user/purchases)
    if (type === 'purchases') {
      const purchases = await prisma.purchase.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ purchases })
    }

    // CONSOLIDATED: User settings (formerly /api/user/settings)
    if (type === 'settings') {
      const userSettings = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          language: true
        }
      })

      return NextResponse.json({ settings: userSettings })
    }

    // CONSOLIDATED: User language (formerly /api/user/language)
    if (type === 'language') {
      return NextResponse.json({ language: user.language || 'en' })
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const body = await request.json()

    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter required' },
        { status: 400 }
      )
    }

    // CONSOLIDATED: Update user settings (formerly /api/user/settings PUT)
    if (type === 'settings') {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          language: body.language
        },
        select: {
          language: true
        }
      })

      return NextResponse.json({ 
        success: true, 
        settings: updatedUser 
      })
    }

    // CONSOLIDATED: Update user language (formerly /api/user/language PUT)
    if (type === 'language') {
      await prisma.user.update({
        where: { id: user.id },
        data: { language: body.language }
      })

      return NextResponse.json({ 
        success: true, 
        language: body.language 
      })
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating user data:', error)
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    )
  }
}