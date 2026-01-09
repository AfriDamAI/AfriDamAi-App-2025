"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Sun, 
  CloudRain, 
  ShieldAlert, 
  CheckCircle2,
  Wind,
  Loader2,
  Moon,
  Zap,
  Activity,
  AlertTriangle
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
    allergies: "" // Added medical requirement
  });

  const totalSteps = 6; // Added Allergy step

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const skipToFinish = () => setStep(totalSteps);

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        profile: {
          ...user?.profile,
          ...formData,
          hasCompletedOnboarding: true
        }
      });
      onComplete();
      router.push('/dashboard');
    } catch (err) {
      console.error("Failed to save onboarding data", err);
      onComplete();
      router.push('/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1C1A19]/98 backdrop-blur-3xl">
      {/* RADIANT BACKGROUND MESH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
      >
        {/* PROGRESS TRACKER */}
        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#4DB6AC] to-[#E1784F]"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-10 md:p-14">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: MELANIN PROFILE */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[#E1784F] text-[9px] font-black uppercase tracking-[0.4em]">Section 01: Pigmentation</span>
                  <h2 className="text-3xl font-black italic uppercase text-foreground leading-none tracking-tighter">Select your <br/> Melanin Tone</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["Rich", "Deep", "Warm", "Tan", "Olive", "Fair"].map((id) => (
                    <button key={id} onClick={() => { setFormData({...formData, melaninTone: id}); nextStep(); }} className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-muted/30 hover:border-[#E1784F] transition-all">
                      <div className="w-10 h-10 rounded-full shadow-inner bg-current text-amber-900" />
                      <span className="text-[8px] font-black uppercase tracking-widest">{id}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SKIN TYPE (OPTIONAL) */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.4em]">Section 02: Texture</span>
                  <h2 className="text-3xl font-black italic uppercase text-foreground leading-none tracking-tighter">Your skin's <br/> daily feel?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Oily / Shine", "Dry / Tight", "Balanced", "Sensitive"].map((type) => (
                    <button key={type} onClick={() => { setFormData({...formData, skinType: type}); nextStep(); }} className="p-6 rounded-2xl border border-border bg-muted/30 hover:border-[#4DB6AC] text-left transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{type}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: CONCERNS */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[#E1784F] text-[9px] font-black uppercase tracking-[0.4em]">Section 03: Objectives</span>
                  <h2 className="text-3xl font-black italic uppercase text-foreground leading-none tracking-tighter">Top Clinical <br/> Concern?</h2>
                </div>
                <div className="grid gap-3">
                  {["Hyperpigmentation", "Active Acne", "Scars / Blemishes", "Anti-Aging"].map((id) => (
                    <button key={id} onClick={() => { setFormData({...formData, primaryConcern: id}); nextStep(); }} className="p-5 rounded-2xl border border-border bg-muted/30 hover:border-[#E1784F] text-left flex justify-between items-center transition-all group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{id}</span>
                      <ChevronRight size={14} className="opacity-30 group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: ALLERGIES (MEDICAL DATA) */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                <div className="space-y-2">
                  <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.4em]">Section 04: Medical</span>
                  <h2 className="text-3xl font-black italic uppercase text-foreground leading-none tracking-tighter">Allergies or <br/> Sensitivities?</h2>
                </div>
                <textarea 
                  placeholder="e.g. Fragrance, Vitamin C, Nuts, etc. (Leave blank if none)"
                  className="w-full bg-muted/30 border-2 border-border rounded-2xl p-6 text-[11px] font-bold outline-none focus:border-red-500/50 transition-all min-h-[120px]"
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                />
                <Button onClick={nextStep} className="w-full h-14 bg-foreground text-background dark:bg-white dark:text-black rounded-xl font-black uppercase text-[10px] tracking-widest">Continue</Button>
              </motion.div>
            )}

            {/* STEP 5: ENVIRONMENT */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                <div className="space-y-2">
                  <span className="text-blue-400 text-[9px] font-black uppercase tracking-[0.4em]">Section 05: Exposure</span>
                  <h2 className="text-3xl font-black italic uppercase text-foreground leading-none tracking-tighter">Your Daily <br/> Surroundings?</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[{id: "Urban", icon: <Wind size={20}/>}, {id: "Humid", icon: <CloudRain size={20}/>}, {id: "High Sun", icon: <Sun size={20}/>}, {id: "Dry", icon: <Moon size={20}/>}].map((env) => (
                    <button key={env.id} onClick={() => { setFormData({...formData, environment: env.id}); nextStep(); }} className="p-8 rounded-[2rem] bg-muted/30 border border-border hover:border-blue-400 flex flex-col items-center gap-4 transition-all">
                      <div className="text-blue-400 opacity-60">{env.icon}</div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-foreground">{env.id}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 6: SUCCESS */}
            {step === 6 && (
              <motion.div key="s6" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-10 py-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-[#4DB6AC]/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative w-24 h-24 bg-card border border-[#4DB6AC]/30 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-[#4DB6AC] w-10 h-10" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black italic uppercase text-foreground tracking-tighter">Profile Active</h2>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] leading-loose max-w-[280px] mx-auto">
                    Your dermatological profile is synchronized. Let's begin.
                  </p>
                </div>
                <button onClick={handleFinish} disabled={isSaving} className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95">
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Enter My Dashboard"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PORTABLE NAVIGATION & SKIP */}
          {step < totalSteps && (
            <div className="mt-12 flex justify-between items-center border-t border-border pt-8">
              <button onClick={prevStep} disabled={step === 1} className={`text-[9px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'opacity-40 hover:opacity-100 text-foreground'}`}>
                Back
              </button>
              
              <div className="flex gap-2">
                {Array.from({length: totalSteps}).map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${step === i + 1 ? 'bg-[#E1784F] w-4' : 'bg-foreground/10'}`} />
                ))}
              </div>

              <button onClick={skipToFinish} className="text-[9px] font-black uppercase tracking-widest text-[#E1784F] hover:scale-105 transition-all">
                Skip for now
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}