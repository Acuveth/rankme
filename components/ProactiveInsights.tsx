'use client'

import { useState, useEffect } from 'react'
import { 
  Trophy, TrendingDown, Lightbulb, Heart, 
  ChevronRight, X, Clock, Target, AlertCircle,
  CheckCircle, Star, Zap
} from 'lucide-react'

interface ProactiveInsight {
  type: 'milestone_celebration' | 'obstacle_warning' | 'habit_suggestion' | 'motivation_boost'
  priority: 'high' | 'medium' | 'low'
  message: string
  actionable: boolean
  suggestedActions?: string[]
  triggerData: any
}

interface ProactiveInsightsProps {
  assessmentId: string
  className?: string
}

const insightConfig = {
  milestone_celebration: {
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    title: 'Milestone Reached! 🎉'
  },
  obstacle_warning: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    title: 'Challenge Detected'
  },
  habit_suggestion: {
    icon: Lightbulb,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    title: 'Growth Opportunity'
  },
  motivation_boost: {
    icon: Heart,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    title: 'You\'ve Got This!'
  }
}

const priorityConfig = {
  high: { 
    indicator: 'bg-red-500',
    label: 'High Priority',
    pulse: 'animate-pulse'
  },
  medium: { 
    indicator: 'bg-yellow-500',
    label: 'Medium Priority',
    pulse: ''
  },
  low: { 
    indicator: 'bg-green-500',
    label: 'Low Priority',
    pulse: ''
  }
}

export default function ProactiveInsights({ assessmentId, className = '' }: ProactiveInsightsProps) {
  const [insights, setInsights] = useState<ProactiveInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set())
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)

  useEffect(() => {
    fetchProactiveInsights()
  }, [assessmentId])

  const fetchProactiveInsights = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/coach/${assessmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_proactive_insights'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights || [])
      }
    } catch (error) {
      console.error('Error fetching proactive insights:', error)
      // Mock insights for demo
      setInsights([
        {
          type: 'milestone_celebration',
          priority: 'high',
          message: '🔥 Incredible! You\'ve maintained a 14-day streak! This level of consistency is building life-changing habits.',
          actionable: true,
          suggestedActions: [
            'Set a new personal best goal for 21 days',
            'Reflect on what strategies helped you maintain this streak',
            'Consider increasing task difficulty to match your growing discipline'
          ],
          triggerData: { streakDays: 14 }
        },
        {
          type: 'habit_suggestion',
          priority: 'medium',
          message: 'Your financial area (23rd percentile) shows the most growth potential. Small daily habits here could create significant improvements.',
          actionable: true,
          suggestedActions: [
            'Set one micro-habit for financial improvement',
            'Schedule 15 minutes daily for financial tasks',
            'Track progress in this area for better awareness'
          ],
          triggerData: { category: 'financial', percentile: 23 }
        },
        {
          type: 'motivation_boost',
          priority: 'medium',
          message: 'I see you\'ve been facing some challenges lately. Remember, difficult periods are often when the most growth happens.',
          actionable: true,
          suggestedActions: [
            'Focus on just one small win today',
            'Practice self-compassion - progress isn\'t always linear',
            'Consider what support or resources might help'
          ],
          triggerData: { mood: 'challenging' }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const dismissInsight = (insightIndex: number) => {
    const newDismissed = new Set(dismissedInsights)
    newDismissed.add(insightIndex.toString())
    setDismissedInsights(newDismissed)
  }

  const toggleExpanded = (insightIndex: number) => {
    const key = insightIndex.toString()
    setExpandedInsight(expandedInsight === key ? null : key)
  }

  const visibleInsights = insights.filter((_, index) => 
    !dismissedInsights.has(index.toString())
  )

  if (loading) {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (visibleInsights.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-2">All Caught Up!</h3>
        <p className="text-gray-600 text-sm">
          No new insights right now. Keep up the great work!
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="h-5 w-5 text-yellow-500 mr-2" />
          AI Insights
        </h3>
        <span className="text-sm text-gray-500">
          {visibleInsights.length} insight{visibleInsights.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {visibleInsights.map((insight, index) => {
          const config = insightConfig[insight.type]
          const priority = priorityConfig[insight.priority]
          const Icon = config.icon
          const isExpanded = expandedInsight === index.toString()
          
          return (
            <div
              key={index}
              className={`border rounded-xl p-4 ${config.bgColor} ${config.borderColor} transition-all duration-200`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-lg bg-white ${config.color} flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {config.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${priority.indicator} ${priority.pulse}`} />
                        <span className="text-xs text-gray-500">{priority.label}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-2">
                  {insight.actionable && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="p-1 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                    >
                      <ChevronRight 
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                  )}
                  <button
                    onClick={() => dismissInsight(index)}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Expanded Actions */}
              {isExpanded && insight.suggestedActions && (
                <div className="mt-4 pt-3 border-t border-white border-opacity-50">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Suggested Actions:
                  </h5>
                  <div className="space-y-2">
                    {insight.suggestedActions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-3 pt-2 border-t border-white border-opacity-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Just now</span>
                  </div>
                  {insight.actionable && (
                    <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full">
                      Actionable
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Refresh Button */}
      <div className="text-center pt-2">
        <button
          onClick={fetchProactiveInsights}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Refresh Insights
        </button>
      </div>
    </div>
  )
}