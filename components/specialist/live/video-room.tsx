"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VideoOff, Loader2, User, ShieldCheck, Heart } from "lucide-react"
import { CallControls } from "./call-controls"        
import { ConnectionStatus } from "./connection-status" 
import { useRouter } from "next/navigation"

/**
 * 🛡️ AFRIDAM SPECIALIST: VIDEO ROOM (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Mobile Hardware Handshake & Secure Video Stream.
 */

export function VideoRoom() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * 🚀 CAMERA & MIC HARDWARE HANDSHAKE
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
        console.log("Hardware access denied or unavailable");
        setIsSyncing(false);
      }
    }

    if (!isVideoOff) {
      startCamera();
    } else {
      // Stop tracks if video is manually turned off
      streamRef.current?.getTracks().forEach(track => track.stop());
    }

    return () => {
      // 🛡️ CLEANUP: Ensure camera light turns off on exit
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [isVideoOff]);

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted; 
        setIsMuted(!isMuted);
      }
    }
  };

  const handleHangUp = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    router.push("/dashboard");
  };

  return (
    <div className="relative w-full h-[500px] md:h-[700px] bg-white dark:bg-[#050505] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group shadow-2xl border border-black/5 dark:border-white/10 transition-colors text-left">
      
      {/* 📺 1. SPECIALIST FEED (Waiting State) */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center">
        <AnimatePresence>
          {isSyncing ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <Loader2 className="w-10 h-10 text-[#4DB6AC] animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">Joining Specialist...</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-6 opacity-10 dark:opacity-20">
              <StethoscopeIcon className="w-20 h-20 text-black dark:text-white" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-white text-center">
                Waiting for Specialist <br/> to join
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 👤 2. USER MINI-PREVIEW (Draggable for Mobile) */}
      <motion.div 
        drag
        dragConstraints={{ left: -200, right: 0, top: 0, bottom: 200 }}
        className="absolute top-6 right-6 w-28 h-40 md:w-52 md:h-64 bg-black rounded-[1.8rem] md:rounded-[2.5rem] border-2 border-white/10 overflow-hidden shadow-2xl z-20 cursor-grab active:cursor-grabbing"
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 gap-3">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User size={16} className="text-white/40" />
             </div>
             <span className="text-[7px] font-black uppercase tracking-widest text-white/20">Paused</span>
          </div>
        )}
      </motion.div>

      {/* 🛡️ 3. DESKTOP STATUS */}
      <div className="absolute top-8 left-8 z-30 hidden md:block">
        <ConnectionStatus />
      </div>

      {/* 📱 MOBILE SECURE BADGE */}
      <div className="absolute top-6 left-6 z-30 md:hidden">
          <div className="w-10 h-10 bg-[#4DB6AC] text-white rounded-xl flex items-center justify-center shadow-lg">
             <ShieldCheck size={20} />
          </div>
      </div>

      {/* 🕹️ 4. CALL CONTROLS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-6">
        <CallControls 
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMic={toggleMic}
          onToggleVideo={() => setIsVideoOff(!isVideoOff)}
          onHangUp={handleHangUp}
        />
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