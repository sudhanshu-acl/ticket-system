'use client'

import React, { useEffect, useState } from 'react'
import { sampleTickets } from '../data/tickets'

const DashboardPage = () => {
  const [tickets, setTickets] = useState(sampleTickets.slice(0, 5))
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    // Calculate stats
    const stats = {
      totalTickets: sampleTickets.length,
      openTickets: sampleTickets.filter((t) => t.status === 'Open').length,
      inProgress: sampleTickets.filter((t) => t.status === 'In Progress').length,
      resolved: sampleTickets.filter((t) => t.status === 'Resolved').length,
    }
    setStats(stats)
  }, [])

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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
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
                <tr key={ticket.ticketId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">{ticket.ticketId}</td>
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
    </div>
  )
}

export default DashboardPage

