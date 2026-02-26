"use client"

import React from "react"
import { Phone, PhoneOff, Video, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface IncomingCallProps {
  fromName: string;
  callType: 'voice' | 'video';
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCall = ({ fromName, callType, onAccept, onReject }: IncomingCallProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-6 right-6 z-[200] bg-white dark:bg-[#151312] border border-[#4DB6AC]/20 shadow-2xl rounded-3xl p-6 w-80"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white text-2xl font-bold mb-4 animate-pulse">
          {fromName[0].toUpperCase()}
        </div>
        <h3 className="text-lg font-bold mb-1">{fromName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-widest text-[10px] font-black">
          Incoming {callType} Call...
        </p>

        <div className="flex items-center gap-4 w-full">
          <button
            onClick={onReject}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
          >
            <PhoneOff size={20} />
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 bg-[#4DB6AC] hover:bg-[#4DB6AC]/90 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-[#4DB6AC]/20"
          >
            {callType === 'video' ? <Video size={20} /> : <Phone size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};