'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatPercentile } from '@/lib/utils'
import { 
  Download, TrendingUp, Target, Calendar, ArrowLeft, Share2,
  DollarSign, Heart, Users, Award, BarChart3, CheckCircle, Star
} from 'lucide-react'

interface DetailedScoreData {
  assessment_id: string
  cohort: {
    age_band: string
    sex: string
    region: string
  }
  overall: {
    score_0_100: number
    percentile: number
  }
  categories: Array<{
    id: string
    name: string
    percentile: number
    score: number
    strengths: string[]
    opportunities: string[]
    recommendations: string[]
  }>
  peerComparison: {
    betterThan: number
    similarTo: number
    category: string
  }
  actionPlan: Array<{
    week: number
    focus: string
    actions: string[]
    timeCommitment: string
  }>
}

export default function DetailedReportPage() {
  const params = useParams()
  const router = useRouter()
  const [reportData, setReportData] = useState<DetailedScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDetailedReport()
  }, [params.id])

  const fetchDetailedReport = async () => {
    try {
      const response = await fetch(`/api/report/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else if (response.status === 402) {
        // Payment required - redirect to paywall
        router.push(`/paywall/report/${params.id}`)
        return
      } else {
        setError(`Failed to load report: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      setError('Error fetching report data')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/report/${params.id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `rankme-report-${params.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
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
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-600 mb-4 font-medium">{error}</p>
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

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Report data not found</p>
      </div>
    )
  }

  const categoryIcons: { [key: string]: any } = {
    financial: DollarSign,
    health_fitness: Heart,
    social: Users,
    romantic: TrendingUp
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Exceptional', color: 'text-gray-900' }
    if (score >= 75) return { level: 'Excellent', color: 'text-gray-800' }
    if (score >= 60) return { level: 'Good', color: 'text-gray-700' }
    if (score >= 40) return { level: 'Fair', color: 'text-gray-600' }
    return { level: 'Needs Attention', color: 'text-gray-500' }
  }

  const overallLevel = getScoreLevel(reportData.overall.percentile)

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
                Deep Life Analysis Report
              </h1>
              <p className="text-gray-600">
                Comprehensive insights and personalized recommendations
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0">
              <button
                onClick={() => alert('Share feature coming soon!')}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Executive Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Award className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
              </div>
              
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white mb-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {Math.round(reportData.overall.score_0_100)}
                    </div>
                    <div className="text-gray-200">Overall Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {formatPercentile(reportData.overall.percentile)}
                    </div>
                    <div className="text-gray-200">Percentile Ranking</div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <div className="text-lg font-semibold">
                    {overallLevel.level} Performance
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Peer Comparison</h3>
                <p className="text-gray-700">
                  Your overall life score ranks higher than <strong>{reportData.peerComparison.betterThan}%</strong> of people in your demographic ({reportData.cohort.sex}, {reportData.cohort.age_band}, {reportData.cohort.region}). 
                  You're most similar to individuals in the {reportData.peerComparison.category} category.
                </p>
              </div>
            </div>

            {/* Detailed Category Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Category Deep Dive</h2>
              </div>

              <div className="space-y-8">
                {reportData.categories.map((category) => {
                  const IconComponent = categoryIcons[category.id] || TrendingUp
                  const level = getScoreLevel(category.percentile)
                  
                  return (
                    <div key={category.id} className="border-l-4 border-gray-200 pl-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 p-3 rounded-lg mr-4">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPercentile(category.percentile)}
                            </span>
                            <span className={`font-semibold ${level.color}`}>
                              {level.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">Strengths</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {category.strengths.map((strength, index) => (
                              <li key={index}>• {strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">Opportunities</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {category.opportunities.map((opportunity, index) => (
                              <li key={index}>• {opportunity}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">Quick Wins</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {category.recommendations.map((recommendation, index) => (
                              <li key={index}>• {recommendation}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 30-Day Action Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Calendar className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">30-Day Action Plan</h2>
              </div>

              <div className="space-y-6">
                {reportData.actionPlan.map((week) => (
                  <div key={week.week} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {week.week}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Week {week.week}: {week.focus}</h3>
                        <p className="text-sm text-gray-600">Time commitment: {week.timeCommitment}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {week.actions.map((action, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Report Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assessment Date</span>
                  <span className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Questions Analyzed</span>
                  <span className="font-semibold text-gray-900">32/32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Categories Covered</span>
                  <span className="font-semibold text-gray-900">4 Areas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Peer Group Size</span>
                  <span className="font-semibold text-gray-900">10,000+</span>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Key Insights</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900 text-sm">Top Performer</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    You excel in {reportData.categories.reduce((max, cat) => 
                      cat.percentile > max.percentile ? cat : max
                    ).name.toLowerCase()}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Target className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900 text-sm">Focus Area</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Biggest opportunity in {reportData.categories.reduce((min, cat) => 
                      cat.percentile < min.percentile ? cat : min
                    ).name.toLowerCase()}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900 text-sm">Growth Potential</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Following the action plan could improve your overall score by 15-25 points
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">Want Ongoing Support?</h3>
              <p className="text-sm text-gray-200 mb-4">
                Get personalized coaching and weekly action plans with our AI Life Coach.
              </p>
              <button
                onClick={() => router.push(`/paywall/coach/${params.id}`)}
                className="w-full bg-white text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm"
              >
                Upgrade to AI Coach - $19/mo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}