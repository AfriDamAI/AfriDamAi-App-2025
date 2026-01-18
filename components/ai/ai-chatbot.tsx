/**
 * 🛡️ AFRIDAM WELLNESS ASSISTANT
 * Version: 2026.1.3 (Synced & Mobile-Optimized)
 * Handshake: Fully synced with archived api-client.ts
 */

"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, User, Bot, Zap, Info } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { sendChatMessage } from "@/lib/api-client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
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
      content: "Hello! I am your AfriDam Wellness Assistant. How can I help you care for your skin today?"
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
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);
    
    try {
      // 🛡️ REFERENCE: Using archived api-client.ts
      const response = await sendChatMessage(currentInput);
      
      // Robust handshake to find the text in Tobi's backend response
      const replyText = response?.reply || response?.resultData?.reply || response?.content || "I'm here to support you. Could you tell me a bit more?";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: "error",
        role: "assistant",
        content: "I'm having a moment to connect. Please try again in a second."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 🚀 1. FLOATING TOGGLE - High enough to clear the mobile dock */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 right-6 md:bottom-10 md:right-10 z-[999] w-14 h-14 bg-[#4DB6AC] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* 🏛️ 2. CHAT CONSOLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={`fixed bottom-24 right-4 left-4 md:left-auto md:right-10 z-[998] md:w-[380px] h-[70vh] md:h-[550px] rounded-[2.5rem] shadow-2xl border flex flex-col overflow-hidden backdrop-blur-3xl ${
              isDark ? 'bg-[#151312]/98 border-white/10' : 'bg-white/98 border-black/5'
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-[#1C1A19] text-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#4DB6AC] flex items-center justify-center shadow-lg">
                <Zap size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-black italic uppercase tracking-tighter">Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-[#4DB6AC] rounded-full animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#4DB6AC]">Wellness Ready</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-6 py-2 bg-muted/30 border-b border-border flex items-center gap-2">
               <Info size={10} className="text-muted-foreground" />
               <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Support guidance only • Privacy First</p>
            </div>

            {/* Message Stream */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      msg.role === 'assistant' ? 'bg-[#4DB6AC]/10 text-[#4DB6AC]' : 'bg-[#E1784F]/10 text-[#E1784F]'
                    }`}>
                      {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs font-bold leading-relaxed ${
                      msg.role === 'assistant' 
                        ? (isDark ? 'bg-white/5 text-gray-300' : 'bg-black/5 text-gray-700')
                        : 'bg-[#E1784F] text-white shadow-xl'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 pl-12">
                   <div className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce" />
                   <div className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-1 h-1 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 md:p-6 pt-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your skin..." 
                  className="w-full bg-muted/40 border border-border rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-[#4DB6AC] transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 w-10 h-10 bg-[#E1784F] text-white rounded-xl flex items-center justify-center active:scale-95 shadow-lg"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}