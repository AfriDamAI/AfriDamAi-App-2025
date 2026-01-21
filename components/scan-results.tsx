/**
 * 🛡️ AFRIDAM SCAN RESULTS: CLINICAL UI
 * Version: 2026.1.5 (Rule 7 Sync)
 * Focus: High-Precision Handshake & Editorial Typography.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { RotateCcw, Save, Zap, Loader2, CheckCircle2, Sparkles, Info } from "lucide-react"
import Image from "next/image"
import apiClient from "@/lib/api-client"

interface ScanResultsProps {
  result: {
    image?: string;
    predictions?: Record<string, number>;
    finding?: string;
    status?: string;
    id?: string; 
  }
  onNewScan: () => void
}

export default function ScanResults({ result, onNewScan }: ScanResultsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // 🛡️ THE HANDSHAKE FIX (Rule 7)
  const handleSaveToCloud = async () => {
    // Check for result.id (returned from NestJS) or result.image (base64)
    if (!result.id && !result.image) return;
    
    setIsSaving(true)
    try {
      /** * 🚀 RULE 7 SYNC: 
       * Changed endpoint to /ai/history to match the backend controller.
       * We pass the scan metadata to be archived in the User's Clinical Diary.
       */
      await apiClient.post("/ai/history", {
        externalId: result.id,
        finding: result.finding,
        predictions: result.predictions,
        imageUrl: result.image // If the backend needs to store the base64/link
      });
      
      setIsSaved(true)
    } catch (err) {
      // Rule 3: No jargon, log internally
      console.error("Cloud Sync Failed:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 max-w-2xl mx-auto pb-24 text-left"
    >
      {/* 📊 HEADER */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
          Glow <span className="text-[#E1784F]">Profile</span>
        </h1>
        <div className="flex items-center justify-center gap-3 text-[#4DB6AC]">
          <Sparkles size={16} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Optimized by AfriDam AI</p>
        </div>
      </div>

      {/* 🖼️ CAPTURE BOX */}
      {result.image && (
        <Card className="p-3 bg-white/5 border-white/10 rounded-[3.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="relative aspect-square rounded-[2.8rem] overflow-hidden border border-white/5">
             <Image 
               src={result.image} 
               alt="Aesthetic Scan" 
               fill
               className="object-cover" 
               priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
             <div className="absolute bottom-8 left-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">High-Resolution Capture Verified</p>
             </div>
          </div>
        </Card>
      )}

      {/* 🧠 INDICATORS */}
      <div className="grid grid-cols-1 gap-6">
        {result.predictions && Object.entries(result.predictions).length > 0 && (
          <Card className="p-10 bg-white/5 border-white/10 backdrop-blur-2xl rounded-[3rem]">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F] mb-8 flex items-center gap-3">
              <Zap size={14} className="fill-current" /> Aesthetic Analysis
            </h2>
            <div className="space-y-4">
              {Object.entries(result.predictions).map(([name, confidence]: [string, any], index) => {
                const isHigh = confidence > 0.7;
                return (
                  <div key={index} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isHigh ? 'bg-[#E1784F]/10 border-[#E1784F]/30' : 'bg-white/5 border-white/5'}`}>
                    <span className={`font-black text-xs uppercase tracking-tight ${isHigh ? 'text-[#E1784F]' : 'text-white/70'}`}>
                      {name.replace(/_/g, ' ')}
                    </span>
                    <span className={`font-black text-sm italic ${isHigh ? 'text-[#E1784F]' : 'text-[#4DB6AC]'}`}>
                      {(confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* 📜 NEURAL INSIGHT */}
        <Card className="p-10 bg-white/5 border-white/10 rounded-[3rem]">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F] mb-6">Neural Insight</h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed font-medium italic">
            "{result.finding || "Evaluation complete. No significant aesthetic barriers detected."}"
          </p>
        </Card>
      </div>

      {/* 🕹️ ACTION HUB */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onNewScan} 
          className="flex-1 h-20 bg-white text-black hover:bg-white/90 rounded-[1.8rem] font-black uppercase text-[11px] tracking-widest transition-all shadow-xl"
        >
          <RotateCcw className="mr-3" size={18} /> New Analysis
        </Button>
        
        <Button 
          onClick={handleSaveToCloud}
          disabled={isSaving || isSaved}
          variant="outline" 
          className={`flex-1 h-20 rounded-[1.8rem] font-black uppercase text-[11px] tracking-widest transition-all ${isSaved ? 'bg-[#4DB6AC]/20 text-[#4DB6AC] border-[#4DB6AC]/30' : 'bg-[#E1784F] text-white hover:bg-[#ff8e5e]'}`}
        >
          {isSaving ? (
            <Loader2 className="animate-spin mr-3" size={18} />
          ) : isSaved ? (
            <CheckCircle2 className="mr-3" size={18} />
          ) : (
            <Save className="mr-3" size={18} />
          )}
          {isSaving ? "Syncing..." : isSaved ? "In Care Diary" : "Save to Diary"}
        </Button>
      </div>

      {/* 🛡️ COMPLIANCE FOOTER */}
      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl flex gap-4 items-start opacity-40">
         <Info size={18} className="text-[#E1784F] shrink-0 mt-1" />
         <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white leading-loose">
           Disclaimer: This aesthetic evaluation is for beauty and wellness purposes only. Always consult with a licensed professional for clinical concerns.
         </p>
      </div>
    </motion.div>
  )
}