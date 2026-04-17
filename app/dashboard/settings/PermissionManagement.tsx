// app/dashboard/settings/PermissionManagement.tsx
import React, { useState, useEffect } from 'react';
import { Permission } from '@/app/utils/type';

export default function PermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerm, setEditingPerm] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/permission');
      const data = await res.json();
      if (res.ok) {
        setPermissions(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch permissions');
      }
    } catch (err) {
      setError('An error occurred while fetching permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (perm?: Permission) => {
    if (perm) {
      setEditingPerm(perm);
      setFormData({
        name: perm.name,
        code: perm.code,
        description: perm.description,
      });
    } else {
      setEditingPerm(null);
      setFormData({ name: '', code: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerm(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.description) {
      alert('Name, code, and description are required.');
      return;
    }

    try {
      const url = editingPerm ? `/api/permission/${editingPerm._id}` : '/api/permission';
      const method = editingPerm ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().replace(/\s+/g, '_')
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        handleCloseModal();
        fetchPermissions();
      } else {
        alert(data.error || 'Failed to save permission');
      }
    } catch (err) {
      alert('Failed to save permission due to network error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return;
    try {
      const res = await fetch(`/api/permission/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPermissions();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete permission');
      }
    } catch (err) {
      alert('Failed to delete permission');
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading permissions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Permission Management</h2>
          <p className="text-sm text-gray-500">Define modular permissions available for assignment.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
        >
          + Add Permission
        </button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="bg-white border text-sm border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.map(perm => (
              <tr key={perm._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{perm.name}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mt-3">{perm.code}</td>
                <td className="px-6 py-4 text-gray-500">{perm.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {perm.isSystem ? (
                    <span className="text-gray-400 italic flex items-center justify-end gap-1"><span aria-hidden="true">🔒</span> System</span>
                  ) : (
                    <>
                      <button onClick={() => handleOpenModal(perm)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(perm._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {permissions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No permissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{editingPerm ? 'Edit Permission' : 'Create Permission'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Read Tickets"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="TKT_READ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the permission's scope"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
