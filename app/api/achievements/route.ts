import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkAndAwardAchievements, checkAchievementsAfterTaskCompletion } from '@/lib/achievements'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'

    if (action === 'list') {
      // Fetch user's achievements (original functionality)
      const achievements = await prisma.achievement.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          earnedAt: 'desc'
        },
        take: 10 // Get the 10 most recent achievements
      })

      return NextResponse.json({ achievements })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing achievements request:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const action = body.action || 'create'

    if (action === 'check') {
      // CONSOLIDATED: Check achievements functionality (formerly /api/achievements/check)
      const { trigger, category } = body

      let result
      
      if (trigger === 'task_completion') {
        // Check achievements after a task was completed
        result = await checkAchievementsAfterTaskCompletion(session.user.id, category)
      } else {
        // General achievement check
        const newAchievements = await checkAndAwardAchievements(session.user.id)
        result = { newAchievements }
      }

      return NextResponse.json({ 
        success: true,
        ...result
      })
    }

    if (action === 'create') {
      // Original create functionality
      const { type, title, description, icon, category, level, metadata } = body

      // Check if achievement already exists
      const existingAchievement = await prisma.achievement.findFirst({
        where: {
          userId: session.user.id,
          type,
          title
        }
      })

      if (existingAchievement) {
        return NextResponse.json({ 
          message: 'Achievement already earned',
          achievement: existingAchievement 
        })
      }

      // Create new achievement
      const achievement = await prisma.achievement.create({
        data: {
          userId: session.user.id,
          type,
          title,
          description,
          icon,
          category: category || null,
          level: level || 'bronze',
          metadata: metadata ? JSON.stringify(metadata) : null
        }
      })

      return NextResponse.json({ 
        message: 'Achievement earned!',
        achievement 
      })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing achievements:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}