'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { AlertTriangle, TrendingUp, Lightbulb, Clock, Brain, Sparkles } from 'lucide-react'

interface PredictiveInsight {
  id: string
  type: 'risk_detection' | 'behavior_forecast' | 'personalized_recommendation' | 'intervention_timing' | 'pattern_coaching'
  confidence: number
  priority: 'high' | 'medium' | 'low'
  title: string
  message: string
  reasoning?: string
  data: any
  aiGenerated?: boolean
}

interface QuickInsightsProps {
  assessmentId?: string
  maxInsights?: number
  className?: string
}

const insightTypeConfig = {
  risk_detection: {
    icon: AlertTriangle,
    color: 'text-gray-800',
    bgColor: 'bg-gray-50',
    emoji: '⚠️'
  },
  behavior_forecast: {
    icon: TrendingUp,
    color: 'text-gray-700',
    bgColor: 'bg-white',
    emoji: '📊'
  },
  personalized_recommendation: {
    icon: Lightbulb,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    emoji: '💡'
  },
  intervention_timing: {
    icon: Clock,
    color: 'text-black',
    bgColor: 'bg-white',
    emoji: '⏰'
  },
  pattern_coaching: {
    icon: Brain,
    color: 'text-gray-900',
    bgColor: 'bg-gray-100',
    emoji: '🧠'
  }
}

export default function QuickInsights({ 
  assessmentId, 
  maxInsights = 3,
  className = ''
}: QuickInsightsProps) {
  const { t } = useLanguage()
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [assessmentId])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (assessmentId) params.append('assessmentId', assessmentId)
      params.append('limit', maxInsights.toString())
      
      const response = await fetch(`/api/insights/predictive?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch insights')
      }
      
      const data = await response.json()
      // Get only high priority insights for quick display
      const highPriorityInsights = data.insights.filter((insight: PredictiveInsight) => 
        insight.priority === 'high' || insight.confidence >= 75
      ).slice(0, maxInsights)
      
      setInsights(highPriorityInsights)
    } catch (error) {
      console.error('Error fetching quick insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-sm">{t('insights.aiInsights')}</h3>
        </div>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-sm">{t('insights.aiInsights')}</h3>
        </div>
        <div className="text-center py-4">
          <Brain className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">{t('insights.analyzingPatterns')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gray-800" />
          <h3 className="font-bold text-gray-900 text-sm">{t('insights.aiInsights')}</h3>
          {insights.some(i => i.aiGenerated) && (
            <span className="text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full font-medium">
              🧠 AI
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {insights.length} alert{insights.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const config = insightTypeConfig[insight.type]
          
          return (
            <div
              key={insight.id}
              className={`p-3 rounded-lg border ${config.bgColor} border-gray-200 transition-all hover:shadow-sm`}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0 mt-0.5">{config.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 mb-1 leading-tight">
                    {insight.title}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {insight.message}
                  </p>
                  {insight.confidence >= 80 && (
                    <div className="mt-1">
                      <span className="inline-block text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full">
                        {insight.confidence}% {t('insights.confident')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-center">
        <button 
          onClick={fetchInsights}
          className="text-xs text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          {t('insights.refreshInsights')}
        </button>
      </div>
    </div>
  )
}