import { prisma } from '@/lib/prisma'
import { calculateScores, calculateDualScoring, getAbsolutePotentialInsights } from '@/lib/scoring'
import questionsData from '@/data/questions.json'

interface ProgressReport {
  category: 'financial' | 'health_fitness' | 'social' | 'romantic' | 'career' | 'personal_growth'
  achievementType: 'goal_completed' | 'milestone_reached' | 'habit_formed' | 'measurement_improved'
  description: string
  previousValue?: string | number
  currentValue?: string | number
  relatedQuestionId?: string
}

interface ScoreUpdateResult {
  updated: boolean
  oldScores: {
    overall: number
    categories: Record<string, number>
    percentiles: Record<string, number>
  }
  newScores: {
    overall: number
    categories: Record<string, number> 
    percentiles: Record<string, number>
  }
  triggeredBy: string
  improvementAreas: string[]
}

export class ScoreUpdater {
  
  /**
   * Updates user scores based on progress reports from AI coach interactions
   */
  static async updateScoresBasedOnProgress(
    assessmentId: string,
    progressReports: ProgressReport[]
  ): Promise<ScoreUpdateResult | null> {
    try {
      // Get the assessment with current scores and answers
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
        include: {
          scoreCategory: true,
          scoreOverall: true,
          answers: true,
          categorizedAnswers: true
        }
      })

      if (!assessment || !assessment.scoreOverall || !assessment.scoreCategory) {
        throw new Error('Assessment not found or missing scores')
      }

      // Store original scores
      const originalScores = {
        overall: assessment.scoreOverall.overall,
        categories: {
          financial: assessment.scoreCategory.financial,
          health_fitness: assessment.scoreCategory.healthFitness,
          social: assessment.scoreCategory.social,
          romantic: assessment.scoreCategory.romantic,
          career: assessment.scoreCategory.career,
          personal_growth: assessment.scoreCategory.personalGrowth
        },
        percentiles: {
          overall: assessment.scoreOverall.percentileOverall,
          financial: assessment.scoreOverall.percentileFinancial,
          health: assessment.scoreOverall.percentileHealth,
          social: assessment.scoreOverall.percentileSocial,
          romantic: assessment.scoreOverall.percentileRomantic,
          career: assessment.scoreOverall.percentileCareer,
          personal_growth: assessment.scoreOverall.percentilePersonalGrowth
        }
      }

      // Analyze progress and determine if score thresholds have been crossed
      const updatedAnswers = await this.analyzeProgressAndUpdateAnswers(
        assessment.answers,
        progressReports
      )

      // If no answers were updated, no score changes needed
      if (updatedAnswers.length === 0) {
        return null
      }

      // Recalculate scores with updated answers
      const newScores = calculateScores(updatedAnswers)
      const cohortKey = `${assessment.cohortAge}_${assessment.cohortSex}_${assessment.cohortRegion}`
      const { cohortPercentiles } = calculateDualScoring(newScores, cohortKey)

      // Check if there's significant improvement (at least 2 points in any category or 1 point overall)
      const hasSignificantImprovement = this.checkSignificantImprovement(
        originalScores,
        {
          overall: newScores.overall,
          categories: newScores.categories,
          percentiles: cohortPercentiles
        }
      )

      if (!hasSignificantImprovement) {
        return null
      }

      // Update the database with new scores
      await Promise.all([
        prisma.scoreCategory.update({
          where: { assessmentId },
          data: {
            financial: newScores.categories.financial,
            healthFitness: newScores.categories.health_fitness,
            social: newScores.categories.social,
            romantic: newScores.categories.romantic,
            career: newScores.categories.career,
            personalGrowth: newScores.categories.personal_growth
          }
        }),
        prisma.scoreOverall.update({
          where: { assessmentId },
          data: {
            overall: newScores.overall,
            percentileOverall: cohortPercentiles.overall,
            percentileFinancial: cohortPercentiles.financial,
            percentileHealth: cohortPercentiles.health,
            percentileSocial: cohortPercentiles.social,
            percentileRomantic: cohortPercentiles.romantic,
            percentileCareer: cohortPercentiles.career,
            percentilePersonalGrowth: cohortPercentiles.personal_growth
          }
        })
      ])

      // Log the score update
      await this.logScoreUpdate(assessmentId, originalScores, {
        overall: newScores.overall,
        categories: newScores.categories,
        percentiles: cohortPercentiles
      }, progressReports)

