'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'
import { formatPercentile } from '@/lib/utils'
import { AchievementNotification } from '@/components/AchievementNotification'
import { ContactSupportModal } from '@/components/ContactSupportModal'
import { CheckInModal, CheckInData } from '@/components/CheckInModal'
import { CheckInSetup, CheckInSettings } from '@/components/CheckInSetup'
import WeeklyTaskCreatorModal from '@/components/WeeklyTaskCreatorModal'
import { LoginTrackerComponent } from '@/components/LoginTracker'
import CoachPreferenceSetup from '@/components/CoachPreferenceSetup'
import { useLanguage } from '@/lib/language-context'
import LanguageSelector from '@/components/LanguageSelector'
import { 
  Calendar, MessageSquare, TrendingUp, Target, Award, Clock, 
  ArrowLeft, Settings, Star, CheckCircle, Play, Users,
  DollarSign, Heart, BarChart3, Zap, Trophy, ChevronDown, ChevronUp,
  Trash2, X, Folder
} from 'lucide-react'

interface CoachData {
  user: {
    id: string
    subscription_status: 'active' | 'cancelled' | 'trial'
    focus_area: 'financial' | 'health' | 'social' | 'personal'
    trial_days_left?: number
  }
  currentWeekPlan: {
    week: number
    focus: string
    actions: Array<{
      id: string
      title: string
      description: string
      completed: boolean
      timeEstimate: string
    }>
    completionRate: number
  }
  progress: {
    currentStreak: number
    totalActions: number
    completedActions: number
    thisWeekScore: number
    improvement: number
  }
  upcomingCheckins: Array<{
    id: string
    type: 'daily' | 'weekly'
    scheduledFor: string
    topic: string
  }>
  recentAchievements: Array<{
    id: string
    title: string
    description: string
    earnedAt: string
    icon: string
  }>
}

