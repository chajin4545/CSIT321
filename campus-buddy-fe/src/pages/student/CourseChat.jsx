import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, MoreVertical, Star, Trash2, GraduationCap, User, Send, Loader, MessageSquare, MessageSquarePlus, X } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const CourseChat = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth();
  
  // UI State
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // Data State
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSessionId, setReviewSessionId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchEnrolledModules();
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchEnrolledModules = async () => {
    try {
      const response = await fetch('/api/school-admin/modules', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Ideally we only show modules the student is enrolled in. 
        // For now, fetching all and we'll filter if needed, or assume backend handles enrollment check.
        setModules(data);
        if (data.length > 0) {
          setSelectedModule(data[0].module_code);
        }
      }
    } catch (error) {
      console.error("Failed to fetch modules:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/chat/history', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter history for course_tutor type if possible, or handle in backend
        setHistory(data);
        
        if (data.length > 0 && !currentSessionId) {
          // Find the first course_tutor session or stay on new chat
          const firstTutorSession = data.find(s => s.type === 'course_tutor');
          // if (firstTutorSession) loadSession(firstTutorSession.session_id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/session/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentSessionId(data.sessionId);
        setMessages(data.messages);
        // If the session has a related module, update selector (need backend to return this)
        // if (data.relatedModuleCode) setSelectedModule(data.relatedModuleCode);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToNewChat = () => {
    setCurrentSessionId(null);
    setMessages([{ 
      role: 'assistant', 
      content: `Hello! I am your AI Course Tutor. Please select a module above, and I will help you with information specifically from the materials provided by your professor.` 
    }]);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !selectedModule) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ 
          message: userMessage.content, 
          sessionId: currentSessionId,
          type: 'course_tutor',
          relatedModuleCode: selectedModule
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      if (!currentSessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId);
        fetchHistory();
      }

      setMessages(prev => [...prev, data.message]); 
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error connecting to the server. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openReviewModal = (sessionId) => {
    setReviewSessionId(sessionId);
    setRating(0);
    setComment('');
    setIsReviewModalOpen(true);
    setActiveMenu(null);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewSessionId(null);
  };

  const submitReview = async () => {
    if (rating === 0) return;
    setIsSubmittingReview(true);
    try {
      const response = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ sessionId: reviewSessionId, rating, comment })
      });
      if (response.ok) {
        closeReviewModal();
        alert("Review submitted successfully!");
      }
    } catch (error) {
      alert("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full" onClick={() => setActiveMenu(null)}>
      <Header title="Course Tutor" setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">Study Sessions</span>
              <button onClick={resetToNewChat} className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50">
                <Plus size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
            {history.filter(h => h.type === 'course_tutor').map(item => (
                <div 
                  key={item.session_id} 
                  className={`relative group border-b border-slate-50 transition-colors cursor-pointer ${currentSessionId === item.session_id ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'}`}
                  onClick={() => loadSession(item.session_id)}
                >
                <div className="w-full text-left p-4 pr-10">
                    <div className={`text-sm font-medium truncate ${currentSessionId === item.session_id ? 'text-blue-700' : 'text-slate-800'}`}>
                      {item.title || 'New Study Session'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{formatDate(item.last_active)}</div>
                </div>
                <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === item.session_id ? null : item.session_id);
                    }}
                    className={`absolute right-2 top-3 p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all ${activeMenu === item.session_id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <MoreVertical size={16} />
                </button>
                {activeMenu === item.session_id && (
                  <div className="absolute right-2 top-8 z-50 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openReviewModal(item.session_id); }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <MessageSquarePlus size={14} className="text-blue-500" />
                      Make a Review
                    </button>
                  </div>
                )}
                </div>
            ))}
            </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative min-w-0 h-full">
            {/* Module Selector */}
            <div className="bg-white border-b border-slate-200 p-3 px-6 flex justify-between items-center shadow-sm z-10 flex-shrink-0">
              <div className="flex items-center gap-2 text-slate-600">
                  <GraduationCap size={20} className="text-orange-500" />
                  <span className="font-bold text-slate-700">Course Context</span>
              </div>
              <select 
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  resetToNewChat(); // Clear session when switching modules
                }}
                className="bg-slate-100 border-none text-sm font-medium rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option value="" disabled>Select a Module</option>
                {modules.map(mod => (
                  <option key={mod.module_code} value={mod.module_code}>
                    {mod.module_code}: {mod.module_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            {messages.length === 0 && !isLoading && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                  <MessageSquare size={64} className="mb-4" />
                  <p>Select a module and start studying!</p>
               </div>
            )}
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-2xl gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-orange-500'}`}>
                      {msg.role === 'user' ? <User size={16} className="text-white"/> : <GraduationCap size={16} className="text-white"/>}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base whitespace-pre-wrap ${
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                    {msg.content}
                    </div>
                </div>
                </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="flex max-w-2xl gap-3 flex-row">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-500">
                      <GraduationCap size={16} className="text-white"/>
                    </div>
                    <div className="p-4 rounded-2xl shadow-sm bg-white border border-slate-200 text-slate-500 rounded-tl-none flex items-center gap-2">
                      <Loader size={16} className="animate-spin" /> Analyzing materials...
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-slate-200 p-4 md:p-6 flex-shrink-0">
            <div className="max-w-4xl mx-auto flex gap-4">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about concepts, assignments..." 
                  className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim() || !selectedModule}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 rounded-xl flex items-center gap-2 font-medium transition-colors"
                >
                  <Send size={18} />
                </button>
            </div>
            </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">Rate this Study Session</h3>
                <button onClick={closeReviewModal} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <div className="mb-6 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110 focus:outline-none">
                    <Star size={32} className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="How helpful was the tutor?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32 mb-6"
              />
              <div className="flex gap-3">
                <button onClick={closeReviewModal} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium">Cancel</button>
                <button 
                  onClick={submitReview} disabled={isSubmittingReview || rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:bg-blue-300 flex justify-center items-center gap-2"
                >
                  {isSubmittingReview ? <Loader size={18} className="animate-spin" /> : 'Save Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseChat;