      return {
        updated: true,
        oldScores: originalScores,
        newScores: {
          overall: newScores.overall,
          categories: newScores.categories,
          percentiles: cohortPercentiles
        },
        triggeredBy: progressReports.map(p => p.description).join('; '),
        improvementAreas: this.getImprovementAreas(originalScores, {
          overall: newScores.overall,
          categories: newScores.categories,
          percentiles: cohortPercentiles
        })
      }

    } catch (error) {
      console.error('Error updating scores based on progress:', error)
      throw error
    }
  }

  /**
   * Analyzes progress reports and updates virtual assessment answers based on achievements
   */
  private static async analyzeProgressAndUpdateAnswers(
    originalAnswers: any[],
    progressReports: ProgressReport[]
  ): Promise<any[]> {
    const updatedAnswers = [...originalAnswers.map(a => ({
      questionId: a.questionId,
      value: a.valueRaw
    }))]

    // Define threshold mappings for common progress types
    const thresholdMappings = {
      // Financial thresholds
      financial: {
        'income_increase': { questionId: 'fin_income_avg', thresholds: [30000, 50000, 75000, 100000, 150000] },
        'savings_rate_improved': { questionId: 'fin_savings_rate', thresholds: [10, 15, 20, 25, 30] },
        'debt_reduced': { questionId: 'fin_debt_total', thresholds: [50000, 25000, 10000, 5000, 0] },
        'emergency_fund': { questionId: 'fin_emergency_fund', thresholds: [1, 3, 6, 9, 12] }
      },
      // Health thresholds
      health_fitness: {
        'weight_lost': { questionId: 'health_weight', thresholds: [250, 220, 200, 180, 160] },
        'exercise_frequency': { questionId: 'health_exercise_days', thresholds: [1, 2, 3, 4, 5] },
        'pushup_improvement': { questionId: 'health_pushups', thresholds: [5, 15, 25, 40, 60] },
        'cardio_improvement': { questionId: 'health_cardio_fitness', thresholds: [1, 2, 3, 4, 5] }
      },
      // Social thresholds
      social: {
        'friend_network': { questionId: 'social_close_friends', thresholds: [1, 3, 5, 8, 12] },
        'social_meetups': { questionId: 'social_meetups_month', thresholds: [1, 2, 4, 6, 8] },
        'networking': { questionId: 'social_networking', thresholds: [1, 2, 3, 4, 5] }
      },
      // Romantic thresholds
      romantic: {
        'relationship_satisfaction': { questionId: 'rom_satisfaction', thresholds: [1, 2, 3, 4, 5] },
        'dating_confidence': { questionId: 'rom_confidence', thresholds: [1, 2, 3, 4, 5] },
        'intimacy_frequency': { questionId: 'rom_intimacy', thresholds: [1, 2, 3, 4, 5] }
      }
    }

    for (const report of progressReports) {
      const categoryThresholds = thresholdMappings[report.category]
      if (!categoryThresholds) continue

      // Try to match the progress report to a threshold type
      for (const [progressType, threshold] of Object.entries(categoryThresholds)) {
        if (report.description.toLowerCase().includes(progressType.replace('_', ' ')) ||
            (report.relatedQuestionId && report.relatedQuestionId === threshold.questionId)) {
          
          // Find the corresponding answer to update
          const answerIndex = updatedAnswers.findIndex(a => a.questionId === threshold.questionId)
          if (answerIndex === -1) continue

          // Determine new threshold level based on current value
          const newThresholdIndex = this.calculateNewThresholdLevel(
            report.currentValue,
            threshold.thresholds,
            report.achievementType
          )

          if (newThresholdIndex !== null) {
            updatedAnswers[answerIndex].value = newThresholdIndex.toString()
          }
        }
      }
    }

    return updatedAnswers
  }

  /**
   * Calculates new threshold level based on reported progress
   */
  private static calculateNewThresholdLevel(
    currentValue: string | number | undefined,
    thresholds: number[],
    achievementType: string
  ): number | null {
    if (currentValue === undefined) return null

    const numValue = typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue
    if (isNaN(numValue)) return null

    // Find which threshold the current value crosses
    let thresholdIndex = 0
    for (let i = 0; i < thresholds.length; i++) {
      if (achievementType.includes('reduced') || achievementType.includes('debt')) {
        // For values that should decrease (like debt)
        if (numValue <= thresholds[i]) {
          thresholdIndex = Math.min(i + 1, thresholds.length - 1)
        }
      } else {
        // For values that should increase
        if (numValue >= thresholds[i]) {
          thresholdIndex = Math.min(i + 1, thresholds.length - 1)
        }
      }
    }

    return thresholdIndex
  }

  /**
   * Checks if the improvement is significant enough to warrant a score update
   */
  private static checkSignificantImprovement(
    oldScores: any,
    newScores: any
  ): boolean {
    // Check overall improvement (at least 1 point)
    if (Math.abs(newScores.overall - oldScores.overall) >= 1) {
      return true
    }

    // Check category improvements (at least 2 points)
    for (const [category, newScore] of Object.entries(newScores.categories)) {
      const oldScore = oldScores.categories[category]
      if (Math.abs((newScore as number) - oldScore) >= 2) {
        return true
      }
    }

    // Check percentile improvements (at least 3 percentile points)
    for (const [category, newPercentile] of Object.entries(newScores.percentiles)) {
      const oldPercentile = oldScores.percentiles[category]
      if (Math.abs((newPercentile as number) - oldPercentile) >= 3) {
        return true
      }
    }

    return false
  }

  /**
   * Gets areas that showed improvement
   */
  private static getImprovementAreas(oldScores: any, newScores: any): string[] {
    const improvements: string[] = []

    // Check each category for improvements
    const categoryNames = {
      financial: 'Financial',
      health_fitness: 'Health & Fitness',
      social: 'Social',
      romantic: 'Romantic',
      career: 'Career',
      personal_growth: 'Personal Growth'
    }

    for (const [category, newScore] of Object.entries(newScores.categories)) {
      const oldScore = oldScores.categories[category]
      if ((newScore as number) > oldScore + 1) {
        improvements.push(categoryNames[category as keyof typeof categoryNames])
      }
    }

    if (newScores.overall > oldScores.overall + 0.5) {
      improvements.push('Overall Score')
    }

    return improvements
  }

  /**
   * Logs the score update for tracking and debugging
   */
  private static async logScoreUpdate(
    assessmentId: string,
    oldScores: any,
    newScores: any,
    progressReports: ProgressReport[]
  ): Promise<void> {
    try {
      await prisma.scoreUpdateLog.create({
        data: {
          assessmentId,
          oldOverallScore: oldScores.overall,
          newOverallScore: newScores.overall,
          oldCategoryScores: JSON.stringify(oldScores.categories),
          newCategoryScores: JSON.stringify(newScores.categories),
          oldPercentiles: JSON.stringify(oldScores.percentiles),
          newPercentiles: JSON.stringify(newScores.percentiles),
          triggerReason: JSON.stringify(progressReports),
          createdAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to log score update:', error)
    }
  }

  /**
   * Processes AI coach message and extracts progress reports
   */
  static extractProgressFromCoachMessage(
    message: string,
    category: string
  ): ProgressReport[] {
    const progressReports: ProgressReport[] = []
    
    // Define patterns to identify different types of progress
    const patterns = {
      goal_completed: [
        /completed.*goal/i,
        /achieved.*target/i,
        /finished.*objective/i
      ],
      milestone_reached: [
        /reached.*milestone/i,
        /hit.*mark/i,
        /crossed.*threshold/i
      ],
      habit_formed: [
        /formed.*habit/i,
        /consistent.*days/i,
        /maintained.*routine/i
      ],
      measurement_improved: [
        /improved.*from.*to/i,
        /increased.*by/i,
        /reduced.*from/i,
        /lost.*pounds/i,
        /gained.*muscle/i,
        /saved.*dollars/i
      ]
    }

    // Check each pattern type
    for (const [achievementType, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        if (pattern.test(message)) {
          progressReports.push({
            category: category as any,
            achievementType: achievementType as any,
            description: message,
            currentValue: this.extractNumericValue(message),
          })
          break
        }
      }
    }

    return progressReports
  }

  /**
   * Extracts numeric values from progress descriptions
   */
  private static extractNumericValue(text: string): number | undefined {
    const numberMatches = text.match(/\d+(?:\.\d+)?/g)
    if (numberMatches && numberMatches.length > 0) {
      return parseFloat(numberMatches[numberMatches.length - 1])
    }
    return undefined
  }
}