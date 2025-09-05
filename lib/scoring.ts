import scoringConfig from '@/data/scoring.json'
import demographicsStats from '@/data/demographics_stats.json'

interface Answer {
  questionId: string
  value: any
}

interface CategoryScores {
  financial: number
  health_fitness: number
  social: number
  romantic: number
  career: number
  personal_growth: number
}

export function calculateScores(answers: Answer[]): {
  categories: CategoryScores
  overall: number
} {
  const categoryScores: CategoryScores = {
    financial: 0,
    health_fitness: 0,
    social: 0,
    romantic: 0,
    career: 0,
    personal_growth: 0
  }

  const categoryItems: Record<keyof CategoryScores, number> = {
    financial: 0,
    health_fitness: 0,
    social: 0,
    romantic: 0,
    career: 0,
    personal_growth: 0
  }

  for (const answer of answers) {
    const score = scoreItem(answer.questionId, answer.value)
    const category = getQuestionCategory(answer.questionId)
    
    if (category && score !== null) {
      categoryScores[category as keyof CategoryScores] += score
      categoryItems[category as keyof CategoryScores]++
    }
  }

  for (const category in categoryScores) {
    const key = category as keyof CategoryScores
    if (categoryItems[key] > 0) {
      categoryScores[key] = categoryScores[key] / categoryItems[key]
    } else {
      categoryScores[key] = 50
    }
  }

  const overall = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 6

  return { categories: categoryScores, overall }
}

function scoreItem(questionId: string, value: any): number | null {
  const category = getQuestionCategory(questionId)
  if (!category) return null

  const scoringRule = (scoringConfig.scoring as any)[category]?.[questionId]
  if (!scoringRule) return null

  switch (scoringRule.type) {
    case 'linear_map':
      return mapLinear(value, scoringRule.values)
    
    case 'log_transform':
      return mapLogTransform(value, scoringRule.bounds, scoringRule.reverse)
    
    case 'percentage':
      return mapPercentage(value, scoringRule.bounds)
    
    case 'ratio':
      return 50
    
    case 'optimal_range':
      return mapOptimalRange(value, scoringRule.values)
    
    default:
      return 50
  }
}

function mapLinear(value: string | number, values: number[]): number {
  const options = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let index = 0
  
  if (typeof value === 'string') {
    index = parseInt(value) || 0
  } else {
    index = value
  }
  
  return values[Math.min(index, values.length - 1)] || 0
}

function mapLogTransform(value: number, bounds: {min: number, max: number}, reverse: boolean): number {
  const clampedValue = Math.max(bounds.min, Math.min(value, bounds.max))
  const logMin = Math.log(Math.max(1, bounds.min + 1))
  const logMax = Math.log(bounds.max + 1)
  const logValue = Math.log(clampedValue + 1)
  
  let score = ((logValue - logMin) / (logMax - logMin)) * 100
  
  if (reverse) {
    score = 100 - score
  }
  
  return Math.max(0, Math.min(100, score))
}

function mapPercentage(value: number, bounds: {min: number, max: number}): number {
  const clampedValue = Math.max(bounds.min, Math.min(value, bounds.max))
  return (clampedValue / bounds.max) * 100
}

function mapOptimalRange(value: string, values: number[]): number {
  const index = parseInt(value) || 0
  return values[Math.min(index, values.length - 1)] || 50
}

function getQuestionCategory(questionId: string): string | null {
  const prefix = questionId.split('_')[0]
  const categoryMap: Record<string, string> = {
    'fin': 'financial',
    'health': 'health_fitness',
    'social': 'social',
    'rom': 'romantic',
    'career': 'career',
    'personal': 'personal_growth'
  }
  return categoryMap[prefix] || null
}

export function calculatePercentiles(
  scores: { categories: CategoryScores; overall: number },
  cohortKey?: string
): {
  overall: number
  financial: number
  health: number
  social: number
  romantic: number
  career: number
  personal_growth: number
} {
  // Get cohort stats from demographics data
  const stats = getCohortStats(cohortKey)

  return {
    overall: scoreToPercentile(scores.overall, stats.overall.mean, stats.overall.stddev),
    financial: scoreToPercentile(scores.categories.financial, stats.financial.mean, stats.financial.stddev),
    health: scoreToPercentile(scores.categories.health_fitness, stats.health_fitness.mean, stats.health_fitness.stddev),
    social: scoreToPercentile(scores.categories.social, stats.social.mean, stats.social.stddev),
    romantic: scoreToPercentile(scores.categories.romantic, stats.romantic.mean, stats.romantic.stddev),
    career: scoreToPercentile(scores.categories.career, stats.career.mean, stats.career.stddev),
    personal_growth: scoreToPercentile(scores.categories.personal_growth, stats.personal_growth.mean, stats.personal_growth.stddev)
  }
}

