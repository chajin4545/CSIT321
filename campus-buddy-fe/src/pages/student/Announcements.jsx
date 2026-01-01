import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../../components/common/Header';

const Announcements = () => {
  const { setMobileMenuOpen } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <Header title="Announcements" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Professor Announcements</h2>
            <div className="relative">
                <input type="text" placeholder="Filter by module..." className="pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                <Search size={16} className="absolute right-3 top-2.5 text-slate-400" />
            </div>
            </div>
            
            <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">CS305</span>
                    <span className="text-slate-500 text-sm ml-3 font-medium">Prof. Sarah Smith</span>
                </div>
                <span className="text-slate-400 text-xs">Today, 10:00 AM</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Midterm Results Posted</h3>
                <p className="text-slate-600 text-sm">
                Dear students, I have released the midterm results. The class average was 82%. You can view your individual grades by asking the Admin Assistant chatbot. Let me know if you have any questions during office hours tomorrow.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-orange-500">
                <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">PHY101</span>
                    <span className="text-slate-500 text-sm ml-3 font-medium">Dr. Einstein</span>
                </div>
                <span className="text-slate-400 text-xs">Yesterday</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Lab 3 Rescheduled</h3>
                <p className="text-slate-600 text-sm">
                Due to equipment maintenance, the Physics Lab 3 scheduled for this Friday is moved to next Monday at 2 PM. Please check your updated schedule with the Admin Assistant.
                </p>
            </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Announcements;
