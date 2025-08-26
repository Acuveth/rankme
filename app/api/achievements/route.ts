import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's achievements
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
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, title, description, icon, category, level, metadata } = await request.json()

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
  } catch (error) {
    console.error('Error creating achievement:', error)
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
}