import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

export interface UserAssessmentData {
  overall: {
    score: number
    percentile: number
  }
  categories: {
    financial: number
    health: number
    social: number
    romantic: number
  }
  cohort: {
    age_band: string
    sex: string
    region: string
  }
  completionTime?: number
}

// REMOVED: Basic personalized coaching function - use enhancedCoachingEngine instead

// REMOVED: Basic GPT-3.5-turbo coach response function - use enhancedCoachingEngine instead

// Mock coaching data generation has been removed - AI Coach unavailable without API key

// REMOVED: Basic daily task generation - use enhancedCoachingEngine.generateAITasks instead

// REMOVED: Basic weekly task generation - use enhancedCoachingEngine.generateAITasks instead

// Mock task generation functions have been removed - AI Coach unavailable without API key

export { openai }