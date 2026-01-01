import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft, AlertTriangle } from 'lucide-react';
import Header from '../../components/common/Header';

const Accounts = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create'
  const [users, setUsers] = useState([
    { id: 'ADM001', name: 'School Admin 1', email: 'admin1@uowmail.edu.au', role: 'School Admin', status: 'Active', phone: '8123-1234', address: 'test street 123'  },
    { id: 'ADM002', name: 'School Admin 2', email: 'admin2@uowmail.edu.au', role: 'School Admin', status: 'Active', phone: '8123-1234', address: 'test street 123'  },
    { id: 'ADM003', name: 'School Admin 3', email: 'admin3@uowmail.edu.au', role: 'School Admin', status: 'Inactive', phone: '8123-1234', address: 'test street 123'  }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // stores user ID to confirm
  
  // Form state for creating new admin
  const [formData, setFormData] = useState({ 
    id: 'ADM-2024-X', 
    role: 'School Admin', 
    name: '', 
    email: '', 
    phone: '', 
    address: '' 
  });

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
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
      id: `ADM-${Math.floor(Math.random() * 10000)}`, // Simulate auto-populate
      role: 'School Admin', 
      name: '', 
      email: '', 
      phone: '', 
      address: '' 
    });
    setViewMode('create');
  };

  const handleEdit = (user) => {
    setFormData(user);
    setViewMode('edit');
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
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Role</label>
                  <input 
                    type="text" 
                    value={formData.role} 
                    disabled 
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">User ID (Auto-generated)</label>
                  <input 
                    type="text" 
                    value={formData.id} 
                    disabled 
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-mono" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={formData.name}
                  className={`w-full p-3 border rounded-lg focus:outline-none 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`}
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={formData.email}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="admin@uowmail.edu.au"
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue={formData.phone}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="8123-1234"
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input 
                  type="text" 
                  defaultValue={formData.address}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="123 test street"
                />
              </div>
    
              <div className="flex justify-end pt-4">
                <button 
                  type="button"
                  onClick={() => setViewMode('list')}
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
