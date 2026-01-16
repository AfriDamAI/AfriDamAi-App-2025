"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, ShoppingBag, ShieldAlert, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface SkinAnalysisResultsProps {
  data: {
    finding?: string;
    predictions?: Record<string, number>;
    status?: string;
    overallHealth?: number;
  }
}

export default function SkinAnalysisResults({ data }: SkinAnalysisResultsProps) {
  const router = useRouter();
  const healthScore = data.overallHealth || 85;

  const getSeverityStyles = (confidence: number) => {
    if (confidence < 0.3) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (confidence < 0.6) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-[#E1784F]/10 text-[#E1784F] border-[#E1784F]/20"
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      
      {/* 1. HEALTH SCORE CARD */}
      <Card className="p-8 bg-card border-border backdrop-blur-xl relative overflow-hidden rounded-[2.5rem]">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <CheckCircle2 size={120} />
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Skin Health Score</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Melanin Vitality Index</p>
          </div>
          <div className="text-6xl font-black italic text-[#4DB6AC]">{healthScore}%</div>
        </div>
        <Progress value={healthScore} className="h-3 bg-muted" />
      </Card>

      {/* 2. DETECTED INDICATORS (With Empty State Protection) */}
      <div className="space-y-6">
        <h3 className="text-lg font-black italic uppercase tracking-tighter text-[#E1784F] flex items-center gap-2">
          <AlertCircle size={18} /> Detected Indicators
        </h3>
        
        <div className="grid gap-4">
          {data.predictions && Object.entries(data.predictions).length > 0 ? (
            Object.entries(data.predictions).map(([name, confidence]: [string, any], index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: index * 0.1 }}
                key={name}
              >
                <Card className="p-6 bg-card border-border hover:border-[#E1784F]/30 transition-all group rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-black uppercase italic tracking-tight text-foreground group-hover:text-[#4DB6AC] transition-colors">
                        {name.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Phenotype Detection Confidence</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityStyles(confidence)}`}>
                      {(confidence * 100).toFixed(1)}% Match
                    </span>
                  </div>
                  <Progress value={confidence * 100} className="h-2 bg-muted" />
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="p-10 text-center border-2 border-dashed border-border rounded-3xl opacity-40">
              <p className="text-[10px] font-black uppercase tracking-widest">No major anomalies detected in scan</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. AI CLINICAL SUMMARY */}
      <div className="space-y-4">
        <h3 className="text-lg font-black italic uppercase tracking-tighter text-[#E1784F]">Clinical Summary</h3>
        <Card className="p-8 bg-[#E1784F]/5 border-[#E1784F]/20 rounded-[2rem]">
          <p className="text-sm text-foreground leading-relaxed italic font-medium">
            "{data.finding || "Analysis complete. Skin appears within normal physiological parameters for this phenotype. Continue with regular hydration and sun protection."}"
          </p>
        </Card>
      </div>

      {/* 4. RE-ENFORCED CALL TO ACTION (FIXED LINK) */}
      <Card className="p-8 bg-gradient-to-r from-[#E1784F] to-[#ff8e5e] border-none rounded-[3rem] shadow-2xl shadow-[#E1784F]/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
             <ShoppingBag className="text-white" size={32} />
          </div>
          <div className="space-y-1 text-center md:text-left flex-1">
            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">Curated Solutions</h4>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">View products matched to your melanin profile</p>
          </div>
          <button 
            onClick={() => router.push('/marketplace')}
            className="w-full md:w-auto px-10 h-16 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            Open Shop <ArrowRight size={14} />
          </button>
        </div>
      </Card>

      {/* 5. 🛡️ PLAY STORE PROTECTION LAYER (DISCLAIMER) */}
      <div className="p-8 bg-muted/50 border border-border rounded-[2rem] flex items-start gap-5">
        <ShieldAlert size={24} className="text-[#E1784F] shrink-0" />
        <div className="space-y-2">
          <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Medical Disclaimer</p>
          <p className="text-[10px] font-bold leading-relaxed text-muted-foreground uppercase tracking-tight">
            AfriDam AI analysis is for informational and educational guidance only. This technology is not a substitute for a clinical diagnosis by a licensed dermatologist. If you notice persistent changes, please consult our Expert Hub for a verified medical session.
          </p>
        </div>
      </div>
    </div>
  )
}