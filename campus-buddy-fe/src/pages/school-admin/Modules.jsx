import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Modules = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    _id: null,
    module_code: '',
    module_name: '',
    credits: ''
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school-admin/modules');
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (module) => {
    setFormData({
      _id: module._id,
      module_code: module.module_code,
      module_name: module.module_name,
      credits: module.credits || ''
    });
    setViewMode('edit');
  };

  const handleCreate = () => {
    setFormData({
      _id: null,
      module_code: '',
      module_name: '',
      credits: ''
    });
    setViewMode('create');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = formData._id 
        ? `/api/school-admin/modules/${formData._id}`
        : '/api/school-admin/modules';
      const method = formData._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchModules();
        setViewMode('list');
        alert(formData._id ? 'Module updated successfully!' : 'Module created successfully!');
      }
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Error saving module');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      const filteredModules = modules.filter(m => 
        m.module_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.module_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <div className="p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-end items-center mb-6">
              <div className="flex gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search module..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                  <Plus size={16} /> New Module
                </button>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Module Code</th>
                    <th className="p-3">Module Name</th>
                    <th className="p-3">Credits</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredModules.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-3 text-center text-slate-500">No modules found</td>
                    </tr>
                  ) : (
                    filteredModules.map(m => (
                      <tr key={m._id} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{m.module_code}</td>
                        <td className="p-3 text-slate-600">{m.module_name}</td>
                        <td className="p-3 text-slate-500">{m.credits || '-'}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleEdit(m)} className="text-blue-600 hover:underline font-medium">Edit</button>
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

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
            <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft size={16} /> Back to List
            </button>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {viewMode === 'edit' ? 'Edit Module' : 'Create New Module'}
          </h2>
          <form onSubmit={handleSaveModule} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Module Code</label>
              <input 
                type="text" 
                name="module_code"
                value={formData.module_code}
                onChange={handleInputChange}
                disabled={viewMode === 'edit'}
                required
                placeholder="e.g., CS305"
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  viewMode === 'edit' 
                    ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Module Name</label>
              <input 
                type="text" 
                name="module_name"
                value={formData.module_name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Algorithms"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Credits</label>
              <input 
                type="number" 
                name="credits"
                value={formData.credits}
                onChange={handleInputChange}
                placeholder="e.g., 3"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : (viewMode === 'edit' ? 'Save Changes' : 'Create Module')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Module Management" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Modules;
