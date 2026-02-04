import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft, AlertTriangle } from 'lucide-react';
import Header from '../../components/common/Header';

const Users = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list');
  const [students, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);  

  const [formData, setFormData] = useState({ 
    _id: null,
    user_id: '', 
    full_name: '', 
    email: '', 
    password: '',
    phone: '', 
    address: '',
    role: 'student',
    status: 'active'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school-admin/students');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (studentId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/school-admin/students/${studentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchStudents();
        setConfirmModal(null);
        alert('Student status updated successfully!');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };
  
  const initiateToggle = (student) => {
    if (student.status === 'active') {
      setConfirmModal(student);
    } else {
      handleToggleStatus(student._id, 'active');
    }
  };

  const handleEdit = (student) => {
    setFormData({
      _id: student._id,
      user_id: student.user_id,
      full_name: student.full_name,
      email: student.email,
      password: '',
      phone: student.phone || '',
      address: student.address || '',
      role: student.role,
      status: student.status
    });
    setViewMode('edit');
  };

  const handleCreate = () => {
    setFormData({ 
      _id: null,
      user_id: '', 
      full_name: '', 
      email: '', 
      password: '',
      phone: '', 
      address: '',
      role: 'student',
      status: 'active'
    });
    setViewMode('create');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = formData._id 
        ? `/api/school-admin/students/${formData._id}`
        : '/api/school-admin/students';
      const method = formData._id ? 'PUT' : 'POST';

      // For edit, don't send password if it's empty
      const payload = formData._id && !formData.password
        ? { ...formData, password: undefined }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchStudents();
        setViewMode('list');
        alert(formData._id ? 'Student updated successfully!' : 'Student created successfully!');
      } else {
        alert('Error saving student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      const filteredStudents = students.filter(s => 
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
                    Are you sure you want to inactivate <strong>{confirmModal.full_name}</strong>? They will lose access to the system immediately.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setConfirmModal(null)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(confirmModal._id, 'inactive')}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Confirm Inactivate'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-end items-center mb-6">
                <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                     <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                     <input 
                       type="text" 
                       placeholder="Search by name..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                     />
                  </div>
                  <button 
                    onClick={handleCreate} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={16} /> Create User
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading...</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">ID</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-3 text-center text-slate-500">No students found</td>
                      </tr>
                    ) : (
                      filteredStudents.map(s => (
                        <tr key={s._id} className="hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{s.full_name}</td>
                          <td className="p-3 text-slate-500">{s.user_id}</td>
                          <td className="p-3 text-slate-500">{s.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {s.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3 text-right flex justify-end gap-3 items-center">
                            <button 
                              onClick={() => initiateToggle(s)}
                              disabled={loading}
                              className={`text-xs font-bold px-3 py-1 rounded border disabled:opacity-50 ${
                                s.status === 'active' 
                                  ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                  : 'border-green-200 text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {s.status === 'active' ? 'Inactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={() => handleEdit(s)}
                              disabled={loading}
                              className="text-blue-600 hover:underline font-medium disabled:opacity-50"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      }
    
      // Edit/Create Form
      return (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
              <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
                <ArrowLeft size={16} /> Back to List
              </button>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {viewMode === 'create' ? 'Create New Student' : 'Edit Student Details'}
            </h2>
            <form onSubmit={handleSaveStudent} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={viewMode === 'edit'}
                    required
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
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    disabled={viewMode === 'edit'}
                    required
                    className={`w-full p-3 border rounded-lg focus:outline-none font-mono ${
                      viewMode === 'edit' 
                        ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                        : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                    }`} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={viewMode === 'edit'}
                  required
                  className={`w-full p-3 border rounded-lg focus:outline-none ${
                    viewMode === 'edit' 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                      : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>
              {viewMode === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-2">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (viewMode === 'create' ? 'Create Account' : 'Save Profile')}
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
