import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Exams = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list');
  
  const renderContent = () => {
    if (viewMode === 'list') {
        return (
          <div className="p-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-end items-center mb-6">
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input type="text" placeholder="Search module..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <button 
                    onClick={() => setViewMode('create')} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={16} /> New Schedule
                  </button>
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Module Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium">CS305: Algorithms</td>
                    <td className="p-3">2024-12-15</td>
                    <td className="p-3">10:00 AM - 12:00 PM</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setViewMode('edit')} className="text-blue-600 hover:underline font-medium">Edit</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium">PHY101: Physics</td>
                    <td className="p-3">2024-12-18</td>
                    <td className="p-3">01:00 PM - 03:00 PM</td>
                    <td className="p-3 text-right">
                      <button onClick={() => setViewMode('edit')} className="text-blue-600 hover:underline font-medium">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                {viewMode === 'edit' ? 'Edit Exam Schedule' : 'Create Exam Schedule'}
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Module Name</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg bg-white" defaultValue="CS305">
                  <option value="">Select Module...</option>
                  <option value="CS305">CS305: Algorithms</option>
                  <option value="PHY101">PHY101: Physics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input 
                  type="date" 
                  defaultValue={viewMode === 'edit' ? "2024-12-15" : ""}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Time (From)</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="HH" defaultValue={viewMode === 'edit' ? "10" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <span className="self-center font-bold">:</span>
                    <input type="text" placeholder="MM" defaultValue={viewMode === 'edit' ? "00" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <select className="p-3 border border-slate-300 rounded-lg bg-white">
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>
    
                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time (To)</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="HH" defaultValue={viewMode === 'edit' ? "12" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <span className="self-center font-bold">:</span>
                    <input type="text" placeholder="MM" defaultValue={viewMode === 'edit' ? "00" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                    <select 
                      className="p-3 border border-slate-300 rounded-lg bg-white" 
                      defaultValue={viewMode === 'edit' ? 'PM' : 'AM'}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
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
      <Header title="Exam Schedule Management" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Exams;
