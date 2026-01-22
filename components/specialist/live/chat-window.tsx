/**
 * 🛡️ AFRIDAM SPECIALIST: CLINICAL CHAT WINDOW
 * Version: 2026.1.3 (Human-First & Path Sync)
 * Focus: High-Precision Type alignment & Simple English.
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
// 🛡️ FIXED PATH: Using the @ alias is safer for Vercel builds
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
      content: "Hello. I have your history open. How can I help you today?",
      type: "text"
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConnected) return;
    emit("join_session", { userId: user?.id, content: "Joining" });

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
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0A0A] border-l border-black/5 dark:border-white/5 shadow-2xl overflow-hidden relative">
      
      {/* 🏛️ 1. HEADER */}
      <div className="p-6 border-b border-black/5 dark:border-white/5 bg-black text-white flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#4DB6AC] flex items-center justify-center text-white">
               <Heart size={20} fill="currentColor" />
            </div>
            <div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Your Specialist</h3>
               <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#4DB6AC] animate-pulse' : 'bg-red-500'}`} />
                  <span className={`text-[8px] font-black uppercase tracking-[0.3em] italic ${isConnected ? 'text-[#4DB6AC]' : 'text-red-500'}`}>
                    {isConnected ? 'Secure Connection' : 'Connection Lost'}
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* 🚀 2. MESSAGE STREAM */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth">
         <AnimatePresence initial={false}>
            {messages.map((msg) => (
               <motion.div 
                 key={msg.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        msg.role === 'specialist' ? 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]' : 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]'
                     }`}>
                        {msg.role === 'specialist' ? <Activity size={16} /> : <User size={16} />}
                     </div>
                     <div className={`p-4 rounded-2xl text-[12px] leading-relaxed shadow-sm ${
                        msg.role === 'specialist' 
                           ? 'bg-gray-50 dark:bg-white/5 text-black dark:text-white' 
                           : 'bg-[#E1784F] text-white font-bold'
                     }`}>
                        {msg.content}
                     </div>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* 🕹️ 3. ACTION HUB */}
      <div className="p-6 bg-gray-50 dark:bg-black/40 border-t border-black/5 dark:border-white/5">
         <div className="flex gap-4 mb-4">
            <button className="flex-1 h-12 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest hover:border-[#E1784F] transition-all">
               <Camera size={14} className="text-[#E1784F]" /> Send Photo
            </button>
            <button className="flex-1 h-12 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest hover:border-[#4DB6AC] transition-all">
               <ImageIcon size={14} className="text-[#4DB6AC]" /> Attachment
            </button>
         </div>
         
         <form onSubmit={handleSend} className="relative flex items-center group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-16 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 text-[11px] font-bold outline-none focus:border-[#E1784F] transition-all pr-14"
            />
            <button 
               type="submit"
               disabled={!input.trim() || !isConnected}
               className="absolute right-2 w-12 h-12 bg-[#E1784F] text-white rounded-xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-[#E1784F]/20"
            >
               <Send size={16} />
            </button>
         </form>
         <div className="mt-4 flex items-center justify-center gap-2 opacity-20">
            <ShieldCheck size={10} />
            <span className="text-[7px] font-black uppercase tracking-[0.4em]">Safe & Secure</span>
         </div>
      </div>
    </div>
  )
}