'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatPercentile } from '@/lib/utils'
import { 
  Calendar, MessageSquare, TrendingUp, Target, Award, Clock, 
  ArrowLeft, Settings, Star, CheckCircle, Play, Users,
  DollarSign, Heart, BarChart3, Zap, Trophy
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

  useEffect(() => {
    fetchCoachData()
  }, [params.id])

  const fetchCoachData = async () => {
    try {
      const response = await fetch(`/api/coach/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCoachData(data)
      } else if (response.status === 402) {
        // Payment required - redirect to paywall
        router.push(`/paywall/coach/${params.id}`)
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

  const toggleActionComplete = async (actionId: string) => {
    try {
      const response = await fetch(`/api/coach/${params.id}/actions/${actionId}`, {
        method: 'PATCH'
      })
      if (response.ok) {
        // Refresh data
        fetchCoachData()
      }
    } catch (error) {
      console.error('Error updating action:', error)
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

  const focusAreaNames: { [key: string]: string } = {
    financial: 'Financial Growth',
    health: 'Health & Fitness',
    social: 'Social Network', 
    personal: 'Personal Development'
  }

  const FocusIcon = focusAreaIcons[coachData.user.focus_area] || Star

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 py-8 sm:py-12">
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
                onClick={() => alert('Settings coming soon!')}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button
                onClick={() => alert('Chat feature coming soon!')}
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
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
              </div>
              
              <div className="grid sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-8 w-8 text-gray-700" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{coachData.progress.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((coachData.progress.completedActions / coachData.progress.totalActions) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{coachData.progress.thisWeekScore}</div>
                  <div className="text-sm text-gray-600">This Week Score</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">+{coachData.progress.improvement}</div>
                  <div className="text-sm text-gray-600">Points Improved</div>
                </div>
              </div>
            </div>

            {/* This Week's Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Week {coachData.currentWeekPlan.week}: {coachData.currentWeekPlan.focus}</h2>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(coachData.currentWeekPlan.completionRate * 100)}% Complete
                </div>
              </div>

              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gray-600 to-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${coachData.currentWeekPlan.completionRate * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {coachData.currentWeekPlan.actions.map((action) => (
                  <div 
                    key={action.id} 
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      action.completed 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => toggleActionComplete(action.id)}
                  >
                    <div className="flex items-start">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-all ${
                        action.completed 
                          ? 'bg-green-500 text-white' 
                          : 'border-2 border-gray-300 bg-white hover:border-gray-400'
                      }`}>
                        {action.completed && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold mb-1 transition-all ${
                          action.completed ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {action.title}
                        </div>
                        <p className={`text-sm mb-2 transition-all ${
                          action.completed ? 'text-green-700' : 'text-gray-600'
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
                ))}
              </div>
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
            {/* Upcoming Check-ins */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
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
                  onClick={() => alert('Journal feature coming soon!')}
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
                  onClick={() => alert('Goal setting feature coming soon!')}
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
    </div>
  )
}