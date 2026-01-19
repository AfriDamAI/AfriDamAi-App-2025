/**
 * 🛡️ AFRIDAM NEURAL DIAGNOSTICS: CLINICAL REPORT
 * Version: 2026.1.2 (Premium Editorial Refactor)
 * Handshake: Fully synced with Render Backend & AI v2
 * Focus: High-Contrast, Deep Ambiance, Mature Typography.
 */

"use client"

import { useState, useEffect, Suspense } from "react"
import SkinAnalysisResults from "@/components/skin-analyzer-results"
import Questionnaire from "@/components/questionnaire"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Loader2, ChevronLeft, CheckCircle, ArrowRight, 
  AlertCircle, ShieldCheck, Fingerprint, Activity,
  Zap, Info
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const scanId = searchParams.get('id')

  useEffect(() => {
    const fetchRealAnalysis = async () => {
      if (!scanId) {
        setError("NO ACTIVE SCAN RECORD LOCATED.")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyzer/${scanId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        })

        if (!response.ok) throw new Error("Synchronization failure with AI Node")

        const res = await response.json()
        const data = res.resultData || res; 
        
        setAnalysisData({
          overallHealth: data.healthScore || 85,
          finding: data.description,
          predictions: data.predictions,
          status: data.status,
          imageUrl: data.imageUrl
        })
      } catch (err: any) {
        setError("NEURAL SYNC FAILED. RETRYING...")
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
           <p className="text-[#E1784F] font-black uppercase tracking-[0.6em] text-[10px]">Neural Decoding</p>
           <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[8px]">Analyzing Melanin-Rich Patterns</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto space-y-24 md:space-y-40 pb-20">
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-white/10 pb-16">
          <div className="space-y-8">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-4 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.4em] transition-all"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
              Clinical Portal
            </button>
            <h1 className="text-6xl md:text-[10rem] font-black italic tracking-[-0.05em] uppercase leading-[0.8] text-white">
              The <br /> <span className="text-[#E1784F]">Report</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-10">
             <div className="text-right space-y-2">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Integrity Score</p>
                <div className="flex items-end gap-2">
                   <p className="text-7xl font-black italic tracking-tighter text-[#4DB6AC] leading-none">{analysisData?.overallHealth}</p>
                   <span className="text-xl font-black opacity-20 mb-1">/100</span>
                </div>
             </div>
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center">
                <ShieldCheck className="text-[#E1784F]" size={32} />
             </div>
          </div>
        </header>

        {error ? (
          <div className="py-40 text-center space-y-10 bg-white/5 rounded-[4rem] border border-white/5">
            <AlertCircle className="mx-auto text-red-500" size={64} />
            <div className="space-y-2">
               <h3 className="text-3xl font-black italic uppercase tracking-tighter text-red-500">{error}</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">The diagnostic engine encountered a sync error.</p>
            </div>
            <Button onClick={() => router.push('/ai-scanner')} className="px-12 h-16 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Re-Initiate Scan</Button>
          </div>
        ) : analysisData ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-start"
          >
            {/* LEFT: RESULTS VISUALIZATION */}
            <div className="space-y-20">
              <SkinAnalysisResults data={analysisData} />
              
              {/* THE INSIGHT PLATE */}
              <div className="bg-white dark:bg-white/5 p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-12">
                 <div className="flex items-center gap-4">
                    <Fingerprint className="text-[#4DB6AC]" size={24} />
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Clinical Summary</h3>
                 </div>
                 <p className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
                    "{analysisData.finding || "Analysis reveals a stable dermal landscape with optimal hydration patterns."}"
                 </p>
                 <div className="flex items-center gap-4 pt-10 border-t border-white/10">
                    <Info className="text-[#E1784F]" size={18} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-relaxed">
                       AI diagnostics are for educational support. Verified clinical paths require a specialist's biopsy.
                    </p>
                 </div>
              </div>
            </div>

            {/* RIGHT: PERSONAL PROTOCOL (Questionnaire) */}
            <div className="space-y-12 sticky top-32">
               <div className="p-12 bg-black border border-white/10 rounded-[4rem] shadow-2xl space-y-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#4DB6AC]">
                       <Activity size={16} />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em]">Step 02</span>
                    </div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Personal <br /> <span className="text-[#4DB6AC]">Protocol</span></h3>
                  </div>
                  <p className="text-[11px] font-medium opacity-40 uppercase tracking-widest leading-relaxed">
                    Adjust your analysis with lifestyle context to generate a high-precision care regimen.
                  </p>
                  <div className="pt-6 border-t border-white/10">
                     <Questionnaire />
                  </div>
               </div>

               <div className="p-8 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-[3rem] flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#4DB6AC] rounded-3xl flex items-center justify-center text-black shrink-0 shadow-2xl">
                     <CheckCircle size={28} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC]">Record Archived</p>
                     <p className="text-[11px] font-bold text-white/60">
                       Access this report in your <Link href="/dashboard" className="text-white underline decoration-[#4DB6AC] underline-offset-4">Clinical History</Link>.
                     </p>
                  </div>
               </div>

               {/* QUICK ACTIONS */}
               <div className="grid gap-4">
                  <Button onClick={() => router.push('/ai-scanner')} className="h-20 bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all">
                    Initiate New Scan
                  </Button>
                  <Button onClick={() => router.push('/marketplace')} variant="outline" className="h-20 bg-transparent border-white/10 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:border-[#4DB6AC]">
                    Shop Safe Care <ArrowRight size={14} className="ml-2" />
                  </Button>
               </div>
            </div>
          </motion.div>
        ) : null}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <main className="min-h-[100svh] bg-[#050505] text-white p-6 lg:p-16 relative overflow-x-hidden">
      {/* --- PREMIUM AMBIANCE --- */}
      <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(circle_at_70%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <Suspense fallback={
         <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-16 h-16 text-[#E1784F] animate-spin" strokeWidth={3} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-[#E1784F]">Syncing Neural Data</p>
         </div>
      }>
        <ResultsContent />
      </Suspense>
    </main>
  )
}