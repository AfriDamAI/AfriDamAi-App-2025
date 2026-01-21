/**
 * 🛡️ AFRIDAM SPECIALIST CONSOLE: PRODUCTION SYNC
 * Version: 2026.1.22 (Live Handshake Integration)
 * Rule 5: Fully synced with useSocket hook and Prisma Profile models.
 */

"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
  Send, ChevronLeft, Stethoscope, ShieldCheck, 
  FileText, User, Activity, Zap, Clock, 
  Video, MessageSquare 
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { VideoRoom } from "@/components/specialist/live/video-room"
import { DoctorsNote } from "@/components/specialist/live/doctors-note"
import { useSocket } from "@/components/hooks/use-socket" // 🛡️ SYNCED PATH
import apiClient from "@/lib/api-client"

// 🧬 THE ANTI-ANY SHIELD
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
  
  // 🛰️ INITIALIZE THE NEURAL LINK
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

  /**
   * 🔬 INITIAL CLINICAL HANDSHAKE
   */
  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!user?.id) return;
      try {
        const response = await apiClient.get(`/appointments/active/${user.id}`);
        const data = response.data;
        
        if (data?.specialist) {
          setSpecialist({
            name: `Dr. ${data.specialist.lastName}`,
            title: data.specialist.type || "Medical Reviewer",
            avatar: data.specialist.profileImage
          });
        }
        
        if (data?.notes) {
          setDoctorsNote(data.notes);
        }
      } catch (err) {
        console.error("Clinical Node Sync Failed:", err);
      }
    };

    fetchSessionDetails();
  }, [user?.id]);

  /**
   * 🚀 LIVE HANDSHAKE LISTENERS
   * FIXED: Explicitly typed 'data' to resolve ts(7006)
   */
  useEffect(() => {
    if (!isConnected) return;

    // Join room based on user session
    emit("join_session", { userId: user?.id, content: "Joining Portal" });

    // Listen for incoming specialist messages
    listen("new_message", (data: SocketPayload) => {
      setMessages((prev) => [...prev, { id: Date.now(), role: "specialist", content: data.content }]);
    });

    // Listen for real-time Note updates
    listen("note_update", (data: SocketPayload) => {
      if (data.payload?.note) setDoctorsNote(data.payload.note);
      setIsPrescribing(false);
    });

    // Listen for typing indicators
    listen("specialist_typing", (data: SocketPayload) => {
      setIsTyping(data.payload?.isTyping || false);
      if (data.payload?.isNote) setIsPrescribing(data.payload.isTyping || false);
    });

  }, [isConnected, user?.id, emit, listen]);

  // 🛡️ SECURITY GUARD
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

    const payload = {
      content: input,
      userId: user?.id,
      senderId: user?.id
    };

    // 🛰️ EMIT TO BACKEND
    emit("send_message", payload);

    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden no-scrollbar">
      
      {/* 🧬 1. CLINICAL SIDEBAR */}
      <aside className="w-full md:w-[400px] border-r border-white/10 p-8 space-y-10 overflow-y-auto no-scrollbar bg-[#0A0A0A] z-20">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft size={16} /> Exit Portal
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-2xl relative overflow-hidden">
                {specialist?.avatar ? (
                    <img src={specialist.avatar} alt="Specialist" className="w-full h-full object-cover" />
                ) : (
                    <Stethoscope size={28} />
                )}
             </div>
             <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                    {specialist?.name || "Assigning..."}
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E1784F]">
                    {specialist?.title || "Specialist Node"}
                </p>
             </div>
          </div>
          
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                <span>Status</span>
                <span className={isConnected ? "text-[#4DB6AC] animate-pulse" : "text-red-500"}>
                  {isConnected ? "Sync Active" : "Offline"}
                </span>
             </div>
             <div className="flex items-center gap-3 opacity-60">
                <Clock size={14} />
                <span className="text-xs font-bold uppercase tracking-tighter">Live Session</span>
             </div>
          </div>
        </div>

        <DoctorsNote note={doctorsNote} isPrescribing={isPrescribing} />

        <div className="space-y-6 pt-6 border-t border-white/5">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 flex items-center gap-2">
             <FileText size={14} /> Clinical Profile
           </h3>
           <div className="space-y-3">
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Dermal Type</p>
                 <p className="text-xs font-black italic uppercase tracking-tight text-[#4DB6AC]">{user?.profile?.skinType || "Analysis Pending"}</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">Melanin Tone</p>
                 <p className="text-xs font-black italic uppercase tracking-tight text-[#E1784F]">{user?.profile?.melaninTone || "Type VI"}</p>
              </div>
           </div>
        </div>

        <button 
          onClick={() => setViewMode(viewMode === 'chat' ? 'video' : 'chat')}
          className="w-full h-20 bg-white text-black rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl hover:bg-[#4DB6AC] hover:text-white transition-all active:scale-95"
        >
          {viewMode === 'chat' ? <><Video size={18} /> Switch to Video</> : <><MessageSquare size={18} /> Return to Chat</>}
        </button>
      </aside>

      {/* 🏛️ 2. DYNAMIC WORKSPACE */}
      <main className="flex-1 flex flex-col relative h-[100svh] md:h-screen">
        <header className="p-8 border-b border-white/5 flex items-center justify-between bg-[#050505]/80 backdrop-blur-2xl z-10">
           <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[#4DB6AC] animate-pulse' : 'bg-red-500'}`} />
              <h1 className="text-xl font-black italic uppercase tracking-tighter">
                {viewMode === 'chat' ? 'Secure Clinical Chat' : 'Live Neural Link'}
              </h1>
           </div>
           <ShieldCheck size={18} className="opacity-30 text-[#4DB6AC]" />
        </header>

        <AnimatePresence mode="wait">
          {viewMode === 'chat' ? (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth pb-32">
                <div className="flex justify-start">
                    <div className="max-w-[80%] space-y-4">
                      <div className="w-10 h-10 bg-[#4DB6AC] rounded-xl flex items-center justify-center text-black shadow-lg">
                          <Zap size={20} fill="currentColor" />
                      </div>
                      <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-medium italic text-white/80">
                        "Welcome {user?.firstName}. {specialist?.name || "The specialist"} is reviewing your neural metrics. How can we support you today?"
                      </div>
                    </div>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] space-y-4 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                        <div className={`p-6 rounded-[2rem] text-sm font-bold ${
                          msg.role === 'user' ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-white/80'
                        }`}>
                            {msg.content}
                        </div>
                      </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-pulse">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#4DB6AC]">
                      {isPrescribing ? "Drafting care node..." : "Specialist typing..."}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-gradient-to-t from-[#050505] to-transparent">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter clinical inquiry..."
                      className="w-full h-20 bg-white/5 border border-white/10 rounded-[2rem] px-8 text-sm font-black italic uppercase outline-none focus:border-[#E1784F] transition-all placeholder:opacity-20"
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || !isConnected}
                      className="absolute right-3 w-14 h-14 bg-[#E1784F] text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 disabled:opacity-20"
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