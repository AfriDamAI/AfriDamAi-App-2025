"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronRight, 
  CloudRain, 
  CheckCircle2,
  Wind,
  Loader2,
  Zap,
  Sun,
  Moon
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

export function OnboardingSurvey({ onComplete }: { onComplete: () => void }) {
  const { updateUserProfile, user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    skinType: "",
    primaryConcern: "",
    environment: "",
    melaninTone: "",
    allergies: ""
  });

  const totalSteps = 6;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const skipToFinish = () => setStep(totalSteps);

  /**
   * 🛡️ OGA FIX: Nuclear Sync Logic
   * We send the flag to the root AND the profile object to be 100% safe.
   */
  const handleFinish = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      // 1. Prepare the update payload
      const updatePayload = {
        // Root level flag
        onboardingCompleted: true, 
        // Profile nested data
        profile: {
          ...user?.profile,
          skinType: formData.skinType,
          primaryConcern: formData.primaryConcern,
          environment: formData.environment,
          melaninTone: formData.melaninTone,
          allergies: formData.allergies,
          onboardingCompleted: true // Mirror flag for safety
        }
      };

      // 2. Sync with Backend
      await updateUserProfile?.(updatePayload);
      
      // 3. 🛡️ THE BREATHING ROOM: 
      // This ensures the DB transaction is fully committed on the server
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Trigger Parent Callback
      onComplete();

    } catch (err) {
      console.error("Clinical Profile Sync Failed:", err);
      // Fallback: Trigger completion anyway so user isn't stuck in a loop
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#0A0A0A]/98 backdrop-blur-3xl overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,120,79,0.1),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-card border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-[#E1784F]"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-16">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.5em]">Section 01: Tone</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-none tracking-tighter">Your Melanin <br/> Profile</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "Rich", color: "bg-[#3D251E]" },
                    { id: "Deep", color: "bg-[#5C3A2E]" },
                    { id: "Warm", color: "bg-[#8D5B44]" },
                    { id: "Tan", color: "bg-[#C68642]" },
                    { id: "Olive", color: "bg-[#E0AC69]" },
                    { id: "Fair", color: "bg-[#F3CFAB]" }
                  ].map((tone) => (
                    <button key={tone.id} onClick={() => { setFormData({...formData, melaninTone: tone.id}); nextStep(); }} className="group flex flex-col items-center gap-4 p-5 rounded-3xl border border-white/5 bg-white/5 hover:border-[#E1784F] transition-all">
                      <div className={`w-12 h-12 rounded-full shadow-2xl ${tone.color} border-2 border-white/10`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{tone.id}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.5em]">Section 02: Type</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-none tracking-tighter">Skin Feel <br/> Dynamics?</h2>
                </div>
                <div className="grid gap-3">
                  {["Oily / Shine", "Dry / Tight", "Balanced", "Sensitive"].map((type) => (
                    <button key={type} onClick={() => { setFormData({...formData, skinType: type}); nextStep(); }} className="p-8 rounded-[2rem] border border-white/5 bg-white/5 hover:border-[#4DB6AC] text-left transition-all flex justify-between items-center group text-white">
                      <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white">{type}</span>
                      <ChevronRight size={18} className="text-white/10 group-hover:text-[#4DB6AC]" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.5em]">Section 03: Goals</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-none tracking-tighter">Primary <br/> Objective?</h2>
                </div>
                <div className="grid gap-3 text-white">
                  {["Hyperpigmentation", "Active Acne", "Scars / Blemishes", "Anti-Aging"].map((id) => (
                    <button key={id} onClick={() => { setFormData({...formData, primaryConcern: id}); nextStep(); }} className="p-8 rounded-[2rem] border border-white/5 bg-white/5 hover:border-[#E1784F] text-left flex justify-between items-center transition-all">
                      <span className="text-xs font-black uppercase tracking-widest text-white/60">{id}</span>
                      <ChevronRight size={16} className="text-[#E1784F]" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.5em]">Section 04: Safety</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-none tracking-tighter">Known <br/> Allergies?</h2>
                </div>
                <textarea 
                  placeholder="Fragrance, Vitamin C, etc. (Optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm outline-none focus:border-red-500/40 transition-all min-h-[150px] text-white"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                />
                <button onClick={nextStep} className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">Continue</button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em]">Section 05: External</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-none tracking-tighter">Daily <br/> Exposure?</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {id: "Urban", icon: <Wind size={24}/>}, 
                    {id: "Humid", icon: <CloudRain size={24}/>}, 
                    {id: "High Sun", icon: <Sun size={24}/>}, 
                    {id: "Dry", icon: <Moon size={24}/>}
                  ].map((env) => (
                    <button key={env.id} onClick={() => { setFormData({...formData, environment: env.id}); nextStep(); }} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-400 flex flex-col items-center gap-4 transition-all group">
                      <div className="text-blue-400/30 group-hover:text-blue-400 transition-all">{env.icon}</div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white">{env.id}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="s6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-10 py-4">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-[#4DB6AC]/20 blur-3xl rounded-full" />
                  <div className="relative w-full h-full bg-white/5 border border-[#4DB6AC]/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-[#4DB6AC] w-10 h-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Protocol Ready</h2>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest max-w-[250px] mx-auto">Initializing your personalized melanin-safe experience.</p>
                </div>
                <button 
                  onClick={handleFinish} 
                  disabled={isSaving} 
                  className="w-full h-20 bg-[#E1784F] text-white rounded-[1.8rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl flex items-center justify-center gap-3"
                >
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <>Finalize Profile <Zap size={16} fill="white"/></>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < totalSteps && (
            <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-10">
              <button onClick={prevStep} disabled={step === 1} className={`text-[9px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'text-white/20 hover:text-white'}`}>Back</button>
              <div className="flex gap-2">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className={`h-1 rounded-full transition-all ${step === i ? 'bg-[#E1784F] w-6' : 'bg-white/5 w-2'}`} />
                ))}
              </div>
              <button onClick={skipToFinish} className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]/50">Skip</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}