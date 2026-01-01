import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/common/Header';

const Students = () => {
  const { setMobileMenuOpen } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <Header title="Class/Student View" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
                <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input type="text" placeholder="Search by name or ID..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="relative">
                    <select className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:border-blue-500">
                    <option>All Classes</option>
                    <option>CS101</option>
                    <option>CS305</option>
                    <option>MAT202</option>
                    </select>
                    <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
                </div>
                </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                    <th className="p-3">Class Name</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Student ID</th>
                    <th className="p-3">Email</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">CS101</span></td>
                        <td className="p-3 font-medium text-slate-800">Student Name {i}</td>
                        <td className="p-3 text-slate-600">202400{i}</td>
                        <td className="p-3 text-slate-500">student{i}@uowmail.edu.au</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled><ChevronLeft size={16}/></button>
                <span className="text-sm text-slate-600">Page 1 of 5</span>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronRight size={16}/></button>
                </div>
            </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Students;
