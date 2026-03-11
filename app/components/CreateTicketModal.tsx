'use client'

import React, { useState } from 'react'
import { Priority, category } from '@/app/data/dummy'
import { Toast, ToastType } from './toast'

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ticketData: TicketFormData) => void
  initialData?: TicketFormData | null
}

export interface TicketFormData {
  title: string
  description: string
  category: string
  priority: Priority
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Infrastructure',
    priority: initialData?.priority || 'Medium',
  })

  // Whenever initialData prop changes (e.g., when modal opens with AI data), reset the form state
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category || 'Infrastructure',
        priority: initialData?.priority || 'Medium',
      });
    }
  }, [isOpen, initialData]);

  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null)

  const handleGenerateAI = async () => {
    if (!aiQuery.trim()) {
      setToast({ message: 'Please enter a description for the AI.', type: 'warning' })
      return
    }

    setAiLoading(true)
    setToast(null)
    try {
      const response = await fetch('/api/ai/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useQuery: aiQuery }),
      })

      if (response.ok) {
        const jsonResponse = await response.json()
        const aiData = jsonResponse.data

        setFormData({
          title: aiData.title || '',
          description: aiData.description || '',
          category: aiData.category || 'Infrastructure',
          priority: aiData.priority ? (aiData.priority.charAt(0).toUpperCase() + aiData.priority.slice(1)) as any : 'Medium'
        })
        setToast({ message: 'Form auto-filled by AI!', type: 'success' })
      } else {
        setToast({ message: 'Failed to generate ticket via AI', type: 'danger' })
      }
    } catch (error) {
      setToast({ message: 'Error connecting to AI service', type: 'danger' })
    } finally {
      setAiLoading(false)
    }
  }

  const categories: category[] = [
    'Infrastructure',
    'Software',
    'Access Management',
    'Cloud & DevOps',
    'Development Support',
    'Security',
    'HR / Admin IT Requests',
  ]

  const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical']


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setToast(null)

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData)
      setToast({ message: 'Ticket created successfully!', type: 'success' })
      setFormData({
        title: '',
        description: '',
        category: 'Infrastructure',
        priority: 'Medium'
      })
      setTimeout(() => {
        setLoading(false)
        onClose()
      }, 700)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {toast && (
        <div className="fixed top-4 right-4 z-[60]">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-slate-900">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* AI Generator Section */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex flex-col gap-3">
            <label className="block text-sm font-semibold text-purple-900">✨ Autofill with AI</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                disabled={loading || aiLoading}
                className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                placeholder="Describe the issue in plain text..."
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={loading || aiLoading || !aiQuery.trim()}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300 whitespace-nowrap"
              >
                {aiLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4 pt-4"></div>

          <form id="create-ticket-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Brief title of the issue"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Detailed description of the issue"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-slate-900 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-ticket-form"
            disabled={loading || aiLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateTicketModal
