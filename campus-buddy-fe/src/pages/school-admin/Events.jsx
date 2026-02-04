import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Events = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'edit', 'create'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    _id: null,
    title: '',
    description: '',
    venue: '',
    start_date: '',
    end_date: '',
    organizer: '',
    category: 'academic'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/school-admin/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      _id: event._id,
      title: event.title,
      description: event.description || '',
      venue: event.venue || '',
      start_date: event.start_date.split('T')[0],
      end_date: event.end_date ? event.end_date.split('T')[0] : '',
      organizer: event.organizer || '',
      category: event.category || 'academic'
    });
    setViewMode('edit');
  };

  const handleCreate = () => {
    setFormData({
      _id: null,
      title: '',
      description: '',
      venue: '',
      start_date: '',
      end_date: '',
      organizer: '',
      category: 'academic'
    });
    setViewMode('create');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = formData._id 
        ? `/api/school-admin/events/${formData._id}`
        : '/api/school-admin/events';
      const method = formData._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchEvents();
        setViewMode('list');
        alert(formData._id ? 'Event updated successfully!' : 'Event created successfully!');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                      placeholder="Search event..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                    <Plus size={16} /> New Event
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading...</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Event Name</th>
                      <th className="p-3">Venue</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-3 text-center text-slate-500">No events found</td>
                      </tr>
                    ) : (
                      filteredEvents.map(ev => (
                        <tr key={ev._id} className="hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{ev.title}</td>
                          <td className="p-3 text-slate-500">{ev.venue || 'N/A'}</td>
                          <td className="p-3 text-slate-500">{new Date(ev.start_date).toLocaleDateString()}</td>
                          <td className="p-3 text-slate-500 capitalize">{ev.category || 'N/A'}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleEdit(ev)} className="text-blue-600 hover:underline font-medium">Edit</button>
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
                <ArrowLeft size={16} /> Back to Events
              </button>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {viewMode === 'edit' ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form onSubmit={handleSaveEvent} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
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
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                <input 
                  type="date" 
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                    <option value="sports">Sports</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Organizer</label>
                <input 
                  type="text" 
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="e.g., Student Council"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Event Description</label>
                <textarea 
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
    
              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (viewMode === 'edit' ? 'Save Changes' : 'Create Event')}
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
