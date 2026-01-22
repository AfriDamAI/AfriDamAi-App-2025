/**
 * 🛡️ AFRIDAM SPECIALIST: CHAT WINDOW (Rule 6 Synergy)
 * Version: 2026.1.22 (Payment Handshake & Soft Tone)
 * Focus: High-Precision Type alignment & Relatable English.
 */

"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, 
  Camera, 
  ImageIcon, 
  User, 
  Activity,
  Heart,
  ShieldCheck
} from "lucide-react"
import { useSocket } from "@/hooks/use-socket" 
import { useAuth } from "@/providers/auth-provider"

interface SocketData {
  content: string;
  senderId?: string;
  userId?: string;
  type?: string;
}

interface Message {
  id: string;
  role: "specialist" | "user";
  content: string;
  type: "text" | "image";
  assetUrl?: string;
}

export function ChatWindow() {
  const { user } = useAuth();
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
  const { isConnected, emit, listen } = useSocket(socketUrl);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "specialist",
      content: "Hello! I have your skin diary open. How can I help you glow today?",
      type: "text"
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  /** * 🚀 THE HANDSHAKE (Rule 6)
   * We only join the session if the user is authenticated. 
   */
  useEffect(() => {
    if (!isConnected || !user?.id) return;
    
    emit("join_session", { userId: user.id, content: "Joining specialist chat" });

    listen("new_message", (data: SocketData) => {
      const specialistMsg: Message = {
        id: Date.now().toString(),
        role: "specialist",
        content: data.content,
        type: "text"
      };
      setMessages((prev) => [...prev, specialistMsg]);
    });
  }, [isConnected, user?.id, emit, listen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      type: "text"
    };

    emit("send_message", {
      content: input,
      userId: user?.id,
      senderId: user?.id
    });

    setMessages(prev => [...prev, userMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0A0A] border-l border-black/5 dark:border-white/5 relative overflow-hidden">
      
      {/* 🏛️ 1. HEADER (Soft Tone) */}
      <div className="p-5 border-b border-black/5 dark:border-white/5 bg-black text-white flex items-center justify-between">
         <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-[1rem] bg-[#4DB6AC] flex items-center justify-center text-white shadow-lg shadow-[#4DB6AC]/20">
               <Heart size={20} fill="currentColor" />
            </div>
            <div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Your Specialist</h3>
               <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#4DB6AC] animate-pulse' : 'bg-red-500'}`} />
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${isConnected ? 'text-[#4DB6AC]' : 'text-red-500'}`}>
                    {isConnected ? 'Secure Connection' : 'Trying to connect...'}
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* 🚀 2. MESSAGE STREAM (Mobile-First Optimization) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar scroll-smooth">
         <AnimatePresence initial={false}>
            {messages.map((msg) => (
               <motion.div 
                 key={msg.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                  <div className={`max-w-[88%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                     <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        msg.role === 'specialist' ? 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]' : 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]'
                     }`}>
                        {msg.role === 'specialist' ? <Activity size={14} /> : <User size={14} />}
                     </div>
                     <div className={`p-4 rounded-[1.5rem] text-[11px] leading-relaxed shadow-sm ${
                        msg.role === 'specialist' 
                           ? 'bg-gray-50 dark:bg-white/5 text-black dark:text-white rounded-bl-none' 
                           : 'bg-[#E1784F] text-white font-bold rounded-br-none'
                     }`}>
                        {msg.content}
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* 🕹️ 3. ACTION HUB (Relatable English) */}
      <div className="p-5 bg-gray-50 dark:bg-black/40 border-t border-black/5 dark:border-white/5">
         <div className="flex gap-3 mb-4">
            <button className="flex-1 h-12 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest hover:border-[#E1784F] transition-all">
               <Camera size={14} className="text-[#E1784F]" /> Send Photo
            </button>
            <button className="flex-1 h-12 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest hover:border-[#4DB6AC] transition-all">
               <ImageIcon size={14} className="text-[#4DB6AC]" /> Attachment
            </button>
         </div>
         
         <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can we help?"
              className="w-full h-16 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl px-6 text-[11px] font-bold outline-none focus:border-[#E1784F] transition-all pr-14"
            />
            <button 
               type="submit"
               disabled={!input.trim() || !isConnected}
               className="absolute right-2 w-12 h-12 bg-[#E1784F] text-white rounded-[1.2rem] flex items-center justify-center active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-[#E1784F]/20"
            >
               <Send size={16} />
            </button>
         </form>
         <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
            <ShieldCheck size={10} className="text-[#4DB6AC]" />
            <span className="text-[7px] font-black uppercase tracking-[0.3em]">Your data is safe</span>
         </div>
      </div>
    </div>
  )
}