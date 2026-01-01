import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Events = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'edit', 'create'
  const [events, setEvents] = useState([
    { id: 1, name: 'Science & Tech Fair', venue: 'Main Hall', date: '2024-12-10', start: '10:00 AM', end: '04:00 PM', description: 'Explore the latest innovations.' },
    { id: 2, name: 'Guest Lecture', venue: 'Auditorium', date: '2024-12-15', start: '02:00 PM', end: '03:30 PM', description: 'Lecture on AI Ethics.' }
  ]);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setEditingEvent({ name: '', venue: '', date: '', start: '', end: '', description: '' });
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
                    <input type="text" placeholder="Search event..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                    <Plus size={16} /> New Event
                  </button>
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Event Name</th>
                    <th className="p-3">Venue</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">{ev.name}</td>
                      <td className="p-3 text-slate-500">{ev.venue}</td>
                      <td className="p-3 text-slate-500">{ev.date}</td>
                      <td className="p-3 text-slate-500">{ev.start} - {ev.end}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleEdit(ev)} className="text-blue-600 hover:underline font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
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
                <ArrowLeft size={16} /> Back to Events
              </button>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {viewMode === 'edit' ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
                <input 
                  type="text" 
                  defaultValue={editingEvent?.name}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Venue</label>
                <input 
                  type="text" 
                  defaultValue={editingEvent?.venue}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input 
                  type="date" 
                  defaultValue={editingEvent?.date}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                  <input 
                    type="text" 
                    placeholder="10:00 AM" 
                    defaultValue={editingEvent?.start}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                  <input 
                    type="text" 
                    placeholder="12:00 PM"
                    defaultValue={editingEvent?.end}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Event Description</label>
                <textarea 
                  rows={4}
                  defaultValue={editingEvent?.description}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
    
              <div className="flex justify-end pt-4">
                <button 
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
                >
                  {viewMode === 'edit' ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Event Management" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Events;
