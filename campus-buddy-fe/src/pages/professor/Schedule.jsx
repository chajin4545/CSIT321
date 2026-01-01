import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/common/Header';

const Schedule = () => {
  const { setMobileMenuOpen } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <Header title="Teaching Schedule" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Module</th>
                    <th className="p-3">Room</th>
                    <th className="p-3">Students</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[
                    { date: 'Mon, 10 Dec', time: '09:00 - 10:30', module: 'CS305: Algorithms', room: 'Lab 4', students: 45 },
                    { date: 'Mon, 10 Dec', time: '13:00 - 14:30', module: 'CS101: Intro', room: 'Hall B', students: 120 },
                    ].map((cls, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-slate-700">{cls.date}</td>
                        <td className="p-3 text-slate-500">{cls.time}</td>
                        <td className="p-3 font-medium text-blue-600">{cls.module}</td>
                        <td className="p-3 text-slate-700">{cls.room}</td>
                        <td className="p-3 text-slate-700">{cls.students}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
