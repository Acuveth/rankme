import { z } from 'zod'

// Base schemas for common data types
export const objectIdSchema = z.string().min(1, 'ID is required')
export const emailSchema = z.string().email('Invalid email format')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

// Assessment schemas
export const cohortDataSchema = z.object({
  age: z.number().int().min(18, 'Must be at least 18 years old').max(100, 'Age cannot exceed 100'),
  country: z.string().min(2, 'Country code must be at least 2 characters').max(10, 'Country code too long'),
  sexGender: z.enum(['Male', 'Female', 'Other', 'PNTS'], {
    errorMap: () => ({ message: 'Invalid gender selection' })
  })
})

export const assessmentCreateSchema = cohortDataSchema

export const assessmentAnswerSchema = z.object({
  assessmentId: objectIdSchema,
  answers: z.array(z.object({
    questionId: z.string().min(1, 'Question ID is required'),
    value: z.union([z.string(), z.number(), z.boolean()], {
      errorMap: () => ({ message: 'Invalid answer value' })
    })
  })).min(1, 'At least one answer is required')
})

export const assessmentScoreSchema = z.object({
  assessmentId: objectIdSchema
})

export const assessmentConnectSchema = z.object({
  assessmentId: objectIdSchema
})

// User schemas
export const userSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  country: z.string().min(2).max(10).optional(),
  sexGender: z.enum(['Male', 'Female', 'Other', 'PNTS']).optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: passwordSchema.optional()
}).refine((data) => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  return true
}, {
  message: 'Current password is required when setting new password',
  path: ['currentPassword']
})

export const userLanguageSchema = z.object({
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'pt'], {
    errorMap: () => ({ message: 'Invalid language code' })
  })
})

// Authentication schemas
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name too long')
})

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

// Task schemas
export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.enum(['financial', 'health_fitness', 'social', 'romantic', 'career', 'personal_growth'], {
    errorMap: () => ({ message: 'Invalid category' })
  }),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  estimatedMinutes: z.number().int().min(1).max(480).optional(), // Max 8 hours
  date: z.string().datetime().optional(),
  week: z.number().int().min(1).max(53).optional()
})

export const taskUpdateSchema = z.object({
  assessmentId: objectIdSchema.optional(),
  completed: z.boolean().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  estimatedMinutes: z.number().int().min(1).max(480).optional()
})

export const dailyTaskParamsSchema = z.object({
  assessmentId: objectIdSchema
})

export const weeklyTaskParamsSchema = z.object({
  assessmentId: objectIdSchema,
  week: z.number().int().min(1).max(53).optional()
})

// Coach schemas
export const coachPreferencesSchema = z.object({
  primaryFocus: z.enum(['financial', 'health_fitness', 'social', 'romantic', 'career', 'personal_growth']),
  secondaryFocus: z.enum(['financial', 'health_fitness', 'social', 'romantic', 'career', 'personal_growth']).optional(),
  coachingStyle: z.enum(['supportive', 'challenging', 'analytical', 'motivational']),
  goalFrequency: z.enum(['daily', 'weekly', 'monthly']),
  dailyReminders: z.boolean(),
  checkInFrequency: z.enum(['daily', 'weekly', 'biweekly']),
  checkInTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  dailyTaskCount: z.number().int().min(1).max(10),
  weeklyTaskCount: z.number().int().min(1).max(5),
  taskDifficulty: z.enum(['easy', 'moderate', 'challenging']),
  motivationLevel: z.enum(['gentle', 'balanced', 'intense']),
  feedbackFrequency: z.enum(['minimal', 'regular', 'frequent']),
  progressTracking: z.boolean(),
  celebrateMilestones: z.boolean(),
  specificGoals: z.string().max(1000).optional()
})

export const coachChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  context: z.string().optional(),
  action: z.enum(['chat', 'generate_tasks', 'update_preferences', 'create_goal']).optional()
})

// Goals schemas
export const goalCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  category: z.enum(['financial', 'health_fitness', 'social', 'romantic', 'career', 'personal_growth']),
  target: z.string().min(1, 'Target is required').max(500, 'Target too long'),
  deadline: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
})

export const goalUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  target: z.string().min(1).max(500).optional(),
  deadline: z.string().datetime().optional(),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  progress: z.number().min(0).max(100).optional()
})

// Check-in schemas
export const checkInCreateSchema = z.object({
  type: z.enum(['daily', 'weekly', 'custom']),
  scheduledFor: z.string().datetime(),
  assessmentId: objectIdSchema
})

export const checkInUpdateSchema = z.object({
  mood: z.enum(['very_low', 'low', 'neutral', 'high', 'very_high']).optional(),
  energy: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(1000).optional(),
  responses: z.string().optional() // JSON string of responses
})

// Payment schemas
export const checkoutSchema = z.object({
  product: z.enum(['deep_report', 'deep_report_oneoff', 'ai_coach_monthly'], {
    errorMap: () => ({ message: 'Invalid product type' })
  }),
  assessmentId: objectIdSchema,
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional()
})

// Analytics schemas
export const analyticsEventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Event name too long'),
  props: z.record(z.any()).optional(),
  userId: objectIdSchema.optional(),
  anonId: z.string().optional()
})

// Support schemas
export const supportRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  category: z.enum(['technical', 'billing', 'feedback', 'other']).default('other')
})

// Share schemas
export const shareGenerateSchema = z.object({
  assessmentId: objectIdSchema,
  expiresInDays: z.number().int().min(1).max(365).default(30)
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
})

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'application/pdf'])
})

// Environment validation schema
export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('Invalid NextAuth URL'),
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional()
})

// Helper function to validate environment variables
export function validateEnv() {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NODE_ENV: process.env.NODE_ENV,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS
    })
  } catch (error) {
    console.error('Environment validation failed:', error)
    throw new Error('Invalid environment configuration')
  }
}

// Export type inference helpers
export type CohortData = z.infer<typeof cohortDataSchema>
export type AssessmentAnswer = z.infer<typeof assessmentAnswerSchema>
export type UserSettings = z.infer<typeof userSettingsSchema>
export type TaskCreate = z.infer<typeof taskCreateSchema>
export type CoachPreferences = z.infer<typeof coachPreferencesSchema>
export type GoalCreate = z.infer<typeof goalCreateSchema>
export type CheckoutRequest = z.infer<typeof checkoutSchema>