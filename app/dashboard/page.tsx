'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LoginTrackerComponent } from '@/components/LoginTracker'
import { useLanguage } from '@/lib/language-context'
import LanguageSelector from '@/components/LanguageSelector'
import PredictiveInsights from '@/components/PredictiveInsights'
import { 
  User, 
  LogOut, 
  BarChart3, 
  Calendar, 
  Trophy, 
  TrendingUp,
  ArrowRight,
  Settings,
  Mail,
  Star,
  Brain,
  FileText,
  X,
  Save,
  Eye,
  EyeOff,
  Flame,
  Clock,
  History
} from 'lucide-react'

interface Assessment {
  id: string
  createdAt: string
  status: string
  scoreOverall?: {
    overall: number
    percentileOverall: number
  }
}

interface UserSubscription {
  status: string
  product: string
  periodEnd: string
}

interface UserSettings {
  id: string
  name: string
  email: string
  country: string
  birthYear: number
  sexGender: string
  createdAt: string
  lastLogin: string
}

interface DailyTask {
  id: string
  title: string
  description?: string
  category: string
  completed: boolean
  date: string
  priority?: string
  estimatedMinutes?: number
}

interface WeeklyTask {
  id: string
  title: string
  description?: string
  category: string
  completed: boolean
  week: number
  priority?: string
  estimatedMinutes?: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  
  // Helper function to translate day of week
  const translateDayOfWeek = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      'Monday': t('dashboard.monday'),
      'Tuesday': t('dashboard.tuesday'),
      'Wednesday': t('dashboard.wednesday'),
      'Thursday': t('dashboard.thursday'),
      'Friday': t('dashboard.friday'),
      'Saturday': t('dashboard.saturday'),
      'Sunday': t('dashboard.sunday')
    }
    return dayMap[day] || day
  }
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [purchasedReports, setPurchasedReports] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    country: '',
    sexGender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [settingsSuccess, setSettingsSuccess] = useState('')
  const [loginStreak, setLoginStreak] = useState<{ currentStreak: number; longestStreak: number; totalLoginDays: number } | null>(null)
  const [loginAnalytics, setLoginAnalytics] = useState<{
    lastLoginTime: Date | null;
    loginPattern: string;
    averageTimeOfDay: string | null;
    recentLogins: Array<{
      date: string;
      time: string;
      dayOfWeek: string;
    }>;
  } | null>(null)
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/dashboard')
      return
    }

    // MEGA OPTIMIZATION: Batch all user data calls into a single request
    fetchAllUserData()
    // Batch auth data calls  
    fetchAuthData()
  }, [session, status, router])

  // Fetch tasks after assessments are loaded
  useEffect(() => {
    if (assessments.length > 0) {
      fetchUserTasks()
    }
  }, [assessments])

  // MEGA OPTIMIZATION: Batch all user data into a single API call
  const fetchAllUserData = async () => {
    try {
      const response = await fetch('/api/user?batch=assessments,subscription,purchases,settings')
      if (response.ok) {
        const batchData = await response.json()
        
        // Process assessments data
        if (batchData.assessments?.success) {
          setAssessments(batchData.assessments.assessments)
        }
        
        // Process subscription data  
        if (batchData.subscription && !batchData.subscription.error) {
          if (batchData.subscription.hasSubscription && batchData.subscription.subscription) {
            setSubscription({
              status: batchData.subscription.subscription.status,
              product: batchData.subscription.subscription.product,
              periodEnd: batchData.subscription.subscription.periodEnd
            })
          }
        }
        
        // Process purchases data
        if (batchData.purchases && !batchData.purchases.error) {
          const deepReportAssessmentIds = batchData.purchases.purchases
            ?.filter((purchase: any) => 
              (purchase.product === 'deep_report_oneoff' || purchase.product === 'deep_report') && 
              purchase.status === 'completed'
            )
            .map((purchase: any) => purchase.assessmentId) || []
          
          setPurchasedReports(new Set(deepReportAssessmentIds))
        }
        
        // Process settings data
        if (batchData.settings && !batchData.settings.error) {
          setUserSettings(batchData.settings.settings)
        }
      }
    } catch (error) {
      console.error('Error fetching batched user data:', error)
    } finally {
      setLoading(false)
    }
  }

  // MEGA OPTIMIZATION: Batch auth data into optimized calls
  const fetchAuthData = async () => {
    try {
      // Single call with analytics=true gives us both streak and analytics data
      const response = await fetch('/api/auth?action=history&analytics=true&days=30')
      if (response.ok) {
        const data = await response.json()
        
        // Set login streak data
        setLoginStreak({
          currentStreak: data.streak?.currentStreak || data.streak?.consecutiveLoginDays || 0,
          longestStreak: data.streak?.longestStreak || 0,
          totalLoginDays: data.streak?.totalLoginDays || 0
        })
        
        // Set login analytics data  
        setLoginAnalytics({
          lastLoginTime: data.lastLoginTime ? new Date(data.lastLoginTime) : null,
          loginPattern: data.loginPattern || 'No data',
          averageTimeOfDay: data.averageTimeOfDay,
          recentLogins: data.recentLogins || []
        })
      }
    } catch (error) {
      console.error('Error fetching auth data:', error)
    }
  }


  const fetchUserTasks = async () => {
    try {
      // Wait for assessments to be loaded first
      if (assessments.length === 0) return

      setTasksLoading(true)
      const latestAssessment = assessments.find(a => a.status === 'completed')
      if (!latestAssessment) {
        setTasksLoading(false)
        return
      }

      // Fetch daily tasks
      const dailyResponse = await fetch(`/api/tasks/daily?assessmentId=${latestAssessment.id}`)
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json()
        setDailyTasks(dailyData.tasks || [])
      }

      // Fetch weekly tasks
      const weeklyResponse = await fetch(`/api/tasks/weekly?assessmentId=${latestAssessment.id}`)
      if (weeklyResponse.ok) {
        const weeklyData = await weeklyResponse.json()
        setWeeklyTasks(weeklyData.tasks || [])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setTasksLoading(false)
    }
  }

  const toggleTaskCompletion = async (taskId: string, taskType: 'daily' | 'weekly', currentCompleted: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskType}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !currentCompleted,
          assessmentId: assessments.find(a => a.status === 'completed')?.id
        })
      })

      if (response.ok) {
        // Update local state
        if (taskType === 'daily') {
          setDailyTasks(prev => 
            prev.map(task => 
              task.id === taskId ? { ...task, completed: !currentCompleted } : task
            )
          )
        } else {
          setWeeklyTasks(prev => 
            prev.map(task => 
              task.id === taskId ? { ...task, completed: !currentCompleted } : task
            )
          )
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const initializeSettingsForm = (settingsData: any = userSettings) => {
    setSettingsForm({
      name: session?.user?.name || settingsData?.name || '',
      country: settingsData?.country || '',
      sexGender: settingsData?.sexGender || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsLoading(true)
    setSettingsError('')
    setSettingsSuccess('')

    // Validate password fields
    if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
      setSettingsError('New passwords do not match')
      setSettingsLoading(false)
      return
    }

    if (settingsForm.newPassword && !settingsForm.currentPassword) {
      setSettingsError('Current password is required to set a new password')
      setSettingsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user?type=settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: settingsForm.name,
          country: settingsForm.country,
          sexGender: settingsForm.sexGender,
          currentPassword: settingsForm.currentPassword || undefined,
          newPassword: settingsForm.newPassword || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setUserSettings(data.settings)
        setSettingsSuccess('Settings updated successfully!')
        setSettingsForm({
          ...settingsForm,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        // Trigger session update to reflect name change
        await fetch('/api/auth/session', { method: 'GET' })
        window.location.reload()
      } else {
        setSettingsError(data.error || 'Failed to update settings')
      }
    } catch (error) {
      setSettingsError('Error updating settings')
      console.error('Error updating settings:', error)
    } finally {
      setSettingsLoading(false)
    }
  }

  const openSettings = async () => {
    setShowSettings(true)
    // Fetch fresh settings data to ensure accuracy (preserving original functionality)
    try {
      const response = await fetch('/api/user?type=settings')
      if (response.ok) {
        const data = await response.json()
        const freshSettings = data.settings
        setUserSettings(freshSettings)
        initializeSettingsForm(freshSettings)
      } else {
        // Fallback to cached data if fresh fetch fails
        initializeSettingsForm(userSettings)
      }
    } catch (error) {
      console.error('Error fetching fresh settings:', error)
      // Fallback to cached data if fresh fetch fails
      initializeSettingsForm(userSettings)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const completedAssessments = assessments.filter(a => a.status === 'completed')
  const latestAssessment = completedAssessments[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginTrackerComponent />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              {t('header.title')}
            </Link>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-900 font-medium">
                  {session.user?.name || userSettings?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('header.signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcomeBack')}, {(session.user?.name || userSettings?.name)?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-600">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-bold text-gray-900">{t('dashboard.assessments')}</h3>
                <p className="text-2xl font-bold text-gray-900">{completedAssessments.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{t('dashboard.totalCompleted')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Flame className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-bold text-gray-900">{t('dashboard.dayStreak')}</h3>
                <p className="text-2xl font-bold text-gray-900">{loginStreak?.currentStreak || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {loginStreak?.currentStreak === 0 ? t('dashboard.startStreak') : 
               loginStreak?.currentStreak === 1 ? t('dashboard.greatStart') : 
               t('dashboard.daysInRow')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-bold text-gray-900">{t('dashboard.latestScore')}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {latestAssessment ? Math.round(latestAssessment.scoreOverall?.overall || 0) : '--'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{t('dashboard.outOf100')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-bold text-gray-900">{t('dashboard.percentile')}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {latestAssessment ? Math.round(latestAssessment.scoreOverall?.percentileOverall || 0) : '--'}th
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{t('dashboard.amongPeers')}</p>
          </div>

        </div>

        {/* Predictive Insights Section */}
        {completedAssessments.length > 0 && (
          <div className="mb-8">
            <PredictiveInsights 
              useAllAssessments={true}
              maxInsights={6}
              className="shadow-lg"
              showHeader={true}
              collapsible={true}
              defaultCollapsed={true}
            />
          </div>
        )}

        {/* Your Tasks Section */}
        {(dailyTasks.length > 0 || weeklyTasks.length > 0) && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.yourTasks')}</h2>
                {subscription?.status === 'active' && completedAssessments.length > 0 && (
                  <Link
                    href={`/coach/${completedAssessments[0].id}`}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span className="text-sm font-medium">{t('dashboard.viewAiCoach')}</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                )}
              </div>

              {tasksLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading tasks...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Daily Tasks */}
                  {dailyTasks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-gray-600" />
{t('dashboard.todaysTasks')} ({dailyTasks.filter(t => t.completed).length}/{dailyTasks.length})
                      </h3>
                      <div className="space-y-3">
                        {dailyTasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleTaskCompletion(task.id, 'daily', task.completed)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  task.completed 
                                    ? 'bg-gray-900 border-gray-900 text-white' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {task.completed && <span className="text-xs">✓</span>}
                              </button>
                              <div>
                                <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                  {task.title}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{task.category}</p>
                              </div>
                            </div>
                            {task.estimatedMinutes && (
                              <span className="text-xs text-gray-500">{task.estimatedMinutes}min</span>
                            )}
                          </div>
                        ))}
                        {dailyTasks.length > 5 && (
                          <p className="text-sm text-gray-500 text-center py-2">
                            +{dailyTasks.length - 5} more tasks
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Weekly Tasks */}
                  {weeklyTasks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-600" />
{t('dashboard.thisWeeksTasks')} ({weeklyTasks.filter(t => t.completed).length}/{weeklyTasks.length})
                      </h3>
                      <div className="space-y-3">
                        {weeklyTasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleTaskCompletion(task.id, 'weekly', task.completed)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  task.completed 
                                    ? 'bg-gray-900 border-gray-900 text-white' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {task.completed && <span className="text-xs">✓</span>}
                              </button>
                              <div>
                                <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                  {task.title}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{task.category}</p>
                              </div>
                            </div>
                            {task.estimatedMinutes && (
                              <span className="text-xs text-gray-500">{task.estimatedMinutes}min</span>
                            )}
                          </div>
                        ))}
                        {weeklyTasks.length > 5 && (
                          <p className="text-sm text-gray-500 text-center py-2">
                            +{weeklyTasks.length - 5} more tasks
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.yourAssessments')}</h2>
                <Link
                  href="/assessment"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="text-sm font-medium">{t('dashboard.takeNewAssessment')}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {completedAssessments.length > 0 ? (
                <div className="space-y-4">
                  {completedAssessments.map((assessment) => (
                    <div key={assessment.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{t('dashboard.lifeAssessment')}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(assessment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {assessment.scoreOverall && (
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                {Math.round(assessment.scoreOverall.overall)}/100
                              </p>
                              <p className="text-sm text-gray-600">
                                {Math.round(assessment.scoreOverall.percentileOverall)}th percentile
                              </p>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/scorecard/${assessment.id}`}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              {t('dashboard.viewResults')}
                            </Link>
                            <Link
                              href={purchasedReports.has(assessment.id) ? `/report/${assessment.id}` : `/paywall/report/${assessment.id}`}
                              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                                purchasedReports.has(assessment.id) 
                                  ? 'bg-gray-900 text-white hover:bg-gray-800' 
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              title={purchasedReports.has(assessment.id) ? 'View Your Deep Report' : 'Get Deep Analysis Report'}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {purchasedReports.has(assessment.id) ? t('dashboard.viewReport') : t('dashboard.deepReport')}
                            </Link>
                            {subscription?.status === 'active' ? (
                              <Link
                                href={`/coach/${assessment.id}`}
                                className="px-4 py-2 bg-gradient-to-t from-yellow-500 to-amber-400 text-white rounded-lg hover:from-yellow-600 hover:to-amber-500 transition-colors flex items-center shadow-lg"
                                title="Access AI Coach"
                              >
                                <Brain className="h-4 w-4 mr-1" />
                                {t('dashboard.aiCoach')}
                              </Link>
                            ) : (
                              <Link
                                href={`/paywall/coach/${assessment.id}`}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                                title="Upgrade to AI Coach"
                              >
                                <Star className="h-4 w-4 mr-1" />
                                {t('dashboard.getAiCoach')}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.noAssessmentsYet')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('dashboard.noAssessmentsDesc')}
                  </p>
                  <Link
                    href="/assessment"
                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {t('dashboard.takeAssessment')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('dashboard.quickActions')}</h3>
              <div className="space-y-3">
                <Link
                  href="/assessment"
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {t('dashboard.newAssessment')}
                </Link>
                {subscription?.status === 'active' && completedAssessments.length > 0 ? (
                  <Link
                    href={`/coach/${completedAssessments[0].id}`}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-t from-yellow-500 to-amber-400 text-white rounded-xl hover:from-yellow-600 hover:to-amber-500 transition-all shadow-lg"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    {t('dashboard.aiCoachDashboard')}
                  </Link>
                ) : completedAssessments.length > 0 ? (
                  <Link
                    href={`/paywall/coach/${completedAssessments[0].id}`}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <Star className="h-5 w-5 mr-2" />
                    {t('dashboard.upgradeToAiCoach')}
                  </Link>
                ) : (
                  <Link
                    href="/assessment?product=coach"
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <Star className="h-5 w-5 mr-2" />
                    {t('dashboard.takeAssessmentUpgrade')}
                  </Link>
                )}
              </div>
            </div>


            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('dashboard.account')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{t('dashboard.email')}</span>
                  <span className="text-sm font-medium text-gray-900">{session.user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{t('dashboard.plan')}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {subscription?.status === 'active' ? t('dashboard.aiCoachPro') : t('dashboard.free')}
                  </span>
                </div>
                {loginStreak && loginStreak.longestStreak > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">{t('dashboard.bestStreak')}</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                      <Flame className="h-3 w-3 text-gray-600 mr-1" />
                      {loginStreak.longestStreak} {t('dashboard.days')}
                    </span>
                  </div>
                )}
                {loginAnalytics && loginAnalytics.lastLoginTime && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">{t('dashboard.lastLogin')}</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                      <Clock className="h-3 w-3 text-gray-600 mr-1" />
                      {loginAnalytics.lastLoginTime.toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {loginAnalytics && loginAnalytics.loginPattern !== 'No data' && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">{t('dashboard.youAre')}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {loginAnalytics.loginPattern}
                    </span>
                  </div>
                )}
                <button 
                  onClick={openSettings}
                  className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t('dashboard.accountSettings')}
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            {loginAnalytics && loginAnalytics.recentLogins.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <History className="h-5 w-5 mr-2 text-gray-600" />
                  {t('dashboard.recentActivity')}
                </h3>
                <div className="space-y-3">
                  {loginAnalytics.recentLogins.slice(0, 5).map((login, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{translateDayOfWeek(login.dayOfWeek)}</p>
                          <p className="text-xs text-gray-600">{login.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{login.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {loginAnalytics.averageTimeOfDay && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      {t('dashboard.averageLoginTime')}: <span className="font-medium text-gray-900">{loginAnalytics.averageTimeOfDay}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Support */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">{t('dashboard.needHelp')}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.needHelpDesc')}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-gray-900 hover:underline"
              >
                <Mail className="h-4 w-4 mr-1" />
                {t('dashboard.contactSupport')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{t('settings.accountSettings')}</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSettingsSubmit} className="p-6 space-y-6">
              {/* Error and Success Messages */}
              {settingsError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {settingsError}
                </div>
              )}
              {settingsSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  {settingsSuccess}
                </div>
              )}

              {/* Profile Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.profileInformation')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.accountName')}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                      placeholder={t('settings.enterAccountName')}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('settings.accountNameDesc')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('dashboard.email')}
                    </label>
                    <input
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('settings.emailCannotChange')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.country')}
                    </label>
                    <select
                      value={settingsForm.country}
                      onChange={(e) => setSettingsForm({...settingsForm, country: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                    >
                      <option value="">{t('settings.selectCountry')}</option>
                      <option value="US">{t('countries.us')}</option>
                      <option value="UK">{t('countries.uk')}</option>
                      <option value="CA">{t('countries.ca')}</option>
                      <option value="AU">{t('countries.au')}</option>
                      <option value="DE">{t('countries.de')}</option>
                      <option value="FR">{t('countries.fr')}</option>
                      <option value="Other">{t('countries.other')}</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.gender')}
                    </label>
                    <select
                      value={settingsForm.sexGender}
                      onChange={(e) => setSettingsForm({...settingsForm, sexGender: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                    >
                      <option value="">{t('settings.selectGender')}</option>
                      <option value="Male">{t('settings.male')}</option>
                      <option value="Female">{t('settings.female')}</option>
                      <option value="Other">{t('settings.other')}</option>
                      <option value="PNTS">{t('settings.preferNotToSay')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('settings.changePassword')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.currentPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={settingsForm.currentPassword}
                        onChange={(e) => setSettingsForm({...settingsForm, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder={t('settings.enterCurrentPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.newPassword')}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={settingsForm.newPassword}
                          onChange={(e) => setSettingsForm({...settingsForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder={t('settings.enterNewPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.confirmPassword')}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={settingsForm.confirmPassword}
                          onChange={(e) => setSettingsForm({...settingsForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder={t('settings.confirmNewPassword')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t('settings.passwordFieldsDesc')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {t('settings.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {settingsLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('settings.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('settings.saveChanges')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}