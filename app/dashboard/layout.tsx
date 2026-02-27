
'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/app/components/Sidebar'
import CreateTicketModal from '@/app/components/CreateTicketModal'
import { User } from '@/app/utils/type'
import { TicketFormData } from '@/app/components/CreateTicketModal'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Redirect to login if no user
      window.location.href = '/login'
    }
    setLoading(false)
  }, [])

  const handleCreateTicket = (ticketData: TicketFormData) => {
    console.log('New ticket created:', ticketData)
    // Here you would typically send the data to your API
    alert(`Ticket created: ${ticketData.title}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  const mainMargin = sidebarCollapsed ? '5rem' : '16rem'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar user={user} onCreateTicket={() => setIsCreateTicketOpen(true)} onCollapsedChange={setSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: mainMargin }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user.username}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role || 'user'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  )
}
