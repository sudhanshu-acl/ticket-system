'use client'

import React, { useState } from 'react'
import { Priority, category } from '@/app/data/dummy'

interface CreateTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ticketData: TicketFormData) => void
}

export interface TicketFormData {
  title: string
  description: string
  category: string
  priority: Priority
  impact: string
  urgency: string
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category: 'Infrastructure',
    priority: 'Medium',
    impact: 'Medium',
    urgency: 'Medium',
  })

  const [loading, setLoading] = useState(false)

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

  const impacts = ['Low', 'Medium', 'High']
  const urgencies = ['Low', 'Medium', 'High']

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

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData)
      setFormData({
        title: '',
        description: '',
        category: 'Infrastructure',
        priority: 'Medium',
        impact: 'Medium',
        urgency: 'Medium',
      })
      setLoading(false)
      onClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
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

          {/* Impact and Urgency (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Impact *</label>
              <select
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {impacts.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Urgency *</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {urgencies.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-slate-900 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e as any)}
            disabled={loading}
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
