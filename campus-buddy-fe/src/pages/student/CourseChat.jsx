import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, MoreVertical, Star, Trash2, GraduationCap, User, Send } from 'lucide-react';
import Header from '../../components/common/Header';

const CourseChat = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();
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
    { sender: 'bot', text: `For CS305 Algorithms, the midterm covers: 
1. Big O Notation
2. Sorting Algorithms (Merge, Quick, Heap)
3. Graph Traversals (BFS, DFS).` },
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
    navigate('/student/review');
    setActiveMenu(null);
  };

  return (
    <div className="flex flex-col h-full" onClick={() => setActiveMenu(null)}>
      <Header title="Course Tutor" setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
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
    </div>
  );
};

export default CourseChat;
