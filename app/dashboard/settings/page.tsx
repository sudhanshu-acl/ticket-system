'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAIQuota, AIQuota } from '../../actions/ai/getQuota'
import RoleManagement from './RoleManagement'
import PermissionManagement from './PermissionManagement'
import CategoryManagement from './CategoryManagement'
import UserManagement from './UserManagement'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai-billing' | 'users' | 'roles' | 'permissions' | 'categories'>('general')

  const { data: quotaData, isLoading: isLoadingQuota } = useQuery<AIQuota>({
    queryKey: ['aiQuota'],
    queryFn: () => getAIQuota(),
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow min-h-[500px]">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('ai-billing')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'ai-billing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Quota & Billing
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Permissions
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900">Platform Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" defaultValue="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" defaultValue="support@acmecorp.com" />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">Enable email notifications for new tickets</span>
                  </label>
                </div>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm">Save Preferences</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-billing' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Copilot Usage</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Monthly Quota</p>
                    {isLoadingQuota ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{quotaData?.totalQuota.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Tokens</p>
                  </div>
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm font-medium text-blue-600 mb-1">Used Quota</p>
                    {isLoadingQuota ? (
                      <div className="h-8 bg-blue-200 rounded animate-pulse w-24"></div>
                    ) : (
                      <p className="text-2xl font-bold text-blue-700">{quotaData?.usedQuota.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-blue-500 mt-1">~{quotaData?.utilizationPercentage}% utilized</p>
                  </div>
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <p className="text-sm font-medium text-green-600 mb-1">Remaining Quota</p>
                    {isLoadingQuota ? (
                      <div className="h-8 bg-green-200 rounded animate-pulse w-24"></div>
                    ) : (
                      <p className="text-2xl font-bold text-green-700">{quotaData?.remainingQuota.toLocaleString()}</p>
                    )}
                    <p className="text-xs text-green-500 mt-1">Tokens available</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Usage limits</span>
                    <span className="text-gray-500">{isLoadingQuota ? '...' : `${quotaData?.utilizationPercentage}%`}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: isLoadingQuota ? '0%' : `${quotaData?.utilizationPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Details</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      Pro Plan <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">Active</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Includes advanced AI triage, analytics & 100k token quota.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">$99<span className="text-sm text-gray-500 font-normal"> / month</span></p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium text-sm transition-colors">
                    Manage Payment Method
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors">
                    Upgrade Quota
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserManagement />
          )}

          {activeTab === 'roles' && (
            <RoleManagement />
          )}

          {activeTab === 'permissions' && (
            <PermissionManagement />
          )}

          {activeTab === 'categories' && (
            <CategoryManagement />
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage