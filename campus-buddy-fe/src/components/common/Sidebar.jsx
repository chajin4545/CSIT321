import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, BookOpen, Calendar, MessageCircle, LogIn, LogOut, 
  Users, BarChart, Bell, MapPin, Home, GraduationCap, Clock, Star, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role || 'guest';

  const getNavItems = () => {
    switch(role) {
      case 'student':
        return [
          { path: '/student/admin-chat', label: 'Admin Assistant', icon: User },
          { path: '/student/course-chat', label: 'Course Tutor', icon: GraduationCap },
          { path: '/student/announcements', label: 'Prof. Announcements', icon: Bell },
          { path: '/profile', label: 'My Profile', icon: User },
        ];
      case 'professor':
        return [
          { path: '/professor/schedule', label: 'Teaching Schedule', icon: Calendar },
          { path: '/professor/modules', label: 'Module Management', icon: BookOpen },
          { path: '/professor/students', label: 'Class/Student View', icon: Users },
          { path: '/professor/announcements', label: 'Post Announcement', icon: Bell },
          { path: '/profile', label: 'My Profile', icon: User },
        ];
      case 'school_admin':
        return [
          { path: '/school-admin/schedules', label: 'Teaching Schedules', icon: Calendar },
          { path: '/school-admin/exams', label: 'Exam Schedules', icon: Clock },
          { path: '/school-admin/events', label: 'Event Management', icon: Star },
          { path: '/school-admin/users', label: 'User Management', icon: Users },
          { path: '/profile', label: 'My Profile', icon: User },
        ];
      case 'sys_admin':
        return [
          { path: '/sys-admin/dashboard', label: 'Usage Analytics', icon: BarChart },
          { path: '/sys-admin/feedback', label: 'User Feedback', icon: MessageCircle },
          { path: '/sys-admin/accounts', label: 'Manage Accounts', icon: Users },
          { path: '/profile', label: 'My Profile', icon: User },
        ];
      default: // Guest
        return [
          { path: '/', label: 'Home', icon: Home },
          { path: '/guest/chat', label: 'Chat Assistant', icon: MessageCircle },
          { path: '/guest/events', label: 'Upcoming Events', icon: Calendar },
          { path: '/guest/map', label: 'Campus Map', icon: MapPin },
        ];
    }
  };

  const items = getNavItems();

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
      logout();
      navigate('/');
      setMobileMenuOpen(false);
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="font-bold text-xl tracking-wider">CampusBuddy</div>
        <button onClick={() => setMobileMenuOpen(false)} className="md:hidden">
          <X size={24} />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
        {role !== 'guest' && (
          <div className="pt-8 mt-8 border-t border-slate-700">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg"
             >
              <LogOut size={20} />
              <span>Logout</span>
             </button>
          </div>
        )}
        {role === 'guest' && (
          <div className="pt-8 mt-8 border-t border-slate-700">
             <button 
               onClick={() => handleNavigation('/login')}
               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/login' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-slate-800'}`}
             >
              <LogIn size={20} />
              <span>Login</span>
             </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
