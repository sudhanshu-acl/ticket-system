// app/dashboard/settings/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { User, Role } from '@/app/utils/type';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', jobTitle: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resUsers, resRoles] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/role')
      ]);
      
      const [dataUsers, dataRoles] = await Promise.all([
        resUsers.json(),
        resRoles.json()
      ]);

      if (resUsers.ok && resRoles.ok) {
        setUsers(dataUsers.data || []);
        setRoles(dataRoles.data || []);
      } else {
        setError(dataUsers.error || dataRoles.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('An error occurred while fetching users and roles');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      role: user.role || 'user',
      jobTitle: user.jobTitle || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      alert('Name, email, and role are required.');
      return;
    }

    try {
      // API uses PATCH for updating users
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email, // Passing email as identifier for target user
          name: formData.name,
          role: formData.role,
          jobTitle: formData.jobTitle
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        handleCloseModal();
        fetchData(); // Refresh list to reflect changes
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (err) {
      alert('Failed to save user updates due to network error');
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading user directory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User Access Management</h2>
          <p className="text-sm text-gray-500">Bind dynamic Roles directly to registered user accounts.</p>
        </div>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="bg-white border text-sm border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Assigned Role</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {user.name || 'Unnamed'}
                  <div className="text-xs text-gray-500 font-normal">{user.jobTitle}</div>
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ['admin', 'ADMIN_', 'ADMIN_ROLE'].includes(user.role || '') 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role || 'Unassigned'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:text-blue-900">Manage Access</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found in directory.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Configure Access for {editingUser.name}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 text-xs font-normal">(Target Identifier)</span></label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation / Header</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-900 mb-1">Access Role & Permissions</label>
                <p className="text-xs text-gray-500 mb-3">Assigning a dynamic role updates this user's deep permissions globally.</p>
                
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                >
                  <option value="" disabled>Select a Role</option>
                  
                  {/* Map Dynamic Roles */}
                  {roles.map(role => (
                    <option key={role._id} value={role.code}>
                      {role.name} ({role.code})
                    </option>
                  ))}
                  
                  {/* Append Legacy Hardcoded fallbacks out of safety if they don't exist in DB */}
                  {!roles.some(r => r.code === 'admin') && <option value="admin">System Admin (Legacy)</option>}
                  {!roles.some(r => r.code === 'user') && <option value="user">Standard User (Legacy)</option>}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Save Access Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
