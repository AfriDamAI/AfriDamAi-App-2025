/**
 * 🛡️ AFRIDAM ONBOARDING: SILENT BYPASS
 * Rule 7 Sync: Removed scrapped onboarding flags.
 * Focus: Instant state synchronization and dashboard hand-off.
 */

"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

export function OnboardingSurvey({ onComplete }: { onComplete: () => void }) {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const performInstantHandshake = async () => {
      if (!user?.id) return;

      try {
        /**
         * 🚀 THE CLEAN SWEEP (Rule 7)
         * We no longer send 'onboardingCompleted' because it doesn't exist in the DB.
         * We simply refresh the user state to ensure we have the latest Profile 
         * and then trigger the completion callback.
         */
        await refreshUser();
        
        // Instant exit to dashboard
        onComplete();
      } catch (err) {
        // Rule 6: No stress—if refresh fails, we still move to dashboard
        onComplete(); 
      }
    };

    performInstantHandshake();
  }, [user, refreshUser, onComplete]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#050505] flex items-center justify-center">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
       
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="text-center space-y-8"
       >
          <div className="relative w-20 h-20 mx-auto">
             <div className="absolute inset-0 border-t-2 border-[#E1784F] rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="text-[#E1784F] animate-pulse" size={24} fill="currentColor" />
             </div>
          </div>
          
          <div className="space-y-2">
             <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
                Preparing <span className="text-[#4DB6AC]">Dashboard</span>
             </h2>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                Direct Clinical Access
             </p>
          </div>
       </motion.div>
    </div>
  );
}