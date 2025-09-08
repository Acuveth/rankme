'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { formatPercentile } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import { translateAPIContent, translateAPIContentArray } from '@/lib/api-content-translations'
import GaussianChart from '@/components/GaussianChart'
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
    questionInsights?: Array<{
      questionId: string
      questionText: string
      userAnswer: string
      score: number
      insight: string
      rawIndex: number
      totalOptions: number
    }>
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
  aiReport?: {
    executiveSummary: {
      overallAssessment: string
      keyStrengths: string[]
      primaryGrowthAreas: string[]
    }
    categoryAnalysis: {
      [key: string]: {
        strengthsAnalysis: string
        specificStrengths: string[]
        opportunitiesAnalysis: string
        specificOpportunities: string[]
        quickWins: string[]
      }
    }
    personalizedInsights: {
      crossCategoryPatterns: string
      surprisingFindings: string
      peerComparison: string
    }
    longTermStrategy: {
      primaryLimitingFactor: string
      threeMonthGoals: string[]
      oneYearGoals: string[]
      recommendedResources: string[]
    }
  }
}

export default function DetailedReportPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { t, language } = useLanguage()
  const [reportData, setReportData] = useState<DetailedScoreData | null>(null)

  // Helper function to translate category names
  const translateCategoryName = (categoryName: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Financial Health': t('scorecard.financialHealth'),
      'Physical Wellness': t('scorecard.physicalWellness'),
      'Health & Fitness': t('scorecard.physicalWellness'),
      'Social Network': t('scorecard.socialNetwork'),
      'Social Connections': t('scorecard.socialNetwork'),
      'Romantic': t('scorecard.romantic'),
      'Personal Growth': t('scorecard.personalGrowth'),
      'Career': t('assessment.career'),
      'Career Development': t('assessment.career')
    }
    return categoryMap[categoryName] || categoryName
  }

  // Helper function to translate performance levels
  const translatePerformanceLevel = (level: string): string => {
    const levelMap: { [key: string]: string } = {
      'Exceptional': t('scorecard.excellent'), // Using 'excellent' as closest match
      'Excellent': t('scorecard.excellent'),
      'Good': t('scorecard.good'),
      'Fair': t('scorecard.average'), // Using 'average' as closest match
      'Needs Attention': t('scorecard.needsImprovement')
    }
    return levelMap[level] || level
  }

  // Helper function to format percentile text
  const formatPercentileText = (percentile: number): string => {
    return `${percentile}${t('report.thPercentile')}`
  }

  // Helper function to format top percent text
  const formatTopPercentText = (percentile: number): string => {
    const topPercent = Math.round((100 - percentile))
    return `${t('report.topPercent')} ${topPercent}%`
  }

  // Helper function to translate dynamic API content using comprehensive translation database
  const translateDynamicContent = (text: string): string => {
    return translateAPIContent(text, language)
  }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [shareSvg, setShareSvg] = useState<string | null>(null)
  const [hasActiveCoachSubscription, setHasActiveCoachSubscription] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)

  useEffect(() => {
    fetchDetailedReport()
    if (session?.user?.email) {
      checkSubscriptionStatus()
    } else {
      setSubscriptionLoading(false)
    }
  }, [params.id, session])

  const checkSubscriptionStatus = async () => {
    if (!session?.user?.email) {
      setSubscriptionLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        
        // Check for active AI coach subscription in all subscriptions
        const hasActiveCoachSub = data.subscriptions?.some((sub: any) => 
          sub.product === 'ai_coach_monthly' && 
          sub.status === 'active' &&
          new Date(sub.periodEnd) > new Date()
        ) || false
        
        setHasActiveCoachSubscription(hasActiveCoachSub)
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    } finally {
      setSubscriptionLoading(false)
    }
  }

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

  const handleShare = async () => {
    if (!reportData) return
    
    setShareLoading(true)
    setShowShareModal(true)
    
    try {
      const response = await fetch('/api/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: params.id,
          format: 'instagram',
          isDeepReport: true
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setShareSvg(data.svgContent)
      } else {
        throw new Error('Failed to generate share graphic')
      }
    } catch (error) {
      console.error('Error generating share graphic:', error)
      alert('Failed to generate share graphic. Please try again.')
    } finally {
      setShareLoading(false)
    }
  }

  const downloadShareImage = () => {
    if (!shareSvg) return

    // Convert SVG to blob
    const blob = new Blob([shareSvg], { type: 'image/svg+xml' })
    const url = window.URL.createObjectURL(blob)
    
    // Create download link
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `rankme-deep-report-${params.id}.svg`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
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
            {t('report.backToHome')}
          </button>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">{t('report.reportDataNotFound')}</p>
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
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('report.backToDashboard')}
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {t('report.deepLifeAnalysisReport')}
              </h1>
              <p className="text-gray-600">
                {t('report.comprehensiveInsights')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0">
              <button
                onClick={handleShare}
                className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t('report.shareReport')}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('report.downloadPDF')}
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
                <h2 className="text-2xl font-bold text-gray-900">{t('report.executiveSummary')}</h2>
              </div>
              
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white mb-6">
                <div className="grid lg:grid-cols-2 gap-6 items-center">
                  <div className="text-center lg:text-left">
                    <div className="text-4xl font-bold mb-2">
                      {Math.round(reportData.overall.score_0_100)}
                    </div>
                    <div className="text-gray-200 mb-4">{t('report.overallScore')}</div>
                    <div className="text-lg font-semibold">
                      {translatePerformanceLevel(overallLevel.level)} {t('report.performance')}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <GaussianChart 
                      percentile={reportData.overall.percentile} 
                      title={t('report.overallPerformanceDistribution')}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">{t('report.peerComparison')}</h3>
                {reportData.aiReport?.personalizedInsights.peerComparison ? (
                  <p className="text-gray-700 mb-4">
                    {reportData.aiReport.personalizedInsights.peerComparison}
                  </p>
                ) : (
                  <p className="text-gray-700">
                    {t('report.peerComparisonText')} <strong>{reportData.peerComparison.betterThan}%</strong> {t('report.ofPeopleInYourDemographic')} ({reportData.cohort.sex}, {reportData.cohort.age_band}, {reportData.cohort.region}). 
                    {t('report.youAreMostSimilarTo')} {reportData.peerComparison.category}.
                  </p>
                )}
              </div>
              
              {/* Enhanced AI Executive Summary */}
              {reportData.aiReport?.executiveSummary && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-4">
                  <h3 className="font-semibold text-blue-900 mb-3">{t('report.personalizedInsights')}</h3>
                  <div className="text-blue-800 text-sm leading-relaxed">
                    {reportData.aiReport.executiveSummary.overallAssessment}
                  </div>
                  
                  {reportData.aiReport.executiveSummary.keyStrengths.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-blue-900 mb-2">{t('report.keyStrengths')}</h4>
                      <ul className="space-y-1">
                        {reportData.aiReport.executiveSummary.keyStrengths.map((strength, index) => (
                          <li key={index} className="text-blue-700 text-sm">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {reportData.aiReport.executiveSummary.primaryGrowthAreas.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-blue-900 mb-2">{t('report.primaryGrowthAreas')}</h4>
                      <ul className="space-y-1">
                        {reportData.aiReport.executiveSummary.primaryGrowthAreas.map((area, index) => (
                          <li key={index} className="text-blue-700 text-sm">• {area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detailed Category Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{t('report.categoryDeepDive')}</h2>
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
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{translateCategoryName(category.name)}</h3>
                          <div className={`font-semibold ${level.color} mt-1`}>
                            {translatePerformanceLevel(level.level)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <GaussianChart 
                          percentile={category.percentile} 
                          title={`${translateCategoryName(category.name)} ${t('report.performanceDistribution')}`}
                          width={360}
                          height={160}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">{t('report.strengths')}</h4>
                          {reportData.aiReport?.categoryAnalysis?.[category.id]?.strengthsAnalysis && (
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                              {translateDynamicContent(reportData.aiReport.categoryAnalysis[category.id].strengthsAnalysis)}
                            </p>
                          )}
                          <ul className="text-sm text-gray-700 space-y-1">
                            {(reportData.aiReport?.categoryAnalysis?.[category.id]?.specificStrengths || category.strengths).map((strength, index) => (
                              <li key={index}>• {translateDynamicContent(strength)}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">{t('report.opportunities')}</h4>
                          {reportData.aiReport?.categoryAnalysis?.[category.id]?.opportunitiesAnalysis && (
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                              {translateDynamicContent(reportData.aiReport.categoryAnalysis[category.id].opportunitiesAnalysis)}
                            </p>
                          )}
                          <ul className="text-sm text-gray-700 space-y-1">
                            {(reportData.aiReport?.categoryAnalysis?.[category.id]?.specificOpportunities || category.opportunities).map((opportunity, index) => (
                              <li key={index}>• {translateDynamicContent(opportunity)}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2">{t('report.quickWins')}</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {(reportData.aiReport?.categoryAnalysis?.[category.id]?.quickWins || category.recommendations).map((recommendation, index) => (
                              <li key={index}>• {translateDynamicContent(recommendation)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Detailed Question Analysis */}
                      {category.questionInsights && category.questionInsights.length > 0 && (
                        <div className="mt-8 bg-white rounded-xl border-2 border-gray-100 p-6">
                          <h4 className="font-bold text-gray-900 mb-4 text-lg">Individual Question Analysis</h4>
                          <div className="space-y-4">
                            {category.questionInsights.map((insight, index) => (
                              <div key={insight.questionId} className="border-l-4 border-gray-300 pl-4 py-2">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-gray-800 text-sm flex-1 pr-4">
                                    {insight.questionText}
                                  </h5>
                                  <div className="flex-shrink-0 text-right">
                                    <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                      insight.score >= 80 ? 'bg-green-100 text-green-800' :
                                      insight.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                      insight.score >= 40 ? 'bg-orange-100 text-orange-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {insight.score}/100
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-gray-600">Your Answer: </span>
                                  <span className="text-sm text-gray-800 font-semibold">{insight.userAnswer}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {translateDynamicContent(insight.insight)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 30-Day Action Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <Calendar className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{t('report.actionPlan30Day')}</h2>
              </div>

              <div className="space-y-6">
                {reportData.actionPlan.map((week) => (
                  <div key={week.week} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {week.week}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t('report.week')} {week.week}: {translateDynamicContent(week.focus)}</h3>
                        <p className="text-sm text-gray-600">{t('report.timeCommitment')}: {translateDynamicContent(week.timeCommitment)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {week.actions.map((action, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{translateDynamicContent(action)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Category Insights */}
            {reportData.aiReport?.personalizedInsights && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('report.personalizedInsights')}</h2>
                </div>

                <div className="space-y-6">
                  {reportData.aiReport.personalizedInsights.crossCategoryPatterns && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-3">{t('report.crossCategoryPatterns')}</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {reportData.aiReport.personalizedInsights.crossCategoryPatterns}
                      </p>
                    </div>
                  )}

                  {reportData.aiReport.personalizedInsights.surprisingFindings && (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                      <h3 className="font-semibold text-gray-900 mb-3">{t('report.surprisingFindings')}</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {reportData.aiReport.personalizedInsights.surprisingFindings}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Long-term Strategy */}
            {reportData.aiReport?.longTermStrategy && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('report.longTermStrategy')}</h2>
                </div>

                <div className="space-y-6">
                  {reportData.aiReport.longTermStrategy.primaryLimitingFactor && (
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                      <h3 className="font-semibold text-red-900 mb-3">{t('report.primaryLimitingFactor')}</h3>
                      <p className="text-red-800 leading-relaxed">
                        {translateDynamicContent(reportData.aiReport.longTermStrategy.primaryLimitingFactor)}
                      </p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {reportData.aiReport.longTermStrategy.threeMonthGoals.length > 0 && (
                      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                        <h3 className="font-semibold text-yellow-900 mb-3">{t('report.threeMonthGoals')}</h3>
                        <ul className="space-y-2">
                          {reportData.aiReport.longTermStrategy.threeMonthGoals.map((goal, index) => (
                            <li key={index} className="text-yellow-800 text-sm">• {translateDynamicContent(goal)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reportData.aiReport.longTermStrategy.oneYearGoals.length > 0 && (
                      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                        <h3 className="font-semibold text-green-900 mb-3">{t('report.oneYearGoals')}</h3>
                        <ul className="space-y-2">
                          {reportData.aiReport.longTermStrategy.oneYearGoals.map((goal, index) => (
                            <li key={index} className="text-green-800 text-sm">• {translateDynamicContent(goal)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {reportData.aiReport.longTermStrategy.recommendedResources.length > 0 && (
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-3">{t('report.recommendedResources')}</h3>
                      <ul className="space-y-2">
                        {reportData.aiReport.longTermStrategy.recommendedResources.map((resource, index) => (
                          <li key={index} className="text-purple-800 text-sm">• {translateDynamicContent(resource)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('report.reportOverview')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('report.assessmentDate')}</span>
                  <span className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('report.questionsAnalyzed')}</span>
                  <span className="font-semibold text-gray-900">57/57</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('report.categoriesCovered')}</span>
                  <span className="font-semibold text-gray-900">6 {t('report.areas')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('report.peerGroupSize')}</span>
                  <span className="font-semibold text-gray-900">10,000+</span>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('report.keyInsights')}</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900 text-sm">{t('report.topPerformer')}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t('report.youExcelIn')} {translateCategoryName(reportData.categories.reduce((max, cat) => 
                      cat.percentile > max.percentile ? cat : max
                    ).name).toLowerCase()}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Target className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900 text-sm">{t('report.focusArea')}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t('report.biggestOpportunityIn')} {translateCategoryName(reportData.categories.reduce((min, cat) => 
                      cat.percentile < min.percentile ? cat : min
                    ).name).toLowerCase()}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-900 text-sm">{t('report.growthPotential')}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t('report.followingActionPlanCouldImprove')}
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade CTA - Only show if user doesn't have active AI Coach subscription */}
            {!subscriptionLoading && !hasActiveCoachSubscription && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-3">{t('report.wantOngoingSupport')}</h3>
                <p className="text-sm text-gray-200 mb-4">
                  {t('dashboard.getAiCoach')}
                </p>
                <button
                  onClick={() => router.push(`/paywall/coach/${params.id}`)}
                  className="w-full bg-white text-gray-900 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm"
                >
                  {t('dashboard.upgradeToAiCoach')} - $19/mo
                </button>
              </div>
            )}
            
            {/* Show AI Coach access if user already has subscription */}
            {!subscriptionLoading && hasActiveCoachSubscription && (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">{t('dashboard.aiCoach')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('dashboard.aiCoachPro')}
                </p>
                <button
                  onClick={() => router.push(`/coach/${params.id}`)}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-all font-semibold text-sm"
                >
                  {t('dashboard.aiCoachDashboard')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{t('report.shareYourLifeScore')}</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {shareLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : shareSvg ? (
                <div>
                  <div className="bg-gray-100 rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 overflow-hidden">
                    <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] mx-auto">
                      <div 
                        className="w-full h-auto"
                        dangerouslySetInnerHTML={{ __html: shareSvg.replace(/width="1080"/, 'width="100%"').replace(/height="1920"/, 'height="auto"') }}
                        style={{ display: 'block' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <button
                      onClick={downloadShareImage}
                      className="w-full flex items-center justify-center px-4 sm:px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t('scorecard.downloadForStories')}
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'My RankMe Life Score Deep Report',
                            text: `I just got my detailed life analysis report! Check out RankMe to see how you rank.`,
                            url: window.location.href
                          })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          alert('Link copied to clipboard!')
                        }
                      }}
                      className="w-full flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm sm:text-base"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {t('scorecard.shareLink')}
                    </button>
                  </div>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{t('scorecard.howToUse')}</h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <li>• {t('scorecard.uploadToInstagram')}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">{t('scorecard.somethingWentWrong')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}