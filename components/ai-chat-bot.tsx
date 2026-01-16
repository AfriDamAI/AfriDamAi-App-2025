"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Sparkles, User, Bot, Zap, ShieldCheck, Info } from "lucide-react"
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
  
  // 🛡️ RE-ENFORCED: Clinical Disclaimer in the first message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to AfriDam Clinical Node. I am an AI assistant designed to help you navigate our services. I cannot provide medical diagnoses. For clinical issues, I can connect you with a specialist for $15. How can I assist your glow today?",
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
    setIsTyping(true);
    
    // Simulate API Response Logic
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Understood. Based on your input, I recommend running a Neural Skin Scan for high-precision metrics. Would you like to start a scan or book an urgent specialist chat?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1800);
  };

  return (
    <>
      {/* 🚀 1. FLOATING TOGGLE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[999] w-16 h-16 bg-[#4DB6AC] text-white rounded-[1.8rem] shadow-[0_20px_50px_rgba(77,182,172,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
      >
        {isOpen ? <X size={24} /> : (
          <div className="relative">
            <MessageSquare size={24} className="fill-white/20" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E1784F] rounded-full border-2 border-[#4DB6AC] animate-ping" />
          </div>
        )}
      </button>

      {/* 🏛️ 2. CHAT CONSOLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-24 right-6 md:right-10 z-[998] w-[calc(100vw-3rem)] md:w-[420px] max-h-[70vh] md:h-[650px] rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.4)] border flex flex-col overflow-hidden backdrop-blur-3xl transition-all ${
              isDark ? 'bg-[#151312]/98 border-white/10' : 'bg-white/98 border-black/5'
            }`}
          >
            {/* Header: Identity Bar */}
            <div className="p-8 bg-[#1C1A19] text-white relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(225,120,79,0.15),transparent_70%)]" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4DB6AC] flex items-center justify-center shadow-lg shadow-[#4DB6AC]/20">
                    <Zap className="w-6 h-6 text-white" fill="white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black italic uppercase text-xs tracking-[0.3em]">Neural Concierge</h3>
                    <p className="text-[8px] font-black uppercase text-[#4DB6AC] tracking-widest flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 bg-[#4DB6AC] rounded-full animate-pulse" />
                      Protocol Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Warning Banner: Play Store Compliance */}
            <div className="bg-[#E1784F]/10 px-8 py-3 flex items-center gap-3 border-y border-[#E1784F]/10">
               <Info size={12} className="text-[#E1784F]" />
               <p className="text-[7px] font-black uppercase tracking-widest text-[#E1784F]">
                 Advisory: Non-Diagnostic AI Assistant
               </p>
            </div>

            {/* Message Stream */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      msg.role === 'assistant' 
                        ? 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]' 
                        : 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]'
                    }`}>
                      {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className={`p-5 rounded-2xl text-[11px] font-bold leading-relaxed shadow-sm tracking-tight ${
                      msg.role === 'assistant' 
                        ? (isDark ? 'bg-white/5 text-gray-300' : 'bg-black/5 text-gray-700')
                        : 'bg-[#E1784F] text-white shadow-lg shadow-[#E1784F]/20'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start pl-12">
                  <div className="flex gap-1.5">
                    <span className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Terminal: Input Bar */}
            <div className="p-8 pt-0">
              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Clinical Query..." 
                  className={`w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-[#4DB6AC] transition-all placeholder:opacity-30`}
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#E1784F] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-3 opacity-20">
                 <ShieldCheck size={12} />
                 <p className="text-[7px] font-black uppercase tracking-[0.5em]">Neural Link Encrypted</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}