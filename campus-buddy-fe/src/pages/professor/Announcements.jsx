import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Send } from 'lucide-react';
import Header from '../../components/common/Header';

const Announcements = () => {
  const { setMobileMenuOpen } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <Header title="Post Announcement" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 w-full md:w-2/5 mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            {/* <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Bell className="text-blue-600" />
                Create Announcement
            </h2> */}
            <form className="space-y-6">
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Class</label>
                <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option>Choose a module...</option>
                    <option>CS101: Intro to CS</option>
                    <option>CS305: Algorithms</option>
                </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea 
                    className="w-full p-4 border border-slate-300 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Type your announcement here..."
                ></textarea>
                </div>
                <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center gap-2">
                    <Send size={18} />
                    Post Announcement
                </button>
                </div>
            </form>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Announcements;
