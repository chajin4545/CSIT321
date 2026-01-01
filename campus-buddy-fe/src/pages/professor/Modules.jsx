import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Folder, ArrowLeft, FileText, Upload } from 'lucide-react';
import Header from '../../components/common/Header';

const Modules = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const [currentFolder, setCurrentFolder] = useState(null); 

  const renderRoot = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        onClick={() => setCurrentFolder('lessons')}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group"
      >
        <Folder size={64} className="text-blue-400 group-hover:text-blue-600 mb-4" />
        <h3 className="font-bold text-lg text-slate-800">Lessons</h3>
        <p className="text-sm text-slate-500">Lecture slides & notes</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 opacity-75">
        <Folder size={64} className="text-yellow-400 mb-4" />
        <h3 className="font-bold text-lg text-slate-800">Labs</h3>
        <p className="text-sm text-slate-500">Exercises & solutions</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 opacity-75">
        <Folder size={64} className="text-green-400 mb-4" />
        <h3 className="font-bold text-lg text-slate-800">Assignments</h3>
        <p className="text-sm text-slate-500">Project specs & submissions</p>
      </div>
    </div>
  );

  const renderFiles = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col relative">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <button onClick={() => setCurrentFolder(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <span className="text-slate-400">/</span>
        <span className="font-bold text-slate-800">Lessons</span>
      </div>
      <div className="p-4 space-y-2 flex-1">
        {['Week 1 Intro.pdf', 'Week 2 Variables.pptx', 'Week 3 Logic.pdf'].map((file, i) => (
          <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100">
            <FileText size={20} className="text-slate-400" />
            <span className="text-slate-700">{file}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 right-6">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-transform hover:scale-105">
          <Upload size={20} />
          <span>Upload File</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header title="Module Management" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
            <div className="flex justify-end items-center">
                <select className="bg-white border border-slate-300 text-sm font-medium rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
                    <option>Select Module</option>
                    <option>CS101: Intro to CS</option>
                    <option>CS305: Algorithms</option>
                </select>
            </div>
            {currentFolder === 'lessons' ? renderFiles() : renderRoot()}
        </div>
      </main>
    </div>
  );
};

export default Modules;
