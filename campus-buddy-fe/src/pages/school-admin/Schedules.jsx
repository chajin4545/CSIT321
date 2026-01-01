import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Schedules = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'edit', 'create'
  const [formData, setFormData] = useState({ 
    date: '', 
    startHour: '', startMinute: '', startAmPm: 'AM',
    endHour: '', endMinute: '', endAmPm: 'AM',
    module: '', professor: '' 
  });

  const handleEditClick = () => {
    setFormData({ 
      date: '2024-12-10', 
      startHour: '09', startMinute: '00', startAmPm: 'AM',
      endHour: '10', endMinute: '30', endAmPm: 'AM',
      module: 'CS305', professor: 'Dr. Sarah Smith' 
    });
    setViewMode('edit');
  };

  const handleCreateClick = () => {
    setFormData({ 
      date: '', 
      startHour: '', startMinute: '', startAmPm: 'AM',
      endHour: '', endMinute: '', endAmPm: 'AM',
      module: '', professor: '' 
    });
    setViewMode('create');
  };

  const renderContent = () => {
    if (viewMode === 'list') {
        return (
          <div className="p-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-end items-center mb-6">
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input type="text" placeholder="Search module or professor..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <button onClick={handleCreateClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                    <Plus size={16} /> New Schedule
                  </button>
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Module</th>
                    <th className="p-3">Professor</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3">2024-12-10</td>
                    <td className="p-3">09:00 AM - 10:30 AM</td>
                    <td className="p-3 font-medium">CS305: Algorithms</td>
                    <td className="p-3">Dr. Sarah Smith</td>
                    <td className="p-3 text-right">
                      <button onClick={handleEditClick} className="text-blue-600 hover:underline font-medium">Edit</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3">2024-12-12</td>
                    <td className="p-3">02:00 PM - 03:30 PM</td>
                    <td className="p-3 font-medium">MAT202: Linear Algebra</td>
                    <td className="p-3">Dr. Alan Turing</td>
                    <td className="p-3 text-right">
                      <button onClick={handleEditClick} className="text-blue-600 hover:underline font-medium">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input 
                  type="date" 
                  defaultValue={formData.date}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Time (From)</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="HH" defaultValue={formData.startHour} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <span className="self-center font-bold">:</span>
                    <input type="text" placeholder="MM" defaultValue={formData.startMinute} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <select defaultValue={formData.startAmPm} className="p-3 border border-slate-300 rounded-lg bg-white">
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>
    
                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time (To)</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="HH" defaultValue={formData.endHour} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <span className="self-center font-bold">:</span>
                    <input type="text" placeholder="MM" defaultValue={formData.endMinute} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <select defaultValue={formData.endAmPm} className="p-3 border border-slate-300 rounded-lg bg-white">
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Module</label>
                <select defaultValue={formData.module} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                  <option value="">Select Module...</option>
                  <option value="CS305">CS305: Algorithms</option>
                  <option value="CS101">CS101: Intro to CS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Professor</label>
                <select defaultValue={formData.professor} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                  <option value="">Select Professor...</option>
                  <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
                  <option value="Dr. Alan Turing">Dr. Alan Turing</option>
                </select>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
                >
                  {viewMode === 'edit' ? 'Save Changes' : 'Create Schedule'}
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
