"use client"

import React from "react"
import { Mic, MicOff, Video, VideoOff, PhoneOff, RotateCw } from "lucide-react"

/**
 * 🛡️ AFRIDAM NEURAL LINK: CALL CONTROLS (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Mobile-First Safety & Thumb-Friendly Hardware Controls.
 */

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onHangUp: () => void;
  onFlipCamera?: () => void;
}

export function CallControls({ 
  isMuted, 
  isVideoOff, 
  onToggleMic, 
  onToggleVideo, 
  onHangUp,
  onFlipCamera 
}: CallControlsProps) {
  return (
    <div className="flex items-center gap-3 md:gap-6 px-6 md:px-8 py-4 md:py-6 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl">
      
      {/* 🎤 MICROPHONE CONTROL */}
      <button 
        onClick={onToggleMic}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
          isMuted ? 'bg-red-500 text-white shadow-lg' : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* 📷 CAMERA CONTROL */}
      <button 
        onClick={onToggleVideo}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
          isVideoOff ? 'bg-red-500 text-white shadow-lg' : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
      >
        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      {/* 🔄 CAMERA FLIP (Mobile Handshake) */}
      {onFlipCamera && (
        <button 
          onClick={onFlipCamera}
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 text-white/80 flex items-center justify-center md:hidden active:scale-90 transition-all"
        >
          <RotateCw size={20} />
        </button>
      )}

      {/* 🛑 END CONSULTATION: THE RED BUTTON */}
      <div className="w-[1px] h-8 bg-white/10 mx-1 md:mx-2" />
      
      <button 
        onClick={onHangUp}
        className="w-16 h-14 md:w-24 md:h-16 bg-red-600 text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-xl shadow-red-600/20 hover:bg-red-500 active:scale-95 transition-all"
      >
        <PhoneOff size={24} className="md:w-7 md:h-7" />
      </button>
    </div>
  )
}