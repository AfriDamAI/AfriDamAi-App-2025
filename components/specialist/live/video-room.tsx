/**
 * 🛡️ AFRIDAM NEURAL LINK: VIDEO ROOM (Rule 7 Sync)
 * Version: 2026.1.3 (Full Hardware & UI Integration)
 * Rule 5: Synced with CallControls and specialist view logic.
 */

"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoOff, Loader2, User, ShieldCheck } from "lucide-react"
import { CallControls } from "./call-controls"        
import { ConnectionStatus } from "./connection-status" 
import { useRouter } from "next/navigation"

export function VideoRoom() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * 🚀 HARDWARE HANDSHAKE (Rule 7)
   */
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" }, 
          audio: true 
        });
        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        setIsSyncing(false);
      } catch (err) {
        console.error("Clinical Lens Handshake Failed:", err);
        setIsSyncing(false);
      }
    }

    if (!isVideoOff) {
      startCamera();
    }

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [isVideoOff]);

  // 🛡️ SYNC: Toggle Mic Hardware
  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; 
      });
      setIsMuted(!isMuted);
    }
  };

  const handleHangUp = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    router.push("/dashboard");
  };

  return (
    <div className="relative w-full h-[600px] bg-[#050505] rounded-[3.5rem] overflow-hidden group shadow-2xl border border-white/5">
      
      {/* 📺 1. SPECIALIST VIEW (Main Interface Placeholder) */}
      <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center">
        <AnimatePresence>
          {isSyncing ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <Loader2 className="w-12 h-12 text-[#4DB6AC] animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#4DB6AC]">Syncing Specialist Node...</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-6 opacity-20">
              <StethoscopeIcon className="w-20 h-20 text-white" />
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Specialist Awaiting Feed</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 👤 2. USER MINI-PREVIEW (Draggable) */}
      <motion.div 
        drag
        dragConstraints={{ left: -400, right: 0, top: 0, bottom: 400 }}
        className="absolute top-8 right-8 w-36 h-48 md:w-56 md:h-72 bg-black rounded-[2.5rem] border-2 border-white/10 overflow-hidden shadow-2xl z-20 cursor-grab active:cursor-grabbing group/user"
      >
        {!isVideoOff ? (
          <video 
            ref={userVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover scale-x-[-1]" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 gap-4">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <User size={20} className="text-white/40" />
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Lens Disabled</span>
          </div>
        )}
      </motion.div>

      {/* 🛡️ 3. CONNECTION STATUS */}
      <div className="absolute top-8 left-8 z-30 hidden md:block">
        <ConnectionStatus />
      </div>

      {/* 🕹️ 4. CALL CONTROLS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 transition-transform hover:scale-105">
        <CallControls 
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMic={toggleMic}
          onToggleVideo={() => setIsVideoOff(!isVideoOff)}
          onHangUp={handleHangUp}
        />
      </div>

      <div className="absolute top-8 left-8 z-30 md:hidden">
          <div className="w-10 h-10 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-xl flex items-center justify-center text-[#4DB6AC]">
             <ShieldCheck size={20} />
          </div>
      </div>
    </div>
  )
}

function StethoscopeIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
        </svg>
    )
}