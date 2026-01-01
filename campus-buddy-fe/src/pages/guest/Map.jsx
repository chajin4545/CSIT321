import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';

const Map = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <Header title="Campus Map" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
          {/* Map Container */}
          <div className="w-[800px] h-[500px] bg-slate-200 rounded-xl border-4 border-slate-300 relative shadow-inner overflow-hidden">
            
            {/* Watermark Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-6xl font-black text-slate-300 opacity-40 transform -rotate-12 uppercase tracking-widest">
                Example Map
              </span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Map;
