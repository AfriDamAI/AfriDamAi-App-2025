/**
 * 🛡️ AFRIDAM SPECIALIST CONSOLE: PRODUCTION SYNC
 * Version: 2026.1.22 (Handshake & Soft Tone Alignment)
 * Focus: High-Precision Specialist Access & Relatable English.
 */

"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
  Send, ChevronLeft, Stethoscope, ShieldCheck, 
  FileText, Activity, Clock, 
  Video, MessageSquare, Heart
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { VideoRoom } from "@/components/specialist/live/video-room"
import { DoctorsNote } from "@/components/specialist/live/doctors-note"
import { useSocket } from "@/hooks/use-socket" 
import apiClient from "@/lib/api-client"

interface SocketPayload {
  content: string;
  payload?: {
    note?: string;
    isTyping?: boolean;
    isNote?: boolean;
  };
}

export default function SpecialistChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
  const { isConnected, emit, listen } = useSocket(socketUrl);
  
  const [specialist, setSpecialist] = useState<{
    name: string;
    title: string;
    avatar?: string;
  } | null>(null);

  const [viewMode, setViewMode] = useState<'chat' | 'video'>('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [doctorsNote, setDoctorsNote] = useState("");
  const [isPrescribing, setIsPrescribing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!user?.id) return;
      try {
        // 🚀 THE HANDSHAKE: Pulling the session linked to the $15 payment
        const response = await apiClient.get(`/appointments/active/${user.id}`);
        const data = response.data;
        
        if (data?.specialist) {
          setSpecialist({
            name: `${data.specialist.lastName}`, // 🛡️ Soft Tone: Simplified name
            title: data.specialist.type || "Specialist",
            avatar: data.specialist.profileImage
          });
        }
        
        if (data?.notes) {
          setDoctorsNote(data.notes);
        }
      } catch (err) {
        console.error("Session sync paused");
      }
    };

    fetchSessionDetails();
  }, [user?.id]);

  useEffect(() => {
    if (!isConnected || !user?.id) return;

    emit("join_session", { userId: user.id, content: "Joining specialist chat" });

    listen("new_message", (data: SocketPayload) => {
      setMessages((prev) => [...prev, { id: Date.now(), role: "specialist", content: data.content }]);
    });

    listen("note_update", (data: SocketPayload) => {
      if (data.payload?.note) setDoctorsNote(data.payload.note);
      setIsPrescribing(false);
    });

    listen("specialist_typing", (data: SocketPayload) => {
      setIsTyping(data.payload?.isTyping || false);
      if (data.payload?.isNote) setIsPrescribing(data.payload.isTyping || false);
    });

  }, [isConnected, user?.id, emit, listen]);

  /** 🛡️ RULE 6 ACCESS GUARD */
  useEffect(() => {
    if (!user) return;
    // Redirecting if no active plan or session found
    const hasAccess = user.profile?.subscriptionPlan !== "Free" || user.profile?.onboardingCompleted;
    if (!hasAccess) {
      router.push('/pricing');
    }
  }, [user, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, viewMode, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;

    emit("send_message", {
      content: input,
      userId: user?.id,
      senderId: user?.id
    });

    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col lg:flex-row overflow-hidden transition-colors">
      
      {/* 🧬 1. SIDEBAR (Specialist Info) */}
      <aside className="w-full lg:w-[400px] border-r border-black/5 dark:border-white/10 p-8 space-y-8 overflow-y-auto no-scrollbar bg-gray-50 dark:bg-[#0A0A0A] z-20 text-left">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft size={14} /> Back to Hub
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-xl overflow-hidden">
                {specialist?.avatar ? (
                    <img src={specialist.avatar} alt="Specialist" className="w-full h-full object-cover" />
                ) : (
                    <Stethoscope size={24} />
                )}
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tight leading-none">
                    {specialist?.name || "Connecting..."}
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E1784F] mt-2">
                    {specialist?.title || "Specialist"}
                </p>
             </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] shadow-sm">
             <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-30">
                <span>Status</span>
                <span className={isConnected ? "text-[#4DB6AC] animate-pulse" : "text-red-500"}>
                  {isConnected ? "Secure" : "Reconnecting..."}
                </span>
             </div>
             <div className="flex items-center gap-3 mt-3 opacity-60">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Active Chat</span>
             </div>
          </div>
        </div>

        <DoctorsNote note={doctorsNote} isPrescribing={isPrescribing} />

        <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
           <h3 className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 flex items-center gap-2">
             <FileText size={12} /> Your Diary
           </h3>
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-center">
                 <p className="text-[7px] font-black uppercase tracking-widest opacity-30 mb-1">Skin Type</p>
                 <p className="text-[9px] font-black text-[#4DB6AC] uppercase tracking-tighter">{user?.profile?.skinType || "Reviewing"}</p>
              </div>
              <div className="p-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-center">
                 <p className="text-[7px] font-black uppercase tracking-widest opacity-30 mb-1">Pattern</p>
                 <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-tighter">{user?.profile?.melaninTone || "Scanning"}</p>
              </div>
           </div>
        </div>

        <button 
          onClick={() => setViewMode(viewMode === 'chat' ? 'video' : 'chat')}
          className="w-full h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all active:scale-95"
        >
          {viewMode === 'chat' ? <><Video size={16} /> Video Call</> : <><MessageSquare size={16} /> Chat View</>}
        </button>
      </aside>

      {/* 🏛️ 2. WORKSPACE */}
      <main className="flex-1 flex flex-col relative h-[100svh] lg:h-screen">
        <header className="px-8 py-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl z-10">
           <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#4DB6AC] animate-pulse' : 'bg-red-500'}`} />
              <h1 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50">
                {viewMode === 'chat' ? 'Secure Chat' : 'Live Feed'}
              </h1>
           </div>
           <ShieldCheck size={16} className="text-[#4DB6AC] opacity-30" />
        </header>

        <AnimatePresence mode="wait">
          {viewMode === 'chat' ? (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar scroll-smooth pb-32 text-left">
                <div className="flex justify-start">
                    <div className="max-w-[85%] space-y-4">
                      <div className="w-10 h-10 bg-[#4DB6AC] rounded-[1rem] flex items-center justify-center text-white shadow-lg">
                          <Heart size={18} fill="currentColor" />
                      </div>
                      <div className="p-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[1.8rem] rounded-tl-none text-[12px] leading-relaxed">
                        "Hello {user?.firstName}. I am looking at your skin diary now. How can I help you today?"
                      </div>
                    </div>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%]`}>
                        <div className={`p-5 rounded-[1.8rem] text-[12px] leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-[#E1784F] text-white font-bold rounded-tr-none' 
                            : 'bg-gray-100 dark:bg-white/5 text-black dark:text-white rounded-tl-none'
                        }`}>
                            {msg.content}
                        </div>
                      </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-full text-[8px] font-black uppercase tracking-widest text-[#4DB6AC] animate-pulse">
                      {isPrescribing ? "Updating Note..." : "Specialist typing..."}
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION INPUT */}
              <div className="p-6 md:p-10 bg-gradient-to-t from-white dark:from-[#050505] to-transparent">
                <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative flex items-center">
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full h-16 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl px-6 text-[11px] font-bold outline-none focus:border-[#E1784F] transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || !isConnected}
                      className="absolute right-2 w-12 h-12 bg-[#E1784F] text-white rounded-[1.2rem] flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-20"
                    >
                      <Send size={16} />
                    </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="video" className="flex-1 p-4 md:p-10">
               <VideoRoom />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}