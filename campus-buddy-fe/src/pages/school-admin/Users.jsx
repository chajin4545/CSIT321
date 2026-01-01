import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft, AlertTriangle } from 'lucide-react';
import Header from '../../components/common/Header';

const Users = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list');
  const [students, setUsers] = useState([
    { id: '2024001', name: 'Alex Student', email: 'alex@uowmail.edu.au', status: 'Active', role:'Student', phone: '8123-1234', address: 'test street 123' },
    { id: '2024002', name: 'Jamie Doe', email: 'jamie@uowmail.edu.au', status: 'Inactive', role:'Student',phone: '8123-1235', address: 'test street 123' },
    { id: '2024003', name: 'Prof. Jamie', email: 'jamie@uowmail.edu.au', status: 'Inactive', role:'Professor',phone: '8123-1236', address: 'test street 123' }
  ]);
  const [confirmModal, setConfirmModal] = useState(null);  

  // Initialize with empty structure for create mode
  const [formData, setFormData] = useState({ id: '', name: '', email: '', phone: '', address: '' });
  const handleToggleStatus = (id) => {
    setUsers(students.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    setConfirmModal(null);
  };
  
  const initiateToggle = (student) => {
    if (student.status === 'Active') {
      setConfirmModal(student);
    } else {
      handleToggleStatus(student.id); // Direct activate
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setFormData({ 
      id: '2024XXX', // Prefilled system ID
      name: '', 
      email: '', 
      phone: '', 
      address: '' 
    });
    setViewMode('create');
  };

  const renderContent = () => {
    if (viewMode === 'list') {
        return (
          <div className="p-6">
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
                {/* <h3 className="font-bold text-lg text-slate-800">Student Directory</h3> */}
                <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                     <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                     <input type="text" placeholder="Search by name..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <button 
                    onClick={handleCreate} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={16} /> Create User
                  </button>
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">ID</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">{s.name}</td>
                      <td className="p-3 text-slate-500">{s.id}</td>
                      <td className="p-3 text-slate-500">{s.email}</td>
                      <td className="p-3 text-slate-500">{s.role}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-3 items-center">
                        <button 
                          onClick={() => initiateToggle(s)}
                          className={`text-xs font-bold px-3 py-1 rounded border ${
                            s.status === 'Active' 
                              ? 'border-red-200 text-red-600 hover:bg-red-50' 
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {s.status === 'Active' ? 'Inactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    
      // Edit Form
      return (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
              <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft size={16} /> Back to List
              </button>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {viewMode === 'create' ? 'Create New User' : 'Edit Student Details'}
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">User Name</label>
                  <input 
                    type="text" 
                    defaultValue={formData.name} 
                    disabled={viewMode === 'edit'} // Editable only in Create mode
                    className={`w-full p-3 border rounded-lg focus:outline-none ${
                      viewMode === 'edit' 
                        ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                        : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">User ID</label>
                  <input 
                    type="text" 
                    defaultValue={formData.id} 
                    disabled 
                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-mono" 
                  />
                  {viewMode === 'create' && <p className="text-xs text-slate-400 mt-1">Auto-generated by system</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Role</label>
                <select
                  defaultValue={formData.role}
                  disabled={viewMode === 'edit'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })} // Example handler
                  className={`w-full p-3 border rounded-lg focus:outline-none appearance-none ${
                    viewMode === 'edit'
                      ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select a role</option>
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Email Address</label>
                <input 
                  type="text" 
                  defaultValue={formData.email} 
                  disabled={viewMode === 'edit'} // Editable only in Create mode
                  className={`w-full p-3 border rounded-lg focus:outline-none ${
                    viewMode === 'edit' 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                      : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Phone Number</label>
                <input type="text" defaultValue={formData.phone} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Address</label>
                <input type="text" defaultValue={formData.address} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
                >
                  {viewMode === 'create' ? 'Create Account' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="User Management" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Users;
