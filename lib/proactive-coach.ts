import { prisma } from '@/lib/prisma'
import { enhancedCoachingEngine } from './enhanced-coaching'
import { ProactiveInsight } from './coaching-types'

export class ProactiveCoachingScheduler {
  async scheduleUserCheckIns(userId: string) {
    const coachSettings = await prisma.coachSettings.findUnique({
      where: { userId }
    })

    if (!coachSettings) {
      // Create default settings
      await prisma.coachSettings.create({
        data: {
          userId,
          checkInFrequency: 'daily',
          checkInTime: '09:00',
          dailyReminders: true
        }
      })
      return
    }

    const now = new Date()
    const nextCheckIn = this.calculateNextCheckIn(coachSettings.checkInFrequency, coachSettings.checkInTime, coachSettings.checkInDays)

    // Only schedule if no pending check-in exists
    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId,
        status: 'pending',
        scheduledFor: { gte: now }
      }
    })

    if (!existingCheckIn && nextCheckIn > now) {
      await prisma.checkIn.create({
        data: {
          userId,
          type: this.getCheckInType(coachSettings.checkInFrequency),
          scheduledFor: nextCheckIn,
          status: 'pending'
        }
      })

      // Update user settings with next check-in time
      await prisma.coachSettings.update({
        where: { userId },
        data: { nextCheckIn }
      })
    }
  }

  private calculateNextCheckIn(frequency: string, time: string, checkInDays?: string | null): Date {
    const now = new Date()
    const [hour, minute] = time.split(':').map(Number)
    const nextCheckIn = new Date(now)

    switch (frequency) {
      case 'daily':
        nextCheckIn.setDate(now.getDate() + 1)
        break
      case 'weekly':
        const daysArray = checkInDays ? JSON.parse(checkInDays) : ['Monday']
        const targetDay = daysArray[0] // Use first day for simplicity
        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(targetDay)
        const currentDay = now.getDay()
        const daysUntilTarget = (dayIndex - currentDay + 7) % 7 || 7
        nextCheckIn.setDate(now.getDate() + daysUntilTarget)
        break
      case 'biweekly':
        nextCheckIn.setDate(now.getDate() + 14)
        break
      case 'monthly':
        nextCheckIn.setMonth(now.getMonth() + 1)
        break
      default:
        nextCheckIn.setDate(now.getDate() + 1)
    }

    nextCheckIn.setHours(hour, minute, 0, 0)
    return nextCheckIn
  }

  private getCheckInType(frequency: string): string {
    switch (frequency) {
      case 'daily':
        return 'daily'
      case 'weekly':
      case 'biweekly':
        return 'weekly'
      case 'monthly':
        return 'monthly'
      default:
        return 'daily'
    }
  }

  async generateDailyInsights(userId: string): Promise<ProactiveInsight[]> {
    try {
      const context = await enhancedCoachingEngine.gatherUserContext(userId)
      
      // Get assessment data for the user
      const assessment = await prisma.assessment.findFirst({
        where: { userId },
        include: { scoreOverall: true },
        orderBy: { createdAt: 'desc' }
      })

      if (!assessment || !assessment.scoreOverall) {
        return []
      }

      const assessmentData = {
        overall: {
          score: assessment.scoreOverall.overall,
          percentile: assessment.scoreOverall.percentileOverall
        },
        categories: {
          financial: assessment.scoreOverall.percentileFinancial,
          health: assessment.scoreOverall.percentileHealth,
          social: assessment.scoreOverall.percentileSocial,
          romantic: assessment.scoreOverall.percentileRomantic
        },
        cohort: {
          age_band: assessment.cohortAge,
          sex: assessment.cohortSex,
          region: assessment.cohortRegion
        }
      }

      return await this.generateInsights(context, assessmentData)
    } catch (error) {
      console.error('Error generating daily insights:', error)
      return []
    }
  }

  private async generateInsights(context: any, assessmentData: any): Promise<ProactiveInsight[]> {
    const insights: ProactiveInsight[] = []
    const now = new Date()

    // Streak milestones
    if (context.weeklyProgress.currentStreak > 0 && context.weeklyProgress.currentStreak % 7 === 0) {
      insights.push({
        type: 'milestone_celebration',
        priority: 'high',
        message: `🔥 Amazing ${context.weeklyProgress.currentStreak}-day streak! You're building incredible consistency.`,
        actionable: true,
        suggestedActions: [
          'Set a new personal best goal',
          'Reflect on what strategies are working',
          'Share your success with someone who supports you'
        ],
        triggerData: { streakDays: context.weeklyProgress.currentStreak }
      })
    }

    // Completion rate trends
    if (context.weeklyProgress.weeklyCompletionRate < 40 && context.weeklyProgress.completionRate > 60) {
      insights.push({
        type: 'obstacle_warning',
        priority: 'high',
        message: 'I notice your completion rate has dropped this week. Let\'s identify what\'s changed and adapt.',
        actionable: true,
        suggestedActions: [
          'Review your current tasks - are they too challenging?',
          'Check if your schedule has changed recently',
          'Consider breaking large tasks into smaller steps'
        ],
        triggerData: { 
          weeklyRate: context.weeklyProgress.weeklyCompletionRate,
          overallRate: context.weeklyProgress.completionRate
        }
      })
    }

    // Goal progress insights
    const stagnantGoals = context.goalProgress.filter(goal => 
      goal.status === 'active' && goal.progress < 10 && 
      goal.deadline && new Date(goal.deadline) < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    )

    if (stagnantGoals.length > 0) {
      insights.push({
        type: 'habit_suggestion',
        priority: 'medium',
        message: `You have ${stagnantGoals.length} goal(s) with upcoming deadlines that need attention.`,
        actionable: true,
        suggestedActions: [
          'Break down stuck goals into smaller milestones',
          'Set aside dedicated time this week for goal work',
          'Consider if goal deadlines need to be adjusted realistically'
        ],
        triggerData: { stagnantGoals: stagnantGoals.length }
      })
    }

    // Journal consistency
    if (context.recentJournalEntries.length === 0) {
      insights.push({
        type: 'habit_suggestion',
        priority: 'low',
        message: 'Journaling can help clarify your thoughts and track progress. Even 2-3 sentences daily makes a difference.',
        actionable: true,
        suggestedActions: [
          'Set a daily reminder to journal for 5 minutes',
          'Try answering: What went well today? What could be better?',
          'Use voice notes if writing feels too time-consuming'
        ],
        triggerData: { journalGap: 'missing' }
      })
    }

    // Achievement opportunities
    const categoriesNeedingWork = Object.entries(assessmentData.categories)
      .filter(([, percentile]) => percentile < 40)
      .sort(([,a], [,b]) => a - b)

    if (categoriesNeedingWork.length > 0) {
      const [category, percentile] = categoriesNeedingWork[0]
      insights.push({
        type: 'habit_suggestion',
        priority: 'medium',
        message: `Your ${category} area (${percentile}th percentile) has the most growth potential. Small daily actions here can create big improvements.`,
        actionable: true,
        suggestedActions: [
          `Create one micro-habit for ${category} improvement`,
          `Spend 10 minutes daily on ${category} tasks`,
          `Set a 30-day challenge in your ${category} area`
        ],
        triggerData: { category, percentile }
      })
    }

    return insights
  }

  async createMotivationalCheckIn(userId: string): Promise<void> {
    const insights = await this.generateDailyInsights(userId)
    const highPriorityInsights = insights.filter(insight => insight.priority === 'high')

    if (highPriorityInsights.length > 0) {
      const checkInData = {
        insights: highPriorityInsights,
        questions: this.generateCheckInQuestions(highPriorityInsights),
        motivationalMessage: this.generateMotivationalMessage(highPriorityInsights)
      }

      // This could be expanded to send push notifications, emails, etc.
      console.log(`Check-in created for user ${userId}:`, checkInData)
    }
  }

  private generateCheckInQuestions(insights: ProactiveInsight[]): string[] {
    const questions = [
      "How are you feeling about your progress today?",
      "What's one thing you're proud of this week?",
      "What's your biggest challenge right now?"
    ]

    insights.forEach(insight => {
      if (insight.type === 'obstacle_warning') {
        questions.push("What obstacles have you encountered, and how can we address them?")
      } else if (insight.type === 'milestone_celebration') {
        questions.push("How does achieving this milestone make you feel?")
      }
    })

    return questions.slice(0, 3) // Limit to 3 questions
  }

  private generateMotivationalMessage(insights: ProactiveInsight[]): string {
    if (insights.some(i => i.type === 'milestone_celebration')) {
      return "You're making incredible progress! Keep up the momentum."
    } else if (insights.some(i => i.type === 'obstacle_warning')) {
      return "Every challenge is an opportunity to grow stronger. You've got this!"
    } else {
      return "Small consistent actions lead to big transformations. What will you accomplish today?"
    }
  }

  async processScheduledCheckIns(): Promise<void> {
    const now = new Date()
    
    // Find all pending check-ins that should be processed
    const pendingCheckIns = await prisma.checkIn.findMany({
      where: {
        status: 'pending',
        scheduledFor: { lte: now }
      },
      include: {
        user: {
          include: {
            coachSettings: true
          }
        }
      }
    })

    for (const checkIn of pendingCheckIns) {
      if (checkIn.user.coachSettings?.dailyReminders) {
        await this.createMotivationalCheckIn(checkIn.userId)
      }

      // Schedule next check-in
      await this.scheduleUserCheckIns(checkIn.userId)
    }
  }
}

export const proactiveCoachingScheduler = new ProactiveCoachingScheduler()