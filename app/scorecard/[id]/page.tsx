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
  const { data: session, status: sessionStatus } = useSession()
  const { t, language } = useLanguage()
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
  const [progressData, setProgressData] = useState<any>(null)
  const [showProgressModal, setShowProgressModal] = useState(false)

  useEffect(() => {
    fetchScoreData()
    if (session?.user?.email) {
      checkSubscriptionStatus()
      checkDeepReportPurchase()
      fetchProgressData()
    }
  }, [params.id, session])
  
  const checkSubscriptionStatus = async () => {
    if (!session?.user?.email) {
      setSubscriptionStatus('none')
      return
    }
    
    try {
      const response = await fetch('/api/user?type=subscription')
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
      const response = await fetch('/api/user?type=purchases')
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
  
  const fetchProgressData = async () => {
    if (!session?.user?.email) return
    
    try {
      const response = await fetch('/api/progress?type=assessment-history')
      if (response.ok) {
        const data = await response.json()
        setProgressData(data)
      }
    } catch (error) {
      console.error('Error fetching progress data:', error)
    }
  }

  useEffect(() => {
    // Only show account prompt if:
    // 1. Session is definitively not authenticated (not loading)
    // 2. Score data has loaded
    // 3. Page has finished loading
    if (sessionStatus === 'unauthenticated' && scoreData && !loading) {
      const timer = setTimeout(() => {
        // Final check - only show if still unauthenticated
        if (sessionStatus === 'unauthenticated' && !session) {
          setShowAccountPrompt(true)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
    
    // Hide prompt if user is authenticated or session is loading
    if (session || sessionStatus === 'authenticated') {
      setShowAccountPrompt(false)
    }
  }, [session, sessionStatus, scoreData, loading])

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
  
  // Generate compelling statistics for sharing
  const generateCompellingStats = () => {
    if (!scoreData) return []
    
    const stats = []
    const overall = Math.round(scoreData.overall.percentile)
    
    if (overall >= 90) {
      stats.push(`🏆 Top 10% performer`)
      stats.push(`Crushing life goals`)
    } else if (overall >= 75) {
      stats.push(`⭐ Above average achiever`)
      stats.push(`Strong life foundation`)
    } else if (overall >= 50) {
      stats.push(`🎯 Building momentum`)
      stats.push(`Great growth potential`)
    } else {
      stats.push(`🚀 Ready for takeoff`)
      stats.push(`Transformation journey begun`)
    }
    
    // Add category-specific insights
    const topCategory = scoreData.categories.reduce((max, cat) => 
      cat.percentile > max.percentile ? cat : max
    )
    
    const categoryNames: { [key: string]: string } = {
      financial: 'Financial Health',
      health_fitness: 'Physical Wellness', 
      social: 'Social Network',
      romantic: 'Relationships'
    }
    
    const categoryName = categoryNames[topCategory.id] || 'Personal Growth'
    stats.push(`💪 Strongest area: ${categoryName}`)
    
    if (progressData && progressData.stats.overallTrend > 0) {
      stats.push(`📈 Improving by ${Math.round(progressData.stats.overallTrend)} points`)
    }
    
    return stats
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
            {translateText('backToHome')}
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
    const categoryMappings: { [key: string]: { [lang: string]: string } } = {
      'financial': {
        'en': 'Financial Health',
        'es': 'Salud Financiera',
        'fr': 'Santé Financière',
        'de': 'Finanzielle Gesundheit'
      },
      'health_fitness': {
        'en': 'Physical Wellness',
        'es': 'Bienestar Físico',
        'fr': 'Bien-être Physique',
        'de': 'Körperliches Wohlbefinden'
      },
      'social': {
        'en': 'Social Network',
        'es': 'Red Social',
        'fr': 'Réseau Social',
        'de': 'Soziales Netzwerk'
      },
      'romantic': {
        'en': 'Romantic',
        'es': 'Romántico',
        'fr': 'Romantique',
        'de': 'Romantisch'
      }
    }
    
    return categoryMappings[categoryId]?.[language] || categoryId
  }

  // Helper function to translate performance levels
  const translatePerformanceLevel = (level: string): string => {
    const levelMappings: { [key: string]: { [lang: string]: string } } = {
      'Exceptional': {
        'en': 'Exceptional',
        'es': 'Excepcional',
        'fr': 'Exceptionnel',
        'de': 'Außergewöhnlich'
      },
      'Excellent': {
        'en': 'Excellent',
        'es': 'Excelente',
        'fr': 'Excellent',
        'de': 'Ausgezeichnet'
      },
      'Good': {
        'en': 'Good',
        'es': 'Bueno',
        'fr': 'Bon',
        'de': 'Gut'
      },
      'Average': {
        'en': 'Average',
        'es': 'Promedio',
        'fr': 'Moyen',
        'de': 'Durchschnittlich'
      },
      'Fair': {
        'en': 'Fair',
        'es': 'Regular',
        'fr': 'Correct',
        'de': 'Angemessen'
      },
      'Needs Attention': {
        'en': 'Needs Improvement',
        'es': 'Necesita Mejora',
        'fr': 'Besoin d\'Amélioration',
        'de': 'Verbesserungsbedürftig'
      },
      'Needs Improvement': {
        'en': 'Needs Improvement',
        'es': 'Necesita Mejora',
        'fr': 'Besoin d\'Amélioration',
        'de': 'Verbesserungsbedürftig'
      }
    }
    
    return levelMappings[level]?.[language] || level
  }

  // Helper function for problematic translations
  const translateText = (key: string): string => {
    const textMappings: { [key: string]: { [lang: string]: string } } = {
      'scorecardShowsPercentiles': {
        'en': 'This scorecard shows your percentile rankings. Unlock deeper insights with our premium features.',
        'es': 'Esta tarjeta de puntuación muestra tus rankings percentiles. Desbloquea perspectivas más profundas con nuestras características premium.',
        'fr': 'Cette fiche de score montre vos classements en percentiles. Débloquez des insights plus profonds avec nos fonctionnalités premium.',
        'de': 'Diese Bewertungskarte zeigt Ihre Perzentil-Rankings. Schalten Sie tiefere Einblicke mit unseren Premium-Funktionen frei.'
      },
      'emailYourResults': {
        'en': 'Email Your Results',
        'es': 'Envía Tus Resultados por Email',
        'fr': 'Envoyer Vos Résultats par Email',
        'de': 'Ihre Ergebnisse per E-Mail'
      },
      'resultsSentSuccessfully': {
        'en': 'Results sent successfully!',
        'es': '¡Resultados enviados exitosamente!',
        'fr': 'Résultats envoyés avec succès !',
        'de': 'Ergebnisse erfolgreich gesendet!'
      },
      'checkYourInbox': {
        'en': 'Check your inbox for your detailed life score.',
        'es': 'Revisa tu bandeja de entrada para tu puntuación de vida detallada.',
        'fr': 'Vérifiez votre boîte de réception pour votre score de vie détaillé.',
        'de': 'Überprüfen Sie Ihren Posteingang für Ihre detaillierte Lebenspunktzahl.'
      },
      'sendToAnotherEmail': {
        'en': 'Send to another email',
        'es': 'Enviar a otro email',
        'fr': 'Envoyer à un autre email',
        'de': 'An eine andere E-Mail senden'
      },
      'enterEmailAddress': {
        'en': 'Enter your email address',
        'es': 'Ingresa tu dirección de email',
        'fr': 'Entrez votre adresse email',
        'de': 'Geben Sie Ihre E-Mail-Adresse ein'
      },
      'sendMyResults': {
        'en': 'Send My Results',
        'es': 'Enviar Mis Resultados',
        'fr': 'Envoyer Mes Résultats',
        'de': 'Meine Ergebnisse Senden'
      },
      'emailResultsDesc': {
        'en': 'Get a beautifully formatted email with your complete assessment results and insights.',
        'es': 'Obtén un email bellamente formateado con los resultados completos de tu evaluación e insights.',
        'fr': 'Obtenez un email magnifiquement formaté avec vos résultats d\'évaluation complets et des insights.',
        'de': 'Erhalten Sie eine schön formatierte E-Mail mit Ihren vollständigen Bewertungsergebnissen und Einsichten.'
      },
      'viewDeepReport': {
        'en': 'View Deep Report',
        'es': 'Ver Informe Profundo',
        'fr': 'Voir le Rapport Approfondi',
        'de': 'Detailbericht Anzeigen'
      },
      'getDeepAnalysis': {
        'en': 'Get Deep Analysis',
        'es': 'Obtener Análisis Profundo',
        'fr': 'Obtenir l\'Analyse Approfondie',
        'de': 'Tiefgehende Analyse Erhalten'
      },
      'backToHome': {
        'en': 'Back to Home',
        'es': 'Volver al Inicio',
        'fr': 'Retour à l\'Accueil',
        'de': 'Zurück zur Startseite'
      }
    }
    
    return textMappings[key]?.[language] || key
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
    if (score >= 90) return { 
      level: 'Exceptional', 
      color: 'text-gray-900', 
      bgColor: 'bg-gray-50 border-gray-300',
      description: 'You\'re performing exceptionally well in this area - top 10% of your peers!',
      icon: '🌟'
    }
    if (score >= 75) return { 
      level: 'Excellent', 
      color: 'text-gray-800', 
      bgColor: 'bg-gray-100 border-gray-300',
      description: 'Strong performance that puts you ahead of most people in your demographic.',
      icon: '✨'
    }
    if (score >= 60) return { 
      level: 'Good', 
      color: 'text-gray-700', 
      bgColor: 'bg-white border-gray-200',
      description: 'Solid foundation with room for optimization and growth.',
      icon: '👍'
    }
    if (score >= 40) return { 
      level: 'Fair', 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50 border-gray-200',
      description: 'Some good elements, but significant improvement opportunities exist.',
      icon: '⚠️'
    }
    return { 
      level: 'Needs Focus', 
      color: 'text-gray-500', 
      bgColor: 'bg-gray-100 border-gray-300',
      description: 'This area needs immediate attention for meaningful life improvement.',
      icon: '🎯'
    }
  }
  
  // Generate Quick Wins for lowest scoring categories
  const generateQuickWins = (categories: any[]) => {
    const sortedCategories = [...categories].sort((a, b) => a.percentile - b.percentile)
    const lowestCategories = sortedCategories.slice(0, 2)
    
    const quickWinsMap: { [key: string]: string[] } = {
      financial: [
        '📱 Download a budgeting app and track expenses for one week',
        '💰 Set up automatic transfer of $25/week to savings account',
        '📚 Read one personal finance article daily for 7 days'
      ],
      health_fitness: [
        '🚶 Take a 15-minute walk after each meal starting today',
        '💤 Set a consistent bedtime and wake time for this week',
        '🥗 Replace one snack with a piece of fruit daily'
      ],
      social: [
        '📞 Text one friend you haven\'t spoken to in a month',
        '🗓️ Schedule one coffee meeting with someone this week',
        '💬 Join one local community group or online community'
      ],
      romantic: [
        '💬 Have one deep conversation with your partner this week',
        '📱 Download a dating app if single, or plan one date if partnered',
        '📖 Read one article about healthy relationships'
      ],
      career: [
        '🎯 Set 3 specific career goals for the next 3 months',
        '📚 Spend 30 minutes learning a new skill relevant to your job',
        '🤝 Reach out to one professional contact this week'
      ],
      personal_growth: [
        '📝 Write down 3 things you\'re grateful for daily',
        '🎯 Set one small, achievable goal for this week',
        '📚 Read for 15 minutes before bed instead of scrolling'
      ]
    }
    
    return lowestCategories.map(cat => ({
      category: translateCategoryName(cat.id),
      percentile: cat.percentile,
      wins: quickWinsMap[cat.id] || ['Focus on building consistent daily habits in this area']
    }))
  }
  
  // Generate progress insights
  const getProgressInsight = () => {
    if (!progressData || progressData.assessments.length < 2) return null
    
    const latest = progressData.assessments[0]
    const previous = progressData.assessments[1]
    const overallChange = latest.overall.percentile - previous.overall.percentile
    
    if (overallChange > 5) {
      return {
        type: 'improvement',
        message: `You\'ve improved by ${Math.round(overallChange)} percentile points since your last assessment!`,
        icon: '📈',
        color: 'text-gray-800 bg-gray-100 border-gray-200'
      }
    } else if (overallChange < -5) {
      return {
        type: 'decline',
        message: `Your scores have declined by ${Math.abs(Math.round(overallChange))} points. Let\'s focus on rebuilding!`,
        icon: '🎯',
        color: 'text-orange-600 bg-orange-50 border-orange-200'
      }
    } else {
      return {
        type: 'stable',
        message: 'Your scores are stable. Ready to push for your next breakthrough?',
        icon: '🚀',
        color: 'text-gray-700 bg-gray-50 border-gray-200'
      }
    }
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
                    <div key={category.id} className={`rounded-xl p-6 hover:shadow-sm transition-all border-2 ${level.bgColor}`}>
                      <div className="flex items-center mb-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm mr-4">
                          <IconComponent className="h-6 w-6 text-gray-700" />
                        </div>
                        <div className="flex-1 w-full">
                          <h3 className="text-lg font-semibold text-gray-900 w-full">
                            {translateCategoryName(category.id)}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xl mr-2">{level.icon}</span>
                            <p className={`text-sm font-medium ${level.color}`}>
                              {level.level}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className={`text-2xl font-bold ${level.color} mb-2`}>
                          {formatPercentile(category.percentile)}
                        </div>
                        <p className="text-xs text-gray-600">{level.description}</p>
                      </div>
                      
                      <GaussianChart 
                        percentile={category.percentile} 
                        title={`${translateCategoryName(category.id)} Distribution`}
                        width={300}
                        height={140}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {scoreData.categories.map((category) => {
                  const level = getScoreLevel(category.percentile)
                  const categoryName = translateCategoryName(category.id)
                  
                  return (
                    <div key={category.id} className={`p-6 rounded-xl border-2 ${level.bgColor}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{categoryName}</h3>
                        <span className="text-2xl">{level.icon}</span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className={`text-2xl font-bold ${level.color} mr-3`}>
                          {formatPercentile(category.percentile)}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${level.color} bg-white`}>
                          {level.level}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {level.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracking for Logged-in Users */}
            {session?.user && progressData && progressData.assessments.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  📈 Your Progress Journey
                  <button
                    onClick={() => setShowProgressModal(true)}
                    className="ml-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    View Details
                  </button>
                </h3>
                
                {getProgressInsight() && (
                  <div className={`p-4 rounded-lg border mb-4 ${getProgressInsight()?.color}`}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getProgressInsight()?.icon}</span>
                      <p className="text-sm font-medium">{getProgressInsight()?.message}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-600">Total Assessments</span>
                    <span className="font-semibold text-gray-900">{progressData.stats.totalAssessments}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-600">Overall Trend</span>
                    <span className={`font-semibold ${
                      progressData.stats.overallTrend > 0 ? 'text-gray-800' : 
                      progressData.stats.overallTrend < 0 ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {progressData.stats.overallTrend > 0 ? '+' : ''}{Math.round(progressData.stats.overallTrend)} pts
                    </span>
                  </div>
                  {progressData.stats.improvingCategories.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-800 font-medium mb-1">Improving Areas:</div>
                      {progressData.stats.improvingCategories.map((cat: any, i: number) => (
                        <div key={i} className="text-xs text-gray-700">
                          {translateCategoryName(cat.category)} (+{Math.round(cat.change)})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
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
                  {translateText('scorecardShowsPercentiles')}
                </p>
              </div>
            </div>

            {/* Email Results */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-bold text-gray-900">{translateText('emailYourResults')}</h3>
              </div>
              
              {emailSent ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">{translateText('resultsSentSuccessfully')}</p>
                  <p className="text-sm text-gray-600 mt-1">{translateText('checkYourInbox')}</p>
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-2 underline"
                  >
                    {translateText('sendToAnotherEmail')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendEmail}>
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={translateText('enterEmailAddress')}
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
                        {translateText('sendMyResults')}
                      </>
                    )}
                  </button>
                </form>
              )}
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                {translateText('emailResultsDesc')}
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
                        ? `${scoreData.completionTime} ${t('report.seconds')}`
                        : `${Math.floor(scoreData.completionTime / 60)} ${t('report.mins')} ${scoreData.completionTime % 60} ${t('report.sec')}`
                    ) : t('report.defaultCompletionTime')}
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
                {hasDeepReportPurchase ? translateText('viewDeepReport') : translateText('getDeepAnalysis')}
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                {translateText('backToHome')}
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

        {/* Progress Detail Modal */}
        {showProgressModal && progressData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Your Progress History</h3>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-700 font-medium">Total Assessments</div>
                      <div className="text-2xl font-bold text-gray-900">{progressData.stats.totalAssessments}</div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="text-sm text-gray-700 font-medium">Overall Progress</div>
                      <div className={`text-2xl font-bold ${
                        progressData.stats.overallTrend > 0 ? 'text-gray-900' : 
                        progressData.stats.overallTrend < 0 ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {progressData.stats.overallTrend > 0 ? '+' : ''}{Math.round(progressData.stats.overallTrend)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Assessment Timeline</h4>
                    <div className="space-y-4">
                      {progressData.assessments.slice(0, 5).map((assessment: any, index: number) => (
                        <div key={assessment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="font-medium text-gray-900">
                              {new Date(assessment.date).toLocaleDateString()}
                              {assessment.isLatest && <span className="ml-2 text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">Current</span>}
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {Math.round(assessment.overall.percentile)}%
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {assessment.categories.map((cat: any) => (
                              <div key={cat.id} className="flex justify-between">
                                <span className="text-gray-600">{translateCategoryName(cat.id)}:</span>
                                <span className="font-medium">{Math.round(cat.percentile)}%</span>
                              </div>
                            ))}
                          </div>
                          
                          {Object.keys(assessment.improvements).length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs text-gray-600 mb-1">Changes from previous:</div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(assessment.improvements).map(([key, value]: [string, any]) => 
                                  value !== 0 && (
                                    <span key={key} className={`text-xs px-2 py-1 rounded ${
                                      value > 0 ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-600'
                                    }`}>
                                      {key}: {value > 0 ? '+' : ''}{Math.round(value)}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
                          const compellingText = `🎯 Just discovered my life performance score: ${Math.round(scoreData.overall.percentile)}%!\n\n${generateCompellingStats().slice(0, 2).join(' • ')}\n\nTake the assessment: ${window.location.origin}/assessment`
                          
                          if (navigator.share) {
                            navigator.share({
                              title: 'My RankMe Life Score',
                              text: compellingText,
                              url: window.location.href
                            })
                          } else {
                            navigator.clipboard.writeText(compellingText)
                            alert('Compelling share text copied to clipboard!')
                          }
                        }}
                        className="w-full flex items-center justify-center px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-sm sm:text-base font-semibold shadow-lg"
                      >
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Share Your Achievement
                      </button>
                      
                      {/* Quick copy buttons for different platforms */}
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <button
                          onClick={() => {
                            const twitterText = `🎯 Life Score: ${Math.round(scoreData.overall.percentile)}%\n${generateCompellingStats()[0]}\n\nCheck yours: ${window.location.origin}/assessment`
                            navigator.clipboard.writeText(twitterText)
                            alert('Twitter text copied!')
                          }}
                          className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                        >
                          🐦 Twitter
                        </button>
                        <button
                          onClick={() => {
                            const linkedinText = `Just completed a comprehensive life assessment and scored ${Math.round(scoreData.overall.percentile)}%! ${generateCompellingStats()[0]} 🎯\n\nThe insights are incredible. Check out RankMe if you're interested in optimizing key life areas.`
                            navigator.clipboard.writeText(linkedinText)
                            alert('LinkedIn text copied!')
                          }}
                          className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                        >
                          💼 LinkedIn
                        </button>
                        <button
                          onClick={() => {
                            const instagramText = `${generateCompellingStats().slice(0, 3).join('\n')} 🔥\n\n#LifeScore #PersonalGrowth #RankMe`
                            navigator.clipboard.writeText(instagramText)
                            alert('Instagram caption copied!')
                          }}
                          className="px-3 py-2 bg-pink-50 text-pink-700 rounded-lg text-xs font-medium hover:bg-pink-100 transition-colors"
                        >
                          📷 Instagram
                        </button>
                      </div>
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