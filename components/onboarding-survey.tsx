/**
 * 🛡️ AFRIDAM ONBOARDING: SILENT BYPASS
 * Version: 2026.1.3 (World-Class Clean Sweep)
 * Focus: Scrapping onboarding for instant dashboard access.
 * Rule 7 & 8: Mobile-First & Theme-Adaptive.
 */

"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Zap } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { updateUser } from "@/lib/api-client"

export function OnboardingSurvey({ onComplete }: { onComplete: () => void }) {
  const { user, mutate } = useAuth();
  const [isBypassing, setIsBypassing] = useState(true);

  useEffect(() => {
    const performSilentHandshake = async () => {
      if (!user?.id) return;

      try {
        /**
         * 🚀 OGA SYNC: 
         * Instead of showing a form, we tell the backend 
         * immediately that this user is "onboarded."
         */
        await updateUser(user.id, {
          onboardingCompleted: true,
          hasCompletedOnboarding: true,
          skinType: "Balanced", // Default profile data to prevent null errors
          melaninTone: "Rich"
        });

        // Refresh global state
        await mutate();
        
        // Instant exit to dashboard
        onComplete();
      } catch (err) {
        console.error("Bypass failed, forcing dashboard...");
        onComplete(); // Force it anyway so user isn't stuck
      } finally {
        setIsBypassing(false);
      }
    };

    performSilentHandshake();
  }, [user, mutate, onComplete]);

  // 🛡️ WORLD-CLASS LOADING STATE (Rule 8: Dark Mode Adaptive)
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
                Initializing <span className="text-[#4DB6AC]">Clinic</span>
             </h2>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                Syncing Neural Profile
             </p>
          </div>
       </motion.div>
    </div>
  );
}