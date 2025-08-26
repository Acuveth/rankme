import React, { useState } from 'react'
import { Calendar, Clock, Bell, ChevronRight } from 'lucide-react'

interface CheckInSetupProps {
  onComplete: (settings: CheckInSettings) => void
  initialSettings?: CheckInSettings
}

export interface CheckInSettings {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  time: string
  days?: string[]
}

export const CheckInSetup: React.FC<CheckInSetupProps> = ({ onComplete, initialSettings }) => {
  const [settings, setSettings] = useState<CheckInSettings>(initialSettings || {
    frequency: 'daily',
    time: '09:00',
    days: ['Monday']
  })

  const frequencies = [
    { value: 'daily', label: 'Daily', description: 'Check in every day' },
    { value: 'weekly', label: 'Weekly', description: 'Check in on specific days' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Check in every 2 weeks' },
    { value: 'monthly', label: 'Monthly', description: 'Check in once a month' }
  ]

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const handleDayToggle = (day: string) => {
    const currentDays = settings.days || []
    if (currentDays.includes(day)) {
      setSettings({
        ...settings,
        days: currentDays.filter(d => d !== day)
      })
    } else {
      setSettings({
        ...settings,
        days: [...currentDays, day]
      })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Bell className="h-6 w-6 text-gray-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Set Up Check-Ins</h2>
        </div>
        <p className="text-gray-600">
          Regular check-ins help you stay on track and reflect on your progress. 
          Choose how often you'd like to check in with your AI coach.
        </p>
      </div>

      {/* Frequency Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How often would you like to check in?
        </label>
        <div className="grid gap-3">
          {frequencies.map((freq) => (
            <button
              key={freq.value}
              onClick={() => setSettings({ ...settings, frequency: freq.value as any })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                settings.frequency === freq.value
                  ? 'border-gray-900 bg-gray-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{freq.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{freq.description}</div>
                </div>
                {settings.frequency === freq.value && (
                  <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="mb-6">
        <label htmlFor="check-in-time" className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            What time would you like to check in?
          </div>
        </label>
        <input
          id="check-in-time"
          type="time"
          value={settings.time}
          onChange={(e) => setSettings({ ...settings, time: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-2">
          We'll send you a reminder at this time
        </p>
      </div>

      {/* Day Selection (for weekly) */}
      {settings.frequency === 'weekly' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Which days would you like to check in?
            </div>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {weekDays.map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
                  settings.days?.includes(day)
                    ? 'border-gray-900 bg-gray-100 text-gray-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Your check-in schedule:</div>
        <div className="text-gray-900">
          {settings.frequency === 'daily' && `Every day at ${settings.time}`}
          {settings.frequency === 'weekly' && `Every ${settings.days?.join(', ')} at ${settings.time}`}
          {settings.frequency === 'biweekly' && `Every 2 weeks at ${settings.time}`}
          {settings.frequency === 'monthly' && `Once a month at ${settings.time}`}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => onComplete(settings)}
        disabled={settings.frequency === 'weekly' && (!settings.days || settings.days.length === 0)}
        className="w-full flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Continue Setup
        <ChevronRight className="h-4 w-4 ml-2" />
      </button>
    </div>
  )
}