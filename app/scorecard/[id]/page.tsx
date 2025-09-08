'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatPercentile } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Share2, Lock, TrendingUp, Users, Heart, DollarSign, Award, Target, BarChart3, Mail, UserPlus, ArrowLeft, FileText } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSelector from '@/components/LanguageSelector'
import GaussianChart from '@/components/GaussianChart'

interface ScoreData {
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
    percentile: number
  }>
  completionTime?: number // Time in seconds
}

export default function ScorecardPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [shareSvg, setShareSvg] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showAccountPrompt, setShowAccountPrompt] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'active' | 'cancelled' | 'loading'>('loading')
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [hasDeepReportPurchase, setHasDeepReportPurchase] = useState(false)

  useEffect(() => {
    fetchScoreData()
    if (session?.user?.email) {
      checkSubscriptionStatus()
      checkDeepReportPurchase()
    }
  }, [params.id, session])
  
  const checkSubscriptionStatus = async () => {
    if (!session?.user?.email) {
      setSubscriptionStatus('none')
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
        
        setHasActiveSubscription(hasActiveCoachSub)
        setSubscriptionStatus(hasActiveCoachSub ? 'active' : 'none')
      } else {
        setSubscriptionStatus('none')
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      setSubscriptionStatus('none')
    }
  }

  const checkDeepReportPurchase = async () => {
    if (!session?.user?.email) {
      return
    }
    
    try {
      const response = await fetch('/api/user/purchases')
      if (response.ok) {
        const data = await response.json()
        
        // Check if this assessment has a Deep Report purchase
        const hasReportPurchase = data.purchases?.some((purchase: any) => 
          purchase.assessmentId === params.id &&
          (purchase.product === 'deep_report_oneoff' || purchase.product === 'deep_report') && 
          purchase.status === 'completed'
        ) || false
        
        setHasDeepReportPurchase(hasReportPurchase)
      }
    } catch (error) {
      console.error('Error checking Deep Report purchase:', error)
    }
  }

  useEffect(() => {
    // Show account prompt after 3 seconds if user is not logged in
    if (!session && scoreData) {
      const timer = setTimeout(() => {
        setShowAccountPrompt(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [session, scoreData])

  const fetchScoreData = async () => {
    try {
      const response = await fetch(`/api/scorecard/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setScoreData(data)
      } else {
        setError(`Failed to load scorecard: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching score data:', error)
      setError('Error fetching score data')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!scoreData) return
    
    setShareLoading(true)
    setShowShareModal(true)
    
    try {
      const response = await fetch('/api/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: params.id,
          format: 'instagram'
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
    
    // Convert SVG to downloadable image
    const svgBlob = new Blob([shareSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rankme-life-score-${params.id}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !scoreData) return

    setEmailLoading(true)
    try {
      const response = await fetch('/api/email/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: params.id,
          email: email
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEmailSent(true)
        setEmail('')
        
        // If email service is not configured, show a different message
        if (data.emailPreview) {
          console.log('Email preview:', data.emailPreview)
        }
      } else {
        const errorData = await response.json()
        alert(`Failed to send email: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email. Please try again.')
    } finally {
      setEmailLoading(false)
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
            {t('scorecard.backToHome')}
          </button>
        </div>
      </div>
    )
  }

  if (!scoreData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">{t('report.scoreDataNotFound')}</p>
      </div>
    )
  }

  const categoryIcons: { [key: string]: any } = {
    financial: DollarSign,
    health_fitness: Heart,
    social: Users,
    romantic: TrendingUp
  }

  const translateCategoryName = (categoryId: string): string => {
    const categoryMap: { [key: string]: string } = {
      'financial': t('scorecard.financialHealth'),
      'health_fitness': t('scorecard.physicalWellness'),
      'social': t('scorecard.socialNetwork'),
      'romantic': t('scorecard.personalGrowth')
    }
    return categoryMap[categoryId] || categoryId
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

  const categoryNames: { [key: string]: string } = {
    'financial': t('scorecard.financialHealth'),
    'health_fitness': t('scorecard.physicalWellness'),
    'social': t('scorecard.socialNetwork'),
    'romantic': t('scorecard.personalGrowth')
  }

  const translateSex = (sex: string): string => {
    const sexMap: { [key: string]: string } = {
      'Male': t('settings.male'),
      'Female': t('settings.female'),
      'male': t('settings.male'),
      'female': t('settings.female'),
      'MALE': t('settings.male'),
      'FEMALE': t('settings.female'),
      'M': t('settings.male'),
      'F': t('settings.female'),
      'Other': t('settings.other'),
      'other': t('settings.other'),
      'OTHER': t('settings.other')
    }
    return sexMap[sex] || sex
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Exceptional', color: 'text-gray-900' }
    if (score >= 75) return { level: 'Excellent', color: 'text-gray-800' }
    if (score >= 60) return { level: 'Good', color: 'text-gray-700' }
    if (score >= 40) return { level: 'Fair', color: 'text-gray-600' }
    return { level: 'Needs Attention', color: 'text-gray-500' }
  }

  const overallLevel = getScoreLevel(scoreData.overall.percentile)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Language Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {session?.user && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('scorecard.backToDashboard')}
                </button>
              )}
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-4 py-8 sm:py-12">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 animate-fade-scale">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">{t('report.yourLifeScore')}</h1>
                    <p className="text-gray-200 text-sm">
                      {translateSex(scoreData.cohort.sex)} • {scoreData.cohort.age_band} • {scoreData.cohort.region}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="text-7xl sm:text-8xl font-black text-white mb-3 tracking-tight">
                        {Math.round(scoreData.overall.score_0_100)}
                      </div>
                      <div className="w-20 h-px bg-white/40 mx-auto mb-4"></div>
                      <div className="text-sm text-white/80 font-medium uppercase tracking-widest">
                        {t('dashboard.outOf100')}
                      </div>
                    </div>
                    <div className="px-6 py-2 bg-white/15 rounded-lg border border-white/20">
                      <div className="text-sm font-semibold text-white">
                        {translatePerformanceLevel(overallLevel.level)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:flex-1 lg:max-w-sm">
                <div className="bg-white/10 rounded-xl p-4">
                  <GaussianChart 
                    percentile={scoreData.overall.percentile} 
                    title={t('report.overallPerformanceDistribution')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{t('report.performanceBreakdown')}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {scoreData.categories.map((category) => {
                  const IconComponent = categoryIcons[category.id] || TrendingUp
                  const level = getScoreLevel(category.percentile)
                  
                  return (
                    <div key={category.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-sm transition-all">
                      <div className="flex items-center mb-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm mr-4">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <div className="flex-1 w-full">
                          <h3 className="text-lg font-semibold text-gray-900 w-full">
                            {translateCategoryName(category.id)}
                          </h3>
                          <p className={`text-sm font-medium ${level.color}`}>
                            {translatePerformanceLevel(level.level)}
                          </p>
                        </div>
                      </div>
                      
                      <GaussianChart 
                        percentile={category.percentile} 
                        title={`${translateCategoryName(category.id)} Distribution`}
                        width={300}
                        height={160}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Insights Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('report.keyInsights')}</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('report.topStrength')}</h3>
                  <p className="text-gray-700">
                    {translateCategoryName(scoreData.categories.reduce((max, cat) => 
                      cat.percentile > max.percentile ? cat : max
                    ).id)}
                  </p>
                  <div className="text-2xl font-bold text-gray-800 mt-2">
                    {formatPercentile(Math.max(...scoreData.categories.map(c => c.percentile)))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('report.growthArea')}</h3>
                  <p className="text-gray-700">
                    {translateCategoryName(scoreData.categories.reduce((min, cat) => 
                      cat.percentile < min.percentile ? cat : min
                    ).id)}
                  </p>
                  <div className="text-2xl font-bold text-gray-800 mt-2">
                    {formatPercentile(Math.min(...scoreData.categories.map(c => c.percentile)))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Creation Prompt for Non-logged in Users */}
            {!session && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 animate-fade-scale">
                <div className="text-center mb-4">
                  <UserPlus className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-2">{t('scorecard.saveYourResults')}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('scorecard.trackProgressOverTime')}
                  </p>
                  <button
                    onClick={() => router.push(`/auth/signup?assessmentId=${params.id}&redirect=/dashboard`)}
                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm mb-2"
                  >
                    {t('scorecard.createFreeAccount')}
                  </button>
                  <button
                    onClick={() => router.push(`/auth/signin?assessmentId=${params.id}&redirect=/dashboard`)}
                    className="w-full px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border border-gray-300"
                  >
                    {t('scorecard.signInToExistingAccount')}
                  </button>
                </div>
              </div>
            )}

            {/* Free Version Notice */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border">
              <div className="text-center mb-4">
                <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-bold text-gray-900 mb-2">{t('pricing.freeAssessment')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('scorecard.scorecardShowsPercentiles')}
                </p>
              </div>
            </div>

            {/* Email Results */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-bold text-gray-900">{t('scorecard.emailYourResults')}</h3>
              </div>
              
              {emailSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">{t('scorecard.resultsSentSuccessfully')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('scorecard.checkYourInbox')}</p>
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-2 underline"
                  >
                    {t('scorecard.sendToAnotherEmail')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendEmail}>
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('scorecard.enterEmailAddress')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      required
                      disabled={emailLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={emailLoading || !email}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emailLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        {t('scorecard.sendMyResults')}
                      </>
                    )}
                  </button>
                </form>
              )}
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                {t('scorecard.emailResultsDesc')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all group"
              >
                <Share2 className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">{t('scorecard.shareResults')}</span>
              </button>
              
              <button
                onClick={() => router.push(hasDeepReportPurchase ? `/report/${params.id}` : `/paywall/report/${params.id}`)}
                className="w-full flex items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm group"
              >
                {hasDeepReportPurchase ? (
                  <FileText className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                ) : (
                  <Lock className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                )}
                <div className="text-left">
                  <div className="font-semibold">{hasDeepReportPurchase ? t('dashboard.viewReport') : t('scorecard.deepAnalysis')}</div>
                  <div className="text-xs text-gray-300">
                    {hasDeepReportPurchase ? t('scorecard.accessYourReport') : `${t('pricing.deepPrice')} ${t('pricing.oneTimePurchase').toLowerCase()}`}
                  </div>
                </div>
              </button>
              
              {/* AI Coach Button - Only show if user doesn't have active subscription */}
              {!hasActiveSubscription && (
                subscriptionStatus === 'loading' ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center px-6 py-4 bg-gray-600 text-white rounded-xl opacity-50 cursor-not-allowed shadow-sm"
                  >
                    <TrendingUp className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">{t('pricing.aiLifeCoach')}</div>
                      <div className="text-xs text-gray-300">{t('scorecard.loading')}</div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/paywall/coach/${params.id}`)}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-sm group"
                  >
                    <TrendingUp className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="font-semibold">{t('pricing.aiLifeCoach')}</div>
                      <div className="text-xs text-gray-300">{t('pricing.monthlyPrice')}/{t('pricing.perMonth')}</div>
                    </div>
                  </button>
                )
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('scorecard.assessmentStats')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('report.questionsAnswered')}</span>
                  <span className="font-semibold text-gray-900">57/57</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('report.completionTime')}</span>
                  <span className="font-semibold text-gray-900">
                    {scoreData.completionTime ? (
                      scoreData.completionTime < 60 
                        ? `${scoreData.completionTime} seconds`
                        : `${Math.floor(scoreData.completionTime / 60)} min ${scoreData.completionTime % 60} sec`
                    ) : '~8 mins'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('report.peerGroup')}</span>
                  <span className="font-semibold text-gray-900">{scoreData.cohort.age_band}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('report.readyToImproveYourScore')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('report.improveScoreDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push(hasDeepReportPurchase ? `/report/${params.id}` : `/paywall/report/${params.id}`)}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-semibold"
              >
                {hasDeepReportPurchase ? t('scorecard.viewDeepReport') : t('pricing.getDeepAnalysis')}
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                {t('scorecard.backToHome')}
              </button>
            </div>
          </div>
        </div>

        {/* Account Creation Modal for Non-logged in Users */}
        {showAccountPrompt && !session && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-fade-scale">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('scorecard.greatJobSaveResults')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('scorecard.createFreeAccountTo')}
                </p>
                <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2">✓</span>
                    {t('scorecard.trackProgressOverTime')}
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2">✓</span>
                    {t('scorecard.accessResultsAnyDevice')}
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2">✓</span>
                    {t('scorecard.compareImprovements')}
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-600 mr-2">✓</span>
                    {t('scorecard.getPersonalizedRecs')}
                  </li>
                </ul>
                <button
                  onClick={() => router.push(`/auth/signup?assessmentId=${params.id}&redirect=/dashboard`)}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-sm mb-3"
                >
                  {t('scorecard.createFreeAccount')}
                </button>
                <button
                  onClick={() => router.push(`/auth/signin?assessmentId=${params.id}&redirect=/dashboard`)}
                  className="w-full px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border border-gray-300 mb-3"
                >
                  {t('scorecard.iHaveAnAccount')}
                </button>
                <button
                  onClick={() => setShowAccountPrompt(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  {t('scorecard.continueWithoutAccount')}
                </button>
              </div>
            </div>
          </div>
        )}

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
                              title: 'My RankMe Life Score',
                              text: `I just got my life performance score! Check out RankMe to see how you rank.`,
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
    </div>
  )
}