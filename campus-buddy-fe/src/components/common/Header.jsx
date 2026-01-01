import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title, setMobileMenuOpen, rightContent }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-slate-500">
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {rightContent && <div className="mr-4">{rightContent}</div>}
        {user ? (
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-slate-50 transition-colors rounded-lg p-1"
            title="Go to Profile"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {user.initials}
            </div>
          </button>
        ) : (
           <button 
             onClick={() => navigate('/login')}
             className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
           >
             Login
           </button>
        )}
      </div>
    </header>
  );
};

export default Header;
