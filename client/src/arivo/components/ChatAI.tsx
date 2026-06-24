
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { UserProfile } from '../types';
import { useChat } from './ChatContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FRIENDLY_ERRORS = [
  "Oh no! My learning gears got a bit stuck. Could you try asking that again? ⚙️",
  "I'm having a little trouble connecting to my study notes right now. Let's try once more! 📚",
  "Oops! That question was a bit tricky for my circuits. Can we try rephrasing it?",
  "It looks like I took a tiny nap! Could you repeat that for me? 😴",
  "My connection to the brain-ship is a bit wobbly. Let's try sending that again! 🛸",
  "I'm struggling to find the right words right now. Give me one more shot? 🎓"
];

export const ChatAIButton: React.FC = () => {
  const { toggleChat } = useChat();
  return (
    <button 
      onClick={toggleChat}
      className="flex items-center space-x-2.5 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all group border border-indigo-500/50"
    >
      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <span className="hidden sm:inline text-sm">Ask AI Assistant</span>
    </button>
  );
};

export const ChatAIPanel: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const { isOpen, setIsOpen, messages, setMessages } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: `Hi ${profile.fullName.split(' ')[0]}! I'm your Arivo AI assistant. How can I help you with your ${profile.userType} studies today?` }]);
    }
  }, [profile.fullName, profile.userType, setMessages, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const getRandomError = () => {
    return FRIENDLY_ERRORS[Math.floor(Math.random() * FRIENDLY_ERRORS.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `
        You are a professional, helpful, and encouraging learning assistant for an EdTech app called Arivo.
        
        User Profile Information:
        - Name: ${profile.fullName}
        - Role: ${profile.userType}
        - Education Level: ${profile.class || profile.degree || 'Not specified'}
        - Board/Department: ${profile.board || profile.department || 'Not specified'}
        - Year of Study: ${profile.yearOfStudy || 'Not specified'}
        - Learning Goal: ${profile.learningGoal || 'General mastery'}
        - Difficulty Preference: ${profile.difficulty || 'Intermediate'}
        - Subjects of Interest: ${profile.selectedSubjects.join(', ')}
        
        Guidelines:
        - Provide high-quality, professional, and accurate educational support.
        - Tailor your tone to the user's education level (${profile.userType}).
        - Keep answers concise but thorough when explaining complex concepts.
        - Use emojis occasionally to maintain a friendly atmosphere.
        - If the user asks for study help, provide clear explanations, steps, or examples.
        - Be encouraging and build their confidence in their learning journey.
        - If you don't know something, be honest and suggest how they might find the answer.
      `;

      const response = await api.post('/ai/chat', {
        systemInstruction: systemPrompt,
        message: userMessage,
        history: messages.map(m => ({
          role: m.role,
          text: m.text
        }))
      });

      const aiText = response.response;
      
      if (aiText) {
        setMessages(prev => [...prev, { role: 'model', text: aiText }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Hmm, I couldn't quite process that. Could you try rephrasing your question for me? 📝" }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: getRandomError() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 w-[360px] h-full shadow-2xl border-l flex flex-col z-[100] overflow-hidden ${
              profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            }`}
          >
            {/* Header */}
            <div className={`p-6 flex items-center justify-between ${profile.preferences.darkMode ? 'bg-slate-900 border-b border-slate-700' : 'bg-slate-900'} text-white`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-xl border border-indigo-500/30">🤖</div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Study Assistant</h3>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : profile.preferences.darkMode 
                        ? 'bg-slate-700 text-slate-200 rounded-tl-none font-medium'
                        : 'bg-slate-100 text-slate-700 rounded-tl-none font-medium'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`${profile.preferences.darkMode ? 'bg-slate-700' : 'bg-slate-100'} p-4 rounded-2xl rounded-tl-none flex space-x-1`}>
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-6 border-t ${profile.preferences.darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question..."
                  className={`w-full pl-4 pr-12 py-4 rounded-xl border outline-none transition-all text-sm ${
                    profile.preferences.darkMode 
                      ? 'bg-slate-800 border-slate-700 focus:border-indigo-500 text-slate-200 placeholder:text-slate-500' 
                      : 'bg-white border-slate-200 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400'
                  }`}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// For backward compatibility if needed, but we should use the split components
export const ChatAI: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  return (
    <div className="relative">
      <ChatAIButton />
      <ChatAIPanel profile={profile} />
    </div>
  );
};
