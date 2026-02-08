import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import Header from '../../components/common/Header';

const Home = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/school-admin/events');
        const data = await response.json();
        
        // Filter for upcoming events from Feb 8, 2026
        const today = new Date('2026-02-08');
        const upcoming = data
          .filter(event => new Date(event.start_date) >= today)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          .slice(0, 3);
          
        setEvents(upcoming);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      month: months[date.getMonth()],
      day: date.getDate()
    };
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Home" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to CampusBuddy</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">Your digital guide to campus life. Ask questions, find directions, and see what's happening without needing an account.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate('/guest/chat')} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700">Ask Chatbot</button>
            </div>
          </div>
          <div className="grid md:grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">Upcoming Campus Events</h3>
                <button onClick={() => navigate('/guest/events')} className="text-blue-600 text-sm cursor-pointer hover:underline">View All</button>
              </div>
              
              {loading ? (
                <div className="py-8 text-center text-slate-500">Loading events...</div>
              ) : events.length > 0 ? (
                events.map((event) => {
                  const { month, day } = formatDate(event.start_date);
                  return (
                    <div key={event._id} className="flex gap-4 mb-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-700 flex-shrink-0">
                        <span className="text-xs font-bold">{month}</span>
                        <span className="text-lg font-bold">{day}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{event.title}</h4>
                        <p className="text-sm text-slate-500">{event.venue} • {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-500">No upcoming events found.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
