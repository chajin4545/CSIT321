import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, MoreVertical, Star, Trash2, Bell, User, Send } from 'lucide-react';
import Header from '../../components/common/Header';

const AdminChat = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();
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
    navigate('/student/review');
    setActiveMenu(null);
  };

  return (
    <div className="flex flex-col h-full" onClick={() => setActiveMenu(null)}>
      <Header title="Admin Assistant" setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
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
                onClick={() => navigate('/student/announcements')}
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
    </div>
  );
};

export default AdminChat;
