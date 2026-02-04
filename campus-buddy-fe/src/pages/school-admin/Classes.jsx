import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Classes = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list');
  const [classes, setClasses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    _id: null,
    module_code: '',
    group_id: '',
    venue: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchModules();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school-admin/schedules/class');
      const data = await response.json();
      // Group schedules by module_code and group_id to create "classes"
      const groupedClasses = {};
      data.forEach(schedule => {
        const key = `${schedule.module_code}-${schedule.group_id || 'default'}`;
        if (!groupedClasses[key]) {
          groupedClasses[key] = {
            _id: schedule._id,
            module_code: schedule.module_code,
            group_id: schedule.group_id || 'Main Class',
            venue: schedule.venue || 'N/A'
          };
        }
      });
      setClasses(Object.values(groupedClasses));
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/school-admin/modules');
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleEdit = (classItem) => {
    setFormData({
      _id: classItem._id,
      module_code: classItem.module_code,
      group_id: classItem.group_id,
      venue: classItem.venue
    });
    setViewMode('edit');
  };

  const handleCreate = () => {
    setFormData({
      _id: null,
      module_code: '',
      group_id: '',
      venue: ''
    });
    setViewMode('create');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // For classes, we update the schedule record with the class info
      if (formData._id) {
        const response = await fetch(`/api/school-admin/schedules/class/${formData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module_code: formData.module_code,
            group_id: formData.group_id,
            venue: formData.venue,
            // Keep existing time data from the original schedule
            specific_date: new Date().toISOString(),
            start_time: '09:00',
            end_time: '10:00'
          })
        });

        if (response.ok) {
          await fetchClasses();
          setViewMode('list');
          alert('Class updated successfully!');
        }
      } else {
        alert('Class must be associated with a scheduled session. Please create a schedule first.');
      }
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Error saving class');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      const filteredClasses = classes.filter(c => 
        c.module_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.group_id.toLowerCase().includes(searchQuery.toLowerCase())
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
                    placeholder="Search class..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                  <Plus size={16} /> New Class
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
                    <th className="p-3">Class/Group</th>
                    <th className="p-3">Venue</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-3 text-center text-slate-500">No classes found. Create a schedule first to define class groups.</td>
                    </tr>
                  ) : (
                    filteredClasses.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{c.module_code}</td>
                        <td className="p-3 text-slate-600">{c.group_id}</td>
                        <td className="p-3 text-slate-500">{c.venue}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline font-medium">Edit</button>
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
            {viewMode === 'edit' ? 'Edit Class' : 'Create New Class'}
          </h2>
          <p className="text-slate-600 mb-6 text-sm">
            Note: Classes are managed through schedules. A class represents a group section of a module at a specific venue.
          </p>
          <form onSubmit={handleSaveClass} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Module</label>
              <select 
                name="module_code"
                value={formData.module_code}
                onChange={handleInputChange}
                disabled={viewMode === 'edit'}
                required
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  viewMode === 'edit' 
                    ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Module...</option>
                {modules.map(m => (
                  <option key={m._id} value={m.module_code}>{m.module_code}: {m.module_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Class/Group ID</label>
              <input 
                type="text" 
                name="group_id"
                value={formData.group_id}
                onChange={handleInputChange}
                required
                placeholder="e.g., Tutorial Group A, Lecture Group 1"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Venue</label>
              <input 
                type="text" 
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
                placeholder="e.g., LT1.1"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : (viewMode === 'edit' ? 'Save Changes' : 'Create Class')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Class Management" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Classes;
