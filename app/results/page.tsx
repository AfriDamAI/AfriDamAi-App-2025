/**
 * 🛡️ AFRIDAM NEURAL DIAGNOSTICS: REPORT (Rule 6 Synergy)
 * Version: 2026.1.22 (Handshake & Soft Tone Alignment)
 * Focus: High-Precision Report Mapping & Melanin Patterns.
 */

"use client"

import { useState, useEffect, Suspense } from "react"
import SkinAnalysisResults from "@/components/skin-analyzer-results"
import Questionnaire from "@/components/questionnaire"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Loader2, ChevronLeft, ArrowRight, 
  AlertCircle, ShieldCheck, Fingerprint, Activity,
  Zap, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import apiClient from "@/lib/api-client"

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const scanId = searchParams.get('id')

  useEffect(() => {
    const fetchRealAnalysis = async () => {
      // 🛡️ RULE 6: Checking LocalStorage first for zero-flicker testing
      const localData = localStorage.getItem("last_scan");
      
      if (localData && !scanId) {
        setAnalysisData(JSON.parse(localData));
        setIsLoading(false);
        return;
      }

      if (!scanId) {
        setError("Your diary record is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true)
        const response = await apiClient.get(`/ai/history/${scanId}`)
        const data = response.data;
        
        setAnalysisData({
          overallHealth: data.healthScore || data.overallHealth || 85,
          finding: data.description || data.finding,
          predictions: data.predictions,
          status: data.status,
          imageUrl: data.imageUrl
        })
      } catch (err: any) {
        // 🛡️ Rule 4: Relatable English
        setError("Our AI core is taking a moment to sync. Please try again.");
      } finally {
        setIsLoading(false)
      }
    }

    fetchRealAnalysis()
  }, [scanId])

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-10">
        <div className="relative">
           <div className="w-32 h-32 rounded-[3rem] border-t-4 border-[#E1784F] animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-[#E1784F] animate-pulse" size={32} fill="currentColor" />
           </div>
        </div>
        <div className="text-center space-y-2">
           <p className="text-[#E1784F] font-black uppercase tracking-[0.5em] text-[10px]">Building Your Diary</p>
           <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[8px]">Reviewing Patterns</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto space-y-20 md:space-y-32 pb-20 text-left">
        {/* HEADER SECTION (Soft Tone) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/5 pb-16">
          <div className="space-y-6">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-3 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.3em] transition-all"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Hub
            </button>
            <h1 className="text-5xl md:text-[9rem] font-black italic tracking-tighter uppercase leading-[0.8] text-white">
              The <br /> <span className="text-[#E1784F]">Report</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="text-right">
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Health Score</p>
                <div className="flex items-end gap-2">
                   <p className="text-6xl font-black italic tracking-tighter text-[#4DB6AC] leading-none">{analysisData?.overallHealth}</p>
                   <span className="text-xl font-black opacity-10 mb-1">/100</span>
                </div>
             </div>
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
                <ShieldCheck className="text-[#E1784F]" size={32} />
             </div>
          </div>
        </header>

        {error ? (
          <div className="py-32 text-center space-y-10 bg-white/5 rounded-[3rem] border border-white/5">
            <AlertCircle className="mx-auto text-red-500/50" size={48} />
            <div className="space-y-2 px-6">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-red-500">{error}</h3>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">The AI core encountered a sync delay.</p>
            </div>
            <Button onClick={() => router.push('/scanner')} className="px-10 h-16 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">Retake Scan</Button>
          </div>
        ) : analysisData ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start"
          >
            {/* LEFT COLUMN */}
            <div className="space-y-16">
              <SkinAnalysisResults data={analysisData} />
              <div className="bg-white/5 p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10">
                 <div className="flex items-center gap-3">
                    <Fingerprint className="text-[#4DB6AC]" size={20} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4DB6AC]">Summary Observation</h3>
                 </div>
                 <p className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-tight text-white">
                    "{analysisData.finding || "Your skin shows a healthy, stable pattern with good hydration."}"
                 </p>
                 <div className="flex items-start gap-3 pt-8 border-t border-white/5">
                    <Info className="text-[#E1784F] shrink-0" size={16} />
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 leading-relaxed">
                       AI results are for guidance only. For a certified care plan, please talk to a specialist.
                    </p>
                 </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-10 lg:sticky lg:top-24">
               <div className="p-10 bg-black/40 border border-white/5 rounded-[3.5rem] shadow-2xl space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#4DB6AC]">
                       <Activity size={14} />
                       <span className="text-[9px] font-black uppercase tracking-[0.4em]">Step 02</span>
                    </div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Your Next <br /> <span className="text-[#4DB6AC]">Step</span></h3>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                     <Questionnaire />
                  </div>
               </div>

               <div className="grid gap-4">
                  <Button onClick={() => router.push('/scanner')} className="h-16 bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl transition-all">
                    Start New Scan
                  </Button>
                  <Button onClick={() => router.push('/marketplace')} variant="outline" className="h-16 bg-transparent border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:border-[#4DB6AC] transition-all">
                    Shop Care Plan <ArrowRight size={14} className="ml-2" />
                  </Button>
               </div>
            </div>
          </motion.div>
        ) : null}
    </div>
  )
}

// ... ResultsPage container remains same but updated background styles