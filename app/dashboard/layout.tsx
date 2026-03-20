
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/components/Sidebar'
import { User } from '@/app/utils/type'

export default function DashboardLayout({
  children,
  createTicketModal,
}: {
  children: React.ReactNode
  createTicketModal: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      // Redirect to unauthorized if user is 'user'
      if (parsedUser.role === 'user') {
        router.push('/unauthorized')
        return
      }
    } else {
      // Redirect to login if no user
      router.push('/login')
    }
    setLoading(false)
  }, [])

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

  // Default to collapsed view (no Sidebar) if user role is 'user', otherwise handle via state
  const isNormalUser = user?.role === 'user'
  const mainMargin = isNormalUser ? '0' : (sidebarCollapsed ? '5rem' : '16rem')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for Admins & Support */}
      {!isNormalUser && <Sidebar user={user} onCollapsedChange={setSidebarCollapsed} />}

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: mainMargin }}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user.name || user.email}</p>
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

      {/* Parallel Route: Create Ticket Modal */}
      {createTicketModal}
    </div>
  )
}
