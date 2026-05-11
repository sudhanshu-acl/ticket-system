'use client';

import React, { useState } from 'react';
import AITopologyGraph from '@/app/components/AITopologyGraph';

export default function TopologyPage() {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/ticket/${ticketId.trim()}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch ticket');
      }
      
      setTicket(result.data);
    } catch (err: any) {
      setError(err.message);
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTicketId('');
    setTicket(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Topology</h1>
          <p className="mt-1 text-sm text-slate-600">
            Interactive visualization of the AI-driven ticket resolution and triage flow.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Ticket ID..."
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? 'Searching...' : 'Trace'}
          </button>
          {ticket && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {ticket && (
        <div className="p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200 flex justify-between items-center">
          <div>
            <strong>Tracking Ticket:</strong> {ticket.title} ({ticket._id})
          </div>
          <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold uppercase tracking-wider text-blue-600 border border-blue-200">
            Status: {ticket.status}
          </span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="h-[700px] w-full">
          <AITopologyGraph ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
