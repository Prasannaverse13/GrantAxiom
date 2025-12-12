import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Search, Loader2, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { chatWithAgent } from '../services/geminiService';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am GrantAxiom. I can help refine your proposal or search for the latest literature.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await chatWithAgent(history, userMsg.text);
    
    const botMsg: Message = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-80 lg:w-96 shrink-0 bg-transparent">
      <div className="p-5 border-b border-glass-border bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
        <h3 className="text-white font-bold flex items-center gap-2">
            <div className="p-1.5 bg-scientific-500/20 rounded-lg border border-scientific-500/30">
               <Bot className="w-4 h-4 text-scientific-400" />
            </div>
            Axiom Assistant
        </h3>
        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-scientific-500" />
            Powered by Gemini 2.5 Flash + Search
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin" ref={scrollRef}>
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} group animate-fade-in`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 shadow-lg ${msg.role === 'user' ? 'bg-slate-800' : 'bg-gradient-to-br from-scientific-900 to-scientific-800'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-scientific-300" />}
                </div>
                <div className={`rounded-2xl p-3.5 text-sm max-w-[85%] shadow-md backdrop-blur-sm border ${
                    msg.role === 'user' 
                    ? 'bg-scientific-600/80 text-white border-scientific-500/50 rounded-tr-sm' 
                    : 'bg-white/5 text-slate-200 border-white/10 rounded-tl-sm'
                }`}>
                    {msg.text}
                    <div className="text-[10px] opacity-40 mt-1 text-right">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-scientific-900/50 flex items-center justify-center shrink-0 border border-scientific-500/20">
                    <Loader2 className="w-4 h-4 text-scientific-400 animate-spin" />
                 </div>
                 <div className="bg-white/5 rounded-2xl rounded-tl-sm p-3 text-sm border border-white/10 text-slate-400 italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-scientific-500 rounded-full animate-pulse"></span>
                    Thinking...
                 </div>
            </div>
        )}
      </div>

      <div className="p-4 border-t border-glass-border bg-black/20 backdrop-blur-md">
        <div className="relative group">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about citations..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-scientific-500/50 focus:bg-slate-900/80 transition-all shadow-inner placeholder:text-slate-600"
            />
            <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-scientific-600 rounded-lg transition-all text-scientific-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-scientific-500"
            >
                {input.length > 0 ? <Send className="w-4 h-4" /> : <Search className="w-4 h-4 opacity-50" />}
            </button>
        </div>
      </div>
    </div>
  );
};