'use client'

import React from 'react'
import Link from 'next/link'
import { TicketFormData } from '@/app/components/CreateTicketModal'
import { Priority, category, IncidentTicket } from '@/app/data/dummy'
import { useState } from 'react'
import { Toast, ToastType } from '@/app/components/toast'

export default function CreateTicketFullPage() {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category: 'Infrastructure',
    priority: 'Medium',
  })

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null)

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
    setToast(null)

    setTimeout(() => {
      console.log('New ticket created via full page:', formData)
      setToast({ message: `Ticket created: ${formData.title}`, type: 'success' })
      setFormData({
        title: '',
        description: '',
        category: 'Infrastructure',
        priority: 'Medium',
      })
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Ticket</h1>
          <p className="text-slate-600 mb-6">Fill out the form below to create a support ticket</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Brief title of the issue"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Detailed description of the issue"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
              <label className="block text-sm font-medium text-slate-900 mb-2">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
              <Link href="/dashboard" className="flex-1 px-6 py-3 bg-gray-200 text-slate-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
