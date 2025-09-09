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
    const assessmentId = searchParams.get('assessmentId')
    const date = searchParams.get('date')

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns the assessment
    const assessment = await prisma.assessment.findUnique({
      where: { 
        id: assessmentId,
        userId: user.id 
      }
    })

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found or access denied' },
        { status: 404 }
      )
    }

    // Build query filters
    const whereClause: any = {
      userId: user.id,
      assessmentId: assessmentId
    }

    // If specific date provided, filter by that date
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const dailyTasks = await prisma.dailyTask.findMany({
      where: whereClause,
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      tasks: dailyTasks,
      count: dailyTasks.length
    })

  } catch (error) {
    console.error('Error fetching daily tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily tasks' },
      { status: 500 }
    )
  }
}