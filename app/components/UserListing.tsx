"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers } from '../actions/users/getUsers';
import { updateUser } from '../actions/users/updateUser';
import EditUserModal from './EditUserModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  jobTitle: string;
}

const TableSkeleton = () => (
  <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {[...Array(5)].map((_, i) => (
            <th key={i} className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-[100px]"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[...Array(5)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {[...Array(5)].map((_, colIndex) => (
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

const UserListing = () => {
    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data: usersData, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const data = await getUsers();
            return Array.isArray(data) ? data : [];
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: { email: string; name: string; role: string; jobTitle: string }) => 
            updateUser(data.email, data.name, data.role, data.jobTitle),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    const handleEditSubmit = async (data: { email: string; name: string; role: string; jobTitle: string }) => {
        await updateMutation.mutateAsync(data);
    };

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="text-red-500 p-4 mt-6 bg-red-50 rounded-lg text-sm">Error loading users. Please try again later.</div>;
    }

    const users: User[] = usersData || [];

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow mt-6">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => (
                        <tr key={user._id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                    {user.role || 'user'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.jobTitle || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => setEditingUser(user)}
                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <EditUserModal 
                isOpen={!!editingUser} 
                onClose={() => setEditingUser(null)} 
                onSubmit={handleEditSubmit} 
                user={editingUser} 
            />
        </div>
    );
};

export default UserListing;