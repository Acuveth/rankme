import scoringConfig from '@/data/scoring.json'

interface Answer {
  questionId: string
  value: any
}

interface CategoryScores {
  financial: number
  health_fitness: number
  social: number
  romantic: number
}

export function calculateScores(answers: Answer[]): {
  categories: CategoryScores
  overall: number
} {
  const categoryScores: CategoryScores = {
    financial: 0,
    health_fitness: 0,
    social: 0,
    romantic: 0
  }

  const categoryItems: Record<keyof CategoryScores, number> = {
    financial: 0,
    health_fitness: 0,
    social: 0,
    romantic: 0
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

  const overall = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 4

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
    'rom': 'romantic'
  }
  return categoryMap[prefix] || null
}

export function calculatePercentiles(
  scores: { categories: CategoryScores; overall: number },
  cohortStats: any
): {
  overall: number
  financial: number
  health: number
  social: number
  romantic: number
} {
  const stats = cohortStats || scoringConfig.cohort_stats.default

  return {
    overall: scoreToPercentile(scores.overall, stats.overall.mean, stats.overall.stddev),
    financial: scoreToPercentile(scores.categories.financial, stats.financial.mean, stats.financial.stddev),
    health: scoreToPercentile(scores.categories.health_fitness, stats.health_fitness.mean, stats.health_fitness.stddev),
    social: scoreToPercentile(scores.categories.social, stats.social.mean, stats.social.stddev),
    romantic: scoreToPercentile(scores.categories.romantic, stats.romantic.mean, stats.romantic.stddev)
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