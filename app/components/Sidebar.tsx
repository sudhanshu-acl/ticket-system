'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, UserRole } from '@/app/utils/type'

interface SidebarProps {
  user: User | null
  onCollapsedChange?: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ user, onCollapsedChange }) => {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const handleToggleCollapse = () => {
    const newState = !collapsed
    setCollapsed(newState)
    onCollapsedChange?.(newState)
  }

  // Role-based menu items
  const getMenuItems = (role?: UserRole) => {
    const baseItems = [
      { label: 'Dashboard', href: '/dashboard', icon: '📊' },
      { label: 'My Tickets', href: '/ticket', icon: '🎫' },
    ]

    const roleItems: Record<UserRole, typeof baseItems> = {
      admin: [
        { label: 'Dashboard', href: '/dashboard', icon: '📊' },
        { label: 'Users', href: '/dashboard/users', icon: '👥' },
        { label: 'Reports', href: '/dashboard/reports', icon: '📋' },
        { label: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
        { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
      ],
      support: [
        { label: 'Dashboard', href: '/dashboard', icon: '📊' },
        { label: 'Queue', href: '/dashboard/queue', icon: '📋' },
        { label: 'Reports', href: '/dashboard/reports', icon: '📋' },
        { label: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
      ],
      user: baseItems,
    }

    return roleItems[role || 'user'] || baseItems
  }

  const menuItems = getMenuItems(user?.role)

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-slate-900 text-white h-screen transition-all duration-300 flex flex-col fixed left-0 top-0`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && <h2 className="text-xl font-bold">TicketHub</h2>}
        <button
          onClick={handleToggleCollapse}
          className="p-1 hover:bg-slate-800 rounded"
          title="Toggle sidebar"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-slate-700">
          <p className="font-semibold text-sm">{user.name || user.email}</p>
          <p className="text-xs text-slate-400 capitalize">{user.role || 'user'}</p>
          {user.jobTitle && <p className="text-xs text-slate-400">{user.jobTitle}</p>}
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      )}

      {/* Create Ticket Button */}
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={() => router.push('/dashboard/create-ticket')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded text-sm transition-colors"
          title="Create new ticket"
        >
          {collapsed ? '➕' : 'Create Ticket'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
            title={collapsed ? item.label : ''}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => {
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
          title="Logout"
        >
          {collapsed ? '🚪' : 'Logout'}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
