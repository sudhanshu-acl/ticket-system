"use client";

import { useState } from 'react';
import { IncidentTicket } from '../data/dummy';
import { getPriorityColor, getStatusColor } from '../utils/helper';
import CreateTicketModal, { TicketFormData } from '../components/CreateTicketModal';
import { useAuth } from '../context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTickets } from '../actions/tickets/getTicket';

const TicketCard = ({ ticket }: { ticket: IncidentTicket }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <div className="flex justify-between items-start mb-3">
      <span className="text-sm font-medium text-gray-500">{ticket._id}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
        {ticket.status}
      </span>
    </div>
    <h3 className="font-semibold text-lg text-gray-900 mb-2">{ticket.title}</h3>
    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
    <div className="flex flex-wrap gap-2 mb-3">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
        {ticket.priority}
      </span>
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {ticket.category}
      </span>
    </div>
    <div className="text-sm text-gray-500">
      <p>Reported by: {ticket.reportedBy.name}</p>
      <p>Department: {ticket.reportedBy.department}</p>
      {/* <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p> */}
    </div>
  </div>
);

const TicketTable = ({ tickets }: { tickets: IncidentTicket[] }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <tr key={ticket._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket._id}</td>
            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{ticket.title}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.category}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.reportedBy.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(ticket.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TableSkeleton = () => (
  <div className="overflow-x-auto bg-white rounded-lg shadow">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {[...Array(7)].map((_, i) => (
            <th key={i} className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-[100px]"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(5)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {[...Array(7)].map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-[150px]"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
        <div className="flex justify-between items-start mb-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function TicketPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const data = await getTickets();
      return Array.isArray(data) ? data : [];
    }
  });

  const tickets = ticketsData || [];

  const handleCreateTicket = async (data: TicketFormData) => {

    const formateData = {
      ...data,
      status: "Open",
      reportedBy: {
        name: user?.name,
        email: user?.email,
        department: "developer",
      },
    }
    const response = await fetch('/api/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formateData),
    });
    console.log('RES ', response);

    if (response.ok) {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">


          {/* View Toggle and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
            <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Ticket
            </button>
          </div>
        </div>

        {/* Ticket Count */}
        <div className="mb-4 text-gray-600">
          Showing {tickets.length} tickets
        </div>

        {/* Content based on view mode */}
        {isLoading ? (
          viewMode === 'table' ? <TableSkeleton /> : <CardsSkeleton />
        ) : viewMode === 'table' ? (
          <TicketTable tickets={tickets} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}
