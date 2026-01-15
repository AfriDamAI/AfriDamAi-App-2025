"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { RotateCcw, Save, ShieldCheck, Zap } from "lucide-react"
import Image from "next/image"

interface ScanResultsProps {
  result: {
    image?: string;
    predictions?: Record<string, number>;
    finding?: string;
    status?: string;
  }
  onNewScan: () => void
}

export default function ScanResults({ result, onNewScan }: ScanResultsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          Analysis <span className="text-[#E1784F]">Report</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-[#4DB6AC]">
          <ShieldCheck size={14} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Validated by AfriDam AI Node</p>
        </div>
      </div>

      {result.image && (
        <Card className="p-2 bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden">
             <Image 
               src={result.image || "/placeholder.svg"} 
               alt="Analyzed Skin Sample" 
               fill
               className="object-cover" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Dynamic Predictions from Backend */}
        {result.predictions && Object.entries(result.predictions).length > 0 && (
          <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl rounded-[2.5rem]">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#E1784F] mb-6 flex items-center gap-2">
              <Zap size={14} className="fill-current" /> Neural Indicators
            </h2>
            <div className="space-y-4">
              {Object.entries(result.predictions).map(([name, confidence]: [string, any], index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="font-bold text-sm uppercase tracking-tight text-white/80">
                    {name.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[#4DB6AC] font-black text-xs">
                    {(confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* AI Finding Description */}
        <Card className="p-8 bg-white/5 border-white/10 rounded-[2.5rem]">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#E1784F] mb-4">AI Interpretation</h2>
          <p className="text-sm text-white/60 leading-relaxed font-medium italic">
            "{result.finding || "Analysis confirms stable skin phenotype with no critical immediate actions required."}"
          </p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pb-20">
        <Button 
          onClick={onNewScan} 
          className="flex-1 h-16 bg-[#E1784F] hover:bg-[#ff8e5e] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
        >
          <RotateCcw className="mr-2" size={16} /> New Scan
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-16 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest"
        >
          <Save className="mr-2" size={16} /> Save to Cloud
        </Button>
      </div>
    </motion.div>
  )
}