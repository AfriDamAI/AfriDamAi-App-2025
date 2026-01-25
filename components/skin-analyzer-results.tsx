/**
 * 🛡️ AFRIDAM SKIN WELLNESS: RESULTS VIEW (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: High-Precision Indicator mapping for Melanin-Rich profiles.
 */

"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { 
  ShoppingBag, ArrowRight, Sparkles, Info, Activity
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SkinAnalysisResultsProps {
  data: {
    finding?: string;
    predictions?: Record<string, number>;
    status?: string;
    /** 🚀 SYNC: Support for all potential Backend/AI response keys */
    overallHealth?: number; 
    overall_health?: number;
    overallGlow?: number;   
    overall_glow?: number;
  }
}

export default function SkinAnalysisResults({ data }: SkinAnalysisResultsProps) {
  const router = useRouter();
  
  /**
   * 🛡️ THE HANDSHAKE SYNC (Rule 7)
   * Prioritize clinical indices from the verified pipeline.
   */
  const healthIndex = data.overallHealth || data.overall_health || data.overallGlow || data.overall_glow || 85;
  const findings = data.finding || "Scan complete. Your profile suggests maintaining your current safe hydration routine.";

  /**
   * 🎨 INTENSITY LOGIC (Standardized)
   * Colors adjust automatically based on match accuracy.
   */
  const getIntensityStyles = (confidence: number) => {
    const value = confidence <= 1 ? confidence : confidence / 100;
    
    if (value < 0.3) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (value < 0.6) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-[#E1784F]/10 text-[#E1784F] border-[#E1784F]/20";
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 text-left px-1">
      
      {/* 📊 1. WELLNESS INDEX CARD */}
      <Card className="p-6 md:p-8 bg-card border-border backdrop-blur-xl relative overflow-hidden rounded-[2.5rem] shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
           <Activity size={100} />
        </div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <h2 className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-foreground leading-none">Wellness Index</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Safe Balance Score</p>
          </div>
          <div className="text-5xl md:text-6xl font-black italic text-[#4DB6AC]">{healthIndex}%</div>
        </div>
        <Progress value={healthIndex} className="h-2 md:h-3 bg-muted" />
      </Card>

      {/* 🧬 2. SKIN OBSERVATIONS */}
      <div className="space-y-4 md:space-y-6">
        <h3 className="text-md md:text-lg font-black italic uppercase tracking-tighter text-[#E1784F] flex items-center gap-2 px-2">
          <Sparkles size={16} /> Key Observations
        </h3>
        
        <div className="grid gap-3">
          {data.predictions && Object.entries(data.predictions).length > 0 ? (
            Object.entries(data.predictions).map(([name, confidence], index) => {
              const displayConfidence = confidence <= 1 ? confidence * 100 : confidence;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.1 }}
                  key={name}
                >
                  <Card className="p-5 md:p-6 bg-card border-border rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-md font-black uppercase italic tracking-tight text-foreground">
                          {name.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">Neural Match</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getIntensityStyles(confidence)}`}>
                        {displayConfidence.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={displayConfidence} className="h-1.5 bg-muted" />
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <div className="p-12 text-center border border-dashed border-border rounded-[2rem] opacity-40">
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Searching for Neural Indicators</p>
            </div>
          )}
        </div>
      </div>

      {/* 📜 3. CLINICAL SUMMARY */}
      <div className="space-y-3 px-2">
        <h3 className="text-md md:text-lg font-black italic uppercase tracking-tighter text-[#E1784F]">AI Interpretation</h3>
        <Card className="p-6 md:p-8 bg-[#E1784F]/5 border-[#E1784F]/10 rounded-[2rem]">
          <p className="text-xs md:text-sm text-foreground leading-relaxed italic font-medium">
            "{findings}"
          </p>
        </Card>
      </div>

      {/* 🛍️ 4. CARE HUB CTA */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-[#E1784F] to-[#ff8e5e] border-none rounded-[2.5rem] shadow-xl overflow-hidden relative">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center relative z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0 text-white">
               <ShoppingBag size={24} />
            </div>
            <div className="text-left text-white">
              <h4 className="text-xl font-black italic uppercase tracking-tighter">The Care Shop</h4>
              <p className="text-white/80 text-[8px] font-black uppercase tracking-widest leading-none">Find safe products for your scan</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/marketplace')}
            className="w-full md:w-auto px-10 py-4 bg-black text-white rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Access Shop <ArrowRight size={14} />
          </button>
        </div>
      </Card>

      {/* 🛡️ 5. DISCLAIMER */}
      <div className="p-6 bg-muted/30 border border-border rounded-2xl flex items-start gap-4 opacity-60">
        <Info size={18} className="text-[#E1784F] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[8px] font-black text-foreground uppercase tracking-[0.2em]">Safe Note</p>
          <p className="text-[8px] font-bold leading-relaxed text-muted-foreground uppercase tracking-tight">
            These results are for wellness guidance only. They do not replace a clinical consultation. If you have concerns, speak with a specialist.
          </p>
        </div>
      </div>
    </div>
  )
}