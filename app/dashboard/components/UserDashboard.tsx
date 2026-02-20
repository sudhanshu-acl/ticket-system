'use client';

import { sampleTickets } from '@/app/data/tickets';

export default function UserDashboard() {
  // User sees only their own tickets (simulated with first 2 tickets)
  const userTickets = sampleTickets.slice(0, 2);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">My Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">View and manage your support tickets</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors text-left">
          <span className="block text-lg">Create New Ticket</span>
          <span className="text-sm text-amber-100">Submit a new support request</span>
        </button>
        <button className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-black dark:text-zinc-50 font-medium py-4 px-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700 transition-colors text-left">
          <span className="block text-lg">View My Tickets</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Track your existing requests</span>
        </button>
      </div>

      {/* My Tickets */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">My Recent Tickets</h2>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {userTickets.map((ticket) => (
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
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-black dark:text-zinc-50 mt-2">{ticket.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{ticket.description}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="ml-4 px-3 py-1 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-zinc-700 border border-amber-600 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
