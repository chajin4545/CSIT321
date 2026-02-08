import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Search, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Events = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/school-admin/events');
        const data = await response.json();
        
        // Filter for upcoming events from Feb 8, 2026
        const today = new Date('2026-02-08');
        const upcoming = data
          .filter(event => new Date(event.start_date) >= today)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
          
        setEvents(upcoming);
        setFilteredEvents(upcoming);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const results = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      month: months[date.getMonth()],
      day: date.getDate(),
      fullDate: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Upcoming Events" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
              <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="relative w-64">
               <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search events..." 
                 className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-12 text-center text-slate-500">Loading events...</div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => {
                const { month, day, time } = formatDate(event.start_date);
                return (
                  <div key={event._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex gap-6">
                    <div className="flex flex-col items-center justify-center w-20 bg-blue-50 rounded-lg text-blue-700 p-2 flex-shrink-0">
                      <span className="text-sm font-bold uppercase">{month}</span>
                      <span className="text-2xl font-bold">{day}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-slate-800 mb-1">{event.title}</h3>
                        {event.category && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">{event.category}</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{event.description}</p>
                      <div className="flex gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={14} /> {time}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {event.venue}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-slate-500">No events found matching your search.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Events;
