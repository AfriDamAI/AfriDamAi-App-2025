"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Sparkles, User, Bot, Zap, ShieldCheck } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChatBot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to your AfriDam Clinical Concierge. I can help you analyze skin scans, understand ingredients, or connect you with a specialist for $15. How can I assist your glow today?",
      timestamp: new Date()
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    // Simulate "Clinical Thinking"
    setIsTyping(true);
    
    // This is where your AI Team will plug in the real API
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've noted your concern. For a detailed clinical analysis, please use our Skin Scanner. If this is an emergency, I can book an urgent $15 session with a specialist right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* 1. FLOATING TOGGLE BUTTON - Radiant Glow */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#4DB6AC] text-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(77,182,172,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={24} /> : (
          <div className="relative">
            <Sparkles size={24} className="animate-pulse" />
            <span className="absolute -top-3 -right-3 w-4 h-4 bg-[#E1784F] text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">1</span>
          </div>
        )}
      </button>

      {/* 2. CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={`fixed bottom-28 right-8 z-[100] w-[90vw] md:w-[400px] h-[600px] max-h-[75vh] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border flex flex-col overflow-hidden backdrop-blur-3xl transition-colors duration-500 ${
              isDark ? 'bg-[#151312]/95 border-white/10' : 'bg-white/95 border-black/5'
            }`}
          >
            {/* HEADER - High End Gradient */}
            <div className="p-8 bg-gradient-to-br from-[#1C1A19] to-[#000000] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/20 blur-3xl rounded-full" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#4DB6AC] flex items-center justify-center shadow-lg shadow-[#4DB6AC]/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black italic uppercase text-xs tracking-[0.3em]">Clinical Node</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Verified Specialist AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth no-scrollbar"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      msg.role === 'assistant' ? 'bg-[#4DB6AC]/10 text-[#4DB6AC]' : 'bg-[#E1784F]/10 text-[#E1784F]'
                    }`}>
                      {msg.role === 'assistant' ? <Zap size={14} fill="currentColor" /> : <User size={14} />}
                    </div>
                    <div className={`p-5 rounded-2xl text-[11px] font-bold leading-relaxed shadow-sm ${
                      msg.role === 'assistant' 
                        ? (isDark ? 'bg-white/5 text-gray-300 border border-white/5' : 'bg-black/5 text-gray-700 border border-black/5')
                        : 'bg-[#E1784F] text-white shadow-[#E1784F]/20 shadow-lg'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Thinking State */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 px-5 py-3 rounded-2xl flex gap-1 items-center">
                    <span className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* INPUT AREA */}
            <div className="p-8 border-t border-border bg-transparent">
              <div className="relative flex items-center gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a clinical question..." 
                  className={`w-full bg-muted/50 border border-border rounded-2xl px-6 py-5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#4DB6AC] transition-all ${
                    isDark ? 'placeholder:text-gray-700' : 'placeholder:text-gray-400'
                  }`}
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 p-3 bg-[#E1784F] text-white rounded-xl hover:scale-105 transition-all shadow-lg"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 mt-6 opacity-30">
                 <ShieldCheck size={10} />
                 <p className="text-[7px] font-black uppercase tracking-[0.4em]">
                   End-to-End Encrypted Consultation
                 </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}