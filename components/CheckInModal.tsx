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
    { value: 'great', label: 'Great', icon: '😊' },
    { value: 'good', label: 'Good', icon: '🙂' },
    { value: 'okay', label: 'Okay', icon: '😐' },
    { value: 'challenging', label: 'Bad', icon: '😕' },
    { value: 'difficult', label: 'Awful', icon: '😔' }
  ]

  const questions = [
    "What's one accomplishment today?",
    "Biggest challenge?",
    "Tomorrow's focus?",
    "Self-care today?"
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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          {/* Compact Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Check-In</h2>
                <p className="text-xs text-gray-600">Step {step} of 3</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4">
            {/* Step 1: Mood & Energy - Compact */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    How are you feeling?
                  </h3>
                  <div className="grid grid-cols-5 gap-1">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setCheckInData({ ...checkInData, mood: mood.value })}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          checkInData.mood === mood.value
                            ? 'border-gray-900 bg-gray-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg">{mood.icon}</div>
                        <div className="text-xs mt-1">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Energy Level
                  </h3>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={checkInData.energy}
                    onChange={(e) => setCheckInData({ ...checkInData, energy: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Low</span>
                    <span className="font-semibold text-gray-900">{checkInData.energy}/10</span>
                    <span>High</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!checkInData.mood}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Quick Reflection - Very Compact */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Quick Reflection (Optional)
                </h3>

                {questions.map((question, index) => (
                  <div key={index}>
                    <label className="text-xs font-medium text-gray-700">
                      {question}
                    </label>
                    <input
                      type="text"
                      value={checkInData.responses[`q${index}`] || ''}
                      onChange={(e) => setCheckInData({
                        ...checkInData,
                        responses: {
                          ...checkInData.responses,
                          [`q${index}`]: e.target.value
                        }
                      })}
                      className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Brief answer..."
                    />
                  </div>
                ))}

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Notes & Complete - Compact */}
            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Additional Notes (Optional)
                  </h3>
                  <textarea
                    rows={3}
                    value={checkInData.notes}
                    onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm resize-none"
                    placeholder="Any other thoughts..."
                  />
                </div>

                {/* Compact Summary */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Summary</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mood:</span>
                      <span className="font-medium">
                        {moods.find(m => m.value === checkInData.mood)?.icon} {moods.find(m => m.value === checkInData.mood)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy:</span>
                      <span className="font-medium">{checkInData.energy}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reflections:</span>
                      <span className="font-medium">
                        {Object.values(checkInData.responses).filter(r => r).length}/4
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm"
                  >
                    Complete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}