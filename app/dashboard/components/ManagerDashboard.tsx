'use client';

import { sampleTickets } from '@/app/data/tickets';

export default function ManagerDashboard() {
  // Manager sees tickets assigned to their team
  const teamTickets = sampleTickets.filter(t => 
    t.status === 'Open' || t.status === 'In Progress'
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Manager Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">Team overview and ticket assignment</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Team Tickets</h3>
          <p className="text-3xl font-bold text-black dark:text-zinc-50 mt-2">{teamTickets.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Awaiting Assignment</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {teamTickets.filter(t => t.status === 'Open').length}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">In Progress</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {teamTickets.filter(t => t.status === 'In Progress').length}
          </p>
        </div>
      </div>

      {/* Team Tickets */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Team Tickets</h2>
          <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
            Assign Ticket
          </button>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {teamTickets.map((ticket) => (
            <div key={ticket.ticketId} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-amber-600">{ticket.ticketId}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-black dark:text-zinc-50 mt-2">{ticket.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{ticket.description}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    Reported by: {ticket.reportedBy.name} - {ticket.reportedBy.department}
                  </p>
                </div>
                <button className="ml-4 px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
