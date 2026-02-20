'use client';

import { useState } from 'react';
import { UserRole } from '@/app/utils/type';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import UserDashboard from './components/UserDashboard';

export default function DashboardPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const renderDashboard = () => {
    switch (selectedRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'user':
        return <UserDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      {/* Role Selector */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black dark:text-zinc-50">View As Role:</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Switch between different role views to understand the dashboard behavior</p>
            </div>
            <div className="flex gap-2">
              {(['admin', 'manager', 'user'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedRole === role
                      ? 'bg-amber-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto">
        {renderDashboard()}
      </div>
    </div>
  );
}
