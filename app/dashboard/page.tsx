'use client'

import React, { useEffect, useState } from 'react'
import { sampleTickets } from '../data/tickets'
import { User } from '@/app/utils/type'
import { IncidentTicket, Status } from '../data/dummy'
import { getTickets } from '../actions/tickets/getTicket'
import TicketAnalyticsModal from '../components/TicketAnalyticsModal'

const DashboardPage = () => {
  const [tickets, setTickets] = useState<IncidentTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<IncidentTicket | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAnalyticsModalOpen, setAnalyticsModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<Status>('Open')
  const [resolvedBy, setResolvedBy] = useState('')

  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }

      setLoading(true)
      const fetchedTickets = await getTickets()
      setTickets(fetchedTickets || [])
      setLoading(false)
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    const currentStats = {
      totalTickets: tickets.length,
      openTickets: tickets.filter((t) => t.status === 'Open').length,
      inProgress: tickets.filter((t) => t.status === 'In Progress').length,
      resolved: tickets.filter((t) => t.status === 'Resolved').length,
    }
    setStats(currentStats)
  }, [tickets])

  const handleRowClick = (ticket: IncidentTicket) => {
    if (user?.role === 'admin') {
      setSelectedTicket(ticket)
      setNewStatus(ticket.status)
      setResolvedBy('') // could be prepopulated if it existed on the dummy ticket
      setIsSidebarOpen(true)
    }
  }

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return

    try {
      const res = await fetch(`/api/ticket/${selectedTicket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, resolvedBy })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update ticket');

      const updatedTickets = tickets.map((t) => {
        if (t._id === selectedTicket._id) {
          return {
            ...t,
            status: newStatus,
            // Add 'resolvedBy' if you add it to the Interface later
          }
        }
        return t
      })

      setTickets(updatedTickets)
      setIsSidebarOpen(false)
      setSelectedTicket(null)
      alert("Ticket updated successfully!"); // Or use the toast component if we had added it here
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800'
      case 'In Progress':
        return 'bg-purple-100 text-purple-800'
      case 'Resolved':
        return 'bg-green-100 text-green-800'
      case 'Closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm text-slate-600">Total Tickets</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalTickets}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-slate-600">Open</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.openTickets}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-sm text-slate-600">In Progress</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm text-slate-600">Resolved</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.resolved}</p>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
          {user?.role === 'admin' && (
            <button
              onClick={() => setAnalyticsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <span>✨</span> AI Analysis
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Reported By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className={`hover:bg-gray-50 ${user?.role === 'admin' ? 'cursor-pointer' : ''}`}
                  onClick={() => handleRowClick(ticket)}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">{ticket._id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ticket.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ticket.reportedBy.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Edit Sidebar */}
      {isSidebarOpen && selectedTicket && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 transform transition-transform duration-300">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Update Ticket</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Ticket ID</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedTicket._id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Title</p>
                <p className="mt-1 text-slate-900">{selectedTicket.title}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Status)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {(newStatus === 'Resolved' || newStatus === 'Closed') && (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Resolved By
                  </label>
                  <input
                    type="text"
                    value={resolvedBy}
                    onChange={(e) => setResolvedBy(e.target.value)}
                    placeholder="Enter name or ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTicket}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for the sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* AI Analytics Modal */}
      <TicketAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
      />
    </div>
  )
}

export default DashboardPage

