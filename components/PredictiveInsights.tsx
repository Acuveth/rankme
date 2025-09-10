'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { 
  AlertTriangle, Brain, TrendingUp, Target, Clock, 
  Lightbulb, Heart, Zap, Shield, ChevronRight, X,
  BarChart3, Calendar, Timer, Star, Award, Sparkles,
  ChevronDown, ChevronUp, RotateCcw, Info
} from 'lucide-react'

interface PredictiveInsight {
  id: string
  type: 'risk_detection' | 'behavior_forecast' | 'personalized_recommendation' | 'intervention_timing' | 'pattern_coaching'
  confidence: number
  priority: 'high' | 'medium' | 'low'
  title: string
  message: string
  reasoning?: string
  data: any
  actionable: boolean
  suggestedActions?: string[]
  timeFrame?: string
  category?: string
  aiGenerated?: boolean
}

interface PredictiveInsightsProps {
  assessmentId?: string
  userId?: string
  className?: string
  showHeader?: boolean
  maxInsights?: number
  useAllAssessments?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
}

const getInsightTypeConfig = (t: any) => ({
  risk_detection: {
    icon: AlertTriangle,
    color: 'text-gray-800',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    accentColor: 'bg-gray-800',
    title: t('insights.riskAlert'),
    description: t('insights.riskAlertDesc')
  },
  behavior_forecast: {
    icon: TrendingUp,
    color: 'text-gray-700',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    accentColor: 'bg-gray-700',
    title: t('insights.patternForecast'),
    description: t('insights.patternForecastDesc')
  },
  personalized_recommendation: {
    icon: Lightbulb,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    accentColor: 'bg-gray-600',
    title: t('insights.smartRecommendation'),
    description: t('insights.smartRecommendationDesc')
  },
  intervention_timing: {
    icon: Clock,
    color: 'text-black',
    bgColor: 'bg-white',
    borderColor: 'border-gray-300',
    accentColor: 'bg-black',
    title: t('insights.strategicTiming'),
    description: t('insights.strategicTimingDesc')
  },
  pattern_coaching: {
    icon: Brain,
    color: 'text-gray-900',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    accentColor: 'bg-gray-900',
    title: t('insights.deepInsights'),
    description: t('insights.deepInsightsDesc')
  }
})

const getPriorityConfig = (t: any) => ({
  high: { 
    label: t('insights.highPriority'), 
    color: 'text-gray-900',
    bgColor: 'bg-gray-200',
    indicator: '🔥'
  },
  medium: { 
    label: t('insights.mediumPriority'), 
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    indicator: '⚡'
  },
  low: { 
    label: t('insights.lowPriority'), 
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    indicator: '💡'
  }
})

