import React from 'react';
import UserListing from '../../components/UserListing';

export default function UsersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all registered platform users.</p>
      </div>
      
      <UserListing />
    </div>
  );
}
