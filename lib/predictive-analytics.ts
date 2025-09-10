import { prisma } from '@/lib/prisma'
import { startOfWeek, addDays, format, differenceInDays, subDays, startOfDay, endOfDay } from 'date-fns'

export interface PredictiveInsight {
  id: string
  type: 'risk_detection' | 'behavior_forecast' | 'personalized_recommendation' | 'intervention_timing' | 'pattern_coaching'
  confidence: number // 0-100
  priority: 'high' | 'medium' | 'low'
  title: string
  message: string
  data: any
  actionable: boolean
  suggestedActions?: string[]
  timeFrame?: string
  category?: string
}

export interface UserPattern {
  dayOfWeek: number
  hourOfDay: number
  category: string
  completionRate: number
  averageTime?: number
  moodCorrelation?: number
}

export interface RiskPrediction {
  taskId?: string
  category: string
  riskLevel: number // 0-100
  factors: string[]
  preventionStrategies: string[]
  predictedDate: Date
}

export class PredictiveAnalyticsEngine {
  private userId: string
  private assessmentId?: string

  constructor(userId: string, assessmentId?: string) {
    this.userId = userId
    this.assessmentId = assessmentId
  }

  async generateAllInsights(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = []

    try {
      // Gather all insights in parallel for performance
      const [
        riskInsights,
        behaviorInsights,
        recommendationInsights,
        interventionInsights,
        patternInsights
      ] = await Promise.all([
        this.detectTaskCompletionRisks(),
        this.forecastBehaviorPatterns(),
        this.generatePersonalizedRecommendations(),
        this.determineOptimalInterventions(),
        this.analyzePatternBasedCoaching()
      ])

      insights.push(...riskInsights, ...behaviorInsights, ...recommendationInsights, ...interventionInsights, ...patternInsights)

      // Sort by priority and confidence
      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return b.confidence - a.confidence
      })
    } catch (error) {
      console.error('Error generating predictive insights:', error)
      return insights
    }
  }

  async detectTaskCompletionRisks(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = []

    try {
      // Get historical task data for the last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30)
      
      const historicalTasks = await prisma.dailyTask.findMany({
        where: {
          userId: this.userId,
          date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: 'desc' }
      })

      if (historicalTasks.length < 7) {
        return insights // Not enough data for prediction
      }

      // Analyze patterns by category and day of week
      const categoryPatterns = new Map<string, { total: number, completed: number, byDay: Map<number, { total: number, completed: number }> }>()
      
      historicalTasks.forEach(task => {
        const dayOfWeek = new Date(task.date).getDay()
        const category = task.category
        
        if (!categoryPatterns.has(category)) {
          categoryPatterns.set(category, { total: 0, completed: 0, byDay: new Map() })
        }
        
        const pattern = categoryPatterns.get(category)!
        pattern.total++
        if (task.completed) pattern.completed++
        
        if (!pattern.byDay.has(dayOfWeek)) {
          pattern.byDay.set(dayOfWeek, { total: 0, completed: 0 })
        }
        
        const dayPattern = pattern.byDay.get(dayOfWeek)!
        dayPattern.total++
        if (task.completed) dayPattern.completed++
      })

      // Generate risk predictions for tomorrow
      const tomorrow = addDays(new Date(), 1)
      const tomorrowDayOfWeek = tomorrow.getDay()

      for (const [category, pattern] of categoryPatterns) {
        const overallCompletionRate = pattern.completed / pattern.total
        const dayPattern = pattern.byDay.get(tomorrowDayOfWeek)
        const dayCompletionRate = dayPattern ? dayPattern.completed / dayPattern.total : overallCompletionRate

        // Calculate risk based on historical patterns
        const riskLevel = Math.round((1 - dayCompletionRate) * 100)

        if (riskLevel > 50) {
          const factors: string[] = []
          
          // Identify risk factors
          if (dayCompletionRate < overallCompletionRate - 0.2) {
            factors.push(`${format(tomorrow, 'EEEE')}s are typically challenging for ${category} tasks`)
          }
          
          if (overallCompletionRate < 0.4) {
            factors.push(`Historical completion rate for ${category} is low (${Math.round(overallCompletionRate * 100)}%)`)
          }

          // Check for recent declining trend
          const recentTasks = historicalTasks.filter(t => 
            t.category === category && differenceInDays(new Date(), new Date(t.date)) <= 7
          )
          const recentCompletionRate = recentTasks.filter(t => t.completed).length / recentTasks.length
          
          if (recentCompletionRate < overallCompletionRate - 0.15) {
            factors.push('Recent performance has been declining')
          }

          insights.push({
            id: `risk_${category}_${tomorrow.getTime()}`,
            type: 'risk_detection',
            confidence: Math.min(95, Math.round(70 + (historicalTasks.length / 30) * 25)),
            priority: riskLevel > 70 ? 'high' : 'medium',
            title: `⚠️ Task Completion Risk Alert`,
            message: `You're ${riskLevel}% likely to miss tomorrow's ${category} tasks based on your patterns`,
            data: {
              category,
              riskLevel,
              dayCompletionRate: Math.round(dayCompletionRate * 100),
              overallCompletionRate: Math.round(overallCompletionRate * 100),
              predictedDate: tomorrow
            },
            actionable: true,
            suggestedActions: [
              `Schedule ${category} tasks for your most productive time`,
              'Set a reminder 30 minutes before your usual task time',
              'Prepare materials tonight to reduce friction tomorrow',
              `Consider breaking ${category} tasks into smaller steps`
            ],
            timeFrame: 'Tomorrow',
            category
          })
        }
      }

      // Check for upcoming streak break risk
      const progressStats = await prisma.userProgressStats.findUnique({
        where: { userId: this.userId }
      })

      if (progressStats && progressStats.currentStreak > 3) {
        const todayTasks = await prisma.dailyTask.findMany({
          where: {
            userId: this.userId,
            date: startOfDay(new Date())
          }
        })

        const todayCompletionRate = todayTasks.length > 0 
          ? todayTasks.filter(t => t.completed).length / todayTasks.length 
          : 0

        if (todayCompletionRate < 0.5 && new Date().getHours() >= 18) {
          insights.push({
            id: `streak_risk_${new Date().getTime()}`,
            type: 'risk_detection',
            confidence: 85,
            priority: 'high',
            title: '🔥 Streak at Risk!',
            message: `Your ${progressStats.currentStreak}-day streak is at risk! Complete today's remaining tasks to keep it alive.`,
            data: {
              currentStreak: progressStats.currentStreak,
              tasksRemaining: todayTasks.filter(t => !t.completed).length,
              completionRate: Math.round(todayCompletionRate * 100)
            },
            actionable: true,
            suggestedActions: [
              'Complete at least one more task to maintain momentum',
              'Focus on quick wins to boost completion rate',
              'Set a timer for 25 minutes and tackle your easiest task'
            ],
            timeFrame: 'Today',
            category: 'streak'
          })
        }
      }

    } catch (error) {
      console.error('Error detecting task completion risks:', error)
    }

    return insights
  }

  async forecastBehaviorPatterns(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = []

    try {
      // Analyze task completion by hour and day
      const thirtyDaysAgo = subDays(new Date(), 30)
      
      const tasks = await prisma.dailyTask.findMany({
        where: {
          userId: this.userId,
          date: { gte: thirtyDaysAgo },
          completed: true,
          completedAt: { not: null }
        }
      })

      if (tasks.length < 20) {
        return insights // Not enough data
      }

      // Analyze productivity by hour
      const hourlyProductivity = new Map<number, { count: number, categories: Set<string> }>()
      const dayProductivity = new Map<number, { count: number, avgCompletionTime: number }>()

      tasks.forEach(task => {
        if (task.completedAt) {
          const hour = new Date(task.completedAt).getHours()
          const day = new Date(task.date).getDay()
          
          if (!hourlyProductivity.has(hour)) {
            hourlyProductivity.set(hour, { count: 0, categories: new Set() })
          }
          const hourData = hourlyProductivity.get(hour)!
          hourData.count++
          hourData.categories.add(task.category)

          if (!dayProductivity.has(day)) {
            dayProductivity.set(day, { count: 0, avgCompletionTime: 0 })
          }
          const dayData = dayProductivity.get(day)!
          dayData.count++
          dayData.avgCompletionTime = (dayData.avgCompletionTime * (dayData.count - 1) + hour) / dayData.count
        }
      })

      // Find peak productivity hours
      let maxHour = -1
      let maxCount = 0
      hourlyProductivity.forEach((data, hour) => {
        if (data.count > maxCount) {
          maxCount = data.count
          maxHour = hour
        }
      })

      if (maxHour !== -1) {
        const timeRange = maxHour < 12 ? 'morning' : maxHour < 17 ? 'afternoon' : 'evening'
        const nextOccurrence = this.getNextTimeOccurrence(maxHour)
        
        insights.push({
          id: `behavior_peak_${new Date().getTime()}`,
          type: 'behavior_forecast',
          confidence: Math.min(90, Math.round(60 + (tasks.length / 50) * 30)),
          priority: 'medium',
          title: '📊 Peak Productivity Detected',
          message: `Based on your patterns, ${maxHour}:00-${maxHour + 1}:00 is your most productive time (${timeRange})`,
          data: {
            peakHour: maxHour,
            taskCount: maxCount,
            timeRange,
            nextOccurrence: nextOccurrence.toLocaleString()
          },
          actionable: true,
          suggestedActions: [
            `Schedule your most important tasks around ${maxHour}:00`,
            `Block this time in your calendar for deep work`,
            `Avoid meetings during your peak productivity window`,
            `Prepare your workspace before ${maxHour}:00 to maximize focus`
          ],
          timeFrame: 'Daily Pattern',
          category: 'productivity'
        })
      }

      // Find best day of week patterns
      let bestDay = -1
      let bestDayCount = 0
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      
      dayProductivity.forEach((data, day) => {
        if (data.count > bestDayCount) {
          bestDayCount = data.count
          bestDay = day
        }
      })

      if (bestDay !== -1) {
        const nextBestDay = this.getNextDayOccurrence(bestDay)
        
        insights.push({
          id: `behavior_bestday_${new Date().getTime()}`,
          type: 'behavior_forecast',
          confidence: 75,
          priority: 'low',
          title: '🌟 Weekly Pattern Identified',
          message: `${dayNames[bestDay]}s are typically your most productive days`,
          data: {
            bestDay: dayNames[bestDay],
            averageTasks: Math.round(bestDayCount / 4), // Assuming 4 weeks of data
            nextOccurrence: nextBestDay.toLocaleDateString()
          },
          actionable: true,
          suggestedActions: [
            `Plan challenging tasks for ${dayNames[bestDay]}s`,
            `Use ${dayNames[bestDay]}s for important goal progress`,
            `Schedule easier tasks on less productive days`
          ],
          timeFrame: 'Weekly Pattern',
          category: 'productivity'
        })
      }

      // Detect productivity decline patterns
      const recentWeekTasks = tasks.filter(t => differenceInDays(new Date(), new Date(t.date)) <= 7)
      const previousWeekTasks = tasks.filter(t => {
        const daysDiff = differenceInDays(new Date(), new Date(t.date))
        return daysDiff > 7 && daysDiff <= 14
      })

      if (recentWeekTasks.length > 0 && previousWeekTasks.length > 0) {
        const recentAvg = recentWeekTasks.length / 7
        const previousAvg = previousWeekTasks.length / 7
        const changePercent = ((recentAvg - previousAvg) / previousAvg) * 100

        if (changePercent < -20) {
          insights.push({
            id: `behavior_decline_${new Date().getTime()}`,
            type: 'behavior_forecast',
            confidence: 80,
            priority: 'high',
            title: '📉 Productivity Decline Detected',
            message: `Your task completion has decreased by ${Math.abs(Math.round(changePercent))}% this week`,
            data: {
              recentAverage: Math.round(recentAvg * 10) / 10,
              previousAverage: Math.round(previousAvg * 10) / 10,
              changePercent: Math.round(changePercent)
            },
            actionable: true,
            suggestedActions: [
              'Review and simplify your current goals',
              'Take a short break to prevent burnout',
              'Focus on one category at a time',
              'Consider adjusting task difficulty'
            ],
            timeFrame: 'This Week',
            category: 'productivity'
          })
        } else if (changePercent > 30) {
          insights.push({
            id: `behavior_improvement_${new Date().getTime()}`,
            type: 'behavior_forecast',
            confidence: 85,
            priority: 'medium',
            title: '🚀 Productivity Surge!',
            message: `Your task completion has increased by ${Math.round(changePercent)}% this week!`,
            data: {
              recentAverage: Math.round(recentAvg * 10) / 10,
              previousAverage: Math.round(previousAvg * 10) / 10,
              changePercent: Math.round(changePercent)
            },
            actionable: true,
            suggestedActions: [
              'Document what\'s working for you',
              'Consider increasing task difficulty',
              'Share your success strategies',
              'Set more ambitious goals'
            ],
            timeFrame: 'This Week',
            category: 'productivity'
          })
        }
      }

    } catch (error) {
      console.error('Error forecasting behavior patterns:', error)
    }

    return insights
  }

  async generatePersonalizedRecommendations(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = []

    try {
      // Get user's assessment data and compare with cohort
      if (!this.assessmentId) return insights

      const assessment = await prisma.assessment.findUnique({
        where: { id: this.assessmentId },
        include: {
          scoreCategory: true,
          scoreOverall: true
        }
      })

      if (!assessment || !assessment.scoreCategory) return insights

      // Get similar users' performance (same cohort)
      const similarUsers = await prisma.assessment.findMany({
        where: {
          cohortAge: assessment.cohortAge,
          cohortSex: assessment.cohortSex,
          status: 'completed',
          userId: { not: null }
        },
        include: {
          scoreCategory: true,
          user: {
            include: {
              progressStats: true
            }
          }
        },
        take: 100
      })

      if (similarUsers.length < 10) return insights

      // Analyze high performers in the cohort
      const highPerformers = similarUsers.filter(u => 
        u.scoreOverall && u.scoreOverall.score > (assessment.scoreOverall?.score || 50)
      )

      if (highPerformers.length > 0) {
        // Analyze their task patterns
        const highPerformerPatterns = await this.analyzeHighPerformerPatterns(
          highPerformers.map(u => u.userId!).filter(Boolean)
        )

        if (highPerformerPatterns.optimalTime) {
          insights.push({
            id: `recommendation_time_${new Date().getTime()}`,
            type: 'personalized_recommendation',
            confidence: Math.min(85, 60 + highPerformers.length),
            priority: 'medium',
            title: '💡 Cohort Success Pattern',
            message: `Users similar to you improve 40% faster by doing tasks at ${highPerformerPatterns.optimalTime}:00`,
            data: {
              cohortSize: highPerformers.length,
              optimalTime: highPerformerPatterns.optimalTime,
              improvementRate: 40,
              yourCurrentTime: await this.getUserAverageTaskTime()
            },
            actionable: true,
            suggestedActions: [
              `Try completing tasks at ${highPerformerPatterns.optimalTime}:00 for a week`,
              'Set daily reminders for this optimal time',
              'Track if this timing improves your completion rate',
              'Adjust your schedule to protect this time slot'
            ],
            timeFrame: 'Next 7 Days',
            category: 'optimization'
          })
        }

        // Category focus recommendations
        const userScores = assessment.scoreCategory
        const categoryGaps = this.identifyCategoryGaps(userScores, highPerformers)

        if (categoryGaps.length > 0) {
          const topGap = categoryGaps[0]
          insights.push({
            id: `recommendation_category_${new Date().getTime()}`,
            type: 'personalized_recommendation',
            confidence: 78,
            priority: topGap.gap > 20 ? 'high' : 'medium',
            title: '🎯 Focus Area Identified',
            message: `High performers in your cohort excel in ${topGap.category}. You could gain ${Math.round(topGap.gap)} points here.`,
            data: {
              category: topGap.category,
              yourScore: topGap.userScore,
              cohortAverage: topGap.cohortAverage,
              potentialGain: topGap.gap
            },
            actionable: true,
            suggestedActions: [
              `Increase ${topGap.category} tasks by 50% this week`,
              `Set a specific ${topGap.category} goal for this month`,
              `Find an accountability partner for ${topGap.category}`,
              `Research best practices for ${topGap.category} improvement`
            ],
            timeFrame: 'This Month',
            category: topGap.category
          })
        }
      }

      // Task frequency recommendations
      const taskFrequency = await this.analyzeOptimalTaskFrequency()
      if (taskFrequency) {
        insights.push({
          id: `recommendation_frequency_${new Date().getTime()}`,
          type: 'personalized_recommendation',
          confidence: 70,
          priority: 'low',
          title: '📈 Optimal Task Load',
          message: taskFrequency.message,
          data: taskFrequency.data,
          actionable: true,
          suggestedActions: taskFrequency.suggestions,
          timeFrame: 'Next Week',
          category: 'workload'
        })
      }

    } catch (error) {
      console.error('Error generating personalized recommendations:', error)
    }

    return insights
  }

  async determineOptimalInterventions(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = []

    try {
      // Analyze weekly patterns for motivation dips
      const thirtyDaysAgo = subDays(new Date(), 30)
      
      const tasks = await prisma.dailyTask.findMany({
        where: {
          userId: this.userId,
          date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: 'asc' }
      })

      if (tasks.length < 14) return insights

      // Analyze completion rates by day of week
      const dayPatterns = new Map<number, { total: number, completed: number }>()
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      tasks.forEach(task => {
        const day = new Date(task.date).getDay()
        if (!dayPatterns.has(day)) {
          dayPatterns.set(day, { total: 0, completed: 0 })
        }
        const pattern = dayPatterns.get(day)!
        pattern.total++
        if (task.completed) pattern.completed++
      })

      // Find lowest performance day
      let worstDay = -1
      let worstRate = 1
      dayPatterns.forEach((pattern, day) => {
        const rate = pattern.completed / pattern.total
        if (rate < worstRate && pattern.total >= 3) {
          worstRate = rate
          worstDay = day
        }
      })

      if (worstDay !== -1 && worstRate < 0.6) {
        const nextOccurrence = this.getNextDayOccurrence(worstDay)
        
        insights.push({
          id: `intervention_motivation_${new Date().getTime()}`,
          type: 'intervention_timing',
          confidence: Math.min(85, 65 + tasks.length / 5),
          priority: 'medium',
          title: '🎯 Strategic Planning Alert',
          message: `Your motivation typically drops on ${dayNames[worstDay]}s - schedule easier tasks`,
          data: {
            challengeDay: dayNames[worstDay],
            completionRate: Math.round(worstRate * 100),
            nextOccurrence: nextOccurrence.toLocaleDateString(),
            historicalPerformance: Array.from(dayPatterns.entries()).map(([day, pattern]) => ({
              day: dayNames[day],
              rate: Math.round((pattern.completed / pattern.total) * 100)
            }))
          },
          actionable: true,
          suggestedActions: [
            `Pre-plan simple wins for ${dayNames[worstDay]}`,
            'Schedule your favorite activities as rewards',
            'Prepare everything the night before',
            'Partner with someone for accountability',
            `Consider making ${dayNames[worstDay]} a rest or planning day`
          ],
          timeFrame: `Next ${dayNames[worstDay]}`,
          category: 'motivation'
        })
      }

      // Energy management interventions
      const journalEntries = await prisma.journalEntry.findMany({
        where: {
          userId: this.userId,
          date: { gte: thirtyDaysAgo },
          mood: { not: null }
        },
        orderBy: { date: 'desc' }
      })

      if (journalEntries.length >= 7) {
        const moodPatterns = this.analyzeMoodPatterns(journalEntries)
        
        if (moodPatterns.lowEnergyTime) {
          insights.push({
            id: `intervention_energy_${new Date().getTime()}`,
            type: 'intervention_timing',
            confidence: 75,
            priority: 'medium',
            title: '⚡ Energy Management Tip',
            message: `Your energy tends to dip around ${moodPatterns.lowEnergyTime}. Plan accordingly.`,
            data: {
              lowEnergyTime: moodPatterns.lowEnergyTime,
              pattern: moodPatterns.pattern,
              suggestion: moodPatterns.suggestion
            },
            actionable: true,
            suggestedActions: [
              'Schedule breaks before energy dips',
              'Plan energizing activities for low points',
              'Adjust meal timing for sustained energy',
              'Try a 10-minute walk during low energy times'
            ],
            timeFrame: 'Daily',
            category: 'energy'
          })
        }
      }

      // Burnout prevention interventions
      const recentStreak = await this.checkForBurnoutRisk()
      if (recentStreak.burnoutRisk) {
        insights.push({
          id: `intervention_burnout_${new Date().getTime()}`,
          type: 'intervention_timing',
          confidence: 88,
          priority: 'high',
          title: '🛑 Burnout Prevention Alert',
          message: 'High activity detected. Time for strategic recovery.',
          data: recentStreak.data,
          actionable: true,
          suggestedActions: [
            'Take a complete rest day this week',
            'Reduce task load by 30% for 3 days',
            'Focus only on essential tasks',
            'Schedule something enjoyable and relaxing',
            'Practice saying no to additional commitments'
          ],
          timeFrame: 'This Week',
          category: 'wellbeing'
        })
      }

    } catch (error) {
      console.error('Error determining optimal interventions:', error)
    }

    return insights
  }

  async analyzePatternBasedCoaching(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = []

    try {
      // Analyze correlation between journal mood and task completion
      const thirtyDaysAgo = subDays(new Date(), 30)
      
      const [journalEntries, dailyTasks] = await Promise.all([
        prisma.journalEntry.findMany({
          where: {
            userId: this.userId,
            date: { gte: thirtyDaysAgo },
            mood: { not: null }
          },
          orderBy: { date: 'asc' }
        }),
        prisma.dailyTask.findMany({
          where: {
            userId: this.userId,
            date: { gte: thirtyDaysAgo }
          },
          orderBy: { date: 'asc' }
        })
      ])

      if (journalEntries.length >= 10 && dailyTasks.length >= 10) {
        // Group tasks by date for easier correlation
        const tasksByDate = new Map<string, { total: number, completed: number }>()
        dailyTasks.forEach(task => {
          const dateKey = format(new Date(task.date), 'yyyy-MM-dd')
          if (!tasksByDate.has(dateKey)) {
            tasksByDate.set(dateKey, { total: 0, completed: 0 })
          }
          const dayTasks = tasksByDate.get(dateKey)!
          dayTasks.total++
          if (task.completed) dayTasks.completed++
        })

        // Analyze mood-completion correlation
        const moodCompletionData: { mood: string, avgCompletion: number, count: number }[] = []
        const moodGroups = new Map<string, { totalRate: number, count: number }>()

        journalEntries.forEach(entry => {
          const dateKey = format(new Date(entry.date), 'yyyy-MM-dd')
          const dayTasks = tasksByDate.get(dateKey)
          
          if (dayTasks && dayTasks.total > 0 && entry.mood) {
            const completionRate = dayTasks.completed / dayTasks.total
            
            if (!moodGroups.has(entry.mood)) {
              moodGroups.set(entry.mood, { totalRate: 0, count: 0 })
            }
            const moodData = moodGroups.get(entry.mood)!
            moodData.totalRate += completionRate
            moodData.count++
          }
        })

        // Find significant correlations
        let bestMood = ''
        let bestMoodRate = 0
        let worstMood = ''
        let worstMoodRate = 1

        moodGroups.forEach((data, mood) => {
          const avgRate = data.totalRate / data.count
          if (avgRate > bestMoodRate) {
            bestMoodRate = avgRate
            bestMood = mood
          }
          if (avgRate < worstMoodRate) {
            worstMoodRate = avgRate
            worstMood = mood
          }
        })

        if (bestMood && worstMood && (bestMoodRate - worstMoodRate) > 0.2) {
          insights.push({
            id: `pattern_mood_${new Date().getTime()}`,
            type: 'pattern_coaching',
            confidence: Math.min(85, 60 + journalEntries.length),
            priority: 'high',
            title: '🧠 Mood-Performance Connection',
            message: `Your journal mood correlates with task completion - let's explore this`,
            data: {
              bestMood,
              bestMoodCompletion: Math.round(bestMoodRate * 100),
              worstMood,
              worstMoodCompletion: Math.round(worstMoodRate * 100),
              correlation: Math.round((bestMoodRate - worstMoodRate) * 100)
            },
            actionable: true,
            suggestedActions: [
              `Notice what creates "${bestMood}" mood states`,
              `Plan important tasks when feeling "${bestMood}"`,
              `Develop strategies to shift from "${worstMood}" states`,
              'Keep journaling to deepen self-awareness',
              'Consider mood-boosting activities before tasks'
            ],
            timeFrame: 'Ongoing',
            category: 'self-awareness'
          })
        }

        // Analyze category-mood patterns
        const categoryMoodPatterns = await this.analyzeCategoryMoodPatterns(journalEntries, dailyTasks)
        if (categoryMoodPatterns) {
          insights.push(categoryMoodPatterns)
        }
      }

      // Analyze goal progress patterns
      const goals = await prisma.goal.findMany({
        where: { userId: this.userId },
        orderBy: { createdAt: 'desc' }
      })

      if (goals.length >= 3) {
        const progressPatterns = this.analyzeGoalProgressPatterns(goals)
        if (progressPatterns) {
          insights.push(progressPatterns)
        }
      }

      // Check for task completion time patterns
      const completionTimePattern = await this.analyzeCompletionTimePatterns()
      if (completionTimePattern) {
        insights.push(completionTimePattern)
      }

    } catch (error) {
      console.error('Error analyzing pattern-based coaching:', error)
    }

    return insights
  }

  // Helper methods
  private getNextTimeOccurrence(hour: number): Date {
    const now = new Date()
    const next = new Date()
    next.setHours(hour, 0, 0, 0)
    
    if (next <= now) {
      next.setDate(next.getDate() + 1)
    }
    
    return next
  }

  private getNextDayOccurrence(dayOfWeek: number): Date {
    const now = new Date()
    const currentDay = now.getDay()
    let daysUntil = dayOfWeek - currentDay
    
    if (daysUntil <= 0) {
      daysUntil += 7
    }
    
    const next = new Date(now)
    next.setDate(next.getDate() + daysUntil)
    next.setHours(0, 0, 0, 0)
    
    return next
  }

  private async analyzeHighPerformerPatterns(userIds: string[]): Promise<any> {
    try {
      const tasks = await prisma.dailyTask.findMany({
        where: {
          userId: { in: userIds },
          completed: true,
          completedAt: { not: null }
        },
        select: {
          completedAt: true,
          category: true
        },
        take: 1000
      })

      if (tasks.length === 0) return {}

      // Find most common completion hour
      const hourCounts = new Map<number, number>()
      tasks.forEach(task => {
        if (task.completedAt) {
          const hour = new Date(task.completedAt).getHours()
          hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
        }
      })

      let optimalTime = -1
      let maxCount = 0
      hourCounts.forEach((count, hour) => {
        if (count > maxCount) {
          maxCount = count
          optimalTime = hour
        }
      })

      return {
        optimalTime: optimalTime !== -1 ? optimalTime : null,
        taskCount: maxCount,
        sampleSize: tasks.length
      }
    } catch (error) {
      console.error('Error analyzing high performer patterns:', error)
      return {}
    }
  }

  private identifyCategoryGaps(userScores: any, highPerformers: any[]): any[] {
    const gaps: any[] = []
    const categories = ['financial', 'healthFitness', 'social', 'romantic', 'career']

    categories.forEach(category => {
      const userScore = userScores[category] || 0
      const cohortScores = highPerformers
        .map(hp => hp.scoreCategory?.[category] || 0)
        .filter(score => score > 0)

      if (cohortScores.length > 0) {
        const cohortAverage = cohortScores.reduce((a, b) => a + b, 0) / cohortScores.length
        const gap = cohortAverage - userScore

        if (gap > 5) {
          gaps.push({
            category,
            userScore,
            cohortAverage: Math.round(cohortAverage),
            gap: Math.round(gap)
          })
        }
      }
    })

    return gaps.sort((a, b) => b.gap - a.gap)
  }

  private async getUserAverageTaskTime(): Promise<number> {
    try {
      const tasks = await prisma.dailyTask.findMany({
        where: {
          userId: this.userId,
          completed: true,
          completedAt: { not: null }
        },
        select: { completedAt: true },
        take: 50
      })

      if (tasks.length === 0) return 10 // Default to 10 AM

      const hours = tasks
        .map(t => t.completedAt ? new Date(t.completedAt).getHours() : null)
        .filter(h => h !== null) as number[]

      return Math.round(hours.reduce((a, b) => a + b, 0) / hours.length)
    } catch (error) {
      return 10
    }
  }

  private async analyzeOptimalTaskFrequency(): Promise<any> {
    try {
      const thirtyDaysAgo = subDays(new Date(), 30)
      
      const dailyTaskCounts = await prisma.dailyTask.groupBy({
        by: ['date'],
        where: {
          userId: this.userId,
          date: { gte: thirtyDaysAgo }
        },
        _count: { id: true }
      })

      if (dailyTaskCounts.length < 7) return null

      const counts = dailyTaskCounts.map(d => d._count.id)
      const average = counts.reduce((a, b) => a + b, 0) / counts.length
      const optimal = Math.round(average * 1.2) // 20% increase for growth

      return {
        message: `Your optimal daily task load is ${optimal} tasks based on your capacity`,
        data: {
          currentAverage: Math.round(average),
          optimalCount: optimal,
          maxObserved: Math.max(...counts),
          minObserved: Math.min(...counts)
        },
        suggestions: [
          `Aim for ${optimal} tasks per day`,
          'Start with easier tasks to build momentum',
          'Batch similar tasks together',
          'Review and adjust weekly'
        ]
      }
    } catch (error) {
      return null
    }
  }

  private analyzeMoodPatterns(entries: any[]): any {
    // Simple mood pattern analysis
    const moodTimes = new Map<string, number[]>()
    
    entries.forEach(entry => {
      if (entry.mood && entry.createdAt) {
        const hour = new Date(entry.createdAt).getHours()
        if (!moodTimes.has(entry.mood)) {
          moodTimes.set(entry.mood, [])
        }
        moodTimes.get(entry.mood)!.push(hour)
      }
    })

    // Find when low energy moods occur most
    const lowEnergyMoods = ['tired', 'stressed', 'anxious', 'sad', 'frustrated']
    let lowEnergyHours: number[] = []
    
    moodTimes.forEach((hours, mood) => {
      if (lowEnergyMoods.some(lem => mood.toLowerCase().includes(lem))) {
        lowEnergyHours.push(...hours)
      }
    })

    if (lowEnergyHours.length === 0) return {}

    const avgLowEnergyHour = Math.round(
      lowEnergyHours.reduce((a, b) => a + b, 0) / lowEnergyHours.length
    )

    return {
      lowEnergyTime: `${avgLowEnergyHour}:00`,
      pattern: 'recurring',
      suggestion: 'Plan energizing activities before this time'
    }
  }

  private async checkForBurnoutRisk(): Promise<any> {
    try {
      const sevenDaysAgo = subDays(new Date(), 7)
      
      const recentTasks = await prisma.dailyTask.count({
        where: {
          userId: this.userId,
          date: { gte: sevenDaysAgo }
        }
      })

      const avgTasksPerDay = recentTasks / 7
      const burnoutRisk = avgTasksPerDay > 10 // Threshold for burnout risk

      return {
        burnoutRisk,
        data: {
          recentTaskCount: recentTasks,
          avgPerDay: Math.round(avgTasksPerDay * 10) / 10,
          threshold: 10,
          recommendation: burnoutRisk ? 'Reduce load by 30%' : 'Sustainable pace'
        }
      }
    } catch (error) {
      return { burnoutRisk: false }
    }
  }

  private async analyzeCategoryMoodPatterns(journals: any[], tasks: any[]): Promise<PredictiveInsight | null> {
    // Complex analysis for category-specific mood patterns
    // Implementation would analyze which categories perform better with which moods
    return null
  }

  private analyzeGoalProgressPatterns(goals: any[]): PredictiveInsight | null {
    const activeGoals = goals.filter(g => g.status === 'active')
    const completedGoals = goals.filter(g => g.status === 'completed')
    
    if (completedGoals.length > 0 && activeGoals.length > 0) {
      const avgCompletionTime = completedGoals.reduce((acc, goal) => {
        const days = differenceInDays(new Date(goal.updatedAt), new Date(goal.createdAt))
        return acc + days
      }, 0) / completedGoals.length

      return {
        id: `pattern_goals_${new Date().getTime()}`,
        type: 'pattern_coaching',
        confidence: 70,
        priority: 'low',
        title: '🎯 Goal Achievement Pattern',
        message: `You typically complete goals in ${Math.round(avgCompletionTime)} days`,
        data: {
          averageCompletionDays: Math.round(avgCompletionTime),
          activeGoals: activeGoals.length,
          completedGoals: completedGoals.length
        },
        actionable: true,
        suggestedActions: [
          'Break long-term goals into smaller milestones',
          'Celebrate progress at the halfway point',
          'Review goals weekly to maintain momentum'
        ],
        timeFrame: 'Ongoing',
        category: 'goals'
      }
    }
    
    return null
  }

  private async analyzeCompletionTimePatterns(): Promise<PredictiveInsight | null> {
    try {
      const tasks = await prisma.dailyTask.findMany({
        where: {
          userId: this.userId,
          completed: true,
          completedAt: { not: null }
        },
        select: {
          completedAt: true,
          category: true,
          createdAt: true
        },
        take: 100,
        orderBy: { completedAt: 'desc' }
      })

      if (tasks.length < 20) return null

      // Calculate average time to complete after creation
      const completionTimes = tasks.map(task => {
        const created = new Date(task.createdAt)
        const completed = new Date(task.completedAt!)
        return (completed.getTime() - created.getTime()) / (1000 * 60 * 60) // Hours
      })

      const avgHours = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length

      if (avgHours > 24) {
        return {
          id: `pattern_procrastination_${new Date().getTime()}`,
          type: 'pattern_coaching',
          confidence: 75,
          priority: 'medium',
          title: '⏰ Task Timing Pattern',
          message: `Tasks take an average of ${Math.round(avgHours)} hours from creation to completion`,
          data: {
            averageHours: Math.round(avgHours),
            suggestion: avgHours > 48 ? 'Consider tackling tasks sooner' : 'Good completion timing'
          },
          actionable: true,
          suggestedActions: [
            'Try the 2-minute rule for quick tasks',
            'Schedule tasks immediately after creating them',
            'Set completion deadlines when creating tasks',
            'Use time-blocking to ensure prompt completion'
          ],
          timeFrame: 'Ongoing',
          category: 'productivity'
        }
      }
    } catch (error) {
      console.error('Error analyzing completion time patterns:', error)
    }
    
    return null
  }
}