export function calculateDualScoring(
  scores: { categories: CategoryScores; overall: number },
  cohortKey?: string
): {
  cohortPercentiles: {
    overall: number
    financial: number
    health: number
    social: number
    romantic: number
    career: number
    personal_growth: number
  },
  absolutePotential: {
    overall: number
    financial: number
    health: number
    social: number
    romantic: number
    career: number
    personal_growth: number
  }
} {
  // Calculate cohort percentiles
  const cohortPercentiles = calculatePercentiles(scores, cohortKey)
  
  // Calculate absolute potential (percentage of theoretical maximum)
  const absolutePotential = {
    overall: Math.round((scores.overall / 100) * 100),
    financial: Math.round((scores.categories.financial / 100) * 100),
    health: Math.round((scores.categories.health_fitness / 100) * 100),
    social: Math.round((scores.categories.social / 100) * 100),
    romantic: Math.round((scores.categories.romantic / 100) * 100),
    career: Math.round((scores.categories.career / 100) * 100),
    personal_growth: Math.round((scores.categories.personal_growth / 100) * 100)
  }
  
  return {
    cohortPercentiles,
    absolutePotential
  }
}

function getCohortStats(cohortKey?: string): any {
  if (!cohortKey) {
    return demographicsStats.cohort_stats.default
  }

  // Try to find the exact cohort key
  const cohortStats = demographicsStats.cohort_stats[cohortKey as keyof typeof demographicsStats.cohort_stats]
  if (cohortStats) {
    return cohortStats
  }

  // Fallback to default if cohort not found
  console.warn(`Cohort stats not found for key: ${cohortKey}, using default`)
  return demographicsStats.cohort_stats.default
}

export function categorizeAnswers(answers: Answer[]): {
  financial: Answer[]
  health_fitness: Answer[]
  social: Answer[]
  romantic: Answer[]
  career: Answer[]
  personal_growth: Answer[]
} {
  const categorized = {
    financial: [] as Answer[],
    health_fitness: [] as Answer[],
    social: [] as Answer[],
    romantic: [] as Answer[],
    career: [] as Answer[],
    personal_growth: [] as Answer[]
  }

  for (const answer of answers) {
    const category = getQuestionCategory(answer.questionId)
    if (category && categorized[category as keyof typeof categorized]) {
      categorized[category as keyof typeof categorized].push(answer)
    }
  }

  return categorized
}

export function getAbsolutePotentialInsights(
  scores: { categories: CategoryScores; overall: number }
): {
  overall: { score: number; potential: number; gapToExcellence: number }
  financial: { score: number; potential: number; gapToExcellence: number }
  health: { score: number; potential: number; gapToExcellence: number }
  social: { score: number; potential: number; gapToExcellence: number }
  romantic: { score: number; potential: number; gapToExcellence: number }
  career: { score: number; potential: number; gapToExcellence: number }
  personal_growth: { score: number; potential: number; gapToExcellence: number }
} {
  // Best real-world p99 scores across all demographics
  const excellence = {
    overall: 87.5,
    financial: 93.4,
    health_fitness: 88.6,
    social: 85.4,
    romantic: 91.4,
    career: 92.0,
    personal_growth: 86.1
  }

  return {
    overall: {
      score: scores.overall,
      potential: scores.overall,
      gapToExcellence: Math.max(0, excellence.overall - scores.overall)
    },
    financial: {
      score: scores.categories.financial,
      potential: scores.categories.financial,
      gapToExcellence: Math.max(0, excellence.financial - scores.categories.financial)
    },
    health: {
      score: scores.categories.health_fitness,
      potential: scores.categories.health_fitness,
      gapToExcellence: Math.max(0, excellence.health_fitness - scores.categories.health_fitness)
    },
    social: {
      score: scores.categories.social,
      potential: scores.categories.social,
      gapToExcellence: Math.max(0, excellence.social - scores.categories.social)
    },
    romantic: {
      score: scores.categories.romantic,
      potential: scores.categories.romantic,
      gapToExcellence: Math.max(0, excellence.romantic - scores.categories.romantic)
    },
    career: {
      score: scores.categories.career,
      potential: scores.categories.career,
      gapToExcellence: Math.max(0, excellence.career - scores.categories.career)
    },
    personal_growth: {
      score: scores.categories.personal_growth,
      potential: scores.categories.personal_growth,
      gapToExcellence: Math.max(0, excellence.personal_growth - scores.categories.personal_growth)
    }
  }
}

function scoreToPercentile(score: number, mean: number, stddev: number): number {
  const zScore = (score - mean) / stddev
  const percentile = normalCDF(zScore) * 100
  return Math.max(0.1, Math.min(99.9, percentile))
}

function normalCDF(x: number): number {
  const a1 =  0.254829592
  const a2 = -0.284496736
  const a3 =  1.421413741
  const a4 = -1.453152027
  const a5 =  1.061405429
  const p  =  0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x) / Math.sqrt(2.0)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return 0.5 * (1.0 + sign * y)
}