export default function CoachDashboard() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [coachData, setCoachData] = useState<CoachData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'coach', message: string, timestamp: Date}>>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [taskPreferences, setTaskPreferences] = useState<{
    dailyCount?: number;
    weeklyCount?: number;
    focusAreas?: string[];
    specificGoals?: string;
    confirmTasks?: boolean;
    previewedTasks?: {
      daily: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
      weekly: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
    };
  } | null>(null)
  const [waitingForTaskPreferences, setWaitingForTaskPreferences] = useState(false)
  const [taskPreview, setTaskPreview] = useState<{
    daily: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
    weekly: Array<{title: string; description: string; category: string; estimatedMinutes: number}>;
  } | null>(null)
  const [awaitingTaskConfirmation, setAwaitingTaskConfirmation] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [journalEntry, setJournalEntry] = useState('')
  const [journalQuestion, setJournalQuestion] = useState('')
  const [showGoals, setShowGoals] = useState(false)
  const [coachPreferences, setCoachPreferences] = useState<any>(null)
  const [showPreferenceSetup, setShowPreferenceSetup] = useState(false)
  const [preferencesLoading, setPreferencesLoading] = useState(true)
  const [showCoachConfig, setShowCoachConfig] = useState(false)
  const [editingCoachConfig, setEditingCoachConfig] = useState(false)
  const [goals, setGoals] = useState<Array<{id: string, category: string, title: string, description: string, target: string, deadline: string}>>([])
  const [newGoal, setNewGoal] = useState({category: '', title: '', description: '', target: '', deadline: ''})
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminders: true,
    weeklyReports: true,
    focusArea: 'financial',
    reminderTime: '09:00',
    coachingStyle: 'supportive',
    goalFrequency: 'weekly'
  })
  const [weeklyProgress, setWeeklyProgress] = useState<{[key: string]: boolean}>({})
  const [journalEntries, setJournalEntries] = useState<Array<{date: string, entry: string, question: string}>>([])
  const [dailyGoals, setDailyGoals] = useState<Array<{id: string, title: string, completed: boolean, category: string}>>([])
  const [actualWeeklyProgress, setActualWeeklyProgress] = useState(0)
  const [coachWeeklyTasks, setCoachWeeklyTasks] = useState<Array<{id: string, title: string, description: string, completed: boolean, timeEstimate: string, category: string}>>([])
  const [showTaskCreator, setShowTaskCreator] = useState(false)
  const [showDailyTaskCreator, setShowDailyTaskCreator] = useState(false)
  const [expandedAreas, setExpandedAreas] = useState<{[key: string]: boolean}>({
    financial: false,
    health: false,
    social: false,
    personal: false,
    other: false
  })
  const [combinedWeeklyProgress, setCombinedWeeklyProgress] = useState(0)
  const [weeklyDailyGoalsProgress, setWeeklyDailyGoalsProgress] = useState(0)
  const [currentWeek, setCurrentWeek] = useState(1) // Default to week 1, will be updated when coach data loads
  const [weeklyProgressByDay, setWeeklyProgressByDay] = useState<{[key: string]: number}>({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0, 
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  })
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)
  const [userProgress, setUserProgress] = useState<{
    streak: { days: number; message: string }
    completionRate: { percentage: number; completed: number; total: number }
    currentScore: { percentile: number; improvement: number }
    recentActivity: any
    lastUpdated: string
  } | null>(null)
  const [newAchievement, setNewAchievement] = useState<any>(null)
  const [showContactSupport, setShowContactSupport] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [currentCheckInId, setCurrentCheckInId] = useState<string | null>(null)
  const [upcomingCheckIns, setUpcomingCheckIns] = useState<any[]>([])
  const [showCheckInSetup, setShowCheckInSetup] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const focusAreas = ['financial', 'health', 'social', 'personal', 'other']
  const focusAreaNames = {
    financial: t('coach.financialHealth'),
    health: t('coach.physicalWellness'), 
    social: t('coach.socialNetwork'),
    personal: t('coach.personalDevelopment'),
    other: t('coach.otherTasks')
  }

  // Date navigation functions
  const navigateToYesterday = () => {
    const yesterday = new Date(selectedDate)
    yesterday.setDate(selectedDate.getDate() - 1)
    setSelectedDate(yesterday)
  }

  const navigateToTomorrow = () => {
    const tomorrow = new Date(selectedDate)
    tomorrow.setDate(selectedDate.getDate() + 1)
    setSelectedDate(tomorrow)
  }

  const navigateToToday = () => {
    setSelectedDate(new Date())
  }

  // Helper to format date for display
  const formatDateForDisplay = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return t('coach.todaysGoals')
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('coach.yesterdaysGoals')
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return t('coach.tomorrowsGoals')
    } else {
      return `${t('coach.goalsFor')} ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
  }

  // Check if selected date is tomorrow
  const isTomorrow = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return selectedDate.toDateString() === tomorrow.toDateString()
  }

  // Separate effect for assessment changes only
  useEffect(() => {
    // CLEAR ALL STATE when assessment changes
    console.log('COACH DASHBOARD: Assessment changed to', params.id)
    setCoachData(null)
    setLoading(true)
    setError(null)
    setDailyGoals([])
    setChatMessages([])
    
    // Load new data (fetchCoachData will set the current week)
    fetchCoachData()
    loadProgressData()
    loadUserProgress()
    loadSettings()
    loadCheckIns()
    loadCoachPreferences()
    refreshWeeklyProgress() // Load initial weekly progress charts
  }, [params.id])
  
  // Separate effect for week changes only
  useEffect(() => {
    // Only load weekly tasks if we have the assessment ID
    if (params.id && currentWeek > 0) {
      console.log(`COACH DASHBOARD: Week changed to ${currentWeek}, loading tasks...`)
      loadWeeklyTasks()
    }
  }, [currentWeek, params.id])

  // Effect for selected date changes
  useEffect(() => {
    if (params.id) {
      loadProgressData(selectedDate)
    }
  }, [selectedDate, params.id])

  const loadProgressData = async (date?: Date) => {
    try {
      // Load daily goals
      const targetDate = date || selectedDate
      const dateString = targetDate.toISOString().split('T')[0]
      const dailyResponse = await fetch(`/api/progress?type=daily&date=${dateString}&assessmentId=${params.id}`)
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json()
        // Always sync with database state - this ensures consistency after refresh
        if (dailyData.tasks) {
          const dbDailyGoals = dailyData.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            category: task.category
          }))
          setDailyGoals(dbDailyGoals)
        } else {
          // If no DB tasks, clear local state to prevent stale data
          setDailyGoals([])
        }
      } else {
        console.error('Failed to load daily tasks')
        // On error, clear state to prevent showing stale data
        setDailyGoals([])
      }

      // Weekly task progress is now handled in loadWeeklyTasks() to avoid conflicts

      // Load journal entries
      const journalResponse = await fetch(`/api/progress?type=journal&limit=5&assessmentId=${params.id}`)
      if (journalResponse.ok) {
        const journalData = await journalResponse.json()
        if (journalData.entries) {
          const dbJournalEntries = journalData.entries.map((entry: any) => ({
            date: entry.date,
            entry: entry.entry,
            question: entry.question || ''
          }))
          setJournalEntries(dbJournalEntries)
        }
      }
    } catch (error) {
      console.error('Error loading progress data:', error)
    }
  }

  const loadUserProgress = async () => {
    try {
      console.log('LOADING USER PROGRESS for assessment:', params.id)
      const response = await fetch(`/api/user-progress?assessmentId=${params.id}`)
      if (response.ok) {
        const progressData = await response.json()
        console.log('RECEIVED PROGRESS DATA:', progressData)
        setUserProgress(progressData)
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
    }
  }

  useEffect(() => {
    if (coachData) {
      // Sync settings with coach data
      setSettings(prev => ({
        ...prev,
        focusArea: coachData.user.focus_area
      }))
      
      // Weekly progress is now loaded in loadWeeklyTasks() which will set the correct percentage
      // Don't reset to 0 here as it would override the correct calculation
      
      // Don't initialize mock daily goals - they should come from database only
    }
  }, [coachData, currentWeek])

  // Auto-update progress when weekly tasks change
  useEffect(() => {
    if (coachWeeklyTasks.length > 0) {
      // Recalculate weekly progress
      const completedTasks = coachWeeklyTasks.filter(task => task.completed).length
      const totalTasks = coachWeeklyTasks.length
      const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      setActualWeeklyProgress(progressPercentage)
      
      // Also refresh combined weekly progress
      refreshWeeklyProgress()
    }
  }, [coachWeeklyTasks])

  // Auto-update progress when daily goals change
  useEffect(() => {
    if (dailyGoals.length > 0) {
      // Refresh combined weekly progress when daily tasks change
      refreshWeeklyProgress()
    }
  }, [dailyGoals])

  useEffect(() => {
    if (coachData && showJournal && !journalQuestion) {
      // Get today's check-in question
      const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
      const todayCheckin = coachData.upcomingCheckins.find(checkin => {
        const checkinDay = new Date(checkin.scheduledFor).getDay()
        return checkinDay === today
      })
      
      if (todayCheckin) {
        setJournalQuestion(todayCheckin.topic)
      } else {
        // Fallback question based on focus area
        const questions = {
          financial: t('coach.financialJournalPrompt'),
          health: t('coach.healthJournalPrompt'), 
          social: t('coach.socialJournalPrompt'),
          personal: t('coach.personalJournalPrompt')
        }
        setJournalQuestion(questions[coachData.user.focus_area])
      }
    }
  }, [coachData, showJournal, journalQuestion])

  const fetchCoachData = async () => {
    try {
      console.log('🔍 FETCHING COACH DATA for assessment:', params.id)
      console.log('📍 Current URL:', window.location.href)
      const response = await fetch(`/api/coach/${params.id}?skipOpenAI=true`)
      console.log('📊 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ RECEIVED COACH DATA:', {
          assessmentId: params.id,
          focusArea: data.user?.focus_area,
          subscriptionStatus: data.user?.subscription_status
        })
        
        // Load user settings specific to this assessment
        const settingsResponse = await fetch(`/api/progress?type=settings&assessmentId=${params.id}`)
        let userSettings = null
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          userSettings = settingsData.settings
          console.log('RECEIVED SETTINGS DATA:', userSettings?.primaryFocus)
        }
        
        // Fetch real achievements from API
        let achievements = []
        try {
          const achievementsResponse = await fetch('/api/achievements')
          if (achievementsResponse.ok) {
            const achievementsData = await achievementsResponse.json()
            achievements = achievementsData.achievements || []
          }
        } catch (error) {
          console.error('Error fetching achievements:', error)
        }
        
        // Fetch user goals from API
        let userGoals = []
        try {
          const goalsResponse = await fetch('/api/goals')
          if (goalsResponse.ok) {
            const goalsData = await goalsResponse.json()
            userGoals = goalsData.goals || []
          }
        } catch (error) {
          console.error('Error fetching goals:', error)
        }
        
        // Transform API data to match component interface
        const transformedData = {
          user: {
            id: data.assessment.id,
            subscription_status: data.subscription.status === 'active' ? 'active' : 'trial' as 'active' | 'cancelled' | 'trial',
            focus_area: userSettings?.primaryFocus || getLowestCategory(data.assessment.categories),
            trial_days_left: Math.max(0, Math.floor((new Date(data.subscription.periodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
          },
          currentWeekPlan: data.coaching ? {
            week: data.coaching.weeklyPlan.week,
            focus: data.coaching.weeklyPlan.focus,
            actions: data.coaching.weeklyPlan.tasks.map((task: string, index: number) => ({
              id: `action-${index}`,
              title: task,
              description: `Focus on improving your ${data.coaching.weeklyPlan.focus} area`,
              completed: Math.random() > 0.7, // Random for demo
              timeEstimate: '15-30 min'
            })),
            completionRate: 0.4 // Demo value
          } : {
            week: 1,
            focus: 'Getting Started',
            actions: [],
            completionRate: 0
          },
          progress: {
            currentStreak: 0,
            totalActions: 0,
            completedActions: 0,
            thisWeekScore: Math.round(data.assessment.overall.percentile),
            improvement: 0
          },
          upcomingCheckins: data.coaching?.dailyCheckins ? data.coaching.dailyCheckins.slice(0, 3).map((checkin: any, index: number) => ({
            id: `checkin-${index}`,
            type: 'daily',
            scheduledFor: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
            topic: checkin.question
          })) : [],
          recentAchievements: achievements.length > 0 ? achievements.slice(0, 5).map((achievement: any) => ({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            earnedAt: achievement.earnedAt,
            icon: achievement.icon || '🏆'
          })) : []
        }
        setCoachData(transformedData)
        
        // Calculate current week based on assessment creation date
        const assessmentDate = new Date(data.assessment.createdAt)
        const currentDate = new Date()
        const daysDifference = Math.floor((currentDate.getTime() - assessmentDate.getTime()) / (1000 * 60 * 60 * 24))
        const calculatedWeek = Math.max(1, Math.floor(daysDifference / 7) + 1)
        setCurrentWeek(calculatedWeek)
        console.log(`Assessment created: ${assessmentDate.toDateString()}, Current week: ${calculatedWeek}`)
        
        // Set the goals state with fetched data
        setGoals(userGoals.map((goal: any) => ({
          id: goal.id,
          category: goal.category,
          title: goal.title,
          description: goal.description || '',
          target: goal.target,
          deadline: goal.deadline || ''
        })))
      } else if (response.status === 403) {
        console.log('❌ No subscription - redirecting to paywall')
        router.push(`/paywall/coach/${params.id}`)
        return
      } else if (response.status === 401) {
        console.log('❌ Not logged in - redirecting to login')
        router.push(`/auth/signin?callbackUrl=/coach/${params.id}`)
        return
      } else if (response.status === 404) {
        console.log('⚠️ Coach data not found - showing onboarding screen')
        console.log('🎯 This happens when user just purchased and needs to complete setup')
        setShowOnboarding(true)
        setLoading(false)
        return
      } else {
        setError(`Failed to load coach data: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching coach data:', error)
      setError(t('coach.coachingDataError'))
    } finally {
      setLoading(false)
    }
  }

  const getLowestCategory = (categories: any) => {
    const categoryMap = {
      financial: categories.financial,
      health: categories.health,
      social: categories.social,
      personal: categories.romantic
    }
    
    return Object.entries(categoryMap).reduce((lowest, [key, value]) => 
      value < categoryMap[lowest] ? (key as keyof typeof categoryMap) : lowest
    , 'financial' as keyof typeof categoryMap) as 'financial' | 'health' | 'social' | 'personal'
  }

  // Remove mock data - daily tasks should come from database
  const getTodayGoalForArea = (area: string, goalNumber: number) => {
    // This function is now deprecated - tasks should be created through the UI
    return ''
  }

  // Remove mock data - weekly tasks should come from database
  const getWeeklyTasksForArea = (area: string) => {
    // This function is now deprecated - tasks should be created through the UI
    return []
  }

  const getAllWeekTasks = () => {
    // Always use database tasks - no fallback
    return coachWeeklyTasks
  }

  const getCurrentWeekTasks = () => {
    // Keep this for backward compatibility but now returns all tasks
    return getAllWeekTasks()
  }

  const toggleAreaExpanded = (area: string) => {
    setExpandedAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }))
  }


  const createUserTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          assessmentId: params.id  // Use the current assessment ID from URL
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(t('coach.taskCreatedSuccessfully'))
        
        // Refresh the data
        if (taskData.type === 'weekly') {
          await loadWeeklyTasks()
        } else {
          await loadProgressData()
          // Also refresh weekly progress if the new task is for today
          const today = new Date().toISOString().split('T')[0]
          const taskDate = new Date(taskData.date).toISOString().split('T')[0]
          if (taskDate === today) {
            refreshWeeklyProgress()
          }
        }
        setShowDailyTaskCreator(false)
        return data.task
      } else {
        const error = await response.json()
        alert(`Error creating task: ${error.error}`)
        return null
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert(t('coach.failedToCreateTask'))
      return null
    }
  }

  const loadWeeklyTasks = async () => {
    try {
      console.log(`🔄 WEEKLY TASKS: Loading for week ${currentWeek}, assessment ${params.id}`)
      const response = await fetch(`/api/progress?type=weekly&week=${currentWeek}&assessmentId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`📦 WEEKLY TASKS: API Response:`, data)
        console.log(`✅ WEEKLY TASKS: Completion status of tasks:`)
        data.tasks?.forEach((t: any) => {
          console.log(`  - ${t.title} (${t.id}): completed=${t.completed}`)
        })
        // Always sync with database state for weekly tasks and their progress
        if (data.tasks && data.tasks.length > 0) {
          const formattedTasks = data.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description || 'Coach-assigned task',
            completed: task.completed || false, // Ensure completed is always boolean
            timeEstimate: '15-30 min',
            category: task.category
          }))
          console.log('🔄 Setting coachWeeklyTasks to:')
          formattedTasks.forEach((t: any) => {
            console.log(`  - ${t.title} (category: "${t.category}", completed: ${t.completed})`)
          })
          setCoachWeeklyTasks(formattedTasks)

          // Remove weeklyProgress state usage - we're using coachWeeklyTasks directly now

          // Calculate weekly progress percentage
          const completedTasks = data.tasks.filter((task: any) => task.completed).length
          const totalTasks = data.tasks.length
          const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
          console.log(`📊 LOAD PROGRESS: ${completedTasks}/${totalTasks} = ${progressPercentage}%`)
          setActualWeeklyProgress(progressPercentage)
        } else {
          // No coach-assigned tasks for this week - but preserve existing progress
          console.log(`WEEKLY TASKS: No tasks found for week ${currentWeek}`)
          setCoachWeeklyTasks([])
          // Don't clear weeklyProgress - preserve completed states
          setActualWeeklyProgress(0)
        }
      } else {
        console.error('Failed to load weekly tasks')
        // On error, don't clear existing progress - preserve user's completed tasks
        setCoachWeeklyTasks([])
        setActualWeeklyProgress(0)
      }
    } catch (error) {
      console.error('Error loading weekly tasks:', error)
    }
  }

  const toggleActionComplete = async (actionId: string) => {
    // Get the current task from our state
    const currentTask = coachWeeklyTasks.find(t => t.id === actionId)
    if (!currentTask) {
      console.error(`❌ Task not found: ${actionId}`)
      return
    }
    
    const currentCompleted = currentTask.completed
    const newCompleted = !currentCompleted
    console.log(`🔄 TOGGLE: Task ${actionId} "${currentTask.title}", current: ${currentCompleted}, new: ${newCompleted}`)
    
    try {
      const currentWeekTasks = getCurrentWeekTasks()
      
      // Optimistically update the coachWeeklyTasks array to reflect the new completion state
      console.log('📝 Optimistically updating task state...')
      setCoachWeeklyTasks(prev => {
        const updated = prev.map(task => 
          task.id === actionId ? { ...task, completed: newCompleted } : task
        )
        console.log('📝 Updated tasks:', updated.map(t => ({id: t.id, title: t.title, completed: t.completed})))
        return updated
      })
      
      // Don't manually calculate progress here - let the useEffect handle it after state updates
      // The useEffect will recalculate based on the updated coachWeeklyTasks state
      
      // Let useEffect handle coachData updates based on the updated coachWeeklyTasks

      // Save to database
      const taskInfo = currentWeekTasks.find(task => task.id === actionId)
      console.log(`📋 Task to save:`, taskInfo)
      if (taskInfo) {
        // Check if this task has a database ID format
        // Database tasks use CUID (starts with 'c') or UUID (36 chars with dashes) format
        // Non-database tasks would have custom formats like "financial-week-1-task-0"
        const looksLikeDbId = (
          // CUID format (Prisma default)
          (taskInfo.id.startsWith('c') && taskInfo.id.length >= 25 && taskInfo.id.length <= 30) ||
          // UUID format (if any integrations use it)
          (taskInfo.id.length === 36 && taskInfo.id.includes('-') && !taskInfo.id.includes('week'))
        )
        console.log(`🔍 Looks like DB ID: ${looksLikeDbId}, Task ID: ${taskInfo.id}, Length: ${taskInfo.id.length}`)
        
        let response
        if (looksLikeDbId) {
          // Try direct PUT API first for tasks that look like they're from the database
          console.log('📌 Using PUT endpoint for existing task')
          response = await fetch(`/api/tasks/weekly/${actionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              completed: newCompleted,
              assessmentId: params.id
            })
          })
        } else {
          // Use upsert for generated/non-database tasks
          console.log('📌 Using UPSERT endpoint for new/generated task')
          const currentFocusArea = taskInfo.category || focusAreas[(currentWeek - 1) % focusAreas.length]
          response = await fetch('/api/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'weekly_task',
              data: {
                title: taskInfo.title,
                description: taskInfo.description,
                category: currentFocusArea,
                week: currentWeek,
                completed: newCompleted,
                assessmentId: params.id
              }
            })
          })
          
          // If PUT fails (task not found), fall back to upsert
          if (!response.ok && response.status === 404) {
            console.log('⚠️ Task not found in DB, falling back to UPSERT')
            const currentFocusArea = taskInfo.category || focusAreas[(currentWeek - 1) % focusAreas.length]
            response = await fetch('/api/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'weekly_task',
                data: {
                  title: taskInfo.title,
                  description: taskInfo.description,
                  category: currentFocusArea,
                  week: currentWeek,
                  completed: newCompleted,
                  assessmentId: params.id
                }
              })
            })
          }
        }
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Failed to save task:', errorText)
          throw new Error('Failed to save task to database')
        }
        
        const result = await response.json()
        console.log(`💾 SAVE RESULT: Task ${actionId} saved to database:`, result)
        console.log(`📝 Updated task state:`, result.task ? `completed=${result.task.completed}` : 'No task in response')
        
        // If we get a task back from the API, update our local state with it
        if (result.task) {
          console.log('✅ Updating local task with server response:', result.task)
          setCoachWeeklyTasks(prev => prev.map(task => 
            task.id === result.task.id ? {
              ...task,
              completed: result.task.completed,
              completedAt: result.task.completedAt
            } : task
          ))
          // Don't reload - we already have the updated state
        } else {
          console.log('⚠️ No task in response, keeping optimistic update')
          // Keep the optimistic update - don't reload
        }
        
        // Refresh user progress after task completion
        await loadUserProgress()
        
        // Check for achievements after weekly task completion
        if (newCompleted) {
          try {
            const achievementResponse = await fetch('/api/achievements/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ trigger: 'task_completion', category: taskInfo?.category || 'financial' })
            })
            
            if (achievementResponse.ok) {
              const { newAchievements } = await achievementResponse.json()
              if (newAchievements && newAchievements.length > 0) {
                // Show achievement notification
                const latestAchievement = newAchievements[0]
                setNewAchievement(latestAchievement)
                
                // Refresh coach data to show new achievements
                await fetchCoachData()
              }
            }
          } catch (error) {
            console.error('Error checking achievements:', error)
          }
        }
      }
    } catch (error) {
      // Revert on error - restore the original task state
      setCoachWeeklyTasks(prev => prev.map(task => 
        task.id === actionId ? { ...task, completed: currentCompleted } : task
      ))
      console.error('❌ Error updating action:', error)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      message: chatInput.trim(),
      timestamp: new Date()
    }

    // Check if we're providing task preferences or confirming tasks
    let currentTaskPreferences = null
    
    // If user is making a vague request and we have stored preferences, use them
    const isVagueTaskRequest = /create|make|add|set|generate|give me|suggest|need.*task/i.test(userMessage.message) &&
                               !/\d+\s*(daily|weekly)/i.test(userMessage.message) &&
                               !userMessage.message.toLowerCase().includes('focus')
    
    if (isVagueTaskRequest && coachPreferences && !waitingForTaskPreferences && !awaitingTaskConfirmation) {
      // Use stored preferences for vague requests
      currentTaskPreferences = {
        dailyCount: coachPreferences.dailyTaskCount,
        weeklyCount: coachPreferences.weeklyTaskCount,
        focusAreas: [coachPreferences.primaryFocus, coachPreferences.secondaryFocus].filter(Boolean),
        specificGoals: coachPreferences.specificGoals,
        confirmTasks: false
      }
      setTaskPreferences(currentTaskPreferences)
    } else if (waitingForTaskPreferences) {
      // Parse the user's response for task preferences
      const message = userMessage.message.toLowerCase()
      const dailyMatch = message.match(/(\d+)\s*daily/)
      const weeklyMatch = message.match(/(\d+)\s*weekly/)
      
      currentTaskPreferences = {
        dailyCount: dailyMatch ? parseInt(dailyMatch[1]) : undefined,
        weeklyCount: weeklyMatch ? parseInt(weeklyMatch[1]) : undefined,
        specificGoals: userMessage.message,
        focusAreas: [settings.focusArea],
        confirmTasks: false
      }
      
      setTaskPreferences(currentTaskPreferences)
      setWaitingForTaskPreferences(false)
    } else if (awaitingTaskConfirmation) {
      // Check if user is confirming, modifying, or regenerating tasks
      const message = userMessage.message.toLowerCase()
      
      if (message.includes('yes') || message.includes('confirm') || message.includes('add them') || message.includes('looks good') || 
          message.includes('sure') || message.includes('add it') || message.includes('add to') || message.includes('like them')) {
        // User confirmed tasks - send confirmation with the preview tasks
        console.log('User confirmed tasks, current preview:', taskPreview)
        currentTaskPreferences = {
          ...taskPreferences,
          confirmTasks: true,
          // Include the previewed tasks so they get created exactly as shown
          previewedTasks: taskPreview || undefined
        }
        console.log('Sending confirmation with preferences:', currentTaskPreferences)
        setTaskPreferences(currentTaskPreferences)
        setAwaitingTaskConfirmation(false)
        setTaskPreview(null)
      } else if (message.includes('regenerate') || message.includes('new tasks') || message.includes('different')) {
        // User wants new tasks - regenerate with same preferences
        currentTaskPreferences = {
          ...taskPreferences,
          confirmTasks: false
        }
        setAwaitingTaskConfirmation(false)
      } else {
        // User wants to modify tasks - include their feedback
        currentTaskPreferences = {
          ...taskPreferences,
          specificGoals: userMessage.message,
          confirmTasks: false
        }
        setTaskPreferences(currentTaskPreferences)
        // Keep awaitingTaskConfirmation true so we show the next preview
      }
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const response = await fetch(`/api/coach/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          data: {
            message: userMessage.message,
            taskPreferences: currentTaskPreferences || taskPreferences,
            conversationHistory: chatMessages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.message
            })),
            // Include additional context for AI
            additionalContext: {
              weeklyProgress: {
                completed: Object.values(weeklyProgress).filter(Boolean).length,
                total: Object.keys(weeklyProgress).length,
                percentage: actualWeeklyProgress,
                focusArea: settings.focusArea
              },
              recentJournalEntries: journalEntries.slice(-3), // Last 3 entries
              dailyGoals: dailyGoals,
              settings: settings,
              // Keep track if we're in task creation flow
              isInTaskFlow: waitingForTaskPreferences || awaitingTaskConfirmation || currentTaskPreferences?.confirmTasks
            }
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const coachMessage = {
          id: `coach-${Date.now()}`,
          type: 'coach' as const,
          message: data.message || data.response?.message,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, coachMessage])
        
        // Handle delete responses - refresh tasks if tasks were deleted
        if (data.deletedTasks) {
          // Refresh the UI to reflect deleted tasks
          await loadProgressData()
          await loadWeeklyTasks()
        }
        
        // Handle focus area task creation - refresh tasks if tasks were created
        if (data.createdTasks && (data.createdTasks.daily?.length > 0 || data.createdTasks.weekly?.length > 0)) {
          // Refresh the UI to reflect new tasks
          await loadProgressData()
          await loadWeeklyTasks()
        }
        
        // Check if AI needs more information for task creation
        if (data.response && data.response.needsMoreInfo) {
          setWaitingForTaskPreferences(true)
        }
        
        // Check if AI is showing task preview
        if (data.response && data.response.awaitingConfirmation && data.taskPreview) {
          console.log('Setting task preview:', data.taskPreview)
          setTaskPreview(data.taskPreview)
          setAwaitingTaskConfirmation(true)
        }
        
        // If goals were created, refresh the goals list
        if (data.createdGoals && data.createdGoals.length > 0) {
          try {
            const goalsResponse = await fetch('/api/goals')
            if (goalsResponse.ok) {
              const goalsData = await goalsResponse.json()
              setGoals(goalsData.goals.map((goal: any) => ({
                id: goal.id,
                category: goal.category,
                title: goal.title,
                description: goal.description || '',
                target: goal.target,
                deadline: goal.deadline || ''
              })))
            }
          } catch (error) {
            console.error('Error refreshing goals:', error)
          }
        }
        
        // If tasks were created, refresh the task lists
        if (data.createdTasks && (data.createdTasks.daily.length > 0 || data.createdTasks.weekly.length > 0)) {
          console.log('Tasks created by AI:', data.createdTasks)
          // Refresh daily tasks
          if (data.createdTasks.daily.length > 0) {
            console.log('Refreshing daily tasks...')
            await loadProgressData()
          }
          // Refresh weekly tasks
          if (data.createdTasks.weekly.length > 0) {
            console.log('Refreshing weekly tasks...')
            await loadWeeklyTasks()
          }
        }
      } else {
        const errorMessage = {
          id: `coach-error-${Date.now()}`,
          type: 'coach' as const,
          message: t('coach.troubleConnecting'),
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending chat message:', error)
      const errorMessage = {
        id: `coach-error-${Date.now()}`,
        type: 'coach' as const,
        message: t('coach.troubleConnecting'),
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  const saveJournalEntry = async () => {
    if (!journalEntry.trim()) return

    try {
      // Save to database
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'journal_entry',
          data: {
            entry: journalEntry.trim(),
            question: journalQuestion,
            mood: null, // Could add mood tracking later
            assessmentId: params.id
          }
        })
      })
      
      // Save to local state
      const newEntry = {
        date: new Date().toISOString(),
        entry: journalEntry.trim(),
        question: journalQuestion
      }
      setJournalEntries(prev => [newEntry, ...prev])
      
      // Refresh user progress after journal entry
      await loadUserProgress()
      
      alert(t('coach.journalEntrySaved'))
      setJournalEntry('')
      setJournalQuestion('')
      setShowJournal(false)
    } catch (error) {
      console.error('Error saving journal entry:', error)
      alert(t('coach.journalEntryError'))
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/progress?type=settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data.settings }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const loadCoachPreferences = async () => {
    if (!params.id) return
    
    try {
      setPreferencesLoading(true)
      const response = await fetch(`/api/coach-preferences?assessmentId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log('RECEIVED COACH PREFERENCES:', data.settings)
        setCoachPreferences(data.settings)
        
        // Show setup if not completed
        if (!data.settings.hasCompletedSetup) {
          setShowPreferenceSetup(true)
        }
      }
    } catch (error) {
      console.error('Error loading coach preferences:', error)
    } finally {
      setPreferencesLoading(false)
    }
  }

  const handlePreferenceSetupComplete = async (preferences: any) => {
    if (!params.id) return
    
    try {
      const response = await fetch('/api/coach-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, assessmentId: params.id })
      })

      if (response.ok) {
        const data = await response.json()
        setCoachPreferences(data.settings)
        setShowPreferenceSetup(false)
        
        // Refresh coach data with new preferences
        await fetchCoachData()
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Failed to save preferences. Please try again.')
    }
  }

  const loadCheckIns = async () => {
    try {
      const response = await fetch(`/api/checkins?type=upcoming&limit=5&assessmentId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded check-ins for assessment:', params.id, data.checkIns)
        setUpcomingCheckIns(data.checkIns || [])
        
        // Check if there's a check-in due now
        const now = new Date()
        const dueCheckIn = data.checkIns?.find((checkIn: any) => {
          const scheduledTime = new Date(checkIn.scheduledFor)
          return scheduledTime <= now && checkIn.status === 'pending'
        })
        
        if (dueCheckIn) {
          setCurrentCheckInId(dueCheckIn.id)
          setShowCheckIn(true)
        }
      } else {
        console.error('Failed to load check-ins:', response.status)
      }
    } catch (error) {
      console.error('Error loading check-ins:', error)
    }
  }

  const handleCheckInComplete = async (data: CheckInData) => {
    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          data: {
            checkInId: data.checkInId || currentCheckInId,
            mood: data.mood,
            energy: data.energy,
            notes: data.notes,
            responses: data.responses
          }
        })
      })
      
      if (response.ok) {
        setShowCheckIn(false)
        setCurrentCheckInId(null)
        await loadCheckIns()
        alert('Check-in completed successfully!')
      }
    } catch (error) {
      console.error('Error completing check-in:', error)
      alert('Failed to complete check-in. Please try again.')
    }
  }

  const handleCheckInSetup = async (settings: CheckInSettings) => {
    try {
      // Save check-in settings first
      const settingsResponse = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'settings',
          data: {
            checkInFrequency: settings.frequency,
            checkInTime: settings.time,
            checkInTimes: settings.times ? JSON.stringify(settings.times) : null,
            checkInDays: settings.days ? JSON.stringify(settings.days) : null,
            checkInTimeOfDay: settings.timeOfDay,
            checkInReminderMinutes: settings.reminderMinutesBefore,
            assessmentId: params.id
          }
        })
      })
      
      if (!settingsResponse.ok) {
        throw new Error('Failed to save settings')
      }
      
      // Now schedule initial check-ins
      const scheduleResponse = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'schedule', data: { assessmentId: params.id } })
      })
      
      if (!scheduleResponse.ok) {
        const errorData = await scheduleResponse.json()
        throw new Error(errorData.error || 'Failed to schedule check-ins')
      }
      
      const scheduleData = await scheduleResponse.json()
      console.log('Check-ins scheduled:', scheduleData)
      
      setShowCheckInSetup(false)
      
      // Reload settings to get the updated check-in preferences
      await loadSettings()
      
      // Load the newly scheduled check-ins
      await loadCheckIns()
      
    } catch (error) {
      console.error('Error setting up check-ins:', error)
      alert(`Failed to set up check-ins: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  const generateCoachingData = async () => {
    try {
      setLoading(true)
      console.log('🔄 GENERATING COACHING DATA for assessment:', params.id)
      
      // Call API without skipOpenAI parameter to generate coaching data
      const response = await fetch(`/api/coach/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ GENERATED COACHING DATA')
        
        // Reload the coach data with the new coaching information
        await fetchCoachData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate coaching data')
      }
    } catch (error) {
      console.error('Error generating coaching data:', error)
      alert(`Failed to generate coaching data: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteDailyGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/tasks/daily/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        // Remove from local state
        setDailyGoals(prev => prev.filter(goal => goal.id !== goalId))
        // Update progress after deletion
        await loadUserProgress()
      } else {
        console.error('Failed to delete daily goal')
        alert('Failed to delete daily goal. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting daily goal:', error)
      alert('Error deleting daily goal. Please try again.')
    }
  }

  const deleteWeeklyTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/weekly/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        // Remove from local state
        setCoachWeeklyTasks(prev => prev.filter(task => task.id !== taskId))
        // Also remove from progress tracking
        setWeeklyProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[taskId]
          return newProgress
        })
        // Update progress after deletion
        await loadUserProgress()
        await loadWeeklyTasks()
      } else {
        console.error('Failed to delete weekly task')
        alert('Failed to delete weekly task. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting weekly task:', error)
      alert('Error deleting weekly task. Please try again.')
    }
  }

  const refreshWeeklyProgress = () => {
    // Refresh both weekly progress charts AND combined progress - independent of selected date
    const loadWeeklyDailyProgress = async () => {
      try {
        const today = new Date()
        const progressByDay: {[key: string]: number} = {}
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        // Calculate the start of the current week (Monday)
        const currentDayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = currentDayOfWeek === 0 ? -6 : -(currentDayOfWeek - 1) // Convert to Monday-based
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() + mondayOffset)
        
        // Variables for combined weekly progress calculation
        let dailyTasksCompleted = 0
        let dailyTasksTotal = 0
        
        await Promise.all(daysOfWeek.map(async (day, index) => {
          const dayDate = new Date(weekStart)
          dayDate.setDate(weekStart.getDate() + index)
          const dateString = dayDate.toISOString().split('T')[0]
          
          const currentDayIndex = (today.getDay() + 6) % 7 // Convert to Monday-based (0 = Monday)
          
          // Always load from database for weekly progress charts
          try {
            const response = await fetch(`/api/progress?type=daily&date=${dateString}&assessmentId=${params.id}`)
            if (response.ok) {
              const data = await response.json()
              if (data.tasks && data.tasks.length > 0) {
                const completed = data.tasks.filter((t: any) => t.completed).length
                const total = data.tasks.length
                progressByDay[day] = total > 0 ? Math.round((completed / total) * 100) : 0
                
                // Add to combined progress calculation
                dailyTasksTotal += total
                dailyTasksCompleted += completed
              } else {
                progressByDay[day] = 0 // No tasks for this day
              }
            } else {
              progressByDay[day] = 0
            }
          } catch (error) {
            console.error(`Error loading daily progress for ${day}:`, error)
            progressByDay[day] = 0
          }
        }))
        
        setWeeklyProgressByDay(progressByDay)
        
        // Calculate combined weekly progress using actual data
        const currentWeekTasks = getCurrentWeekTasks()
        const weeklyTasksCompleted = currentWeekTasks.filter(task => task.completed).length
        const weeklyTasksTotal = currentWeekTasks.length
        
        // Calculate individual percentages (rounded)
        const weeklyTasksPercentage = weeklyTasksTotal > 0 ? Math.round((weeklyTasksCompleted / weeklyTasksTotal) * 100) : 0
        const dailyTasksPercentage = dailyTasksTotal > 0 ? Math.round((dailyTasksCompleted / dailyTasksTotal) * 100) : 0
        
        // Set the weekly daily goals progress for consistent display
        setWeeklyDailyGoalsProgress(dailyTasksPercentage)
        
        // Calculate combined percentage based on individual task counts (total completed / total tasks)
        const totalCompleted = weeklyTasksCompleted + dailyTasksCompleted
        const totalTasks = weeklyTasksTotal + dailyTasksTotal
        const combinedPercentage = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0
        
        setCombinedWeeklyProgress(combinedPercentage)
        
        console.log('Combined Progress Calculation (Fixed):', {
          weeklyTasks: `${weeklyTasksCompleted}/${weeklyTasksTotal} = ${weeklyTasksPercentage}%`,
          dailyTasks: `${dailyTasksCompleted}/${dailyTasksTotal} = ${dailyTasksPercentage}%`,
          combined: `${totalCompleted}/${totalTasks} = ${Math.round(combinedPercentage)}%`,
          rawCombined: `${combinedPercentage.toFixed(2)}%`
        })
        
      } catch (error) {
        console.error('Error calculating weekly progress:', error)
        setWeeklyProgressByDay({
          Monday: 0,
          Tuesday: 0, 
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0
        })
        setCombinedWeeklyProgress(0)
      }
    }
    
    loadWeeklyDailyProgress()
  }

  const toggleDailyGoal = async (goalId: string) => {
    const goalToToggle = dailyGoals.find(goal => goal.id === goalId)
    if (!goalToToggle) return
    
    // Update local state immediately for responsive UI
    const newCompletedState = !goalToToggle.completed
    const updatedGoals = dailyGoals.map(goal => 
      goal.id === goalId ? { ...goal, completed: newCompletedState } : goal
    )
    setDailyGoals(updatedGoals)
    
    try {
      // Use PUT method to update existing task directly by ID
      const response = await fetch(`/api/tasks/daily/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: newCompletedState,
          assessmentId: params.id
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      
      // Update user progress after successful save
      await loadUserProgress()
      
      // Refresh weekly progress charts only if this task is for today
      const today = new Date().toISOString().split('T')[0]
      const selectedDateString = selectedDate.toISOString().split('T')[0]
      if (selectedDateString === today) {
        refreshWeeklyProgress()
      }
      
      // Check for new achievements after task completion
      if (newCompletedState) {
        try {
          const achievementResponse = await fetch('/api/achievements/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trigger: 'task_completion', category: goalToToggle.category })
          })
          
          if (achievementResponse.ok) {
            const { newAchievements } = await achievementResponse.json()
            if (newAchievements && newAchievements.length > 0) {
              // Show achievement notification
              const latestAchievement = newAchievements[0]
              setNewAchievement(latestAchievement)
              
              // Refresh coach data to show new achievements
              await fetchCoachData()
            }
          }
        } catch (error) {
          console.error('Error checking achievements:', error)
        }
      }
      
    } catch (error) {
      console.error('Error updating daily goal:', error)
      // Revert local state on error
      const revertedGoals = dailyGoals.map(goal => 
        goal.id === goalId ? { ...goal, completed: !newCompletedState } : goal
      )
      setDailyGoals(revertedGoals)
      alert('Failed to update task. Please try again.')
    }
  }

  const saveGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.category) return

    const goalToAdd = {
      id: `goal-${Date.now()}`,
      category: newGoal.category,
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      target: newGoal.target.trim(),
      deadline: newGoal.deadline
    }

    setGoals(prev => [...prev, goalToAdd])
    setNewGoal({category: '', title: '', description: '', target: '', deadline: ''})
    alert('Goal created successfully! Keep working towards it.')
  }

  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId))
  }

  const saveSettings = async () => {
    try {
      // Save settings to database
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'coach_settings',
          data: {
            primaryFocus: settings.focusArea,
            coachingStyle: settings.coachingStyle,
            goalFrequency: settings.goalFrequency,
            dailyReminders: settings.dailyReminders
          }
        })
      })
      
      // Generate new weekly tasks based on updated focus area
      if (coachData && settings.focusArea !== coachData.user.focus_area) {
        // Update coach data immediately for responsive UI
        setCoachData(prev => prev ? {
          ...prev,
          user: {
            ...prev.user,
            focus_area: settings.focusArea as 'financial' | 'health' | 'social' | 'personal'
          }
        } : prev)
        
        const response = await fetch(`/api/coach/${params.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_focus_area',
            data: { 
              focusArea: settings.focusArea,
              preferences: settings
            }
          })
        })
        
        if (response.ok) {
          // Refresh coach data to get new tasks
          await fetchCoachData()
          
          // Update daily goals for new focus area
          const newDailyGoals = [
            {
              id: `daily-${Date.now()}-1`,
              title: getTodayGoalForArea(settings.focusArea, 1),
              completed: false,
              category: settings.focusArea
            },
            {
              id: `daily-${Date.now()}-2`, 
              title: getTodayGoalForArea(settings.focusArea, 2),
              completed: false,
              category: settings.focusArea
            }
          ]
          setDailyGoals(newDailyGoals)
        }
      }
      
      // In a real app, save to database
      alert('Settings saved successfully! Your preferences have been updated.')
      setShowSettings(false)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4 py-8">
          {/* Onboarding Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Your AI Life Coach! 🎉
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your subscription is active! Let's set up your personalized coaching experience to help you achieve your life goals.
            </p>
          </div>

          {/* Onboarding Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('coach.letsGetYouStarted')}</h2>
            
            <div className="space-y-6">
              {/* Step 1: Set Preferences */}
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. {t('coach.setYourCoachingPreferences')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('coach.chooseFocusAreaDesc')}
                  </p>
                  <CoachPreferenceSetup 
                    assessmentId={params.id as string}
                    onComplete={(preferences) => {
                      console.log('✅ ONBOARDING COMPLETE!')
                      console.log('📝 Preferences saved:', preferences)
                      console.log('🚀 Hiding onboarding screen and fetching coach dashboard...')
                      // Move to next step or refresh data
                      setShowOnboarding(false)
                      setLoading(true)
                      fetchCoachData()
                    }}
                  />
                </div>
              </div>

              {/* Step 2: Set Check-ins (will show after preferences) */}
              <div className="flex items-start opacity-50">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. {t('coach.scheduleYourCheckins')}</h3>
                  <p className="text-gray-600">
                    {t('coach.setUpCheckinsDesc')}
                  </p>
                </div>
              </div>

              {/* Step 3: First Chat (will show after check-ins) */}
              <div className="flex items-start opacity-50">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  <MessageSquare className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. {t('coach.meetYourAiCoach')}</h3>
                  <p className="text-gray-600">
                    {t('coach.firstConversationDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <Target className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('coach.personalizedGoals')}</h3>
              <p className="text-sm text-gray-600">{t('coach.personalizedGoalsDesc')}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <MessageSquare className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('coach.twentyFourSevenSupport')}</h3>
              <p className="text-sm text-gray-600">{t('coach.twentyFourSevenSupportDesc')}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <TrendingUp className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('coach.trackProgress')}</h3>
              <p className="text-sm text-gray-600">{t('coach.trackProgressDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-600 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
          >
{t('common.back')} to Home
          </button>
        </div>
      </div>
    )
  }

  if (!coachData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">{t('coach.coachNotFound')}</p>
      </div>
    )
  }

  // Show preference setup if needed
  if (showPreferenceSetup && coachPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <CoachPreferenceSetup
          onComplete={handlePreferenceSetupComplete}
          initialPreferences={coachPreferences}
          assessmentId={Array.isArray(params.id) ? params.id[0] : params.id}
        />
      </div>
    )
  }

  const focusAreaIcons: { [key: string]: any } = {
    financial: DollarSign,
    health: Heart,
    social: Users,
    personal: Star,
    other: Folder
  }

  const FocusIcon = focusAreaIcons[coachData.user.focus_area] || Star

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginTrackerComponent />
      
      <AchievementNotification 
        achievement={newAchievement} 
        onClose={() => setNewAchievement(null)} 
      />
      <ContactSupportModal 
        isOpen={showContactSupport}
        onClose={() => setShowContactSupport(false)}
        userEmail={session?.user?.email}
      />
      <CheckInModal
        isOpen={showCheckIn}
        onClose={() => {
          setShowCheckIn(false)
          setCurrentCheckInId(null)
        }}
        checkInId={currentCheckInId || undefined}
        onComplete={handleCheckInComplete}
      />
      {showCheckInSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-2xl w-full mx-4">
            <CheckInSetup
              onComplete={handleCheckInSetup}
              onClose={() => setShowCheckInSetup(false)}
              initialSettings={{
                frequency: (settings as any).checkInFrequency || 'daily',
                time: (settings as any).checkInTime || '09:00',
                days: (settings as any).checkInDays ? JSON.parse((settings as any).checkInDays) : ['Monday']
              }}
            />
          </div>
        </div>
      )}
      <div className={`${showChat ? 'flex h-screen' : 'max-w-6xl mx-auto p-4 py-8 sm:py-12'}`}>
        {/* Main Dashboard Content */}
        <div className={`${showChat ? 'w-1/2 p-4 py-8 sm:py-12 overflow-y-auto' : 'w-full'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('coach.backToDashboard')}
            </button>
            <LanguageSelector />
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {t('coach.yourAiLifeCoach')}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FocusIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-gray-600">{focusAreaNames[coachData.user.focus_area]}</span>
                </div>
                {coachData.user.subscription_status === 'trial' && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
{coachData.user.trial_days_left} {t('coach.daysLeftInTrial')}
                  </div>
                )}
                {coachData.user.subscription_status === 'active' && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
{t('coach.activeSubscription')}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Settings className="h-4 w-4 mr-2" />
{t('coach.settings')}
              </button>
              <button
                onClick={() => setShowChat(true)}
                className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
{t('coach.chatWithCoach')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Coach Configuration */}
            {coachPreferences && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Settings className="h-6 w-6 text-gray-600 mr-3" />
{t('coach.coachConfiguration')}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {showCoachConfig && (
                      <button
                        onClick={async () => {
                          if (editingCoachConfig) {
                            // Save changes
                            try {
                              const response = await fetch(`/api/coach-preferences`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  preferences: coachPreferences,
                                  assessmentId: params.id
                                })
                              });
                              if (response.ok) {
                                console.log('Coach preferences saved successfully');
                              }
                            } catch (error) {
                              console.error('Error saving coach preferences:', error);
                            }
                          }
                          setEditingCoachConfig(!editingCoachConfig);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          editingCoachConfig 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
{editingCoachConfig ? t('common.save') : t('common.edit')}
                      </button>
                    )}
                    <button
                      onClick={() => setShowCoachConfig(!showCoachConfig)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      {showCoachConfig ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {showCoachConfig && (
                  <div className="space-y-8">
                    {editingCoachConfig ? (
                      /* Edit Mode - Minimalist */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Primary Focus</label>
                            <select
                              value={coachPreferences.primaryFocus}
                              onChange={(e) => setCoachPreferences((prev: any) => ({ ...prev, primaryFocus: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                            >
                              <option value="financial">Financial</option>
                              <option value="health">Health</option>
                              <option value="social">Social</option>
                              <option value="personal">Personal</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Secondary</label>
                            <select
                              value={coachPreferences.secondaryFocus || ''}
                              onChange={(e) => setCoachPreferences((prev: any) => ({ ...prev, secondaryFocus: e.target.value || null }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                            >
                              <option value="">None</option>
                              <option value="financial">Financial</option>
                              <option value="health">Health</option>
                              <option value="social">Social</option>
                              <option value="personal">Personal</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Style</label>
                            <select
                              value={coachPreferences.coachingStyle}
                              onChange={(e) => setCoachPreferences((prev: any) => ({ ...prev, coachingStyle: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                            >
                              <option value="supportive">Supportive</option>
                              <option value="analytical">Analytical</option>
                              <option value="direct">Direct</option>
                              <option value="encouraging">Encouraging</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Motivation</label>
                            <select
                              value={coachPreferences.motivationLevel}
                              onChange={(e) => setCoachPreferences((prev: any) => ({ ...prev, motivationLevel: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                            >
                              <option value="gentle">Gentle</option>
                              <option value="balanced">Balanced</option>
                              <option value="intense">Intense</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 pt-2">
                          <div className="flex items-center space-x-2">
                            <label className="text-xs text-gray-500">Daily:</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={coachPreferences.dailyTaskCount}
                              onChange={(e) => setCoachPreferences((prev: any) => ({ ...prev, dailyTaskCount: parseInt(e.target.value) }))}
                              className="w-12 p-1 border border-gray-300 rounded text-center text-gray-900 text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-xs text-gray-500">Weekly:</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={coachPreferences.weeklyTaskCount}
                              onChange={(e) => setCoachPreferences((prev: any) => ({ ...prev, weeklyTaskCount: parseInt(e.target.value) }))}
                              className="w-12 p-1 border border-gray-300 rounded text-center text-gray-900 text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-xs text-gray-500">Difficulty:</label>
                            <select
                              value={coachPreferences.taskDifficulty}
                              onChange={(e) => setCoachPreferences((prev: any) => ({ ...prev, taskDifficulty: e.target.value }))}
                              className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                            >
                              <option value="easy">Easy</option>
                              <option value="moderate">Moderate</option>
                              <option value="challenging">Challenging</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* View Mode - Clean Display */
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Focus Area</span>
                            <div className="text-lg font-semibold text-gray-900 capitalize">{coachPreferences.primaryFocus}</div>
                            {coachPreferences.secondaryFocus && (
                              <div className="text-sm text-gray-600">Secondary: {coachPreferences.secondaryFocus}</div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Coaching Style</span>
                            <div className="text-lg font-semibold text-gray-900 capitalize">{coachPreferences.coachingStyle}</div>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Task Frequency</span>
                            <div className="text-lg font-semibold text-gray-900">
                              {coachPreferences.dailyTaskCount} daily, {coachPreferences.weeklyTaskCount} weekly
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Motivation Level</span>
                            <div className="text-lg font-semibold text-gray-900 capitalize">{coachPreferences.motivationLevel}</div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Assessment-specific settings</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium capitalize">
                              {coachPreferences.taskDifficulty} difficulty
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('coach.yourProgress')}</h2>
                </div>
                <div className="text-sm text-gray-500">
{t('coach.lastUpdated')}: {new Date().toLocaleDateString()}
                </div>
              </div>
              
              <div className="grid sm:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userProgress?.streak.days || coachData.progress.currentStreak}</div>
                  <div className="text-sm text-gray-600">{t('coach.dayStreak')}</div>
                  <div className="text-xs text-gray-400 mt-1">
{userProgress?.streak.message || (coachData.progress.currentStreak > 7 ? t('coach.onFire') : t('coach.keepGoing'))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userProgress?.completionRate.percentage || 0}%
                  </div>
                  <div className="text-sm text-gray-600">{t('coach.completionRate')}</div>
                  <div className="text-xs text-gray-400 mt-1">
{userProgress?.completionRate.completed || 0}/{userProgress?.completionRate.total || 0} {t('coach.completed')}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userProgress?.currentScore.percentile || coachData.progress.thisWeekScore}</div>
                  <div className="text-sm text-gray-600">{t('coach.currentScore')}</div>
                  <div className="text-xs text-gray-400 mt-1">
{userProgress?.currentScore.percentile || coachData.progress.thisWeekScore}th {t('coach.percentile')}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userProgress?.currentScore.improvement !== undefined ? 
                      (userProgress.currentScore.improvement >= 0 ? '+' : '') + userProgress.currentScore.improvement : 
                      '+' + coachData.progress.improvement}
                  </div>
                  <div className="text-sm text-gray-600">Points Improved</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Since you started
                  </div>
                </div>
              </div>

              {/* Progress Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Daily Progress by Day */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Daily Progress by Day</h4>
                  <div className="space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                      if (!day) return null;
                      const dayShort = day.substring(0, 3);
                      const progress = (weeklyProgressByDay && weeklyProgressByDay[day]) ? weeklyProgressByDay[day] : 0;
                      const currentDay = new Date().getDay();
                      const isToday = index === (currentDay === 0 ? 6 : currentDay - 1); // Handle Sunday = 0 case
                      const isPastDay = index < (currentDay === 0 ? 6 : currentDay - 1);
                      const isFutureDay = index > (currentDay === 0 ? 6 : currentDay - 1);
                      
                      return (
                        <div key={day} className="flex items-center">
                          <div className={`w-8 text-xs ${isToday ? 'font-bold text-gray-900' : isPastDay ? 'text-gray-700' : 'text-gray-400'}`}>
                            {dayShort}
                          </div>
                          <div className="flex-1 mx-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isToday ? 'bg-gray-900' : 
                                  isPastDay ? 'bg-gray-600' : 
                                  isFutureDay ? 'bg-gray-300' : 'bg-gray-400'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className={`w-8 text-xs text-right ${
                            isToday ? 'text-gray-900 font-medium' : 
                            isPastDay ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {progress}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <span>Past days</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                        <span>Today</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span>Future</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Combined Weekly Task Progress */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">Combined Weekly Progress</h4>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {Math.round(combinedWeeklyProgress)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      All tasks for this week
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(combinedWeeklyProgress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                        <span className="text-gray-700">Weekly Tasks</span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {Math.round(actualWeeklyProgress)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        <span className="text-gray-700">Daily Goals (Week)</span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {weeklyDailyGoalsProgress}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    Combines all weekly tasks + daily goals for the entire week
                  </div>
                </div>
              </div>
            </div>

            {/* This Week's Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-gray-600 mr-3" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentWeek(prev => Math.max(1, prev - 1))}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        disabled={currentWeek <= 1}
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Week {currentWeek}: All Focus Areas
                      </h2>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            const allExpanded = Object.values(expandedAreas).every(expanded => expanded)
                            const newState = allExpanded ? false : true
                            setExpandedAreas({
                              financial: newState,
                              health: newState,
                              social: newState,
                              personal: newState
                            })
                          }}
                          className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          {Object.values(expandedAreas).every(expanded => expanded) ? 'Collapse All' : 'Expand All'}
                        </button>
                        <button
                          onClick={() => setShowTaskCreator(true)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                        >
                          + Create Tasks
                        </button>
                      </div>
                      <button
                        onClick={() => setCurrentWeek(prev => prev + 1)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Work on all areas of your life simultaneously
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(actualWeeklyProgress)}% Complete
                </div>
              </div>

              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gray-600 to-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${actualWeeklyProgress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {focusAreas.map((area) => {
                  const areaIcon = focusAreaIcons[area] || Star
                  const Icon = areaIcon
                  const areaName = focusAreaNames[area as keyof typeof focusAreaNames]
                  const areaTasks = area === 'other' 
                    ? getAllWeekTasks().filter(task => !['financial', 'health', 'social', 'personal'].includes(task.category))
                    : getAllWeekTasks().filter(task => task.category === area)
                  const completedTasks = areaTasks.filter(task => task.completed).length
                  
                  // Debug for all categories to see displayed vs counted (moved to useEffect to avoid spam)
                  
                  return (
                    <div key={area} className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Icon className="h-6 w-6 text-gray-600 mr-3" />
                          <h3 className="text-lg font-semibold text-gray-900">{areaName}</h3>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">
                            {completedTasks}/{areaTasks.length} completed
                          </span>
                          <button
                            onClick={() => toggleAreaExpanded(area)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title={expandedAreas[area] ? 'Collapse tasks' : 'Expand tasks'}
                          >
                            {expandedAreas[area] ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      {expandedAreas[area] && (
                        <div className="space-y-3">
                          {areaTasks.map((action) => {
                          const isCompleted = action.completed
                          return (
                            <div 
                              key={action.id} 
                              className={`p-3 rounded-lg border-2 transition-all group ${
                                isCompleted 
                                  ? 'border-gray-200 bg-gray-50' 
                                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start">
                                <div 
                                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all cursor-pointer ${
                                    isCompleted 
                                      ? 'bg-gray-900 text-white' 
                                      : 'border-2 border-gray-300 bg-white hover:border-gray-400'
                                  }`}
                                  onClick={() => toggleActionComplete(action.id)}
                                >
                                  {isCompleted && <CheckCircle className="h-4 w-4" />}
                                </div>
                                <div 
                                  className="flex-1 cursor-pointer"
                                  onClick={() => toggleActionComplete(action.id)}
                                >
                                  <div className={`font-semibold mb-1 transition-all ${
                                    isCompleted ? 'text-gray-800 line-through' : 'text-gray-900'
                                  }`}>
                                    {action.title}
                                  </div>
                                  <p className={`text-sm mb-2 transition-all ${
                                    isCompleted ? 'text-gray-700' : 'text-gray-600'
                                  }`}>
                                    {action.description}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {action.timeEstimate}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteWeeklyTask(action.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700"
                                  title="Delete task"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Completed Tasks View */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Completed Tasks</h2>
                </div>
                <button
                  onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {showCompletedTasks ? 'Hide' : 'Show'} Completed
                </button>
              </div>

              {showCompletedTasks && (
                <div className="space-y-6">
                  {/* Completed Weekly Tasks */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Weekly Tasks</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          {Math.round(actualWeeklyProgress)}% Complete
                        </span>
                        <button
                          onClick={() => setShowTaskCreator(true)}
                          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          + Add Task
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const completedWeeklyTasks = getCurrentWeekTasks().filter(task => 
                          task.completed
                        )
                        
                        if (completedWeeklyTasks.length === 0) {
                          return (
                            <p className="text-gray-500 text-sm py-3">No weekly tasks completed yet</p>
                          )
                        }
                        
                        return completedWeeklyTasks.map(task => (
                          <div key={task.id} className="group flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium">{task.title}</p>
                              <p className="text-gray-600 text-sm">{task.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600 text-xs">Week {currentWeek}</span>
                              <button
                                onClick={() => deleteWeeklyTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700"
                                title="Delete task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>

                  {/* Completed Daily Goals */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Daily Goals</h3>
                      <span className="text-sm text-gray-600">
                        {weeklyDailyGoalsProgress}% Complete (Week)
                      </span>
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const completedDailyGoals = dailyGoals.filter(goal => goal && goal.completed)
                        
                        if (completedDailyGoals.length === 0) {
                          return (
                            <p className="text-gray-500 text-sm py-3">No daily goals completed yet</p>
                          )
                        }
                        
                        return completedDailyGoals.map((goal, index) => (
                          <div key={goal.id || index} className="group flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium">{goal.title}</p>
                              <p className="text-gray-600 text-sm capitalize">{goal.category}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600 text-xs">Today</span>
                              <button
                                onClick={() => deleteDailyGoal(goal.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700"
                                title="Delete goal"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {getCurrentWeekTasks().filter(task => task.completed).length}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">Weekly Tasks</p>
                        <div className="text-xs font-medium text-green-600">
                          {Math.round(actualWeeklyProgress)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {dailyGoals.filter(goal => goal && goal.completed).length}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">Daily Goals Today</p>
                        <div className="text-xs font-medium text-blue-600">
                          {weeklyDailyGoalsProgress}% Week
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.round(combinedWeeklyProgress)}%
                        </p>
                        <p className="text-xs text-gray-600 mb-1">Overall Progress</p>
                        <div className="text-xs font-medium text-purple-600">
                          Combined
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-semibold text-gray-800">
                        Total: {
                          getCurrentWeekTasks().filter(task => task.completed).length +
                          dailyGoals.filter(goal => goal && goal.completed).length
                        } Tasks Completed This Week
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!showCompletedTasks && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    {getCurrentWeekTasks().filter(task => task.completed).length + 
                     dailyGoals.filter(goal => goal && goal.completed).length} total tasks completed
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Click "Show Completed" to view details</p>
                </div>
              )}
            </div>

            {/* Recent Achievements */}
            {coachData.recentAchievements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <Trophy className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Recent Achievements</h2>
                </div>
                
                <div className="grid gap-4">
                  {coachData.recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{achievement.title}</h3>
                          <p className="text-sm text-gray-700 mb-2">{achievement.description}</p>
                          <div className="text-xs text-gray-600">
                            Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Goals */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-gray-900">{formatDateForDisplay(selectedDate)}</h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={navigateToYesterday}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      title="Yesterday"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    {selectedDate.toDateString() !== new Date().toDateString() && (
                      <button
                        onClick={navigateToToday}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Go to Today"
                      >
                        Today
                      </button>
                    )}
                    <button
                      onClick={navigateToTomorrow}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      title="Tomorrow"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                </div>
              </div>
              <div className="space-y-3">
                {dailyGoals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">
                      {selectedDate.toDateString() === new Date().toDateString() 
                        ? "No goals set for today" 
                        : selectedDate > new Date()
                        ? `No goals planned for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        : `No goals were set for ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      }
                    </p>
                    {(selectedDate.toDateString() === new Date().toDateString() || isTomorrow()) && (
                      <button
                        onClick={() => setShowDailyTaskCreator(true)}
                        className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Create your first goal
                      </button>
                    )}
                  </div>
                ) : (
                  dailyGoals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className={`p-3 rounded-lg border transition-all group ${
                      goal.completed 
                        ? 'border-gray-200 bg-gray-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <div 
                        className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 transition-all cursor-pointer ${
                          goal.completed 
                            ? 'bg-gray-900 text-white' 
                            : 'border-2 border-gray-300 bg-white hover:border-gray-400'
                        }`}
                        onClick={() => toggleDailyGoal(goal.id)}
                      >
                        {goal.completed && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleDailyGoal(goal.id)}
                      >
                        <div className={`text-sm font-medium transition-all ${
                          goal.completed ? 'text-gray-800 line-through' : 'text-gray-900'
                        }`}>
                          {goal.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          {goal.category} focus
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteDailyGoal(goal.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700"
                        title="Delete goal"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  ))
                )}
              </div>
              {dailyGoals.length > 0 && (
                <div className="mt-4 text-center space-y-3">
                  <div className="text-xs text-gray-500">
                    {dailyGoals.filter(g => g.completed).length} of {dailyGoals.length} completed
                  </div>
                  {(selectedDate.toDateString() === new Date().toDateString() || isTomorrow()) && (
                    <button
                      onClick={() => setShowDailyTaskCreator(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Add a new daily goal
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Upcoming Check-ins */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Upcoming Check-ins</h3>
                <button
                  onClick={() => setShowCheckInSetup(true)}
                  className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                >
                  Edit Schedule
                </button>
              </div>
              <div className="space-y-3">
                {upcomingCheckIns.length > 0 ? (
                  upcomingCheckIns.slice(0, 3).map((checkin) => {
                    const isOverdue = new Date(checkin.scheduledFor) < new Date()
                    return (
                      <div key={checkin.id} className={`p-4 rounded-xl ${
                        isOverdue ? 'bg-gray-50 border border-gray-300' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 text-gray-600 mr-2" />
                            <span className="font-semibold text-gray-900 text-sm capitalize">
                              {checkin.type} Check-in
                            </span>
                          </div>
                          {isOverdue && (
                            <span className="text-xs text-gray-800 font-medium">Overdue</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {new Date(checkin.scheduledFor).toLocaleDateString()} at{' '}
                          {new Date(checkin.scheduledFor).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        {isOverdue && (
                          <button
                            onClick={() => {
                              setCurrentCheckInId(checkin.id)
                              setShowCheckIn(true)
                            }}
                            className="text-xs bg-gray-900 text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-all"
                          >
                            Complete Now
                          </button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-3">No check-ins scheduled</p>
                    <button
                      onClick={() => setShowCheckInSetup(true)}
                      className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                    >
                      Set Up Check-ins
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowJournal(true)}
                  className="w-full flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-all text-left"
                >
                  <Play className="h-4 w-4 text-gray-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Daily Journal</div>
                    <div className="text-xs text-gray-600">Reflect on your progress</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => router.push(`/report/${params.id}`)}
                  className="w-full flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-all text-left"
                >
                  <BarChart3 className="h-4 w-4 text-gray-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">View Full Report</div>
                    <div className="text-xs text-gray-600">Deep analysis & insights</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setShowGoals(true)}
                  className="w-full flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-all text-left"
                >
                  <Target className="h-4 w-4 text-gray-600 mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Set New Goals</div>
                    <div className="text-xs text-gray-600">Update your objectives</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-200 mb-4">
                Questions about your coaching plan or progress? We're here to help.
              </p>
              <button
                onClick={() => setShowContactSupport(true)}
                className="w-full bg-white text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Chat Panel - Right Half */}
        {showChat && (
          <div className="w-1/2 bg-white shadow-2xl flex flex-col border-l border-gray-200 h-screen">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI Life Coach</h3>
                  <p className="text-sm text-gray-600">Here to help you grow</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-gray-600 mb-4">Ask me about your progress, goals, or anything related to your personal development.</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setChatInput("How can I improve my lowest scoring area?")}
                      className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      "How can I improve my lowest scoring area?"
                    </button>
                    <button
                      onClick={() => setChatInput("What should I focus on this week?")}
                      className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      "What should I focus on this week?"
                    </button>
                    <button
                      onClick={() => setChatInput("I'm feeling stuck. Any advice?")}
                      className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      "I'm feeling stuck. Any advice?"
                    </button>
                  </div>
                </div>
              )}

              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="text-sm">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                        }}
                      >
                        {message.message}
                      </ReactMarkdown>
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-2xl bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
                  disabled={chatLoading}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Journal Modal */}
      {showJournal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Journal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Daily Journal</h3>
                  <p className="text-sm text-gray-600">Reflect on today's progress</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowJournal(false)
                  setJournalEntry('')
                  setJournalQuestion('')
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Journal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Today's Reflection</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-800 text-sm leading-relaxed">{journalQuestion}</p>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="journal-entry" className="block font-semibold text-gray-900 mb-2">
                  Your Thoughts
                </label>
                <textarea
                  id="journal-entry"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Take a moment to reflect on your day, progress, challenges, and insights..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={8}
                />
                <div className="text-xs text-gray-500 mt-2">
                  {journalEntry.length} characters
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h5 className="font-semibold text-gray-900 mb-2">💡 Journaling Tips</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be honest and authentic with your thoughts</li>
                  <li>• Focus on specific examples and experiences</li>
                  <li>• Consider what you learned and how you can improve</li>
                  <li>• Celebrate small wins and progress made</li>
                </ul>
              </div>
            </div>

            {/* Journal Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowJournal(false)
                    setJournalEntry('')
                    setJournalQuestion('')
                  }}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveJournalEntry}
                  disabled={!journalEntry.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Goals Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Personal Goals</h3>
                  <p className="text-sm text-gray-600">Set and track your objectives</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoals(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Goals Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Existing Goals */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Your Current Goals</h4>
                  {goals.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No goals set yet</p>
                      <p className="text-sm text-gray-500">Create your first goal to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full mb-2">
                                {goal.category}
                              </span>
                              <h5 className="font-semibold text-gray-900">{goal.title}</h5>
                            </div>
                            <button
                              onClick={() => removeGoal(goal.id)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          {goal.description && (
                            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {goal.target && <span>Target: {goal.target}</span>}
                            {goal.deadline && <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* New Goal Form */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Create New Goal</h4>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={newGoal.category}
                          onChange={(e) => setNewGoal(prev => ({...prev, category: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                        >
                          <option value="">Select a category</option>
                          <option value="Financial Health">Financial Health</option>
                          <option value="Physical Wellness">Physical Wellness</option>
                          <option value="Social Network">Social Network</option>
                          <option value="Personal Development">Personal Development</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                        <input
                          type="text"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal(prev => ({...prev, title: e.target.value}))}
                          placeholder="e.g., Save $5,000 for emergency fund"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                        <textarea
                          value={newGoal.description}
                          onChange={(e) => setNewGoal(prev => ({...prev, description: e.target.value}))}
                          placeholder="Describe your goal and why it's important to you..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target (optional)</label>
                        <input
                          type="text"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal(prev => ({...prev, target: e.target.value}))}
                          placeholder="e.g., $5,000, 10 lbs, 30 minutes daily"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (optional)</label>
                        <input
                          type="date"
                          value={newGoal.deadline}
                          onChange={(e) => setNewGoal(prev => ({...prev, deadline: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                        />
                      </div>

                      <button
                        onClick={saveGoal}
                        disabled={!newGoal.title.trim() || !newGoal.category}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Create Goal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Settings Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center mr-3">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Coaching Preferences</h3>
                  <p className="text-sm text-gray-600">Customize your coaching experience</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Notifications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-700">Push Notifications</label>
                        <p className="text-sm text-gray-600">Receive coaching reminders and updates</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({...prev, notifications: !prev.notifications}))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications ? 'bg-gray-900' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-700">Daily Reminders</label>
                        <p className="text-sm text-gray-600">Get reminded about daily actions</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({...prev, dailyReminders: !prev.dailyReminders}))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.dailyReminders ? 'bg-gray-900' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.dailyReminders ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-700">Weekly Reports</label>
                        <p className="text-sm text-gray-600">Receive weekly progress summaries</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({...prev, weeklyReports: !prev.weeklyReports}))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.weeklyReports ? 'bg-gray-900' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coaching Preferences */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Coaching Style</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Primary Focus Area</label>
                      <select
                        value={settings.focusArea}
                        onChange={(e) => setSettings(prev => ({...prev, focusArea: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                      >
                        <option value="financial">Financial Health</option>
                        <option value="health">Physical Wellness</option>
                        <option value="social">Social Network</option>
                        <option value="personal">Personal Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Coaching Style</label>
                      <select
                        value={settings.coachingStyle}
                        onChange={(e) => setSettings(prev => ({...prev, coachingStyle: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                      >
                        <option value="supportive">Supportive & Encouraging</option>
                        <option value="challenging">Direct & Challenging</option>
                        <option value="analytical">Data-Driven & Analytical</option>
                        <option value="motivational">High-Energy & Motivational</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Goal Setting Frequency</label>
                      <select
                        value={settings.goalFrequency}
                        onChange={(e) => setSettings(prev => ({...prev, goalFrequency: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                      >
                        <option value="daily">Daily Goals</option>
                        <option value="weekly">Weekly Goals</option>
                        <option value="monthly">Monthly Goals</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-2">Daily Reminder Time</label>
                      <input
                        type="time"
                        value={settings.reminderTime}
                        onChange={(e) => setSettings(prev => ({...prev, reminderTime: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Account */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">Subscription Status</span>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {coachData?.user.subscription_status === 'active' ? 'Active' : 'Trial'}
                      </span>
                    </div>
                    {coachData?.user.subscription_status === 'trial' && (
                      <p className="text-sm text-gray-600">
                        Trial ends in {coachData.user.trial_days_left} days
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl hover:from-gray-600 hover:to-gray-800 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Creator Modal */}
      {showTaskCreator && (
        <WeeklyTaskCreatorModal
          currentWeek={currentWeek.toString()}
          onClose={() => setShowTaskCreator(false)}
          onSubmit={async (tasksData) => {
            try {
              const promises = tasksData.tasks.map(task => 
                fetch('/api/tasks/user', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'weekly',
                    title: task.title,
                    description: task.description || task.title,
                    category: task.category,
                    priority: (task as any).priority || 'medium',
                    weekNumber: currentWeek,
                    estimatedMinutes: (task as any).estimatedMinutes || 30,
                    assessmentId: params.id
                  })
                })
              )
              
              const results = await Promise.all(promises)
              const failedTasks = results.filter(r => !r.ok)
              
              if (failedTasks.length === 0) {
                await loadWeeklyTasks()
                setShowTaskCreator(false)
              } else {
                // Log errors but don't show alert
                console.error(`Created ${results.length - failedTasks.length}/${results.length} tasks. Some failed to create.`)
              }
            } catch (error) {
              console.error('Error creating tasks:', error)
            }
          }}
        />
      )}


      {/* Daily Task Creator Modal */}
      {showDailyTaskCreator && (
        <DailyTaskCreatorModal
          onClose={() => setShowDailyTaskCreator(false)}
          onSubmit={createUserTask}
          initialDate={selectedDate}
        />
      )}
    </div>
  )
}

// Daily Task Creator Modal Component
function DailyTaskCreatorModal({ onClose, onSubmit, initialDate }: {
  onClose: () => void
  onSubmit: (taskData: any) => Promise<any>
  initialDate?: Date
}) {
  const [taskData, setTaskData] = useState({
    type: 'daily',
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    estimatedMinutes: 30,
    date: (initialDate || new Date()).toISOString().split('T')[0]
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskData.title.trim()) return

    setSubmitting(true)
    await onSubmit(taskData)
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Create Daily Task</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
              placeholder="Enter task title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
              placeholder="Describe the task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={taskData.category}
                onChange={(e) => setTaskData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
              >
                <option value="financial">Financial</option>
                <option value="health">Health</option>
                <option value="social">Social</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={taskData.date}
                onChange={(e) => setTaskData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Est. Minutes</label>
              <input
                type="number"
                value={taskData.estimatedMinutes}
                onChange={(e) => setTaskData(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) || 30 }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                min="5"
                max="480"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !taskData.title.trim()}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}