import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Search, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Events = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();

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
               <input type="text" placeholder="Search events..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex gap-6">
                <div className="flex flex-col items-center justify-center w-20 bg-blue-50 rounded-lg text-blue-700 p-2 flex-shrink-0">
                  <span className="text-sm font-bold uppercase">DEC</span>
                  <span className="text-2xl font-bold">{10 + i}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">Science & Tech Fair {2024}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Open to Public</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">Explore the latest innovations from our engineering and science departments. Interactive booths and demos available.</p>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> 10:00 AM - 4:00 PM</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> Main Hall, Building A</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Events;
