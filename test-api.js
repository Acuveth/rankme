const { PrismaClient } = require('@prisma/client')
const { ProgressTracker } = require('./lib/progress-tracker.ts')

const prisma = new PrismaClient()

async function testAPI() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (!user) {
      console.log('User not found')
      return
    }

    console.log('=== TESTING PROGRESS TRACKER getUserProgress ===')
    const progressStats = await ProgressTracker.getUserProgress(user.id)
    console.log('Progress stats returned:', progressStats)

    console.log('\n=== TESTING ASSESSMENT DATA ===')
    // Get user's most recent assessment for current score
    const latestAssessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      include: { scoreOverall: true },
      orderBy: { createdAt: 'desc' }
    })

    const currentScore = latestAssessment?.scoreOverall?.percentileOverall || 0
    console.log('Current score:', currentScore)

    // Calculate improvement since first assessment
    const firstAssessment = await prisma.assessment.findFirst({
      where: { userId: user.id },
      include: { scoreOverall: true },
      orderBy: { createdAt: 'asc' }
    })

    const improvementPoints = firstAssessment?.scoreOverall?.percentileOverall 
      ? Math.round(currentScore - firstAssessment.scoreOverall.percentileOverall)
      : 0

    console.log('First assessment score:', firstAssessment?.scoreOverall?.percentileOverall)
    console.log('Improvement points:', improvementPoints)

    console.log('\n=== SIMULATING API RESPONSE ===')
    const apiResponse = {
      streak: {
        days: progressStats?.currentStreak || 0,
        message: getStreakMessage(progressStats?.currentStreak || 0)
      },
      completionRate: {
        percentage: Math.round(progressStats?.monthlyCompletionRate || 0),
        completed: progressStats?.totalTasksCompleted || 0,
        total: progressStats?.totalTasksAssigned || 0
      },
      currentScore: {
        percentile: Math.round(currentScore),
        improvement: improvementPoints
      },
      lastUpdated: progressStats?.lastCalculated?.toISOString() || new Date().toISOString()
    }

    console.log('API Response would be:', JSON.stringify(apiResponse, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function getStreakMessage(streak) {
  if (streak === 0) return "Start your streak today!"
  if (streak === 1) return "Great start!"
  if (streak < 7) return "Keep going!"
  if (streak < 14) return "You're on fire!"
  if (streak < 30) return "Amazing streak!"
  return "Legendary streak!"
}

testAPI()