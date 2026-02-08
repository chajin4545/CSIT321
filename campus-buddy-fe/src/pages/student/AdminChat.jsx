/**
 * AdminChat.jsx
 * 
 * The main interface for the Student-side "Admin Assistant" chatbot.
 * 
 * Features:
 * - Real-time-like messaging (sending to backend, awaiting response).
 * - Chat History Sidebar (fetching, selecting, and creating new sessions).
 * - Optimistic UI updates (showing user message immediately).
 * - Auto-scrolling to the latest message.
 * - Review/Feedback system for chat sessions.
 * 
 * State Management:
 * - messages: Array of current conversation objects.
 * - currentSessionId: Tracks which DB session is active (null for new chat).
 * - history: Array of past sessions for the sidebar.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, MoreVertical, Star, Trash2, Bell, User, Send, Loader, MessageSquare, MessageSquarePlus, X } from 'lucide-react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const AdminChat = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useOutletContext();
  const { user } = useAuth(); // Auth context provides the JWT token
  
  // UI Inputs
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Reference for auto-scrolling
  
  // Data State
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSessionId, setReviewSessionId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  /**
   * Auto-scroll behavior
   * Triggered whenever 'messages' array changes.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Initial Data Fetch
   * Loads chat history on mount.
   */
  useEffect(() => {
    fetchHistory();
  }, []);

  /**
   * fetchHistory
   * Retrieves the list of past chat sessions for the sidebar.
   * If history exists, it automatically loads the most recent session.
   */
  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/chat/history', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched history:", data); // Debug log
        setHistory(data);
        
        // UX Decision: Auto-load the latest chat if available, else show "New Chat" state
        if (data.length > 0 && !currentSessionId) {
          loadSession(data[0].session_id);
        } else if (data.length === 0) {
          resetToNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  /**
   * loadSession
   * Fetches full message history for a specific session ID.
   */
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
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * resetToNewChat
   * Clears current session state to allow starting a fresh conversation.
   */
  const resetToNewChat = () => {
    setCurrentSessionId(null);
    setMessages([{ 
      role: 'assistant', 
      content: `Hello ${user?.name || 'Student'}! I am your AI Assistant. I can help with general queries. What can I do for you today?` 
    }]);
  };

  /**
   * handleSend
   * Core logic for sending messages.
   * 1. Optimistically updates UI with user message.
   * 2. Sends payload to Backend API.
   * 3. Appends Backend response to UI.
   * 4. Updates Session ID if this was the first message in a new chat.
   */
  const handleSend = async () => {
    if (!inputText.trim()) return;

    // 1. Optimistic Update
    const userMessage = { role: 'user', content: inputText };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // 2. API Call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ 
          message: userMessage.content, 
          sessionId: currentSessionId 
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // 3. Handle New Session Creation
      // If we started with null sessionId, the backend created one. We capture it here.
      if (!currentSessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId);
        fetchHistory(); // Refresh sidebar so the new chat appears in the list
      }

      // 4. Update UI with AI Response
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

  // Helper: Relative date formatting (Today, Yesterday, etc.)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Helper: Format message content to handle Markdown links [Text](URL)
  const formatMessage = (content) => {
    if (!content) return null;
    
    // Regex to match [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Push text before the link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      // Push the link component
      parts.push(
        <a 
          key={match.index} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 underline font-medium"
          onClick={(e) => e.stopPropagation()} 
        >
          {match[1]}
        </a>
      );
      
      lastIndex = linkRegex.lastIndex;
    }

    // Push remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  // --- Review Modal Logic ---

  const openReviewModal = (sessionId) => {
    setReviewSessionId(sessionId);
    setRating(0);
    setComment('');
    setIsReviewModalOpen(true);
    setActiveMenu(null); // Close the menu
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewSessionId(null);
  };

  const submitReview = async () => {
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          sessionId: reviewSessionId,
          rating,
          comment
        })
      });

      if (response.ok) {
        closeReviewModal();
        alert("Review submitted successfully!");
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="flex flex-col h-full" onClick={() => setActiveMenu(null)}>
      <Header title="Admin Assistant" setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex flex-1 overflow-hidden bg-slate-50 relative">
        
        {/* --- Sidebar (History) --- */}
        <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">History</span>
              <button 
                onClick={resetToNewChat}
                className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                title="New Chat"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
            {history.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-sm italic">No history yet. Start a chat!</div>
            )}
            {history.map(item => (
                <div 
                  key={item._id || item.session_id} 
                  className={`relative group border-b border-slate-50 transition-colors cursor-pointer ${currentSessionId === item.session_id ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'}`}
                  onClick={() => loadSession(item.session_id)}
                >
                <div className="w-full text-left p-4 pr-10">
                    <div className={`text-sm font-medium truncate ${currentSessionId === item.session_id ? 'text-blue-700' : 'text-slate-800'}`}>
                      {item.title || 'New Chat'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{formatDate(item.last_active)}</div>
                </div>
                
                {/* 3-Dot Menu Button */}
                <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Toggling menu for session: ${item.session_id}`);
                      setActiveMenu(activeMenu === item.session_id ? null : item.session_id);
                    }}
                    className={`absolute right-2 top-3 p-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all ${activeMenu === item.session_id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <MoreVertical size={16} />
                </button>

                {/* Dropdown Menu */}
                {activeMenu === item.session_id && (
                  <div className="absolute right-2 top-8 z-50 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Clicked Make a Review");
                        openReviewModal(item.session_id);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <MessageSquarePlus size={14} className="text-blue-500" />
                      Make a Review
                    </button>
                    {/* Placeholder for future delete functionality */}
                    {/* <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 size={14} />
                      Delete Chat
                    </button> */}
                  </div>
                )}
                </div>
            ))}
            </div>
        </div>

        {/* --- Main Chat Area --- */}
        <div className="flex-1 flex flex-col relative min-w-0 h-full">
            {/* Announcement Banner (Static Mockup for Context) */}
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

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            {messages.length === 0 && !isLoading && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                  <MessageSquare size={64} className="mb-4" />
                  <p>Start a new conversation</p>
               </div>
            )}
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-2xl gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                    <User size={16} className="text-white"/>
                    </div>
                    {/* Message Bubble */}
                    <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base whitespace-pre-wrap ${
                    msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                    {msg.role === 'user' ? msg.content : formatMessage(msg.content)}
                    </div>
                </div>
                </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="flex max-w-2xl gap-3 flex-row">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-600">
                      <User size={16} className="text-white"/>
                    </div>
                    <div className="p-4 rounded-2xl shadow-sm bg-white border border-slate-200 text-slate-500 rounded-tl-none flex items-center gap-2">
                      <Loader size={16} className="animate-spin" /> Thinking...
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
                placeholder="Ask about grades, schedules..." 
                className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 rounded-xl flex items-center gap-2 font-medium transition-colors"
                >
                <Send size={18} />
                </button>
            </div>
            </div>
        </div>
      </div>

      {/* --- Review Modal Overlay --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">Rate this Chat</h3>
                <button onClick={closeReviewModal} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-6 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      size={32} 
                      className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                    />
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the response quality?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={closeReviewModal}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitReview}
                  disabled={isSubmittingReview || rating === 0}
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

export default AdminChat;