export default function PredictiveInsights({ 
  assessmentId, 
  userId, 
  className = '',
  showHeader = true,
  maxInsights = 8,
  useAllAssessments = false,
  collapsible = false,
  defaultCollapsed = true
}: PredictiveInsightsProps) {
  const { t } = useLanguage()
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set())
  const [filterType, setFilterType] = useState<string>('all')
  const [metadata, setMetadata] = useState<any>(null)
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  useEffect(() => {
    fetchInsights()
  }, [assessmentId, userId, maxInsights, useAllAssessments])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (!useAllAssessments && assessmentId) params.append('assessmentId', assessmentId)
      if (maxInsights) params.append('limit', maxInsights.toString())
      if (useAllAssessments) params.append('useAllAssessments', 'true')
      
      console.log('🔄 Fetching predictive insights with params:', params.toString())
      
      const response = await fetch(`/api/insights/predictive?${params.toString()}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API response error:', response.status, errorText)
        throw new Error(`Failed to fetch insights (${response.status}): ${errorText}`)
      }
      
      const data = await response.json()
      console.log('✅ Received insights data:', data)
      
      setInsights(data.insights || [])
      setMetadata(data.metadata)
      
      if (!data.insights || data.insights.length === 0) {
        console.warn('⚠️ No insights returned from API')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading AI insights'
      setError(errorMessage)
      console.error('❌ Error fetching predictive insights:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (insightId: string) => {
    const newExpanded = new Set(expandedInsights)
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId)
    } else {
      newExpanded.add(insightId)
    }
    setExpandedInsights(newExpanded)
  }

  const dismissInsight = (insightId: string) => {
    const newDismissed = new Set(dismissedInsights)
    newDismissed.add(insightId)
    setDismissedInsights(newDismissed)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-gray-800 bg-gray-100'
    if (confidence >= 60) return 'text-gray-700 bg-gray-50'
    return 'text-gray-600 bg-white'
  }

  const insightTypeConfig = getInsightTypeConfig(t)
  const priorityConfig = getPriorityConfig(t)

  const filteredInsights = filterType === 'all' 
    ? insights.filter(insight => !dismissedInsights.has(insight.id))
    : insights.filter(insight => 
        insight.type === filterType && !dismissedInsights.has(insight.id)
      )

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <p>{t('insights.errorLoadingInsights')}: {error}</p>
        </div>
        <button 
          onClick={fetchInsights}
          className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
        >
          {t('insights.tryAgain')}
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-gray-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('insights.aiPredictiveInsights')}
                  </h2>
                  {collapsible && (
                    <button
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                      title={isCollapsed ? t('insights.viewActions') : t('common.close')}
                    >
                      {isCollapsed ? (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    {useAllAssessments 
                      ? t('insights.insightsBasedOnAllAssessments')
                      : t('insights.insightsBasedOnAssessment')
                    }
                  </p>
                  {metadata?.fromCache && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700 border border-blue-200">
                      <Info className="h-3 w-3" />
                      {t('insights.cached')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {metadata && (
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {metadata.fromCache ? 'Cached from' : 'Generated'} {new Date(metadata.generatedAt).toLocaleString()}
                  </div>
                  {metadata.fromCache && metadata.cacheExpiresAt && (
                    <div className="text-xs text-gray-400">
                      Expires {new Date(metadata.cacheExpiresAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
              {!loading && (
                <button
                  onClick={() => fetchInsights()}
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  title={t('insights.refreshInsights')}
                >
                  <RotateCcw className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Filter buttons */}
          {!isCollapsed && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  filterType === 'all'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
{t('insights.allInsights')} ({insights.length})
              </button>
              {Object.entries(insightTypeConfig).map(([type, config]) => {
                const count = insights.filter(i => i.type === type).length
                if (count === 0) return null
                
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filterType === type
                        ? `${config.accentColor} text-white border-transparent`
                        : `bg-white ${config.color} ${config.borderColor} hover:${config.bgColor}`
                    }`}
                  >
                    {config.title} ({count})
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {!isCollapsed && (
        <div className="p-6">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {dismissedInsights.size > 0 
                ? t('insights.noMoreInsights')
                : t('insights.gatheringData')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight) => {
              const config = insightTypeConfig[insight.type]
              const priorityConf = priorityConfig[insight.priority]
              const isExpanded = expandedInsights.has(insight.id)
              const IconComponent = config.icon

              return (
                <div
                  key={insight.id}
                  className={`rounded-lg border ${config.borderColor} ${config.bgColor} transition-all hover:shadow-md`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Icon and accent */}
                        <div className="flex items-center gap-2">
                          <div className={`p-2 ${config.accentColor} rounded-lg`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityConf.bgColor} ${priorityConf.color}`}>
                              {priorityConf.indicator} {priorityConf.label}
                            </span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getConfidenceColor(insight.confidence)}`}>
                              {insight.confidence}% {t('insights.confident')}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {insight.title}
                            </h3>
                
                          </div>
                          
                          <p className="text-gray-700 text-sm mb-3">
                            {insight.message}
                          </p>

                          {/* AI reasoning */}
                          {insight.reasoning && insight.aiGenerated && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                              <p className="text-xs text-gray-800 mb-1 font-medium">🧠 AI Analysis:</p>
                              <p className="text-xs text-gray-700 leading-relaxed">{insight.reasoning}</p>
                            </div>
                          )}

                          {/* Quick data preview */}
                          {insight.data && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {Object.entries(insight.data).slice(0, 3).map(([key, value]) => (
                                <span key={key} className="text-xs bg-white px-2 py-1 rounded border">
                                  <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                  <span className="ml-1 font-medium">
                                    {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            {insight.actionable && insight.suggestedActions && insight.suggestedActions.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(insight.id)}
                                className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${config.color} ${config.borderColor} hover:${config.bgColor}`}
                              >
                                <Target className="h-3 w-3" />
{t('insights.viewActions')} ({insight.suggestedActions.length})
                                <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => dismissInsight(insight.id)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                              title={t('insights.dismissInsight')}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded actions */}
                    {isExpanded && insight.suggestedActions && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
{t('insights.suggestedActions')}
                        </h4>
                        <ul className="space-y-2">
                          {insight.suggestedActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </div>
      )}

      {/* Metadata footer */}
      {metadata && showHeader && !isCollapsed && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Confidence: High ({metadata.confidenceDistribution?.high || 0}), Medium ({metadata.confidenceDistribution?.medium || 0}), Low ({metadata.confidenceDistribution?.low || 0})</span>
              {useAllAssessments && metadata.useAllAssessments && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  All Assessments Mode
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {metadata.fromCache && (
                <span className="text-blue-600">From Cache</span>
              )}
              <button 
                onClick={fetchInsights}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Zap className="h-3 w-3" />
                {t('insights.refreshInsights')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}