'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  Brain
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/dashboard')
      return
    }

    fetchUserAssessments()
    fetchUserSubscription()
  }, [session, status, router])

  const fetchUserAssessments = async () => {
    try {
      const response = await fetch('/api/user/assessments')
      if (response.ok) {
        const data = await response.json()
        setAssessments(data.assessments)
      }
    } catch (error) {
      console.error('Error fetching assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSubscription = async () => {
    try {
      // Check if user has any subscription by finding their most recent assessment
      const response = await fetch('/api/user/assessments')
      if (response.ok) {
        const data = await response.json()
        if (data.assessments && data.assessments.length > 0) {
          const latestAssessment = data.assessments[0]
          // Try to check if this assessment has AI coach access
          const coachResponse = await fetch(`/api/coach/${latestAssessment.id}`)
          if (coachResponse.ok) {
            const coachData = await coachResponse.json()
            if (coachData.subscription && coachData.subscription.status === 'active') {
              setSubscription({
                status: 'active',
                product: 'ai_coach_monthly',
                periodEnd: coachData.subscription.periodEnd
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              RankMe
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-900 font-medium">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-gray-600">
            Track your life performance and continue your improvement journey.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-bold text-gray-900">Assessments</h3>
                <p className="text-2xl font-bold text-gray-900">{completedAssessments.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Total completed</p>
          </div>

          {latestAssessment && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Trophy className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <h3 className="font-bold text-gray-900">Latest Score</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(latestAssessment.scoreOverall?.overall || 0)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Out of 100</p>
            </div>
          )}

          {latestAssessment && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <h3 className="font-bold text-gray-900">Percentile</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(latestAssessment.scoreOverall?.percentileOverall || 0)}th
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Among peers</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-bold text-gray-900">Member Since</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(session.user.createdAt || Date.now()).getFullYear()}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Year joined</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Assessments</h2>
                <Link
                  href="/assessment"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="text-sm font-medium">Take New Assessment</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {completedAssessments.length > 0 ? (
                <div className="space-y-4">
                  {completedAssessments.slice(0, 5).map((assessment) => (
                    <div key={assessment.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Life Assessment</h3>
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
                          <Link
                            href={`/scorecard/${assessment.id}`}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            View Results
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments yet</h3>
                  <p className="text-gray-600 mb-4">
                    Take your first life assessment to get started with tracking your performance.
                  </p>
                  <Link
                    href="/assessment"
                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Take Assessment
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
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/assessment"
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  New Assessment
                </Link>
                {subscription?.status === 'active' && completedAssessments.length > 0 ? (
                  <Link
                    href={`/coach/${completedAssessments[0].id}`}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    <Brain className="h-5 w-5 mr-2" />
                    AI Coach Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/pricing"
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <Star className="h-5 w-5 mr-2" />
                    Upgrade Account
                  </Link>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Account</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{session.user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="text-sm font-medium text-gray-900">
                    {subscription?.status === 'active' ? 'AI Coach Pro' : 'Free'}
                  </span>
                </div>
                <button className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get support or learn more about improving your life score.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center text-gray-900 hover:underline"
              >
                <Mail className="h-4 w-4 mr-1" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}