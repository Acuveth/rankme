import React, { useState } from 'react'
import { Calendar, Clock, Bell, ChevronRight, X, Plus, Trash2, Sun, Moon, Coffee, Sunset } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

interface CheckInSetupProps {
  onComplete: (settings: CheckInSettings) => void
  onClose?: () => void
  initialSettings?: CheckInSettings
}

export interface CheckInSettings {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'multiple-daily'
  time: string
  times?: string[] // For multiple times per day
  days?: string[]
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'custom'
  reminderMinutesBefore?: number
}

export const CheckInSetup: React.FC<CheckInSetupProps> = ({ onComplete, onClose, initialSettings }) => {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<CheckInSettings>(initialSettings || {
    frequency: 'daily',
    time: '09:00',
    times: [],
    days: ['Monday'],
    timeOfDay: 'morning',
    reminderMinutesBefore: 15
  })

  const [customTimes, setCustomTimes] = useState<string[]>(initialSettings?.times || ['09:00'])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const frequencies = [
    { value: 'daily', label: t('coach.frequencyDaily'), description: t('coach.dailyDescription') },
    { value: 'multiple-daily', label: t('coach.frequencyMultipleDaily'), description: t('coach.multipleDailyDescription') },
    { value: 'weekly', label: t('coach.frequencyWeekly'), description: t('coach.weeklyDescription') },
    { value: 'biweekly', label: t('coach.frequencyBiweekly'), description: t('coach.biweeklyDescription') },
    { value: 'monthly', label: t('coach.frequencyMonthly'), description: t('coach.monthlyDescription') }
  ]

  const weekDays = [t('coach.mon'), t('coach.tue'), t('coach.wed'), t('coach.thu'), t('coach.fri'), t('coach.sat'), t('coach.sun')]
  const fullDays = [t('coach.monday'), t('coach.tuesday'), t('coach.wednesday'), t('coach.thursday'), t('coach.friday'), t('coach.saturday'), t('coach.sunday')]

  const timePresets = [
    { value: 'morning', label: t('coach.morning'), icon: Sun, time: '08:00', description: '8 AM' },
    { value: 'afternoon', label: t('coach.afternoon'), icon: Coffee, time: '13:00', description: '1 PM' },
    { value: 'evening', label: t('coach.evening'), icon: Sunset, time: '18:00', description: '6 PM' },
    { value: 'night', label: 'Night', icon: Moon, time: '21:00', description: '9 PM' },
    { value: 'custom', label: 'Custom', icon: Clock, time: '', description: 'Choose time' }
  ]

  const reminderOptions = [
    { value: 0, label: 'At time' },
    { value: 5, label: '5 min before' },
    { value: 15, label: '15 min before' },
    { value: 30, label: '30 min before' }
  ]

  const handleDayToggle = (day: string, index: number) => {
    const currentDays = settings.days || []
    const fullDay = fullDays[index]
    if (currentDays.includes(fullDay)) {
      setSettings({
        ...settings,
        days: currentDays.filter(d => d !== fullDay)
      })
    } else {
      setSettings({
        ...settings,
        days: [...currentDays, fullDay]
      })
    }
  }

  const handleTimePresetSelect = (preset: typeof timePresets[0]) => {
    if (preset.value === 'custom') {
      setSettings({ ...settings, timeOfDay: 'custom' })
    } else {
      setSettings({ 
        ...settings, 
        timeOfDay: preset.value as any,
        time: preset.time 
      })
    }
  }

  const addCustomTime = () => {
    const newTime = '12:00'
    setCustomTimes([...customTimes, newTime])
    setSettings({
      ...settings,
      times: [...customTimes, newTime]
    })
  }

  const updateCustomTime = (index: number, newTime: string) => {
    const updatedTimes = [...customTimes]
    updatedTimes[index] = newTime
    setCustomTimes(updatedTimes)
    setSettings({
      ...settings,
      times: updatedTimes
    })
  }

  const removeCustomTime = (index: number) => {
    const updatedTimes = customTimes.filter((_, i) => i !== index)
    setCustomTimes(updatedTimes)
    setSettings({
      ...settings,
      times: updatedTimes
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getSchedulePreview = () => {
    if (settings.frequency === 'daily') {
      return `Every day at ${formatTime(settings.time)}`
    } else if (settings.frequency === 'multiple-daily') {
      const times = settings.times?.length ? settings.times : customTimes
      return `Daily at ${times.map(t => formatTime(t)).join(', ')}`
    } else if (settings.frequency === 'weekly') {
      return `Every ${settings.days?.join(', ')} at ${formatTime(settings.time)}`
    } else if (settings.frequency === 'biweekly') {
      return `Every 2 weeks at ${formatTime(settings.time)}`
    } else if (settings.frequency === 'monthly') {
      return `Monthly at ${formatTime(settings.time)}`
    }
    return ''
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t('coach.setUpCheckInsTitle')}</h2>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {/* Frequency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
{t('coach.howOften')}
              </label>
              <div className="space-y-2">
                {frequencies.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setSettings({ ...settings, frequency: freq.value as any })}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      settings.frequency === freq.value
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{freq.label}</div>
                        <div className="text-xs text-gray-600">{freq.description}</div>
                      </div>
                      {settings.frequency === freq.value && (
                        <div className="w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection - Daily */}
            {settings.frequency === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coach.whenLabel')}
                </label>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {timePresets.slice(0, 3).map((preset) => {
                    const Icon = preset.icon
                    return (
                      <button
                        key={preset.value}
                        onClick={() => handleTimePresetSelect(preset)}
                        className={`p-2 rounded-lg border transition-all ${
                          settings.timeOfDay === preset.value
                            ? 'border-gray-900 bg-gray-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs font-medium">{preset.label}</div>
                        <div className="text-xs text-gray-600">{preset.description}</div>
                      </button>
                    )
                  })}
                </div>

                {settings.timeOfDay === 'custom' && (
                  <input
                    type="time"
                    value={settings.time}
                    onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                )}
              </div>
            )}

            {/* Multiple Daily */}
            {settings.frequency === 'multiple-daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coach.times')}
                </label>
                
                <div className="space-y-2">
                  {customTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateCustomTime(index, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-xs text-gray-600 w-16">
                        {formatTime(time)}
                      </span>
                      {customTimes.length > 1 && (
                        <button
                          onClick={() => removeCustomTime(index)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {customTimes.length < 3 && (
                  <button
                    onClick={addCustomTime}
                    className="mt-2 flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <Plus className="h-3 w-3" />
                    {t('coach.addTime')}
                  </button>
                )}
              </div>
            )}

            {/* Time for other frequencies */}
            {(settings.frequency === 'weekly' || settings.frequency === 'biweekly' || settings.frequency === 'monthly') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coach.timeLabel')}
                </label>
                <input
                  type="time"
                  value={settings.time}
                  onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            )}

            {/* Days Selection for Weekly */}
            {settings.frequency === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('coach.daysLabel')}
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {weekDays.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day, index)}
                      className={`px-2 py-1 rounded border text-xs font-medium ${
                        settings.days?.includes(fullDays[index])
                          ? 'border-gray-900 bg-gray-100 text-gray-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {showAdvanced ? t('coach.hideAdvanced') : t('coach.showAdvanced')} Advanced
              </button>

              {showAdvanced && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('coach.reminder')}
                  </label>
                  <select
                    value={settings.reminderMinutesBefore || 15}
                    onChange={(e) => setSettings({ ...settings, reminderMinutesBefore: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white font-medium text-gray-900"
                  >
                    {reminderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-700 mb-1">{t('coach.schedule')}</div>
              <div className="text-sm text-gray-900">
                {getSchedulePreview()}
              </div>
              {settings.reminderMinutesBefore && settings.reminderMinutesBefore > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {t('coach.reminder')}: {settings.reminderMinutesBefore} {t('coach.reminderMinBefore')}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => {
                const finalSettings = {
                  ...settings,
                  times: settings.frequency === 'multiple-daily' ? customTimes : undefined
                }
                onComplete(finalSettings)
              }}
              disabled={
                (settings.frequency === 'weekly' && (!settings.days || settings.days.length === 0)) ||
                (settings.frequency === 'multiple-daily' && customTimes.length === 0)
              }
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
{t('coach.continueSetup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}