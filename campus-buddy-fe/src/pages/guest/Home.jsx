import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import Header from '../../components/common/Header';

const Home = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <Header title="Home" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to CampusBuddy</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">Your digital guide to campus life. Ask questions, find directions, and see what's happening without needing an account.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate('/guest/map')} className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50">View Map</button>
              <button onClick={() => navigate('/guest/chat')} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700">Ask Chatbot</button>
            </div>
          </div>
          <div className="grid md:grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">Upcoming Campus Events</h3>
                <button onClick={() => navigate('/guest/events')} className="text-blue-600 text-sm cursor-pointer hover:underline">View All</button>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 mb-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center text-blue-700 flex-shrink-0">
                    <span className="text-xs font-bold">DEC</span>
                    <span className="text-lg font-bold">{10 + i}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Science Fair Open Day</h4>
                    <p className="text-sm text-slate-500">Main Hall • 10:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
