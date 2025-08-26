import React, { useState } from 'react'
import { X, Smile, Meh, Frown, Battery, MessageSquare, ChevronRight, Calendar } from 'lucide-react'

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  checkInId?: string
  onComplete: (data: CheckInData) => void
}

export interface CheckInData {
  checkInId?: string
  mood: string
  energy: number
  notes: string
  responses: {
    [key: string]: string
  }
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ 
  isOpen, 
  onClose,
  checkInId,
  onComplete 
}) => {
  const [step, setStep] = useState(1)
  const [checkInData, setCheckInData] = useState<CheckInData>({
    checkInId,
    mood: '',
    energy: 5,
    notes: '',
    responses: {}
  })

  const moods = [
    { value: 'great', label: 'Great', icon: '😊', color: 'text-gray-900' },
    { value: 'good', label: 'Good', icon: '🙂', color: 'text-gray-800' },
    { value: 'okay', label: 'Okay', icon: '😐', color: 'text-gray-700' },
    { value: 'challenging', label: 'Challenging', icon: '😕', color: 'text-gray-600' },
    { value: 'difficult', label: 'Difficult', icon: '😔', color: 'text-gray-500' }
  ]

  const questions = [
    "What's one thing you accomplished today that you're proud of?",
    "What was your biggest challenge today and how did you handle it?",
    "What are you looking forward to tomorrow?",
    "How did you take care of yourself today?"
  ]

  const handleComplete = () => {
    onComplete(checkInData)
    // Reset for next time
    setStep(1)
    setCheckInData({
      checkInId,
      mood: '',
      energy: 5,
      notes: '',
      responses: {}
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Daily Check-In</h2>
              <p className="text-sm text-gray-600 mt-1">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Mood & Energy */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How are you feeling today?
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setCheckInData({ ...checkInData, mood: mood.value })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        checkInData.mood === mood.value
                          ? 'border-gray-900 bg-gray-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.icon}</div>
                      <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <div className="flex items-center">
                    <Battery className="h-5 w-5 mr-2" />
                    What's your energy level?
                  </div>
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={checkInData.energy}
                    onChange={(e) => setCheckInData({ ...checkInData, energy: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Low</span>
                    <span className="text-lg font-semibold text-gray-900">{checkInData.energy}/10</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!checkInData.mood}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}

          {/* Step 2: Reflection Questions */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Reflection
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take a moment to reflect on your day (optional)
                </p>
              </div>

              {questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {question}
                  </label>
                  <textarea
                    rows={2}
                    value={checkInData.responses[`q${index}`] || ''}
                    onChange={(e) => setCheckInData({
                      ...checkInData,
                      responses: {
                        ...checkInData.responses,
                        [`q${index}`]: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                    placeholder="Your thoughts..."
                  />
                </div>
              ))}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Additional Notes */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Anything else to add?
                  </div>
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Any other thoughts, goals, or notes for today? (optional)
                </p>
              </div>

              <textarea
                rows={5}
                value={checkInData.notes}
                onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Additional notes, thoughts, or reminders..."
              />

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Check-In Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mood:</span>
                    <span className="font-medium text-gray-900">
                      {moods.find(m => m.value === checkInData.mood)?.icon} {' '}
                      {moods.find(m => m.value === checkInData.mood)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy:</span>
                    <span className="font-medium text-gray-900">{checkInData.energy}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reflections:</span>
                    <span className="font-medium text-gray-900">
                      {Object.values(checkInData.responses).filter(r => r).length} answered
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
                >
                  Complete Check-In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}