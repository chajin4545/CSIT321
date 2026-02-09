import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft, AlertTriangle } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Accounts = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create'
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // stores user ID to confirm
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state for creating new admin
  const [formData, setFormData] = useState({ 
    id: 'AUTO', 
    role: 'school_admin', 
    name: '', 
    email: '', 
    phone: '', 
    address: '' 
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sys-admin/accounts', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Map backend fields to frontend expectations if needed
        const mapped = data.map(u => ({
            id: u.user_id,
            name: u.full_name,
            email: u.email,
            role: 'School Admin',
            status: u.status === 'active' ? 'Active' : 'Inactive',
            phone: u.phone,
            address: u.address,
            _id: u._id
        }));
        setUsers(mapped);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user.token]);

  const handleToggleStatus = async (id) => {
    // Optimistic update
    const userToToggle = users.find(u => u.id === id);
    if (!userToToggle) return;

    try {
        const response = await fetch(`/api/sys-admin/accounts/${id}/toggle`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        if (response.ok) {
            fetchUsers(); // Refresh to be safe
        }
    } catch (err) {
        console.error("Failed to toggle", err);
    }
    setConfirmModal(null);
  };

  const initiateToggle = (user) => {
    if (user.status === 'Active') {
      setConfirmModal(user);
    } else {
      handleToggleStatus(user.id); // Direct activate
    }
  };

  const handleCreateClick = () => {
    setFormData({ 
      id: 'AUTO', 
      role: 'school_admin', 
      name: '', 
      email: '', 
      phone: '', 
      address: '' 
    });
    setError('');
    setViewMode('create');
  };

  const handleCreateSubmit = async () => {
    setError('');
    if (!formData.name || !formData.email) {
        setError('Name and Email are required.');
        return;
    }
    
    try {
        const response = await fetch('/api/sys-admin/accounts', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            await fetchUsers();
            setViewMode('list');
        } else {
            const data = await response.json();
            setError(data.message || 'Failed to create admin');
        }
    } catch (err) {
        setError('Network error');
    }
  };

  const handleEdit = (user) => {
    // Not implemented fully on backend yet (Update), but we can just show the form populated
    // For now, let's keep it simple as requested: Create & Toggle.
    alert("Edit feature coming soon. Please deactivate and create a new account if details are wrong.");
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderContent = () => {
    if (viewMode === 'list') {
        return (
        <div className="p-6 relative">
          {/* Confirmation Modal */}
          {confirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-red-500" /> Confirm Deactivation
                </h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to inactivate <strong>{confirmModal.name}</strong>? They will lose access to the system immediately.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setConfirmModal(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(confirmModal.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Confirm Inactivate
                  </button>
                </div>
              </div>
            </div>
          )}
    
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-end items-center mb-6">
              <div className="flex gap-3">
                <div className="relative w-64">
                   <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                   <input 
                     type="text" 
                     placeholder="Search by user name..." 
                     className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <button 
                  onClick={handleCreateClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus size={16} /> Create Admin
                </button>
              </div>
            </div>
            {loading ? <p className="p-4 text-center text-slate-500">Loading...</p> : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{user.name}</td>
                    <td className="p-3 font-mono text-xs text-slate-500">{user.id}</td>
                    <td className="p-3 text-slate-500">{user.email}</td>
                    <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{user.role}</span></td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-right flex justify-end gap-3 items-center">
                      <button 
                        onClick={() => initiateToggle(user)}
                        className={`text-xs font-bold px-3 py-1 rounded border ${
                          user.status === 'Active' 
                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                            : 'border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {user.status === 'Active' ? 'Inactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
        );
      }
      
      //Create/Edit Form
      return (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
              <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft size={16} /> Back to User Management
              </button>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Create School Admin Account</h2>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Role</label>
                  <input 
                    type="text" 
                    value="School Admin"
                    disabled 
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">User ID (Auto-generated)</label>
                  <input 
                    type="text" 
                    value="AUTO"
                    disabled 
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-mono" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="admin@uowmail.edu.au"
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="8123-1234"
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="123 test street"
                />
              </div>
    
              <div className="flex justify-end pt-4">
                <button 
                  type="button"
                  onClick={handleCreateSubmit}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Manage Accounts" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Accounts;
