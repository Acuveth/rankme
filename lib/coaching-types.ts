export interface CoachContext {
  recentJournalEntries: JournalEntry[]
  completedTasks: (DailyTask | WeeklyTask)[]
  goalProgress: GoalProgress[]
  conversationHistory: ChatMessage[]
  userSettings: CoachSettings
  weeklyProgress: ProgressMetrics
  recentCheckIns: CheckIn[]
  achievements: Achievement[]
}

export interface JournalEntry {
  id: string
  entry: string
  question?: string
  mood?: string
  date: Date
}

export interface DailyTask {
  id: string
  title: string
  description?: string
  category: string
  completed: boolean
  completedAt?: Date
  date: Date
  priority?: string
  estimatedMinutes?: number
}

export interface WeeklyTask {
  id: string
  title: string
  description?: string
  category: string
  completed: boolean
  completedAt?: Date
  week: number
  priority?: string
  estimatedMinutes?: number
}

export interface GoalProgress {
  id: string
  title: string
  category: string
  target: string
  progress: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  deadline?: Date
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  coaching_style?: string
}

export interface CoachSettings {
  primaryFocus: string
  coachingStyle: string
  goalFrequency: string
  dailyReminders: boolean
  checkInFrequency: string
  checkInTime: string
}

export interface ProgressMetrics {
  currentStreak: number
  completionRate: number
  weeklyCompletionRate: number
  totalTasksCompleted: number
  totalTasksAssigned: number
  lastActiveDate?: Date
}

export interface CheckIn {
  id: string
  type: string
  status: string
  mood?: string
  energy?: number
  notes?: string
  scheduledFor: Date
  completedAt?: Date
}

export interface Achievement {
  id: string
  type: string
  title: string
  description: string
  icon: string
  category?: string
  level: string
  earnedAt: Date
}

export interface CoachingStyles {
  supportive: {
    description: "Encouraging, gentle guidance with empathetic tone"
    prompts: {
      greeting: "I'm here to support you on your journey. How are you feeling today?"
      encouragement: "You're making great progress! Every small step counts."
      challenge: "I believe in your ability to overcome this challenge."
    }
  }
  direct: {
    description: "Straightforward, action-oriented with clear instructions"
    prompts: {
      greeting: "Let's get straight to it. What do you want to accomplish today?"
      encouragement: "Good work. Now let's tackle the next task."
      challenge: "This is where you need to push harder. What's your plan?"
    }
  }
  motivational: {
    description: "High-energy, achievement-focused with inspiring language"
    prompts: {
      greeting: "You're capable of amazing things! What goals are we crushing today?"
      encouragement: "Fantastic progress! You're on fire!"
      challenge: "This is your moment to shine. Let's turn this obstacle into an opportunity!"
    }
  }
  analytical: {
    description: "Data-driven, metric-focused with logical reasoning"
    prompts: {
      greeting: "Let's review your progress data and optimize your approach."
      encouragement: "Your completion rate has improved by X%. This trend indicates success."
      challenge: "Based on your patterns, I suggest this strategic approach."
    }
  }
}

export interface TaskAdaptation {
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  adaptationReason: 'completion_rate' | 'user_feedback' | 'time_constraints' | 'goal_alignment'
  originalTask: string
  adaptedTask: string
  explanation: string
}

export interface ProactiveInsight {
  type: 'milestone_celebration' | 'obstacle_warning' | 'habit_suggestion' | 'motivation_boost'
  priority: 'high' | 'medium' | 'low'
  message: string
  actionable: boolean
  suggestedActions?: string[]
  triggerData: any
}