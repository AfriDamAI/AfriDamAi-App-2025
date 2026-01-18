/**
 * 🛡️ AFRIDAM WELLNESS ASSISTANT
 * Version: 2026.1.2 (Universal & Inclusive)
 * Focus: Clean, professional support for all skin types.
 */

"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, User, Bot, Zap, ShieldCheck, Info } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { sendChatMessage } from "@/lib/api-client"

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
      content: "Hello! I am your AfriDam Wellness Assistant. How can I support your skin journey today?",
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
    const currentInput = input;
    setInput("");
    setIsTyping(true);
    
    try {
      // 🚀 THE HANDSHAKE: Talking to the actual AI backend
      const response = await sendChatMessage(currentInput);
      const payload = response.resultData || response;

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: payload.reply || payload.content || "I'm here to help. Could you please clarify your request?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: "error",
        role: "assistant",
        content: "I'm having trouble connecting to the wellness hub. Please check your internet and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 🚀 1. FLOATING TOGGLE - Positioned to avoid nav bar collision */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[999] w-14 h-14 bg-[#4DB6AC] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* 🏛️ 2. CHAT CONSOLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-[100px] right-4 left-4 md:left-auto md:right-10 z-[998] md:w-[400px] h-[500px] md:h-[600px] rounded-[2.5rem] shadow-2xl border flex flex-col overflow-hidden backdrop-blur-3xl ${
              isDark ? 'bg-[#151312]/98 border-white/10' : 'bg-white/98 border-black/5'
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-[#1C1A19] text-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#4DB6AC] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm">Wellness Assistant</h3>
                  <p className="text-[9px] text-[#4DB6AC] uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-[#4DB6AC] rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Banner */}
            <div className="bg-muted/50 px-6 py-2 flex items-center gap-2 border-b border-border">
               <Info size={10} className="text-muted-foreground" />
               <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tight">
                 Information provided is for wellness support only.
               </p>
            </div>

            {/* Message Stream */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      msg.role === 'assistant' ? 'bg-[#4DB6AC]/10 text-[#4DB6AC]' : 'bg-[#E1784F]/10 text-[#E1784F]'
                    }`}>
                      {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.role === 'assistant' 
                        ? (isDark ? 'bg-white/5 text-gray-300' : 'bg-black/5 text-gray-700')
                        : 'bg-[#E1784F] text-white shadow-lg'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start pl-10">
                   <Loader2 className="w-4 h-4 animate-spin text-[#4DB6AC]" />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-6 pt-0">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question..." 
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 text-sm outline-none focus:border-[#4DB6AC] transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#E1784F] text-white rounded-lg flex items-center justify-center active:scale-95 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}