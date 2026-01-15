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
import { useRouter } from "next/navigation"

export function OnboardingSurvey({ onComplete }: { onComplete: () => void }) {
  const { updateUserProfile, user } = useAuth();
  const router = useRouter();
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

  const handleFinish = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      // 🛡️ PRODUCTION SYNC: Mapping frontend state to Clinical Profile Schema
      await updateUserProfile?.({
        profile: {
          ...user?.profile,
          skinType: formData.skinType,
          primaryConcern: formData.primaryConcern,
          environment: formData.environment,
          melaninTone: formData.melaninTone,
          allergies: formData.allergies,
          onboardingCompleted: true 
        }
      });
      
      // Allow a brief moment for the DB to propagate before redirecting
      setTimeout(() => {
        onComplete();
        router.push('/dashboard');
      }, 800);

    } catch (err) {
      console.error("Clinical Profile Sync Failed:", err);
      // Fail-safe: move to dashboard to prevent user lock-out
      router.push('/dashboard');
    } finally {
      // Keep loading state active until redirect to prevent double-clicks
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#0A0A0A]/95 backdrop-blur-3xl overflow-hidden">
      {/* RADIANT BACKGROUND MESH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,120,79,0.1),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-card border border-white/5 rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
      >
        {/* PROGRESS TRACKER */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
          <motion.div 
            className="h-full bg-[#E1784F]"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="p-8 md:p-16">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: MELANIN PROFILE */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.5em]">Section 01: Pigmentation</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-foreground leading-[0.9] tracking-tighter">Select your <br/> Melanin Tone</h2>
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
                    <button key={tone.id} onClick={() => { setFormData({...formData, melaninTone: tone.id}); nextStep(); }} className="group flex flex-col items-center gap-4 p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-[#E1784F]/50 transition-all active:scale-90">
                      <div className={`w-14 h-14 rounded-full shadow-2xl ${tone.color} border-2 border-white/10 group-hover:scale-110 transition-transform`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">{tone.id}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SKIN TYPE */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.5em]">Section 02: Texture</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-foreground leading-[0.9] tracking-tighter">Your skin's <br/> daily feel?</h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {["Oily / Shine", "Dry / Tight", "Balanced", "Sensitive"].map((type) => (
                    <button key={type} onClick={() => { setFormData({...formData, skinType: type}); nextStep(); }} className="p-8 rounded-[2rem] border border-white/5 bg-white/5 hover:border-[#4DB6AC] text-left transition-all group active:scale-[0.98] flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white">{type}</span>
                      <ChevronRight size={18} className="text-white/10 group-hover:text-[#4DB6AC] transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONCERNS */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.5em]">Section 03: Objectives</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-foreground leading-[0.9] tracking-tighter">Top Clinical <br/> Concern?</h2>
                </div>
                <div className="grid gap-3">
                  {["Hyperpigmentation", "Active Acne", "Scars / Blemishes", "Anti-Aging"].map((id) => (
                    <button key={id} onClick={() => { setFormData({...formData, primaryConcern: id}); nextStep(); }} className="p-8 rounded-[2rem] border border-white/5 bg-white/5 hover:border-[#E1784F] text-left flex justify-between items-center transition-all group">
                      <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white">{id}</span>
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight size={16} className="text-[#E1784F]" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: ALLERGIES */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-red-500/80 text-[10px] font-black uppercase tracking-[0.5em]">Section 04: Medical</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-foreground leading-[0.9] tracking-tighter">Allergies or <br/> Sensitivities?</h2>
                </div>
                <textarea 
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="e.g. Fragrance, Vitamin C, Nuts... (Optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-[13px] font-bold outline-none focus:border-red-500/30 transition-all min-h-[180px] text-white placeholder:text-white/10 resize-none"
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                />
                <button onClick={nextStep} className="w-full h-18 py-6 bg-white text-black rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl active:scale-95 transition-all">
                  Continue
                </button>
              </motion.div>
            )}

            {/* STEP 5: ENVIRONMENT */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                <div className="space-y-3">
                  <span className="text-blue-400/80 text-[10px] font-black uppercase tracking-[0.5em]">Section 05: Exposure</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase text-foreground leading-[0.9] tracking-tighter">Daily <br/> Surroundings?</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {id: "Urban", icon: <Wind size={28}/>}, 
                    {id: "Humid", icon: <CloudRain size={28}/>}, 
                    {id: "High Sun", icon: <Sun size={28}/>}, 
                    {id: "Dry", icon: <Moon size={28}/>}
                  ].map((env) => (
                    <button key={env.id} onClick={() => { setFormData({...formData, environment: env.id}); nextStep(); }} className="p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-blue-400/40 flex flex-col items-center gap-6 transition-all active:scale-95 group">
                      <div className="text-blue-400/40 group-hover:text-blue-400 group-hover:scale-110 transition-all">{env.icon}</div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white">{env.id}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 6: SUCCESS */}
            {step === 6 && (
              <motion.div key="s6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-12 py-8">
                <div className="relative mx-auto w-32 h-32">
                  <div className="absolute inset-0 bg-[#4DB6AC]/10 blur-[80px] rounded-full animate-pulse" />
                  <div className="relative w-32 h-32 bg-white/5 border border-[#4DB6AC]/20 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle2 className="text-[#4DB6AC] w-14 h-14" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black italic uppercase text-foreground tracking-tighter">Profile Active</h2>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed max-w-[280px] mx-auto">
                    Your clinical profile is now synchronized. Let's start your journey.
                  </p>
                </div>
                <button 
                  onClick={handleFinish} 
                  disabled={isSaving} 
                  className="w-full h-22 py-7 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] shadow-[0_25px_60px_rgba(225,120,79,0.3)] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <>Enter Dashboard <Zap size={18} fill="white"/></>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PORTABLE NAVIGATION & SKIP */}
          {step < totalSteps && (
            <div className="mt-14 flex justify-between items-center border-t border-white/5 pt-12">
              <button 
                onClick={prevStep} 
                disabled={step === 1} 
                className={`text-[9px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-30 hover:opacity-100 text-white'}`}
              >
                Back
              </button>
              
              <div className="flex gap-3">
                {Array.from({length: totalSteps}).map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-700 ${step === i + 1 ? 'bg-[#E1784F] w-8' : 'bg-white/5 w-1.5'}`} />
                ))}
              </div>

              <button onClick={skipToFinish} className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]/60 hover:text-[#E1784F] transition-all">
                Skip
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}