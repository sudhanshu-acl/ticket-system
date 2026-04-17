// app/dashboard/settings/RoleManagement.tsx
import React, { useState, useEffect } from 'react';
import { Role, Permission } from '@/app/utils/type';

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<{name: string, code: string, description: string, permissions: string[]}>({ 
    name: '', code: '', description: '', permissions: [] 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRoles, resPerms] = await Promise.all([
        fetch('/api/role'),
        fetch('/api/permission')
      ]);
      
      const dataRoles = await resRoles.json();
      const dataPerms = await resPerms.json();
      
      if (resRoles.ok && resPerms.ok) {
        setRoles(dataRoles.data || []);
        setAvailablePermissions(dataPerms.data || []);
      } else {
        setError(dataRoles.error || dataPerms.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('An error occurred while fetching roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        code: role.code,
        description: role.description,
        permissions: [...role.permissions]
      });
    } else {
      setEditingRole(null);
      setFormData({ name: '', code: '', description: '', permissions: [] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleCheckboxChange = (permCode: string) => {
    setFormData(prev => {
      if (prev.permissions.includes(permCode)) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permCode) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permCode] };
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.description) {
      alert('Name, code, and description are required.');
      return;
    }

    const payload = {
      name: formData.name,
      code: formData.code.toUpperCase().replace(/\s+/g, '_'),
      description: formData.description,
      permissions: formData.permissions
    };

    try {
      const url = editingRole ? `/api/role/${editingRole._id}` : '/api/role';
      const method = editingRole ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        handleCloseModal();
        fetchData();
      } else {
        alert(data.error || 'Failed to save role');
      }
    } catch (err) {
      alert('Failed to save role due to network error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      const res = await fetch(`/api/role/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete role');
      }
    } catch (err) {
      alert('Failed to delete role');
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading roles...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Role Management</h2>
          <p className="text-sm text-gray-500">Manage user roles and assign permissions dynamically.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
        >
          + Add Role
        </button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="bg-white border text-sm border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map(role => (
              <tr key={role._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {role.name}
                  <div className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1 display-block">{role.code}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">{role.description}</td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((p, i) => (
                      <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full border border-gray-200">{p}</span>
                    ))}
                    {role.permissions.length === 0 && <span className="text-gray-400 italic">None</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {role.isSystem ? (
                    <span className="text-gray-400 italic flex items-center justify-end gap-1"><span aria-hidden="true">🔒</span> System</span>
                  ) : (
                    <>
                      <button onClick={() => handleOpenModal(role)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(role._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No roles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">{editingRole ? 'Edit Role' : 'Create Role'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Finance Admin"
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
                  placeholder="e.g. ADMIN_FINANCE"
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
                  placeholder="Describe the role's purpose"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">Assign Permissions</label>
                {availablePermissions.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No permissions defined. Add them in the Permissions tab.</p>
                ) : (
                  <div className="space-y-2 border border-gray-200 rounded-md p-3 max-h-48 overflow-y-auto">
                    {availablePermissions.map(perm => (
                      <label key={perm._id} className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                          checked={formData.permissions.includes(perm.code)}
                          onChange={() => handleCheckboxChange(perm.code)}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{perm.name} <span className="font-mono text-xs text-gray-500">({perm.code})</span></p>
                          <p className="text-xs text-gray-500">{perm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
