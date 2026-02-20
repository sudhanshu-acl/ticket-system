'use client';

import { sampleTickets } from '@/app/data/tickets';
import { DashboardStats } from '@/app/utils/type';

export default function AdminDashboard() {
  // Calculate stats from sample tickets
  const stats: DashboardStats = {
    totalTickets: sampleTickets.length,
    openTickets: sampleTickets.filter(t => t.status === 'Open').length,
    inProgressTickets: sampleTickets.filter(t => t.status === 'In Progress').length,
    resolvedTickets: sampleTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Admin Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">Full system overview and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Tickets</h3>
          <p className="text-3xl font-bold text-black dark:text-zinc-50 mt-2">{stats.totalTickets}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Open</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.openTickets}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">In Progress</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">{stats.inProgressTickets}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Resolved</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolvedTickets}</p>
        </div>
      </div>

      {/* All Tickets Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">All Tickets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sampleTickets.map((ticket) => (
                <tr key={ticket.ticketId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">{ticket.ticketId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-zinc-50">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-zinc-50">{ticket.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                    {ticket.reportedBy.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
