import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Bell, Loader } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Announcements = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/auth/announcements', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
          setFilteredAnnouncements(data);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchAnnouncements();
    }
  }, [user]);

  useEffect(() => {
    const results = announcements.filter(ann => 
      ann.module_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.professor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnnouncements(results);
  }, [searchTerm, announcements]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Announcements" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Professor Announcements</h2>
              <div className="relative w-full md:w-64">
                  <input 
                    type="text" 
                    placeholder="Search announcements..." 
                    className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader size={40} className="animate-spin mb-4" />
                <p>Loading announcements...</p>
              </div>
            ) : filteredAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {filteredAnnouncements.map((ann) => (
                  <div key={ann._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{ann.module_code}</span>
                          <span className="text-slate-500 text-sm ml-3 font-medium">{ann.professor_name}</span>
                      </div>
                      <span className="text-slate-400 text-xs">{formatDate(ann.posted_at)}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{ann.title}</h3>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap">
                      {ann.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                <Bell size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">No announcements found</p>
                <p className="text-sm">Try adjusting your search or check back later.</p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Announcements;
