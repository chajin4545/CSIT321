import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header';

const Login = () => {
  const [userIdInput, setUserIdInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(userIdInput, password);
    
    if (result.success) {
      const role = result.data.role; // Access role from the returned data
      
      switch(role) {
        case 'student':
          navigate('/student/admin-chat');
          break;
        case 'professor':
          navigate('/professor/schedule');
          break;
        case 'school_admin':
          navigate('/school-admin/schedules');
          break;
        case 'sys_admin':
          navigate('/sys-admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Login" setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-slate-50 p-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-slate-500">Sign in to access your campus account</p>
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
                <input 
                  type="text" 
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="Enter ID (e.g., 2024001)" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="••••••••" 
                  required
                />
              </div>
              {/* Below to be implemented if time allows */}
              {/* <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
              </div> */}
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
