import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Schedules = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'edit', 'create'
  const [schedules, setSchedules] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ 
    _id: null,
    module_code: '',
    venue: '',
    specific_date: '',
    start_time: '',
    end_time: '',
    group_id: ''
  });

  // Fetch schedules and modules on mount
  useEffect(() => {
    fetchSchedules();
    fetchModules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school-admin/schedules/class');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
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

  const handleEditClick = (schedule) => {
    setFormData({
      _id: schedule._id,
      module_code: schedule.module_code,
      venue: schedule.venue || '',
      specific_date: schedule.specific_date.split('T')[0],
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      group_id: schedule.group_id || ''
    });
    setViewMode('edit');
  };

  const handleCreateClick = () => {
    setFormData({
      _id: null,
      module_code: '',
      venue: '',
      specific_date: '',
      start_time: '',
      end_time: '',
      group_id: ''
    });
    setViewMode('create');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = formData._id 
        ? `/api/school-admin/schedules/class/${formData._id}`
        : '/api/school-admin/schedules/class';
      const method = formData._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchSchedules();
        setViewMode('list');
        alert(formData._id ? 'Schedule updated successfully!' : 'Schedule created successfully!');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error saving schedule');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      const filteredSchedules = schedules.filter(s => 
        s.module_code.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <button onClick={handleCreateClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                    <Plus size={16} /> New Schedule
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading...</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">Venue</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSchedules.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-3 text-center text-slate-500">No schedules found</td>
                      </tr>
                    ) : (
                      filteredSchedules.map(schedule => (
                        <tr key={schedule._id} className="hover:bg-slate-50">
                          <td className="p-3">{new Date(schedule.specific_date).toLocaleDateString()}</td>
                          <td className="p-3">{schedule.start_time} - {schedule.end_time}</td>
                          <td className="p-3 font-medium">{schedule.module_code}</td>
                          <td className="p-3">{schedule.venue || 'N/A'}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleEditClick(schedule)} className="text-blue-600 hover:underline font-medium">Edit</button>
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
              {viewMode === 'edit' ? 'Edit Schedule' : 'Create New Schedule'}
            </h2>
            <form onSubmit={handleSaveSchedule} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input 
                  type="date" 
                  name="specific_date"
                  value={formData.specific_date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                  <input 
                    type="time" 
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                  <input 
                    type="time" 
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Module</label>
                <select 
                  name="module_code"
                  value={formData.module_code}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Select Module...</option>
                  {modules.map(m => (
                    <option key={m._id} value={m.module_code}>{m.module_code}: {m.module_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Venue</label>
                <input 
                  type="text" 
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., LT1.1"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Group ID (Optional)</label>
                <input 
                  type="text" 
                  name="group_id"
                  value={formData.group_id}
                  onChange={handleInputChange}
                  placeholder="e.g., Tutorial Group A"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (viewMode === 'edit' ? 'Save Changes' : 'Create Schedule')}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Manage Teaching Schedules" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Schedules;
