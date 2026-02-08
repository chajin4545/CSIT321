import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Send, User, Loader, MessageSquare } from 'lucide-react';
import Header from '../../components/common/Header';

const Chat = () => {
  const { setMobileMenuOpen } = useOutletContext();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([{ 
    role: 'assistant', 
    content: 'Hello! I am the Campus Guest Assistant. I can help you with upcoming events and general campus information.\n\nNote: I cannot access personal student data.' 
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('guestSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content, 
          sessionId: sessionId 
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Update Session ID if new
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('guestSessionId', data.sessionId);
      }

      // Check for Rate Limit
      if (data.limitReached) {
        setLimitReached(true);
      }

      setMessages(prev => [...prev, data.message]);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
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
      const url = match[2];
      const isInternal = url.startsWith('/');
      
      parts.push(
        <a 
          key={match.index} 
          href={url} 
          onClick={(e) => {
            if (isInternal) {
                e.preventDefault();
                navigate(url);
            }
            e.stopPropagation();
          }}
          target={isInternal ? "_self" : "_blank"} 
          rel={isInternal ? "" : "noopener noreferrer"}
          className="text-blue-600 hover:text-blue-800 underline font-bold cursor-pointer"
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

  return (
    <div className="flex flex-col h-full">
      <Header title="Guest Assistant" setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex-1 min-h-0 flex flex-col bg-slate-50 relative">
        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
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
        <div className="bg-white border-t border-slate-200 p-4 md:p-6 flex-shrink-0 z-10">
          <div className="max-w-4xl mx-auto flex gap-4">
             <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={limitReached ? "Limit reached. Please login." : "Ask about events..."}
              disabled={isLoading || limitReached}
              className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-200 disabled:text-slate-500"
             />
             <button 
               onClick={handleSend}
               disabled={isLoading || !inputText.trim() || limitReached}
               className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 rounded-xl flex items-center gap-2 font-medium transition-colors"
             >
               <span>Send</span>
               <Send size={18} />
             </button>
          </div>
          {limitReached && (
            <div className="max-w-4xl mx-auto mt-2 text-center text-red-500 text-sm">
              You have reached the guest message limit. Please <span onClick={() => navigate('/login')} className="underline cursor-pointer font-bold">Login</span> to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
