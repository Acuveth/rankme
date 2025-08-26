'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Save } from 'lucide-react'

interface Task {
  title: string
  description: string
  category: string
}

interface WeeklyTaskCreatorModalProps {
  currentWeek: string
  onClose: () => void
  onSubmit: (tasksData: { tasks: Task[], week: string }) => Promise<void>
}

export default function WeeklyTaskCreatorModal({
  currentWeek,
  onClose,
  onSubmit
}: WeeklyTaskCreatorModalProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { title: '', description: '', category: 'financial' }
  ])
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: 'financial', label: 'Financial Health', color: 'bg-green-100 text-green-800' },
    { value: 'health', label: 'Physical Wellness', color: 'bg-blue-100 text-blue-800' },
    { value: 'social', label: 'Social Connection', color: 'bg-purple-100 text-purple-800' },
    { value: 'personal', label: 'Personal Development', color: 'bg-orange-100 text-orange-800' },
    { value: 'career', label: 'Career Growth', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'mindfulness', label: 'Mindfulness', color: 'bg-pink-100 text-pink-800' }
  ]

  const addTask = () => {
    setTasks([...tasks, { title: '', description: '', category: 'financial' }])
  }

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index))
    }
  }

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    )
    setTasks(updatedTasks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate tasks
    const validTasks = tasks.filter(task => task.title.trim() && task.description.trim())
    
    if (validTasks.length === 0) {
      alert('Please add at least one complete task')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ tasks: validTasks, week: currentWeek })
      onClose()
    } catch (error) {
      console.error('Error creating tasks:', error)
      alert('Failed to create tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (value: string) => {
    return categories.find(cat => cat.value === value)?.label || value
  }

  const getCategoryColor = (value: string) => {
    return categories.find(cat => cat.value === value)?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Weekly Tasks</h2>
            <p className="text-gray-600 mt-1">Week of {currentWeek}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {tasks.map((task, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Task {index + 1}</h3>
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid gap-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={task.category}
                      onChange={(e) => updateTask(index, 'category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-white"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(task.category)}`}>
                        {getCategoryLabel(task.category)}
                      </span>
                    </div>
                  </div>

                  {/* Task Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(index, 'title', e.target.value)}
                      placeholder="e.g., Review monthly budget and expenses"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      required
                    />
                  </div>

                  {/* Task Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      placeholder="Provide details about what needs to be done..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Task Button */}
            <button
              type="button"
              onClick={addTask}
              className="w-full flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Task
            </button>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Tasks
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}