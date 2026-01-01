import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Send } from 'lucide-react';
import Header from '../../components/common/Header';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const { setMobileMenuOpen } = useOutletContext();

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
    <div className="flex flex-col h-full">
      <Header title="Chat Assistant" setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex-1 min-h-0 flex flex-col bg-slate-50 relative">
        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {mockHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base max-w-[80%] ${
                msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>{msg.text}</div>
            </div>
          ))}
        </div>
        
        {/* Input Area */}
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
    </div>
  );
};

export default Chat;
