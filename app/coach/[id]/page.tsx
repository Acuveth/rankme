'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatPercentile } from '@/lib/utils'
import { 
  Calendar, MessageSquare, TrendingUp, Target, Award, Clock, 
  ArrowLeft, Settings, Star, CheckCircle, Play, Users,
  DollarSign, Heart, BarChart3, Zap, Trophy, ChevronDown, ChevronUp
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
  const [coachData, setCoachData] = useState<CoachData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'coach', message: string, timestamp: Date}>>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [journalEntry, setJournalEntry] = useState('')
  const [journalQuestion, setJournalQuestion] = useState('')
  const [showGoals, setShowGoals] = useState(false)
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
    financial: true,
    health: true,
    social: true,
    personal: true
  })
  const [combinedWeeklyProgress, setCombinedWeeklyProgress] = useState(0)
  const [currentWeek, setCurrentWeek] = useState(1)
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
  
  const focusAreas = ['financial', 'health', 'social', 'personal']
  const focusAreaNames = {
    financial: 'Financial Health',
    health: 'Physical Wellness', 
    social: 'Social Network',
    personal: 'Personal Development'
  }

  useEffect(() => {
    fetchCoachData()
    loadProgressData()
    loadUserProgress()
    loadWeeklyTasks()
  }, [params.id, currentWeek])

  const loadProgressData = async () => {
    try {
      // Load daily goals
      const today = new Date().toISOString().split('T')[0]
      const dailyResponse = await fetch(`/api/progress?type=daily&date=${today}`)
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json()
        if (dailyData.tasks && dailyData.tasks.length > 0) {
          const dbDailyGoals = dailyData.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            category: task.category
          }))
          setDailyGoals(dbDailyGoals)
        }
      }

      // Load weekly tasks progress
      const weeklyResponse = await fetch(`/api/progress?type=weekly`)
      if (weeklyResponse.ok) {
        const weeklyData = await weeklyResponse.json()
        if (weeklyData.tasks && weeklyData.tasks.length > 0) {
          const weeklyProgressMap: {[key: string]: boolean} = {}
          weeklyData.tasks.forEach((task: any) => {
            const taskKey = `${task.category}-week-${task.week}-task-${task.id}`
            weeklyProgressMap[taskKey] = task.completed
          })
          setWeeklyProgress(weeklyProgressMap)
          
          // Calculate actual weekly progress
          const completedTasks = weeklyData.tasks.filter((task: any) => task.completed).length
          const totalTasks = weeklyData.tasks.length
          setActualWeeklyProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0)
        }
      }

      // Load journal entries
      const journalResponse = await fetch('/api/progress?type=journal&limit=5')
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
      const response = await fetch('/api/user-progress')
      if (response.ok) {
        const progressData = await response.json()
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
      
      // Initialize weekly progress tracking for current week, but don't overwrite existing progress
      const currentFocusArea = focusAreas[(currentWeek - 1) % focusAreas.length]
      const currentWeekTaskIds = getWeeklyTasksForArea(currentFocusArea).map((_, index) => 
        `${currentFocusArea}-week-${currentWeek}-task-${index}`
      )
      
      // Load existing weekly progress from database
      const loadWeeklyProgress = async () => {
        try {
          const response = await fetch(`/api/progress?type=weekly&week=${currentWeek}&category=${currentFocusArea}`)
          if (response.ok) {
            const data = await response.json()
            const weeklyProgressMap: {[key: string]: boolean} = {}
            
            // Get frontend task definitions to match by title
            const frontendTasks = getWeeklyTasksForArea(currentFocusArea)
            
            // Map database tasks to UI task IDs by matching titles
            if (data.tasks && Array.isArray(data.tasks)) {
              frontendTasks.forEach((frontendTitle: string, frontendIndex: number) => {
                const taskId = `${currentFocusArea}-week-${currentWeek}-task-${frontendIndex}`
                
                // Find matching database task by title
                const matchingDbTask = data.tasks.find((dbTask: any) => dbTask.title === frontendTitle)
                
                if (matchingDbTask) {
                  weeklyProgressMap[taskId] = matchingDbTask.completed
                } else {
                  // If no matching task found, default to false
                  weeklyProgressMap[taskId] = false
                }
              })
            }
            
            setWeeklyProgress(prev => ({ ...prev, ...weeklyProgressMap }))
          }
        } catch (error) {
          console.error('Error loading weekly progress:', error)
        }
      }
      
      loadWeeklyProgress()
      
      // Initialize any missing tasks to false
      setWeeklyProgress(prev => {
        const newProgress = { ...prev }
        currentWeekTaskIds.forEach(taskId => {
          if (newProgress[taskId] === undefined) {
            newProgress[taskId] = false
          }
        })
        return newProgress
      })
      
      // Calculate actual weekly progress (0% initially)
      setActualWeeklyProgress(0)
      
      // Initialize daily goals based on focus area
      const focusArea = coachData.user.focus_area
      const todayGoals = [
        {
          id: `daily-${Date.now()}-1`,
          title: getTodayGoalForArea(focusArea, 1),
          completed: false,
          category: focusArea
        },
        {
          id: `daily-${Date.now()}-2`, 
          title: getTodayGoalForArea(focusArea, 2),
          completed: false,
          category: focusArea
        }
      ]
      setDailyGoals(todayGoals)
    }
  }, [coachData, currentWeek])

  // Update completion percentage when weeklyProgress changes
  useEffect(() => {
    if (coachData) {
      const currentWeekTasks = getCurrentWeekTasks()
      const completedCount = currentWeekTasks.filter(task => weeklyProgress[task.id] ?? false).length
      const totalCount = currentWeekTasks.length
      const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
      
      setActualWeeklyProgress(completionPercentage)
      
      // Only update progress numbers if they've actually changed to avoid loops
      if (coachData.progress.completedActions !== completedCount || coachData.progress.totalActions !== totalCount) {
        setCoachData(prev => prev ? {
          ...prev,
          progress: {
            ...prev.progress,
            completedActions: completedCount,
            totalActions: totalCount
          }
        } : prev)
      }
    }
  }, [weeklyProgress, currentWeek])

  // Load daily goal completion for each day of the current week
  useEffect(() => {
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
        
        await Promise.all(daysOfWeek.map(async (day, index) => {
          const dayDate = new Date(weekStart)
          dayDate.setDate(weekStart.getDate() + index)
          const dateString = dayDate.toISOString().split('T')[0]
          
          const currentDayIndex = (today.getDay() + 6) % 7 // Convert to Monday-based (0 = Monday)
          
          if (index < currentDayIndex) {
            // Past days - load actual completion from database
            try {
              const response = await fetch(`/api/progress?type=daily&date=${dateString}`)
              if (response.ok) {
                const data = await response.json()
                if (data.tasks && data.tasks.length > 0) {
                  const completed = data.tasks.filter((t: any) => t.completed).length
                  const total = data.tasks.length
                  progressByDay[day] = total > 0 ? Math.round((completed / total) * 100) : 0
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
          } else if (index === currentDayIndex) {
            // Today - use current daily goals state
            const dailyGoalCompletion = Array.isArray(dailyGoals) && dailyGoals.length > 0 ? 
              (dailyGoals.filter(g => g && g.completed).length / dailyGoals.length) : 0
            progressByDay[day] = Math.round(dailyGoalCompletion * 100)
          } else {
            // Future days
            progressByDay[day] = 0
          }
        }))
        
        setWeeklyProgressByDay(progressByDay)
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
      }
    }

    loadWeeklyDailyProgress()
  }, [dailyGoals])

  // Calculate combined weekly progress (weekly tasks + all daily tasks for the week)
  useEffect(() => {
    const calculateCombinedProgress = async () => {
      try {
        const today = new Date()
        
        // Calculate the start of the current week (Monday)
        const currentDayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = currentDayOfWeek === 0 ? -6 : -(currentDayOfWeek - 1)
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() + mondayOffset)
        
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6) // Sunday
        
        // Get all weekly tasks for current week
        const currentWeekTasks = getCurrentWeekTasks()
        const weeklyTasksCompleted = currentWeekTasks.filter(task => weeklyProgress[task.id] ?? false).length
        const weeklyTasksTotal = currentWeekTasks.length
        
        // Get all daily tasks for the entire week
        let dailyTasksCompleted = 0
        let dailyTasksTotal = 0
        
        // Check each day of the current week
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const dayDate = new Date(weekStart)
          dayDate.setDate(weekStart.getDate() + dayOffset)
          const dateString = dayDate.toISOString().split('T')[0]
          
          try {
            const response = await fetch(`/api/progress?type=daily&date=${dateString}`)
            if (response.ok) {
              const data = await response.json()
              if (data.tasks && data.tasks.length > 0) {
                dailyTasksTotal += data.tasks.length
                dailyTasksCompleted += data.tasks.filter((t: any) => t.completed).length
              }
            }
          } catch (error) {
            console.error(`Error loading daily tasks for ${dateString}:`, error)
          }
        }
        
        // Include today's daily goals in the count (might overlap with API data, but we'll handle that)
        if (Array.isArray(dailyGoals) && dailyGoals.length > 0) {
          // Add today's goals to the total (these might already be in the API data, but this ensures live updates)
          const todayCompleted = dailyGoals.filter(g => g && g.completed).length
          const todayTotal = dailyGoals.length
          
          // We'll use today's live data instead of API data for today
          const todayString = today.toISOString().split('T')[0]
          dailyTasksCompleted += todayCompleted
          dailyTasksTotal += todayTotal
        }
        
        // Calculate combined completion percentage
        const totalCompleted = weeklyTasksCompleted + dailyTasksCompleted
        const totalTasks = weeklyTasksTotal + dailyTasksTotal
        const combinedPercentage = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0
        
        setCombinedWeeklyProgress(combinedPercentage)
        
        console.log('Combined Progress Calculation:', {
          weeklyTasks: `${weeklyTasksCompleted}/${weeklyTasksTotal}`,
          dailyTasks: `${dailyTasksCompleted}/${dailyTasksTotal}`,
          combined: `${totalCompleted}/${totalTasks} = ${Math.round(combinedPercentage)}%`
        })
        
      } catch (error) {
        console.error('Error calculating combined weekly progress:', error)
        setCombinedWeeklyProgress(0)
      }
    }

    calculateCombinedProgress()
  }, [weeklyProgress, dailyGoals, currentWeek])

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
          financial: "How did you manage your finances today? What progress did you make toward your financial goals?",
          health: "How did you take care of your health today? What healthy choices did you make?", 
          social: "How did you connect with others today? What social interactions brought you joy?",
          personal: "What did you learn about yourself today? How did you grow personally?"
        }
        setJournalQuestion(questions[coachData.user.focus_area])
      }
    }
  }, [coachData, showJournal, journalQuestion])

  const fetchCoachData = async () => {
    try {
      const response = await fetch(`/api/coach/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        
        // Load user settings to get focus area
        const settingsResponse = await fetch('/api/progress?type=settings')
        let userSettings = null
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          userSettings = settingsData.settings
        }
        
        // Transform API data to match component interface
        const transformedData = {
          user: {
            id: data.assessment.id,
            subscription_status: data.subscription.status === 'active' ? 'active' : 'trial' as 'active' | 'cancelled' | 'trial',
            focus_area: userSettings?.primaryFocus || getLowestCategory(data.assessment.categories),
            trial_days_left: Math.max(0, Math.floor((new Date(data.subscription.periodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
          },
          currentWeekPlan: {
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
          },
          progress: {
            currentStreak: 0,
            totalActions: 0,
            completedActions: 0,
            thisWeekScore: Math.round(data.assessment.overall.percentile),
            improvement: 0
          },
          upcomingCheckins: data.coaching.dailyCheckins.slice(0, 3).map((checkin: any, index: number) => ({
            id: `checkin-${index}`,
            type: 'daily',
            scheduledFor: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
            topic: checkin.question
          })),
          recentAchievements: [
            {
              id: 'achievement-1',
              title: 'First Week Complete!',
              description: 'You\'ve completed your first week of coaching',
              earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              icon: '🎉'
            }
          ]
        }
        setCoachData(transformedData)
      } else if (response.status === 403) {
        // No subscription - redirect to paywall
        router.push(`/paywall/coach/${params.id}`)
        return
      } else if (response.status === 401) {
        // Not logged in - redirect to login
        router.push(`/auth/signin?callbackUrl=/coach/${params.id}`)
        return
      } else {
        setError(`Failed to load coach data: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching coach data:', error)
      setError('Error fetching coach data')
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

  const getTodayGoalForArea = (area: string, goalNumber: number) => {
    const goalsByArea = {
      financial: [
        "Track one expense and categorize it",
        "Review your bank account balance",
        "Research one money-saving tip online"
      ],
      health: [
        "Take a 10-minute walk or stretch",
        "Drink an extra glass of water",
        "Plan one healthy meal for tomorrow"
      ],
      social: [
        "Send a message to check in on a friend",
        "Make eye contact and smile at 3 people today",
        "Share something positive on social media"
      ],
      personal: [
        "Spend 5 minutes in mindfulness or reflection",
        "Learn one new fact or skill",
        "Practice gratitude by listing 3 things you're thankful for"
      ]
    }
    
    const goals = goalsByArea[area as keyof typeof goalsByArea] || goalsByArea.personal
    return goals[(goalNumber - 1) % goals.length]
  }

  const getWeeklyTasksForArea = (area: string) => {
    const tasksByArea = {
      financial: [
        "Set up automatic savings transfer of $50/week",
        "Track all expenses for one week using an app", 
        "Research one investment option (index funds, ETFs, etc.)",
        "Calculate your net worth and create a simple spreadsheet",
        "Read one article about personal finance or budgeting"
      ],
      health: [
        "Take a 20-minute walk every day this week",
        "Prep healthy meals for 3 days in advance",
        "Drink 8 glasses of water daily and track it",
        "Go to bed 30 minutes earlier than usual",
        "Schedule one health checkup you've been postponing"
      ],
      social: [
        "Reach out to one old friend you haven't spoken to in months",
        "Join one new group or community (online or offline)",
        "Have one meaningful conversation with someone new",
        "Express gratitude to someone who has helped you recently",
        "Attend one social event or gathering this week"
      ],
      personal: [
        "Journal for 15 minutes daily about your goals and feelings",
        "Set one personal boundary and practice maintaining it",
        "Learn something new about yourself through reflection",
        "Practice one stress-management technique daily",
        "Identify and work toward one personal goal this week"
      ]
    }
    
    return tasksByArea[area as keyof typeof tasksByArea] || tasksByArea.personal
  }

  const getAllWeekTasks = () => {
    // If coach has created tasks, use those instead of default ones
    if (coachWeeklyTasks.length > 0) {
      return coachWeeklyTasks.map(task => ({
        ...task,
        completed: weeklyProgress[task.id] ?? false
      }))
    }
    
    // Otherwise use default tasks (fallback for backwards compatibility)
    const allTasks: Array<{id: string, title: string, description: string, completed: boolean, timeEstimate: string, category: string}> = []
    
    focusAreas.forEach(area => {
      const tasks = getWeeklyTasksForArea(area)
      tasks.forEach((task, index) => {
        allTasks.push({
          id: `${area}-week-${currentWeek}-task-${index}`,
          title: task,
          description: `Focus on improving your ${focusAreaNames[area as keyof typeof focusAreaNames].toLowerCase()} area`,
          completed: weeklyProgress[`${area}-week-${currentWeek}-task-${index}`] ?? false,
          timeEstimate: '15-30 min',
          category: area
        })
      })
    })
    
    return allTasks
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
        body: JSON.stringify(taskData)
      })

      if (response.ok) {
        const data = await response.json()
        alert('Task created successfully!')
        
        // Refresh the data
        if (taskData.type === 'weekly') {
          await loadWeeklyTasks()
        } else {
          await loadProgressData()
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
      alert('Failed to create task. Please try again.')
      return null
    }
  }

  const loadWeeklyTasks = async () => {
    try {
      const response = await fetch(`/api/progress?type=weekly&week=${currentWeek}`)
      if (response.ok) {
        const data = await response.json()
        if (data.tasks && data.tasks.length > 0) {
          const formattedTasks = data.tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            description: task.description || 'Coach-assigned task',
            completed: task.completed,
            timeEstimate: '15-30 min',
            category: task.category
          }))
          setCoachWeeklyTasks(formattedTasks)
        } else {
          // No coach-assigned tasks for this week
          setCoachWeeklyTasks([])
        }
      }
    } catch (error) {
      console.error('Error loading weekly tasks:', error)
    }
  }

  const toggleActionComplete = async (actionId: string) => {
    // Calculate new progress state first (declare outside try block for catch access)
    const currentCompleted = weeklyProgress[actionId] ?? false
    const newCompleted = !currentCompleted
    
    try {
      const currentWeekTasks = getCurrentWeekTasks()
      
      // Create new progress state with the clicked task updated
      const newWeeklyProgress = { ...weeklyProgress, [actionId]: newCompleted }
      
      // Update local state immediately for responsive UI
      setWeeklyProgress(newWeeklyProgress)
      
      // Recalculate weekly progress based on new state (not old closure)
      const completedCount = currentWeekTasks.filter(task => {
        if (task.id === actionId) return newCompleted
        return newWeeklyProgress[task.id] ?? false
      }).length
      const totalCount = currentWeekTasks.length
      const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
      
      setActualWeeklyProgress(completionPercentage)
      
      // Update coachData to reflect the change
      if (coachData) {
        const updatedCoachData = {
          ...coachData,
          currentWeekPlan: {
            ...coachData.currentWeekPlan,
            actions: coachData.currentWeekPlan.actions.map(action => 
              action.id === actionId ? { ...action, completed: newCompleted } : action
            ),
            completionRate: completionPercentage / 100
          },
          progress: {
            ...coachData.progress,
            completedActions: completedCount,
            totalActions: totalCount
          }
        }
        setCoachData(updatedCoachData)
      }

      // Save to database
      const taskInfo = currentWeekTasks.find(task => task.id === actionId)
      if (taskInfo) {
        const currentFocusArea = focusAreas[(currentWeek - 1) % focusAreas.length]
        
        const response = await fetch('/api/progress', {
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
        
        if (!response.ok) {
          throw new Error('Failed to save task to database')
        }
        
        // Refresh user progress after task completion
        await loadUserProgress()
      }
    } catch (error) {
      // Revert on error
      setWeeklyProgress(prev => ({
        ...prev,
        [actionId]: currentCompleted
      }))
      console.error('Error updating action:', error)
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
              settings: settings
            }
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const coachMessage = {
          id: `coach-${Date.now()}`,
          type: 'coach' as const,
          message: data.response.message,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, coachMessage])
      } else {
        const errorMessage = {
          id: `coach-error-${Date.now()}`,
          type: 'coach' as const,
          message: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending chat message:', error)
      const errorMessage = {
        id: `coach-error-${Date.now()}`,
        type: 'coach' as const,
        message: "I'm having trouble connecting right now. Please try again in a moment.",
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
            mood: null // Could add mood tracking later
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
      
      alert('Journal entry saved! Your thoughts have been recorded.')
      setJournalEntry('')
      setJournalQuestion('')
      setShowJournal(false)
    } catch (error) {
      console.error('Error saving journal entry:', error)
      alert('Error saving journal entry. Please try again.')
    }
  }

  const toggleDailyGoal = async (goalId: string) => {
    // Update local state immediately for responsive UI
    const updatedGoals = dailyGoals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    )
    setDailyGoals(updatedGoals)
    
    // Save to database
    const toggledGoal = updatedGoals.find(goal => goal.id === goalId)
    if (toggledGoal) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'daily_task',
            data: {
              title: toggledGoal.title,
              description: `Daily goal for ${toggledGoal.category}`,
              category: toggledGoal.category,
              date: new Date().toISOString().split('T')[0],
              completed: toggledGoal.completed
            }
          })
        })
        
        // Refresh user progress after daily goal completion
        await loadUserProgress()
      } catch (error) {
        console.error('Error saving daily goal:', error)
      }
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!coachData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Coach data not found</p>
      </div>
    )
  }

  const focusAreaIcons: { [key: string]: any } = {
    financial: DollarSign,
    health: Heart,
    social: Users,
    personal: Star
  }

  const FocusIcon = focusAreaIcons[coachData.user.focus_area] || Star

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${showChat ? 'flex h-screen' : 'max-w-6xl mx-auto p-4 py-8 sm:py-12'}`}>
        {/* Main Dashboard Content */}
        <div className={`${showChat ? 'w-1/2 p-4 py-8 sm:py-12 overflow-y-auto' : 'w-full'}`}>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scorecard
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Your AI Life Coach
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FocusIcon className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-gray-600">{focusAreaNames[coachData.user.focus_area]}</span>
                </div>
                {coachData.user.subscription_status === 'trial' && (
                  <div className="bg-orange-100 px-3 py-1 rounded-full text-sm font-medium text-orange-800">
                    {coachData.user.trial_days_left} days left in trial
                  </div>
                )}
                {coachData.user.subscription_status === 'active' && (
                  <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium text-green-800">
                    Active Subscription
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
                Settings
              </button>
              <button
                onClick={() => setShowChat(true)}
                className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Coach
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
              
              <div className="grid sm:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userProgress?.streak.days || coachData.progress.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {userProgress?.streak.message || (coachData.progress.currentStreak > 7 ? '🔥 On fire!' : 'Keep going!')}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userProgress?.completionRate.percentage || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {userProgress?.completionRate.completed || 0}/{userProgress?.completionRate.total || 0} completed
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userProgress?.currentScore.percentile || coachData.progress.thisWeekScore}</div>
                  <div className="text-sm text-gray-600">Current Score</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {userProgress?.currentScore.percentile || coachData.progress.thisWeekScore}th percentile
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-yellow-600" />
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
                          <div className={`w-8 text-xs ${isToday ? 'font-bold text-blue-600' : isPastDay ? 'text-gray-700' : 'text-gray-400'}`}>
                            {dayShort}
                          </div>
                          <div className="flex-1 mx-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isToday ? 'bg-blue-500' : 
                                  isPastDay ? 'bg-green-400' : 
                                  isFutureDay ? 'bg-gray-300' : 'bg-gray-400'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className={`w-8 text-xs text-right ${
                            isToday ? 'text-blue-600 font-medium' : 
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
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Past days</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Weekly Tasks</span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {Math.round(actualWeeklyProgress)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Daily Goals (Week)</span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {Array.isArray(dailyGoals) && dailyGoals.length > 0 
                          ? Math.round((dailyGoals.filter(g => g && g.completed).length / dailyGoals.length) * 100)
                          : 0}%
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
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
                  const areaTasks = getAllWeekTasks().filter(task => task.category === area)
                  const completedTasks = areaTasks.filter(task => task.completed).length
                  
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
                              className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                isCompleted 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                              }`}
                              onClick={() => toggleActionComplete(action.id)}
                            >
                              <div className="flex items-start">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'border-2 border-gray-300 bg-white hover:border-gray-400'
                                }`}>
                                  {isCompleted && <CheckCircle className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className={`font-semibold mb-1 transition-all ${
                                    isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
                                  }`}>
                                    {action.title}
                                  </div>
                                  <p className={`text-sm mb-2 transition-all ${
                                    isCompleted ? 'text-green-700' : 'text-gray-600'
                                  }`}>
                                    {action.description}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {action.timeEstimate}
                                  </div>
                                </div>
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
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekly Tasks</h3>
                    <div className="space-y-2">
                      {(() => {
                        const completedWeeklyTasks = getCurrentWeekTasks().filter(task => 
                          weeklyProgress[task.id] ?? task.completed
                        )
                        
                        if (completedWeeklyTasks.length === 0) {
                          return (
                            <p className="text-gray-500 text-sm py-3">No weekly tasks completed yet</p>
                          )
                        }
                        
                        return completedWeeklyTasks.map(task => (
                          <div key={task.id} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-green-800 font-medium">{task.title}</p>
                              <p className="text-green-600 text-sm">{task.description}</p>
                            </div>
                            <span className="text-green-600 text-xs">Week {currentWeek}</span>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>

                  {/* Completed Daily Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Goals</h3>
                    <div className="space-y-2">
                      {(() => {
                        const completedDailyGoals = dailyGoals.filter(goal => goal && goal.completed)
                        
                        if (completedDailyGoals.length === 0) {
                          return (
                            <p className="text-gray-500 text-sm py-3">No daily goals completed yet</p>
                          )
                        }
                        
                        return completedDailyGoals.map((goal, index) => (
                          <div key={goal.id || index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-blue-800 font-medium">{goal.title}</p>
                              <p className="text-blue-600 text-sm capitalize">{goal.category}</p>
                            </div>
                            <span className="text-blue-600 text-xs">Today</span>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {getCurrentWeekTasks().filter(task => weeklyProgress[task.id] ?? task.completed).length}
                        </p>
                        <p className="text-sm text-gray-600">Weekly Tasks Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {dailyGoals.filter(goal => goal && goal.completed).length}
                        </p>
                        <p className="text-sm text-gray-600">Daily Goals Completed</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-semibold text-gray-800">
                        Total: {
                          getCurrentWeekTasks().filter(task => weeklyProgress[task.id] ?? task.completed).length +
                          dailyGoals.filter(goal => goal && goal.completed).length
                        } Tasks Completed
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!showCompletedTasks && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    {getCurrentWeekTasks().filter(task => weeklyProgress[task.id] ?? task.completed).length + 
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
                    <div key={achievement.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold text-yellow-800 mb-1">{achievement.title}</h3>
                          <p className="text-sm text-yellow-700 mb-2">{achievement.description}</p>
                          <div className="text-xs text-yellow-600">
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
                <h3 className="font-bold text-gray-900">Today's Goals</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDailyTaskCreator(true)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                  >
                    + Add
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {dailyGoals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      goal.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => toggleDailyGoal(goal.id)}
                  >
                    <div className="flex items-start">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 transition-all ${
                        goal.completed 
                          ? 'bg-green-500 text-white' 
                          : 'border-2 border-gray-300 bg-white hover:border-gray-400'
                      }`}>
                        {goal.completed && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium transition-all ${
                          goal.completed ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {goal.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          {goal.category} focus
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-500">
                  {dailyGoals.filter(g => g.completed).length} of {dailyGoals.length} completed
                </div>
              </div>
            </div>

            {/* Upcoming Check-ins */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Upcoming Check-ins</h3>
              <div className="space-y-3">
                {coachData.upcomingCheckins.map((checkin) => (
                  <div key={checkin.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-900 text-sm capitalize">
                        {checkin.type} Check-in
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{checkin.topic}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(checkin.scheduledFor).toLocaleDateString()} at{' '}
                      {new Date(checkin.scheduledFor).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
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
                onClick={() => alert('Support coming soon!')}
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
                    <p className="text-sm leading-relaxed">{message.message}</p>
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
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-blue-800 text-sm leading-relaxed">{journalQuestion}</p>
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
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                                {goal.category}
                              </span>
                              <h5 className="font-semibold text-gray-900">{goal.title}</h5>
                            </div>
                            <button
                              onClick={() => removeGoal(goal.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (optional)</label>
                        <input
                          type="date"
                          value={newGoal.deadline}
                          onChange={(e) => setNewGoal(prev => ({...prev, deadline: e.target.value}))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                          settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
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
                          settings.dailyReminders ? 'bg-blue-500' : 'bg-gray-300'
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
                          settings.weeklyReports ? 'bg-blue-500' : 'bg-gray-300'
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create Weekly Tasks</h3>
              <button
                onClick={() => setShowTaskCreator(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">Create tasks for Week {currentWeek}. Tasks will be assigned to users for completion.</p>
              
              <div className="space-y-4">
                {focusAreas.map((area) => {
                  const Icon = focusAreaIcons[area] || Star
                  return (
                    <div key={area} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Icon className="h-5 w-5 text-gray-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">{focusAreaNames[area as keyof typeof focusAreaNames]}</h4>
                      </div>
                      
                      <textarea
                        placeholder={`Enter tasks for ${focusAreaNames[area as keyof typeof focusAreaNames]}, one per line`}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        rows={3}
                      />
                    </div>
                  )
                })}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTaskCreator(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Create Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Daily Task Creator Modal */}
      {showDailyTaskCreator && (
        <DailyTaskCreatorModal
          onClose={() => setShowDailyTaskCreator(false)}
          onSubmit={createUserTask}
        />
      )}
    </div>
  )
}

// Daily Task Creator Modal Component
function DailyTaskCreatorModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (taskData: any) => Promise<any>
}) {
  const [taskData, setTaskData] = useState({
    type: 'daily',
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    estimatedMinutes: 30,
    date: new Date().toISOString().split('T')[0]
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter task title..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="financial">Financial</option>
                <option value="health">Health</option>
                <option value="social">Social</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Est. Minutes</label>
              <input
                type="number"
                value={taskData.estimatedMinutes}
                onChange={(e) => setTaskData(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) || 30 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}