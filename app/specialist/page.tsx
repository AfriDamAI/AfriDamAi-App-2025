/**
 * 🛡️ AFRIDAM SPECIALIST CONSOLE: PRODUCTION SYNC
 * Version: 2026.1.22 (Human-First & Path Sync)
 * Rule 5: Fully synced with root useSocket hook and user profile models.
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
import { useSocket } from "@/hooks/use-socket" // 🛡️ FIXED PATH
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
        const response = await apiClient.get(`/appointments/active/${user.id}`);
        const data = response.data;
        
        if (data?.specialist) {
          setSpecialist({
            name: `Dr. ${data.specialist.lastName}`,
            title: data.specialist.type || "Medical Professional",
            avatar: data.specialist.profileImage
          });
        }
        
        if (data?.notes) {
          setDoctorsNote(data.notes);
        }
      } catch (err) {
        console.error("Clinical Session Sync Failed:", err);
      }
    };

    fetchSessionDetails();
  }, [user?.id]);

  useEffect(() => {
    if (!isConnected) return;

    emit("join_session", { userId: user?.id, content: "Joining Consultation" });

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

  useEffect(() => {
    if (!user) return;
    const hasAccess = user.profile?.subscriptionPlan !== "Free" || user.profile?.onboardingCompleted;
    if (!hasAccess) {
      router.push('/pricing');
    }
  }, [user, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, viewMode]);

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
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col md:flex-row overflow-hidden transition-colors">
      
      {/* 🧬 1. SIDEBAR */}
      <aside className="w-full md:w-[400px] border-r border-black/5 dark:border-white/10 p-8 space-y-8 overflow-y-auto no-scrollbar bg-gray-50 dark:bg-[#0A0A0A] z-20">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft size={16} /> Exit Room
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-xl overflow-hidden">
                {specialist?.avatar ? (
                    <img src={specialist.avatar} alt="Specialist" className="w-full h-full object-cover" />
                ) : (
                    <Stethoscope size={28} />
                )}
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                    {specialist?.name || "Connecting..."}
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E1784F]">
                    {specialist?.title || "Medical Specialist"}
                </p>
             </div>
          </div>
          
          <div className="p-6 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl shadow-sm">
             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                <span>Status</span>
                <span className={isConnected ? "text-[#4DB6AC] animate-pulse" : "text-red-500"}>
                  {isConnected ? "Secure Connection" : "Offline"}
                </span>
             </div>
             <div className="flex items-center gap-3 mt-4 opacity-60">
                <Clock size={14} />
                <span className="text-xs font-bold">Session Active</span>
             </div>
          </div>
        </div>

        <DoctorsNote note={doctorsNote} isPrescribing={isPrescribing} />

        <div className="space-y-6 pt-6 border-t border-black/5 dark:border-white/5">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 flex items-center gap-2">
             <FileText size={14} /> Clinical Data
           </h3>
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-center">
                 <p className="text-[7px] font-black uppercase tracking-widest opacity-30 mb-1">Skin Type</p>
                 <p className="text-[10px] font-black text-[#4DB6AC] uppercase">{user?.profile?.skinType || "Reviewing"}</p>
              </div>
              <div className="p-4 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-center">
                 <p className="text-[7px] font-black uppercase tracking-widest opacity-30 mb-1">Tone</p>
                 <p className="text-[10px] font-black text-[#E1784F] uppercase">{user?.profile?.melaninTone || "Type VI"}</p>
              </div>
           </div>
        </div>

        <button 
          onClick={() => setViewMode(viewMode === 'chat' ? 'video' : 'chat')}
          className="w-full h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-4 shadow-xl hover:bg-[#4DB6AC] hover:text-white transition-all active:scale-95"
        >
          {viewMode === 'chat' ? <><Video size={18} /> Start Video</> : <><MessageSquare size={18} /> Return to Chat</>}
        </button>
      </aside>

      {/* 🏛️ 2. WORKSPACE */}
      <main className="flex-1 flex flex-col relative h-[100svh] md:h-screen">
        <header className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl z-10">
           <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[#4DB6AC] animate-pulse' : 'bg-red-500'}`} />
              <h1 className="text-lg font-black uppercase tracking-tight">
                {viewMode === 'chat' ? 'Secure Clinical Chat' : 'Secure Video Feed'}
              </h1>
           </div>
           <ShieldCheck size={18} className="opacity-30 text-[#4DB6AC]" />
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
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth pb-32">
                <div className="flex justify-start">
                    <div className="max-w-[85%] space-y-4">
                      <div className="w-10 h-10 bg-[#4DB6AC] rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Heart size={18} fill="currentColor" />
                      </div>
                      <div className="p-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-sm leading-relaxed">
                        "Hello {user?.firstName}. Your medical specialist is reviewing your scan results. How can we help you today?"
                      </div>
                    </div>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] space-y-4`}>
                        <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-[#E1784F] text-white shadow-lg' 
                            : 'bg-gray-100 dark:bg-white/5 text-black dark:text-white'
                        }`}>
                            {msg.content}
                        </div>
                      </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="px-5 py-2 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-full text-[9px] font-black uppercase tracking-widest text-[#4DB6AC]">
                      {isPrescribing ? "Updating Medical Note..." : "Specialist is typing..."}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-gradient-to-t from-white dark:from-[#050505] to-transparent">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full h-16 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 text-sm font-medium outline-none focus:border-[#E1784F] transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || !isConnected}
                      className="absolute right-2 w-12 h-12 bg-[#E1784F] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 disabled:opacity-20"
                    >
                      <Send size={18} />
                    </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div key="video" className="flex-1 p-4 md:p-8">
               <VideoRoom />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}