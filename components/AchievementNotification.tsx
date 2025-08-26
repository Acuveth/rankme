import React, { useEffect, useState } from 'react'
import { Trophy, X } from 'lucide-react'

interface AchievementNotificationProps {
  achievement: {
    title: string
    description: string
    icon: string
    level: string
  } | null
  onClose: () => void
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Allow fade out animation
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const levelColors = {
    bronze: 'from-gray-400 to-gray-600',
    silver: 'from-gray-500 to-gray-700',
    gold: 'from-gray-700 to-gray-900',
    platinum: 'from-gray-800 to-black'
  }

  const levelBgColors = {
    bronze: 'bg-gray-50 border-gray-200',
    silver: 'bg-gray-50 border-gray-300',
    gold: 'bg-gray-100 border-gray-400',
    platinum: 'bg-gray-100 border-gray-500'
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`${levelBgColors[achievement.level as keyof typeof levelBgColors]} border-2 rounded-xl p-4 shadow-lg max-w-sm`}>
        <div className="flex items-start">
          <div className={`w-12 h-12 bg-gradient-to-br ${levelColors[achievement.level as keyof typeof levelColors]} rounded-full flex items-center justify-center flex-shrink-0`}>
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3 flex-1">
            <h4 className="text-lg font-bold text-gray-900">Achievement Unlocked!</h4>
            <p className="text-sm font-semibold text-gray-800 mt-1">{achievement.title}</p>
            <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}