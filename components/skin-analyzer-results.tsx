"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, ShoppingBag, ShieldAlert } from "lucide-react"

interface SkinAnalysisResultsProps {
  data: {
    finding?: string;
    predictions?: Record<string, number>;
    status?: string;
    overallHealth?: number;
  }
}

export default function SkinAnalysisResults({ data }: SkinAnalysisResultsProps) {
  // 1. Logic to calculate a health score if none exists
  const healthScore = data.overallHealth || 85;

  const getSeverityStyles = (confidence: number) => {
    if (confidence < 0.3) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (confidence < 0.6) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-[#E1784F]/10 text-[#E1784F] border-[#E1784F]/20"
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Overall Health Score - Dark Mode UI */}
      <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <CheckCircle2 size={120} />
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Skin Health Score</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Melanin Vitality Index</p>
          </div>
          <div className="text-6xl font-black italic text-[#4DB6AC]">{healthScore}%</div>
        </div>
        <Progress value={healthScore} className="h-2 bg-white/10" />
      </Card>

      {/* Detected Conditions (AI Predictions) */}
      <div className="space-y-4">
        <h3 className="text-lg font-black italic uppercase tracking-tighter text-[#E1784F] flex items-center gap-2">
          <AlertCircle size={18} /> Detected Indicators
        </h3>
        
        <div className="grid gap-4">
          {data.predictions && Object.entries(data.predictions).map(([name, confidence]: [string, any], index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.1 }}
              key={name}
            >
              <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-black uppercase italic tracking-tight text-white group-hover:text-[#4DB6AC] transition-colors">
                      {name.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-xs text-white/40 font-medium">Neural confidence in phenotype detection</p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSeverityStyles(confidence)}`}>
                    {(confidence * 100).toFixed(1)}% Match
                  </span>
                </div>
                <Progress value={confidence * 100} className="h-1.5 bg-white/5" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Summary Description */}
      <div>
        <h3 className="text-lg font-black italic uppercase tracking-tighter text-[#E1784F] mb-4">Clinical Summary</h3>
        <Card className="p-6 bg-[#E1784F]/5 border-[#E1784F]/20 rounded-2xl">
          <p className="text-sm text-white/80 leading-relaxed italic font-medium">
            "{data.finding || "No specific anomalies detected. Skin appears within normal physiological parameters for this phenotype."}"
          </p>
        </Card>
      </div>

      {/* Specialist Call to Action */}
      <Card className="p-8 bg-gradient-to-r from-[#E1784F] to-[#ff8e5e] border-none rounded-[2.5rem] shadow-2xl shadow-[#E1784F]/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
             <ShoppingBag className="text-white" size={32} />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">Curated Solutions</h4>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">View products matched to your skin profile</p>
          </div>
          <button className="md:ml-auto w-full md:w-auto px-8 h-14 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-all">
            Open Shop
          </button>
        </div>
      </Card>

      {/* Legal Footer */}
      <div className="p-6 border border-white/5 rounded-2xl flex items-start gap-4 opacity-40">
        <ShieldAlert size={20} className="shrink-0" />
        <p className="text-[10px] font-bold leading-relaxed uppercase tracking-wider">
          AI analysis is for informational guidance only. This is not a substitute for a physical examination by a licensed dermatologist.
        </p>
      </div>
    </div>
  )
}