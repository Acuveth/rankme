'use client'

import { useState } from 'react'
import { Brain, Target, Zap, BarChart3, Check } from 'lucide-react'

interface CoachingStyle {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  example: string
  benefits: string[]
}

const coachingStyles: CoachingStyle[] = [
  {
    id: 'supportive',
    name: 'Supportive Coach',
    description: 'Encouraging, gentle guidance with empathetic tone',
    icon: <Brain className="h-6 w-6" />,
    example: "I'm here to support you on your journey. How are you feeling about your progress today?",
    benefits: [
      'Builds confidence gradually',
      'Creates safe learning environment', 
      'Focuses on emotional well-being',
      'Perfect for overcoming setbacks'
    ]
  },
  {
    id: 'direct',
    name: 'Direct Coach',
    description: 'Straightforward, action-oriented with clear instructions',
    icon: <Target className="h-6 w-6" />,
    example: "Let's get straight to it. Based on your 67% completion rate, here's exactly what you need to do next.",
    benefits: [
      'Clear, actionable guidance',
      'Eliminates confusion and overthinking',
      'Maximizes productive time',
      'Great for decisive personalities'
    ]
  },
  {
    id: 'motivational',
    name: 'Motivational Coach',
    description: 'High-energy, achievement-focused with inspiring language',
    icon: <Zap className="h-6 w-6" />,
    example: "You're crushing it! Your 10-day streak shows you have what it takes to achieve anything!",
    benefits: [
      'Boosts energy and enthusiasm',
      'Celebrates every victory',
      'Maintains high momentum',
      'Inspires breakthrough thinking'
    ]
  },
  {
    id: 'analytical',
    name: 'Analytical Coach',
    description: 'Data-driven, metric-focused with logical reasoning',
    icon: <BarChart3 className="h-6 w-6" />,
    example: "Your completion rate improved 23% this week. This trend suggests these specific strategies are working...",
    benefits: [
      'Evidence-based recommendations',
      'Tracks measurable progress',
      'Optimizes based on patterns',
      'Appeals to logical thinkers'
    ]
  }
]

interface CoachingStyleSelectorProps {
  currentStyle?: string
  onStyleChange?: (styleId: string) => void
  showExample?: boolean
  className?: string
}

export default function CoachingStyleSelector({
  currentStyle = 'supportive',
  onStyleChange,
  showExample = true,
  className = ''
}: CoachingStyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState(currentStyle)
  const [previewStyle, setPreviewStyle] = useState<string | null>(null)

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId)
    onStyleChange?.(styleId)
  }

  const displayStyle = previewStyle || selectedStyle
  const activeStyle = coachingStyles.find(style => style.id === displayStyle)

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Coaching Style</h3>
        <p className="text-gray-600 text-sm mb-4">
          Your AI coach will adapt its communication style to match your preferences
        </p>
      </div>

      {/* Style Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coachingStyles.map((style) => (
          <div
            key={style.id}
            onClick={() => handleStyleSelect(style.id)}
            onMouseEnter={() => setPreviewStyle(style.id)}
            onMouseLeave={() => setPreviewStyle(null)}
            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedStyle === style.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {/* Selected indicator */}
            {selectedStyle === style.id && (
              <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedStyle === style.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {style.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {style.name}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {style.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Style Preview */}
      {showExample && activeStyle && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {activeStyle.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                {activeStyle.name} Example
              </h4>
              <p className="text-blue-800 text-sm mb-3 italic">
                "{activeStyle.example}"
              </p>
              
              <div className="space-y-1">
                <h5 className="font-medium text-blue-900 text-xs mb-1">Key Benefits:</h5>
                {activeStyle.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-blue-700 text-xs">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Note */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          You can change your coaching style anytime. The AI will immediately adapt its responses.
        </p>
      </div>
    </div>
  )
}