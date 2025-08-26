import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkAndAwardAchievements, checkAchievementsAfterTaskCompletion } from '@/lib/achievements'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
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
  } catch (error) {
    console.error('Error checking achievements:', error)
    return NextResponse.json({ error: 'Failed to check achievements' }, { status: 500 })
  }
}