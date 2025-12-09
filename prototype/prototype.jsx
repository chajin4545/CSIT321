import React, { useState, useEffect, useRef } from 'react';
import { 
  User, BookOpen, Calendar, MessageCircle, LogIn, LogOut, 
  Settings, Users, BarChart, FileText, Upload, Bell, 
  MapPin, Search, ChevronRight, Menu, X, Home,
  AlertCircle, CheckCircle, Clock, Trash2, Edit, Send, Lock,
  GraduationCap, HelpCircle, Plus, Folder, ArrowLeft, Filter, ChevronLeft,
  Save, XCircle, Star, Activity, AlertTriangle, Flag, MoreVertical
} from 'lucide-react';

// --- Components ---

// 1. Navigation Sidebar
const Sidebar = ({ role, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onLogout }) => {
  const getNavItems = () => {
    switch(role) {
      case 'student':
        return [
          { id: 'admin_chat', label: 'Admin Assistant', icon: User },
          { id: 'course_chat', label: 'Course Tutor', icon: GraduationCap },
          { id: 'announcements', label: 'Prof. Announcements', icon: Bell },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'professor':
        return [
          { id: 'schedule', label: 'Teaching Schedule', icon: Calendar },
          { id: 'modules', label: 'Module Management', icon: BookOpen },
          { id: 'students', label: 'Class/Student View', icon: Users },
          { id: 'announcements', label: 'Post Announcement', icon: Bell },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'school_admin':
        return [
          { id: 'schedules', label: 'Teaching Schedules', icon: Calendar },
          { id: 'exams', label: 'Exam Schedules', icon: Clock },
          { id: 'events', label: 'Event Management', icon: Star },
          { id: 'students', label: 'User Management', icon: Users },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'sys_admin':
        return [
          { id: 'dashboard', label: 'Usage Analytics', icon: BarChart },
          { id: 'feedback', label: 'User Feedback', icon: MessageCircle },
          { id: 'accounts', label: 'Manage Accounts', icon: Users },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      default: // Guest
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'chat', label: 'Chat Assistant', icon: MessageCircle },
          { id: 'events', label: 'Upcoming Events', icon: Calendar },
          { id: 'map', label: 'Campus Map', icon: MapPin },
        ];
    }
  };

  const items = getNavItems();

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
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
        {role !== 'guest' && (
          <div className="pt-8 mt-8 border-t border-slate-700">
             <button 
               onClick={onLogout}
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
               onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }}
               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'login' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-slate-800'}`}
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

// --- View Components ---
const Header = ({ title, user, setMobileMenuOpen, onLoginClick, onProfileClick, rightContent }) => (
  <header className="bg-white shadow-sm sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-slate-500">
        <Menu size={24} />
      </button>
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
    </div>
    <div className="flex items-center gap-4">
      {rightContent && <div className="mr-4">{rightContent}</div>}
      {user && (
        <button 
          onClick={onProfileClick}
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
      )}
      {!user && (
         <button 
           onClick={onLoginClick}
           className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
         >
           Login
         </button>
      )}
    </div>
  </header>
);

// GUEST: Home Landing
const GuestHome = ({ setActiveTab }) => (
  <div className="p-6 max-w-5xl mx-auto">
    <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-8">
      <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to CampusBuddy</h2>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">Your digital guide to campus life. Ask questions, find directions, and see what's happening without needing an account.</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => setActiveTab('map')} className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50">View Map</button>
        <button onClick={() => setActiveTab('chat')} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700">Ask Chatbot</button>
      </div>
    </div>
    <div className="grid md:grid-cols-1 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800">Upcoming Campus Events</h3>
          <button onClick={() => setActiveTab('events')} className="text-blue-600 text-sm cursor-pointer hover:underline">View All</button>
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

      {/* <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Library', 'Cafeteria', 'Student Center', 'Admissions', 'Gym', 'Parking'].map((place) => (
            <button 
              key={place} 
              onClick={() => setActiveTab('map')}
              className="p-3 text-left border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-slate-700 text-sm">{place}</span>
              </div>
            </button>
          ))}
        </div>
      </div> */}
    </div>
  </div>
);

// GUEST: Events Page
const GuestEvents = ({ setActiveTab }) => (
  <div className="p-6 max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <button onClick={() => setActiveTab('home')} 
      className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>
      <div className="relative w-64">
         <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
         <input type="text" placeholder="Search events..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
      </div>
    </div>

    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex gap-6">
          <div className="flex flex-col items-center justify-center w-20 bg-blue-50 rounded-lg text-blue-700 p-2 flex-shrink-0">
            <span className="text-sm font-bold uppercase">DEC</span>
            <span className="text-2xl font-bold">{10 + i}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-slate-800 mb-1">Science & Tech Fair {2024}</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Open to Public</span>
            </div>
            <p className="text-slate-600 text-sm mb-3">Explore the latest innovations from our engineering and science departments. Interactive booths and demos available.</p>
            <div className="flex gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Clock size={14} /> 10:00 AM - 4:00 PM</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> Main Hall, Building A</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// GUEST: Map Page
const GuestMap = ({ setActiveTab }) => (
  <div className="flex flex-col h-full">
    <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveTab('home')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
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
  </div>
);

// GUEST: Login Page
const LoginPage = ({ onLogin }) => {
  const [userIdInput, setUserIdInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(userIdInput);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500">Sign in to access your campus account</p>
          <div className="mt-2 p-2 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
             <span className="font-bold">Demo IDs:</span> student1, prof1, school admin1, sys admin1
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
            <input 
              type="text" 
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Enter ID (e.g., student1)" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="••••••••" 
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// GUEST: Chat
const GuestChat = () => {
  const [inputText, setInputText] = useState('');
  // Mock history with enough items to scroll
  const mockHistory = [
    { sender: 'bot', text: 'Hello! Welcome to the Campus Guest Assistant. I can help you with directions, event schedules, or general campus information.' },
    { sender: 'user', text: 'Where is the main library located?' },
    { sender: 'bot', text: 'The Main Library is located in Building B, directly across from the Student Center. Would you like walking directions?' },
    { sender: 'user', text: 'Yes, please.' },
    { sender: 'bot', text: 'Sure, here are the directions...' },
    { sender: 'user', text: 'What time does the cafeteria close?' },
    { sender: 'bot', text: 'The main cafeteria closes at 8:00 PM on weekdays and 6:00 PM on weekends.' },
    { sender: 'user', text: 'Is there visitor parking?' },
    { sender: 'bot', text: 'Yes, visitor parking is available in Lot C behind the administration building. It costs $2 per hour.' },
    { sender: 'user', text: 'How do I apply for a course?' },
    { sender: 'bot', text: 'You can apply online via the Admissions portal. Do you need the link?' },
    { sender: 'user', text: 'No thanks, just browsing.' },
    { sender: 'bot', text: 'No problem! Let me know if you have any other questions about the campus facilities.' },
    { sender: 'user', text: 'Actually, tell me about the gym.' },
    { sender: 'bot', text: 'The campus gym is free for students and staff. Guests can buy a day pass for $10.' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Messages Area - Grows to fill space, scrolls internally */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {mockHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base max-w-[80%] ${
              msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>{msg.text}</div>
          </div>
        ))}
      </div>
      
      {/* Input Area - Fixed at bottom, does not shrink */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6 flex-shrink-0 z-10">
        <div className="max-w-4xl mx-auto flex gap-4">
           <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about facilities, events, or directions..." 
            className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
           />
           <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl flex items-center gap-2 font-medium transition-colors">
             <span>Send</span>
             <Send size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

// --- STUDENT COMPONENTS ---

// NEW: Student Review Page
const StudentLeaveReview = ({ setActiveTab }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Review Submitted! Thank you for your feedback.');
    setActiveTab('admin_chat'); // Go back to default chat
  };

  return (
    <div className="p-6 max-w-2xl mx-auto h-[calc(100vh-80px)] overflow-y-auto">
      <button onClick={() => setActiveTab('admin_chat')} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-blue-600 transition-colors">
        <ArrowLeft size={20} /> Back to Chat
      </button>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Leave a Review</h2>
        <p className="text-slate-600 mb-6">How was your experience with this chat session?</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 hover:scale-110 transition-transform focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-slate-300'}`}
                >
                  <Star size={32} className={star <= rating ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Remarks</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32"
              placeholder="Tell us more about your experience..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('admin_chat')}
              className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentAdminChat = ({ setActiveTab }) => {
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([
    { id: 1, title: 'Fall 2024 Grades', date: 'Yesterday' },
    { id: 2, title: 'Exam Schedule', date: '2 days ago' },
    { id: 3, title: 'Tuition Fee Query', date: '1 week ago' },
    { id: 4, title: 'Library Fine', date: '2 weeks ago' },
    { id: 5, title: 'Transcript Request', date: 'Last month' },
    { id: 6, title: 'Housing Application', date: 'Last month' },
    { id: 7, title: 'Scholarship Info', date: '2 months ago' },
    { id: 8, title: 'ID Card Replacement', date: '3 months ago' },
  ]);
  const [activeMenu, setActiveMenu] = useState(null);

  const mockHistory = [
    { sender: 'bot', text: 'Hello Alex! I am your Admin Assistant. I can help with schedules, grades, and administrative queries.' },
    { sender: 'user', text: 'When is my next exam?' },
    { sender: 'bot', text: 'Your next exam is CS305: Algorithms on Dec 15th at 10:00 AM in Hall A.' },
    { sender: 'user', text: 'Can I check my current GPA?' },
    { sender: 'bot', text: 'Your current GPA for this semester is 3.8. You have an A in CS101 and B+ in MAT202.' },
    { sender: 'user', text: 'What is the deadline for tuition payment?' },
    { sender: 'bot', text: 'The deadline for Fall 2024 tuition payment is January 15th, 2025.' },
    { sender: 'user', text: 'Can I pay in installments?' },
    { sender: 'bot', text: 'Yes, you can set up a payment plan via the Bursar Office portal. Would you like the link?' },
    { sender: 'user', text: 'Yes please.' },
    { sender: 'bot', text: 'Here is the link: portal.uowmail.edu.au/payments' },
    { sender: 'user', text: 'Thanks!' },
    { sender: 'bot', text: 'Is there anything else I can help you with today?' },
    { sender: 'user', text: 'How do I request an official transcript?' },
    { sender: 'bot', text: 'You can request an official transcript through the Registrar page. It costs $5 per copy.' }
  ];

  const handleDelete = (id) => {
    setHistory(history.filter(item => item.id !== id));
    setActiveMenu(null);
  };

  const handleReview = (id) => {
    setActiveTab('review'); // Navigate to review page
    setActiveMenu(null);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 overflow-hidden" onClick={() => setActiveMenu(null)}>
      {/* History Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
          <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">History</span>
          <button className="text-slate-400 hover:text-blue-600"><Plus size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {history.map(item => (
            <div key={item.id} className="relative group border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <button className="w-full text-left p-4 pr-10">
                <div className="text-sm font-medium text-slate-800 truncate">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1">{item.date}</div>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === item.id ? null : item.id);
                }}
                className={`absolute right-2 top-3 p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all ${activeMenu === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <MoreVertical size={16} />
              </button>
              {activeMenu === item.id && (
                <div className="absolute right-2 top-10 w-32 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleReview(item.id); }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Star size={12} /> Leave Review
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full">
        {/* Announcement Banner */}
        <div className="bg-blue-50 border-b border-blue-100 p-3 px-6 flex justify-between items-center shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-blue-900 overflow-hidden whitespace-nowrap">
            <Bell size={16} className="text-blue-600 flex-shrink-0" />
            <span className="font-semibold">Latest Announcement:</span>
            <span className="truncate">Prof. Smith posted "Midterm Results" for CS305</span>
          </div>
          <button 
            onClick={() => setActiveTab('announcements')}
            className="text-xs font-bold text-blue-600 hover:underline flex-shrink-0 ml-4 whitespace-nowrap"
          >
            Show more...
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {mockHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-2xl gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                  <User size={16} className="text-white"/>
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-slate-200 p-4 md:p-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about grades, schedules..." 
              className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl flex items-center gap-2 font-medium transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentKnowledgeChat = ({ setActiveTab }) => { // Accepted setActiveTab prop
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([
    { id: 1, title: 'CS101: Recursion', date: 'Yesterday' },
    { id: 2, title: 'Physics Lab 1', date: '3 days ago' },
    { id: 3, title: 'Calculus Limits', date: '1 week ago' },
    { id: 4, title: 'Java Interfaces', date: '2 weeks ago' },
    { id: 5, title: 'Newton Laws', date: 'Last month' },
  ]);
  const [activeMenu, setActiveMenu] = useState(null);

  const mockHistory = [
    { sender: 'bot', text: 'Hello! I am your Course Tutor. Select a module from the dropdown to ask about study materials or assignments.' },
    { sender: 'user', text: 'What are the key topics for the CS305 midterm?' },
    { sender: 'bot', text: 'For CS305 Algorithms, the midterm covers: \n1. Big O Notation\n2. Sorting Algorithms (Merge, Quick, Heap)\n3. Graph Traversals (BFS, DFS).' },
    { sender: 'user', text: 'When is Assignment 3 due?' },
    { sender: 'bot', text: 'Assignment 3: "Dynamic Programming" is due on Dec 20th at 11:59 PM.' },
    { sender: 'user', text: 'Can you give me an example of dynamic programming?' },
    { sender: 'bot', text: 'Certainly! A classic example is the Fibonacci sequence. Instead of recalculating the same values recursively, you store them in an array (memoization) to improve efficiency.' },
    { sender: 'user', text: 'What about bottom-up approach?' },
    { sender: 'bot', text: 'The bottom-up approach involves solving smaller subproblems first and using their solutions to build up to the main problem, typically using iteration (loops).' },
    { sender: 'user', text: 'Is graph theory covered?' },
    { sender: 'bot', text: 'Yes, basic Graph Theory is covered, specifically representation (Adjacency Matrix/List) and traversal algorithms.' },
    { sender: 'user', text: 'Thanks!' },
    { sender: 'bot', text: 'You are welcome! Happy studying.' }
  ];

  const handleDelete = (id) => {
    setHistory(history.filter(item => item.id !== id));
    setActiveMenu(null);
  };

  const handleReview = (id) => {
    setActiveTab('review'); // Navigate to review page
    setActiveMenu(null);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 overflow-hidden" onClick={() => setActiveMenu(null)}>
      {/* History Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
          <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">Study Sessions</span>
          <button className="text-slate-400 hover:text-blue-600"><Plus size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {history.map(item => (
            <div key={item.id} className="relative group border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <button className="w-full text-left p-4 pr-10">
                <div className="text-sm font-medium text-slate-800 truncate">{item.title}</div>
                <div className="text-xs text-slate-400 mt-1">{item.date}</div>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === item.id ? null : item.id);
                }}
                className={`absolute right-2 top-3 p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all ${activeMenu === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <MoreVertical size={16} />
              </button>
              {activeMenu === item.id && (
                <div className="absolute right-2 top-10 w-32 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleReview(item.id); }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Star size={12} /> Leave Review
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full">
        {/* Module Selector Header */}
        <div className="bg-white border-b border-slate-200 p-3 px-6 flex justify-between items-center shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-600">
            <GraduationCap size={20} className="text-orange-500" />
            <span className="font-bold text-slate-700">Course Context</span>
          </div>
          <select className="bg-slate-100 border-none text-sm font-medium rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
            <option>CS305: Algorithms</option>
            <option>CS101: Intro to CS</option>
            <option>PHY101: Physics</option>
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {mockHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-2xl gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-orange-500'}`}>
                  {msg.sender === 'user' ? <User size={16} className="text-white"/> : <GraduationCap size={16} className="text-white"/>}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-slate-200 p-4 md:p-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about concepts, assignments..." 
              className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl flex items-center gap-2 font-medium transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentAnnouncements = () => (
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
);

// --- PROFESSOR COMPONENTS ---

const ProfessorSchedule = () => (
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
);

const ProfessorModules = () => {
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
  );
};

const ProfessorStudents = () => (
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
);

const ProfessorAnnouncements = () => (
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
);

// --- SCHOOL ADMIN COMPONENTS ---

// 1. MANAGE SCHEDULES (TEACHING)
const AdminScheduleManager = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'edit', 'create'
  const [formData, setFormData] = useState({ 
    date: '', 
    startHour: '', startMinute: '', startAmPm: 'AM',
    endHour: '', endMinute: '', endAmPm: 'AM',
    module: '', professor: '' 
  });

  const handleEditClick = () => {
    setFormData({ 
      date: '2024-12-10', 
      startHour: '09', startMinute: '00', startAmPm: 'AM',
      endHour: '10', endMinute: '30', endAmPm: 'AM',
      module: 'CS305', professor: 'Dr. Sarah Smith' 
    });
    setViewMode('edit');
  };

  const handleCreateClick = () => {
    setFormData({ 
      date: '', 
      startHour: '', startMinute: '', startAmPm: 'AM',
      endHour: '', endMinute: '', endAmPm: 'AM',
      module: '', professor: '' 
    });
    setViewMode('create');
  };

  if (viewMode === 'list') {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-end items-center mb-6">
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input type="text" placeholder="Search module or professor..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button onClick={handleCreateClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                <Plus size={16} /> New Schedule
              </button>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Module</th>
                <th className="p-3">Professor</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3">2024-12-10</td>
                <td className="p-3">09:00 AM - 10:30 AM</td>
                <td className="p-3 font-medium">CS305: Algorithms</td>
                <td className="p-3">Dr. Sarah Smith</td>
                <td className="p-3 text-right">
                  <button onClick={handleEditClick} className="text-blue-600 hover:underline font-medium">Edit</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3">2024-12-12</td>
                <td className="p-3">02:00 PM - 03:30 PM</td>
                <td className="p-3 font-medium">MAT202: Linear Algebra</td>
                <td className="p-3">Dr. Alan Turing</td>
                <td className="p-3 text-right">
                  <button onClick={handleEditClick} className="text-blue-600 hover:underline font-medium">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
          <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to List
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {viewMode === 'edit' ? 'Edit Schedule' : 'Create New Schedule'}
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input 
              type="date" 
              defaultValue={formData.date}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time (From)</label>
              <div className="flex gap-2">
                <input type="text" placeholder="HH" defaultValue={formData.startHour} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <span className="self-center font-bold">:</span>
                <input type="text" placeholder="MM" defaultValue={formData.startMinute} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <select defaultValue={formData.startAmPm} className="p-3 border border-slate-300 rounded-lg bg-white">
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time (To)</label>
              <div className="flex gap-2">
                <input type="text" placeholder="HH" defaultValue={formData.endHour} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <span className="self-center font-bold">:</span>
                <input type="text" placeholder="MM" defaultValue={formData.endMinute} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <select defaultValue={formData.endAmPm} className="p-3 border border-slate-300 rounded-lg bg-white">
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Module</label>
            <select defaultValue={formData.module} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
              <option value="">Select Module...</option>
              <option value="CS305">CS305: Algorithms</option>
              <option value="CS101">CS101: Intro to CS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Professor</label>
            <select defaultValue={formData.professor} className="w-full p-3 border border-slate-300 rounded-lg bg-white">
              <option value="">Select Professor...</option>
              <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
              <option value="Dr. Alan Turing">Dr. Alan Turing</option>
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              {viewMode === 'edit' ? 'Save Changes' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. EXAM SCHEDULE MANAGEMENT
const AdminExamManager = () => {
  const [viewMode, setViewMode] = useState('list');
  
  if (viewMode === 'list') {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-end items-center mb-6">
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input type="text" placeholder="Search module..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button 
                onClick={() => setViewMode('create')} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={16} /> New Schedule
              </button>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Module Name</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-medium">CS305: Algorithms</td>
                <td className="p-3">2024-12-15</td>
                <td className="p-3">10:00 AM - 12:00 PM</td>
                <td className="p-3 text-right">
                  <button onClick={() => setViewMode('edit')} className="text-blue-600 hover:underline font-medium">Edit</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-medium">PHY101: Physics</td>
                <td className="p-3">2024-12-18</td>
                <td className="p-3">01:00 PM - 03:00 PM</td>
                <td className="p-3 text-right">
                  <button onClick={() => setViewMode('edit')} className="text-blue-600 hover:underline font-medium">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Edit/Create Form
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
          <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to List
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {viewMode === 'edit' ? 'Edit Exam Schedule' : 'Create Exam Schedule'}
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Module Name</label>
            <select className="w-full p-3 border border-slate-300 rounded-lg bg-white" defaultValue="CS305">
              <option value="">Select Module...</option>
              <option value="CS305">CS305: Algorithms</option>
              <option value="PHY101">PHY101: Physics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input 
              type="date" 
              defaultValue={viewMode === 'edit' ? "2024-12-15" : ""}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time (From)</label>
              <div className="flex gap-2">
                <input type="text" placeholder="HH" defaultValue={viewMode === 'edit' ? "10" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <span className="self-center font-bold">:</span>
                <input type="text" placeholder="MM" defaultValue={viewMode === 'edit' ? "00" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <select className="p-3 border border-slate-300 rounded-lg bg-white">
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time (To)</label>
              <div className="flex gap-2">
                <input type="text" placeholder="HH" defaultValue={viewMode === 'edit' ? "12" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <span className="self-center font-bold">:</span>
                <input type="text" placeholder="MM" defaultValue={viewMode === 'edit' ? "00" : ""} className="w-full p-3 border border-slate-300 rounded-lg text-center" />
                <select 
                  className="p-3 border border-slate-300 rounded-lg bg-white" 
                  defaultValue={viewMode === 'edit' ? 'PM' : 'AM'}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              {viewMode === 'edit' ? 'Save Changes' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. School Admin: USER MANAGEMENT
const AdminStudentManager = () => {
  const [viewMode, setViewMode] = useState('list');
  const [students, setUsers] = useState([
    { id: '2024001', name: 'Alex Student', email: 'alex@uowmail.edu.au', status: 'Active', role:'Student', phone: '8123-1234', address: 'test street 123' },
    { id: '2024002', name: 'Jamie Doe', email: 'jamie@uowmail.edu.au', status: 'Inactive', role:'Student',phone: '8123-1235', address: 'test street 123' },
    { id: '2024003', name: 'Prof. Jamie', email: 'jamie@uowmail.edu.au', status: 'Inactive', role:'Professor',phone: '8123-1236', address: 'test street 123' }
  ]);
  const [confirmModal, setConfirmModal] = useState(null);  

  // Initialize with empty structure for create mode
  const [formData, setFormData] = useState({ id: '', name: '', email: '', phone: '', address: '' });
  const handleToggleStatus = (id) => {
    setUsers(students.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    setConfirmModal(null);
  };
  
  // const toggleStatus = (id) => {
  //   setStudAndProf(students.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
  // };
  const initiateToggle = (student) => {
    if (student.status === 'Active') {
      setConfirmModal(student);
    } else {
      handleToggleStatus(student.id); // Direct activate
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setFormData({ 
      id: '2024XXX', // Prefilled system ID
      name: '', 
      email: '', 
      phone: '', 
      address: '' 
    });
    setViewMode('create');
  };

  if (viewMode === 'list') {
    return (
      <div className="p-6">
        {/* Confirmation Modal */}
        {confirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="text-red-500" /> Confirm Deactivation
              </h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to inactivate <strong>{confirmModal.name}</strong>? They will lose access to the system immediately.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleToggleStatus(confirmModal.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Inactivate
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-end items-center mb-6">
            {/* <h3 className="font-bold text-lg text-slate-800">Student Directory</h3> */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                 <input type="text" placeholder="Search by name..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button 
                onClick={handleCreate} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={16} /> Create User
              </button>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">ID</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{s.name}</td>
                  <td className="p-3 text-slate-500">{s.id}</td>
                  <td className="p-3 text-slate-500">{s.email}</td>
                  <td className="p-3 text-slate-500">{s.role}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right flex justify-end gap-3 items-center">
                    <button 
                      onClick={() => initiateToggle(s)}
                      className={`text-xs font-bold px-3 py-1 rounded border ${
                        s.status === 'Active' 
                          ? 'border-red-200 text-red-600 hover:bg-red-50' 
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {s.status === 'Active' ? 'Inactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleEdit(s)} className="text-blue-600 hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Edit Form
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
          <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to List
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {viewMode === 'create' ? 'Create New User' : 'Edit Student Details'}
        </h2>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">User Name</label>
              <input 
                type="text" 
                defaultValue={formData.name} 
                disabled={viewMode === 'edit'} // Editable only in Create mode
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  viewMode === 'edit' 
                    ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                    : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                }`} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">User ID</label>
              <input 
                type="text" 
                defaultValue={formData.id} 
                disabled 
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-mono" 
              />
              {viewMode === 'create' && <p className="text-xs text-slate-400 mt-1">Auto-generated by system</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Role</label>
            <select
              defaultValue={formData.role}
              disabled={viewMode === 'edit'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })} // Example handler
              className={`w-full p-3 border rounded-lg focus:outline-none appearance-none ${
                viewMode === 'edit'
                  ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">Email Address</label>
            <input 
              type="text" 
              defaultValue={formData.email} 
              disabled={viewMode === 'edit'} // Editable only in Create mode
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                viewMode === 'edit' 
                  ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Phone Number</label>
            <input type="text" defaultValue={formData.phone} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Address</label>
            <input type="text" defaultValue={formData.address} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              {viewMode === 'create' ? 'Create Account' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. EVENT MANAGEMENT
const AdminEventManager = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'edit', 'create'
  const [events, setEvents] = useState([
    { id: 1, name: 'Science & Tech Fair', venue: 'Main Hall', date: '2024-12-10', start: '10:00 AM', end: '04:00 PM', description: 'Explore the latest innovations.' },
    { id: 2, name: 'Guest Lecture', venue: 'Auditorium', date: '2024-12-15', start: '02:00 PM', end: '03:30 PM', description: 'Lecture on AI Ethics.' }
  ]);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setEditingEvent({ name: '', venue: '', date: '', start: '', end: '', description: '' });
    setViewMode('create');
  };

  if (viewMode === 'list') {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-end items-center mb-6">
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input type="text" placeholder="Search event..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap">
                <Plus size={16} /> New Event
              </button>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Event Name</th>
                <th className="p-3">Venue</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{ev.name}</td>
                  <td className="p-3 text-slate-500">{ev.venue}</td>
                  <td className="p-3 text-slate-500">{ev.date}</td>
                  <td className="p-3 text-slate-500">{ev.start} - {ev.end}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleEdit(ev)} className="text-blue-600 hover:underline font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Edit/Create Form
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
          <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to Events
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {viewMode === 'edit' ? 'Edit Event' : 'Create New Event'}
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
            <input 
              type="text" 
              defaultValue={editingEvent?.name}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Venue</label>
            <input 
              type="text" 
              defaultValue={editingEvent?.venue}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input 
              type="date" 
              defaultValue={editingEvent?.date}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
              <input 
                type="text" 
                placeholder="10:00 AM" 
                defaultValue={editingEvent?.start}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
              <input 
                type="text" 
                placeholder="12:00 PM"
                defaultValue={editingEvent?.end}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Event Description</label>
            <textarea 
              rows={4}
              defaultValue={editingEvent?.description}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              {viewMode === 'edit' ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- SYS ADMIN COMPONENTS ---
const SysAdminDashboard = () => (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Total Users', value: '1,240', icon: Users, color: 'bg-blue-500' },
        { label: 'Daily Active Users (Today)', value: '850', icon: Activity, color: 'bg-green-500' },
        { label: 'Total Conversations (Today)', value: '3,402', icon: MessageCircle, color: 'bg-purple-500' },
        { label: 'AVG Response Time', value: '0.4s', icon: Clock, color: 'bg-orange-500' },
      ].map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-${stat.color.replace('bg-', '')}`}>
              <stat.icon size={24} className={`text-${stat.color.replace('bg-', 'text-')}`} /> 
              {/* Note: Tailwind dynamic classes limitation, using inline style for simplicity in this demo context if needed, but standard text-color classes usually work if safelisted. For now relying on standard text-blue-500 etc being present. */}
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Placeholder for chart */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex flex-col items-center justify-center text-slate-400">
      <BarChart size={48} className="mb-4 opacity-50" />
      <p>Usage Analytics Chart Placeholder</p>
    </div>
  </div>
);

const SysAdminFeedback = () => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-500 text-sm mb-1">Average Rating</p>
        <div className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
          4.2 <Star className="fill-yellow-400 text-yellow-400" size={28} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-500 text-sm mb-1">Total Submissions</p>
        <div className="text-4xl font-bold text-slate-800">156</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-500 text-sm mb-1">Negative Feedback (1-2 Stars)</p>
        <div className="text-4xl font-bold text-red-600">5%</div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-lg text-slate-800 mb-4">Recent User Feedback</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Role</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Conversation ID</th>
              <th className="p-3 w-1/3">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { date: '2024-12-10', uid: '2024001', role: 'Student', rating: 5, cid: 'CONV-1023', comment: 'Very helpful response!' },
              { date: '2024-12-09', uid: 'PROF001', role: 'Professor', rating: 4, cid: 'CONV-0922', comment: 'Good, but the map took a while to load.' },
              { date: '2024-12-08', uid: '2024045', role: 'Student', rating: 2, cid: 'CONV-0811', comment: 'Incorrect class timing shown.' },
            ].map((fb, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-3 text-slate-500">{fb.date}</td>
                <td className="p-3 font-mono text-xs">{fb.uid}</td>
                <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{fb.role}</span></td>
                <td className="p-3 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < fb.rating ? 'fill-current' : 'text-slate-200'} />
                  ))}
                </td>
                <td className="p-3 font-mono text-xs text-blue-600">{fb.cid}</td>
                <td className="p-3 text-slate-700 italic">"{fb.comment}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const SysAdminAccounts = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create'
  const [users, setUsers] = useState([
    { id: 'ADM001', name: 'School Admin 1', email: 'admin1@uowmail.edu.au', role: 'School Admin', status: 'Active', phone: '8123-1234', address: 'test street 123'  },
    { id: 'ADM002', name: 'School Admin 2', email: 'admin2@uowmail.edu.au', role: 'School Admin', status: 'Active', phone: '8123-1234', address: 'test street 123'  },
    { id: 'ADM003', name: 'School Admin 3', email: 'admin3@uowmail.edu.au', role: 'School Admin', status: 'Inactive', phone: '8123-1234', address: 'test street 123'  }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // stores user ID to confirm
  
  // Form state for creating new admin
  const [formData, setFormData] = useState({ 
    id: 'ADM-2024-X', 
    role: 'School Admin', 
    name: '', 
    email: '', 
    phone: '', 
    address: '' 
  });

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    setConfirmModal(null);
  };

  const initiateToggle = (user) => {
    if (user.status === 'Active') {
      setConfirmModal(user);
    } else {
      handleToggleStatus(user.id); // Direct activate
    }
  };

  const handleCreateClick = () => {
    setFormData({ 
      id: `ADM-${Math.floor(Math.random() * 10000)}`, // Simulate auto-populate
      role: 'School Admin', 
      name: '', 
      email: '', 
      phone: '', 
      address: '' 
    });
    setViewMode('create');
  };

  const handleEdit = (user) => {
    setFormData(user);
    setViewMode('edit');
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  //List View
  if (viewMode === 'list') {
    return (
    <div className="p-6 relative">
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="text-red-500" /> Confirm Deactivation
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to inactivate <strong>{confirmModal.name}</strong>? They will lose access to the system immediately.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleToggleStatus(confirmModal.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Inactivate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-end items-center mb-6">
          <div className="flex gap-3">
            <div className="relative w-64">
               <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search by user name..." 
                 className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button 
              onClick={handleCreateClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} /> Create Admin
            </button>
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="p-3">User Name</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-800">{user.name}</td>
                <td className="p-3 font-mono text-xs text-slate-500">{user.id}</td>
                <td className="p-3 text-slate-500">{user.email}</td>
                <td className="p-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{user.role}</span></td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-3 text-right flex justify-end gap-3 items-center">
                  <button 
                    onClick={() => initiateToggle(user)}
                    className={`text-xs font-bold px-3 py-1 rounded border ${
                      user.status === 'Active' 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {user.status === 'Active' ? 'Inactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
  }
  
  //Create/Edit Form
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 text-slate-500 text-sm">
          <button onClick={() => setViewMode('list')} className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to User Management
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Create School Admin Account</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Role</label>
              <input 
                type="text" 
                value={formData.role} 
                disabled 
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">User ID (Auto-generated)</label>
              <input 
                type="text" 
                value={formData.id} 
                disabled 
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-mono" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={formData.name}
              className={`w-full p-3 border rounded-lg focus:outline-none 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500'
                }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              defaultValue={formData.email}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="admin@uowmail.edu.au"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              defaultValue={formData.phone}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="8123-1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <input 
              type="text" 
              defaultValue={formData.address}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="123 test street"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- REVISED COMMON PROFILE COMPONENT ---
const CommonProfile = ({ name: initialName, role, id, email: initialEmail = 'user@university.edu', phone: initialPhone = '8941-1234', address: initialAddress = '123 University Ave, Campus' }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    address: initialAddress
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Logic to save data would go here
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  // Permission Logic
  // Student/Prof: Edit Phone, Address. Read-only Name, Email, ID.
  // Admin/SysAdmin: Edit Name, Email, Phone. Read-only ID, Address.
  
  const isStudentOrProf = role === 'Student' || role === 'Professor';
  const isAdmin = role === 'School Admin' || role === 'Sys Admin';

  const canEditName = isAdmin;
  const canEditEmail = isAdmin;
  const canEditPhone = true; // All roles can edit phone based on interpretation or specific requirement
  const canEditAddress = isStudentOrProf; // Admins read-only based on "able to update name, email, phone"

  return (
    <div className="p-6 w-full md:w-2/5 mx-auto">
       <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={48} className="text-slate-400"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{profileData.name}</h2>
            <p className="text-slate-500">{role}</p>
          </div>
          
          <div className="space-y-4">
            {/* User ID (Always Read Only) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">User ID</label>
              <input 
                type="text" 
                value={id} 
                disabled 
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-sm"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing || !canEditName}
                className={`w-full p-3 rounded-lg border text-sm transition-colors ${
                  !isEditing || !canEditName 
                    ? 'bg-slate-100 border-slate-200 text-slate-500' 
                    : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing || !canEditEmail}
                className={`w-full p-3 rounded-lg border text-sm transition-colors ${
                  !isEditing || !canEditEmail 
                    ? 'bg-slate-100 border-slate-200 text-slate-500' 
                    : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                }`}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing || !canEditPhone}
                className={`w-full p-3 rounded-lg border text-sm transition-colors ${
                  !isEditing || !canEditPhone 
                    ? 'bg-slate-100 border-slate-200 text-slate-500' 
                    : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                }`}
              />
            </div>

            {/* Address - Only visible for Student and Professor */}
            {isStudentOrProf && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Home Address</label>
                <textarea 
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing || !canEditAddress}
                  rows={2}
                  className={`w-full p-3 rounded-lg border text-sm transition-colors resize-none ${
                    !isEditing || !canEditAddress 
                      ? 'bg-slate-100 border-slate-200 text-slate-500' 
                      : 'bg-white border-blue-300 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none'
                  }`}
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            {isEditing ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit size={18} /> Edit Profile
              </button>
            )}
          </div>
       </div>
    </div>
  );
};


// --- Main App Shell ---

const App = () => {
  const [role, setRole] = useState('guest'); // guest, student, professor, school_admin, sys_admin
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set default tab when role changes
  useEffect(() => {
    setActiveTab('dashboard');
    if (role === 'guest') setActiveTab('home');
    if (role === 'student') setActiveTab('admin_chat');
    if (role === 'professor') setActiveTab('schedule');
    if (role === 'school_admin') setActiveTab('schedules');
    if (role === 'sys_admin') setActiveTab('dashboard');
  }, [role]);

  const handleLogout = () => {
    setRole('guest');
    setActiveTab('home');
  };

  const handleLogin = (userIdInput) => {
    const id = userIdInput.toLowerCase().trim();

    if (id === 'student1') setRole('student');
    else if (id === 'prof1') setRole('professor');
    else if (id === 'school admin1') setRole('school_admin');
    else if (id === 'sys admin1') setRole('sys_admin');
    else {
      alert("Invalid User ID for Demo. Try: student1, prof1, school admin1, or sys admin1");
      return; 
    }
  };

  const getUserInfo = () => {
    switch(role) {
      case 'student': return { name: 'Alex Student', role: 'Student', initials: 'AS' };
      case 'professor': return { name: 'Dr. Sarah Smith', role: 'Professor', initials: 'SS' };
      case 'school_admin': return { name: 'Admin Office', role: 'School Admin', initials: 'AO' };
      case 'sys_admin': return { name: 'System Root', role: 'Sys Admin', initials: 'SR' };
      default: return null;
    }
  };

  const renderContent = () => {
    // Guest Routing
    if (role === 'guest') {
      switch(activeTab) {
        case 'home': return <GuestHome setActiveTab={setActiveTab} />;
        case 'chat': return <GuestChat />;
        case 'login': return <LoginPage onLogin={handleLogin} />;
        case 'map': return <GuestMap setActiveTab={setActiveTab} />;
        case 'events': return <GuestEvents setActiveTab={setActiveTab} />;
        default: return <GuestHome setActiveTab={setActiveTab} />;
      }
    }

    // Student Routing
    if (role === 'student') {
      switch(activeTab) {
        case 'admin_chat': return <StudentAdminChat setActiveTab={setActiveTab} />;
        case 'course_chat': return <StudentKnowledgeChat setActiveTab={setActiveTab} />;
        case 'announcements': return <StudentAnnouncements />;
        case 'review': return <StudentLeaveReview setActiveTab={setActiveTab} />;
        case 'profile': return <CommonProfile name="Alex Student" role="Student" id="2024001" email="alex.student@uowmail.edu.au" />;
        default: return <StudentAdminChat setActiveTab={setActiveTab} />;
      }
    }

    // Professor Routing
    if (role === 'professor') {
      switch(activeTab) {
        case 'schedule': return <ProfessorSchedule />;
        case 'modules': return <ProfessorModules />;
        case 'students': return <ProfessorStudents />;
        case 'announcements': return <ProfessorAnnouncements />;
        case 'profile': return <CommonProfile name="Dr. Sarah Smith" role="Professor" id="PROF001" email="sarah.smith@uowmail.edu.au" />;
        default: return <ProfessorSchedule />;
      }
    }

    // SCHOOL ADMIN Routing
    if (role === 'school_admin') {
      switch(activeTab) {
        case 'schedules': return <AdminScheduleManager />;
        case 'exams': return <AdminExamManager />;
        case 'events': return <AdminEventManager />;
        case 'students': return <AdminStudentManager />;
        case 'profile': return <CommonProfile name="School Admin" role="School Admin" id="ADM001" email="admin.office@uowmail.edu.au" />;
        default: return <AdminScheduleManager />;
      }
    }

    // SYSTEM ADMIN Routing
    if (role === 'sys_admin') {
      switch(activeTab) {
        case 'dashboard': return <SysAdminDashboard />;
        case 'feedback': return <SysAdminFeedback />;
        case 'accounts': return <SysAdminAccounts />;
        case 'profile': return <CommonProfile name="System Root" role="Sys Admin" id="ROOT" email="sys.root@uowmail.edu.au" />;
        default: return <SysAdminDashboard />;
      }
    }

    // Fallbacks
    return <div className="p-10 text-center text-slate-500">View for {role} not fully implemented in this demo step.</div>;
  };

  // Dynamic Titles
  const getTitle = () => {
    if (role === 'sys_admin') {
      if (activeTab === 'dashboard') return 'Usage Analytics';
      if (activeTab === 'feedback') return 'User Feedback';
      if (activeTab === 'accounts') return 'Manage Accounts';
      if (activeTab === 'profile') return 'My Profile';
    }
    if (role === 'school_admin') {
      if (activeTab === 'schedules') return 'Manage Teaching Schedules';
      if (activeTab === 'exams') return 'Exam Schedule Management';
      if (activeTab === 'events') return 'Event Management';
      if (activeTab === 'students') return 'User Management';
      if (activeTab === 'profile') return 'My Profile';
    }
    if (role === 'professor') {
      if (activeTab === 'schedule') return 'Teaching Schedule';
      if (activeTab === 'modules') return 'Module Management';
      if (activeTab === 'students') return 'Class View';
      if (activeTab === 'announcements') return 'Post Announcement';
      if (activeTab === 'profile') return 'My Profile';
    }
    if (role === 'guest') {
      if (activeTab === 'map') return 'Campus Map';
      if (activeTab === 'events') return 'Upcoming Events';
      if (activeTab === 'chat') return 'Chat Assistant';
      if (activeTab === 'login') return 'Login';
      return 'Home';
    }
    if (role === 'student') {
      if (activeTab === 'admin_chat') return 'Admin Assistant';
      if (activeTab === 'course_chat') return 'Course Tutor';
      if (activeTab === 'announcements') return 'Professor Announcements';
      if (activeTab === 'review') return 'Review';
      if (activeTab === 'profile') return 'My Profile';
      return 'Home';
    }
    return 'Dashboard';
  };

  const isFixedLayout = ['chat', 'map', 'admin_chat', 'course_chat', 'review'].includes(activeTab);

  return (
    <div className="h-screen bg-slate-100 flex flex-col font-sans text-slate-900 overflow-hidden">
      
      {/* ROLE SWITCHER */}
      <div className="bg-slate-800 text-slate-300 py-2 px-4 text-xs flex justify-center gap-4 flex-wrap items-center z-50 flex-shrink-0">
        <span className="uppercase font-bold text-white tracking-widest">Select Role View:</span>
        {['guest', 'student', 'professor', 'school_admin', 'sys_admin'].map((r) => (
          <button 
            key={r}
            onClick={() => setRole(r)}
            className={`px-3 py-1 rounded-full capitalize transition-all ${role === r ? 'bg-blue-500 text-white shadow-lg scale-105' : 'hover:bg-slate-700'}`}
          >
            {r.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar 
          role={role} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={handleLogout}
        />

        {/* Update: Main Container 
            We apply 'overflow-hidden' if the child needs to control scroll (like Chat),
            otherwise we apply 'overflow-y-auto' for dashboards/lists.
        */}
        <main className={`flex-1 flex flex-col w-full h-full relative transition-all ${isFixedLayout ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <Header 
            title={getTitle()} 
            user={getUserInfo()} 
            setMobileMenuOpen={setMobileMenuOpen}
            onLoginClick={() => setActiveTab('login')}
            onProfileClick={() => setActiveTab('profile')}
          />
          
          {/* Content Wrapper */}
          <div className={`flex-1 min-h-0 flex flex-col relative ${isFixedLayout ? 'h-full' : ''}`}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;