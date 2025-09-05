'use client'

import { useState } from 'react'
import { Target, Heart, Users, Star, DollarSign, Brain, Zap, Calendar, CheckCircle } from 'lucide-react'

interface PreferenceData {
  primaryFocus: string
  secondaryFocus?: string
  dailyTaskCount: number
  weeklyTaskCount: number
  taskDifficulty: string
  coachingStyle: string
  motivationLevel: string
  checkInFrequency: string
  checkInTime: string
  specificGoals?: string
}

interface CoachPreferenceSetupProps {
  onComplete: (preferences: PreferenceData) => void
  assessmentId: string
  initialPreferences?: Partial<PreferenceData>
}

export default function CoachPreferenceSetup({ onComplete, assessmentId, initialPreferences }: CoachPreferenceSetupProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<PreferenceData>({
    primaryFocus: initialPreferences?.primaryFocus || 'financial',
    secondaryFocus: initialPreferences?.secondaryFocus,
    dailyTaskCount: initialPreferences?.dailyTaskCount || 3,
    weeklyTaskCount: initialPreferences?.weeklyTaskCount || 2,
    taskDifficulty: initialPreferences?.taskDifficulty || 'moderate',
    coachingStyle: initialPreferences?.coachingStyle || 'supportive',
    motivationLevel: initialPreferences?.motivationLevel || 'balanced',
    checkInFrequency: initialPreferences?.checkInFrequency || 'daily',
    checkInTime: initialPreferences?.checkInTime || '09:00',
    specificGoals: initialPreferences?.specificGoals || ''
  })

  const focusAreas = [
    { id: 'financial', name: 'Financial Health', icon: DollarSign, description: 'Budget management & wealth building' },
    { id: 'health', name: 'Physical Health', icon: Heart, description: 'Fitness, nutrition & wellness habits' },
    { id: 'social', name: 'Social Life', icon: Users, description: 'Relationships & social connections' },
    { id: 'personal', name: 'Personal Growth', icon: Star, description: 'Self-improvement & skill development' }
  ]

  const coachingStyles = [
    { id: 'supportive', name: 'Supportive', description: 'Gentle encouragement and empathetic guidance' },
    { id: 'direct', name: 'Direct', description: 'Straightforward, action-oriented coaching' },
    { id: 'motivational', name: 'Motivational', description: 'High-energy, inspiring approach' },
    { id: 'analytical', name: 'Analytical', description: 'Data-driven, logical guidance' }
  ]

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save preferences to server before completing
      setLoading(true)
      console.log('📤 SAVING PREFERENCES TO SERVER...')
      console.log('Assessment ID:', assessmentId)
      console.log('Preferences:', preferences)
      
      try {
        const response = await fetch('/api/coach-preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            preferences,
            assessmentId
          })
        })

        console.log('📊 Save response status:', response.status)

        if (response.ok) {
          console.log('✅ Preferences saved successfully!')
          onComplete(preferences)
        } else {
          console.error('❌ Failed to save preferences:', response.status)
          // Still complete onboarding to prevent user from being stuck
          onComplete(preferences)
        }
      } catch (error) {
        console.error('Error saving preferences:', error)
        // Still complete onboarding to prevent user from being stuck
        onComplete(preferences)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Setup Progress</span>
          <span className="text-sm font-medium text-gray-600">Step {step} of 4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Focus Areas */}
      {step === 1 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your AI Life Coach!</h2>
            <p className="text-gray-600">Let's personalize your experience. What area would you like to focus on?</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Primary Focus Area</label>
              <div className="grid grid-cols-2 gap-4">
                {focusAreas.map(area => {
                  const Icon = area.icon
                  return (
                    <button
                      key={area.id}
                      onClick={() => setPreferences({ ...preferences, primaryFocus: area.id })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.primaryFocus === area.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${
                        preferences.primaryFocus === area.id ? 'text-gray-900' : 'text-gray-600'
                      }`} />
                      <h3 className="font-semibold text-gray-900">{area.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Secondary Focus Area (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {focusAreas.filter(a => a.id !== preferences.primaryFocus).map(area => {
                  const Icon = area.icon
                  return (
                    <button
                      key={area.id}
                      onClick={() => setPreferences({ 
                        ...preferences, 
                        secondaryFocus: preferences.secondaryFocus === area.id ? undefined : area.id 
                      })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        preferences.secondaryFocus === area.id
                          ? 'border-gray-700 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${
                        preferences.secondaryFocus === area.id ? 'text-gray-700' : 'text-gray-600'
                      }`} />
                      <h3 className="font-semibold text-gray-900">{area.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Task Preferences */}
      {step === 2 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Preferences</h2>
            <p className="text-gray-600">How many tasks would you like to work on?</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Tasks: {preferences.dailyTaskCount}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={preferences.dailyTaskCount}
                onChange={(e) => setPreferences({ ...preferences, dailyTaskCount: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 task</span>
                <span>3 tasks (recommended)</span>
                <span>5 tasks</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Tasks: {preferences.weeklyTaskCount}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={preferences.weeklyTaskCount}
                onChange={(e) => setPreferences({ ...preferences, weeklyTaskCount: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No weekly tasks</span>
                <span>2-3 (recommended)</span>
                <span>5 tasks</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Task Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'moderate', 'challenging'].map(level => (
                  <button
                    key={level}
                    onClick={() => setPreferences({ ...preferences, taskDifficulty: level })}
                    className={`py-2 px-4 rounded-lg border-2 transition-all capitalize ${
                      preferences.taskDifficulty === level
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Goals or Challenges (Optional)
              </label>
              <textarea
                value={preferences.specificGoals}
                onChange={(e) => setPreferences({ ...preferences, specificGoals: e.target.value })}
                placeholder="E.g., 'I want to save $5000 this year' or 'I need help with budgeting and reducing debt'"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Coaching Style */}
      {step === 3 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coaching Style</h2>
            <p className="text-gray-600">How would you like me to interact with you?</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Coaching Approach</label>
              <div className="space-y-3">
                {coachingStyles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setPreferences({ ...preferences, coachingStyle: style.id })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      preferences.coachingStyle === style.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{style.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Motivation Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'gentle', name: 'Gentle', description: 'Soft encouragement' },
                  { id: 'balanced', name: 'Balanced', description: 'Mixed approach' },
                  { id: 'intense', name: 'Intense', description: 'Push me hard' }
                ].map(level => (
                  <button
                    key={level.id}
                    onClick={() => setPreferences({ ...preferences, motivationLevel: level.id })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.motivationLevel === level.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{level.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Check-ins */}
      {step === 4 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check-in Preferences</h2>
            <p className="text-gray-600">How often would you like to check in on your progress?</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Check-in Frequency</label>
              <div className="grid grid-cols-3 gap-3">
                {['daily', 'weekly', 'biweekly'].map(freq => (
                  <button
                    key={freq}
                    onClick={() => setPreferences({ ...preferences, checkInFrequency: freq })}
                    className={`py-2 px-4 rounded-lg border-2 transition-all capitalize ${
                      preferences.checkInFrequency === freq
                        ? 'border-gray-900 bg-gray-50 text-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Check-in Time
              </label>
              <input
                type="time"
                value={preferences.checkInTime}
                onChange={(e) => setPreferences({ ...preferences, checkInTime: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">You're all set!</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your preferences will be saved and used to personalize your coaching experience. 
                    You can always update these settings later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            step === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {loading ? 'Saving...' : (step === 4 ? 'Complete Setup' : 'Next')}
        </button>
      </div>
    </div>
  )
}