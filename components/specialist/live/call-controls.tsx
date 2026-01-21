/**
 * 🛡️ AFRIDAM NEURAL LINK: CALL CONTROLS
 * Version: 2026.1.1 (Hardware Handshake)
 * Rule 5: Synced with VideoRoom hardware state and mobile flip logic.
 */

"use client"

import React from "react"
import { Mic, MicOff, Video, VideoOff, PhoneOff, RotateCw } from "lucide-react"

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
    <div className="flex items-center gap-4 md:gap-6 px-8 py-6 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl">
      {/* MIC TOGGLE: Hardware Handshake */}
      <button 
        onClick={onToggleMic}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
          isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
        }`}
        title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
      >
        {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
      </button>

      {/* VIDEO TOGGLE: Hardware Handshake */}
      <button 
        onClick={onToggleVideo}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
          isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
        }`}
        title={isVideoOff ? "Enable Camera" : "Disable Camera"}
      >
        {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
      </button>

      {/* FLIP CAMERA: Mobile Optimized (Nathan's Sync) */}
      {onFlipCamera && (
        <button 
          onClick={onFlipCamera}
          className="w-14 h-14 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center hover:text-white hover:bg-white/10 md:hidden active:scale-90 transition-all"
        >
          <RotateCw size={22} />
        </button>
      )}

      {/* THE RED BUTTON: END CLINICAL SESSION */}
      <button 
        onClick={onHangUp}
        className="w-20 h-16 md:w-24 bg-red-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-red-600/20 hover:bg-red-500 active:scale-95 transition-all"
        title="End Consultation"
      >
        <PhoneOff size={28} />
      </button>
    </div>
  )
}