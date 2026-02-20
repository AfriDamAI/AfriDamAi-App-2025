"use client"

import { useState, useEffect, Suspense } from "react"
import SkinAnalysisResults from "@/components/skin-analyzer-results"
import Questionnaire from "@/components/questionnaire"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Loader2, ChevronLeft, ArrowRight,
  AlertCircle, ShieldCheck, Fingerprint, Activity,
  Zap, Info, Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/providers/auth-provider"
import { hasFeatureAccess, SubscriptionTier } from "@/app/tier-config/route"
import { SubscriptionModal } from "@/components/subscription-modal"

/**
 * 🛡️ AFRIDAM NEURAL DIAGNOSTICS: REPORT (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Mobile-First Report Sync & Zero-Flicker Loading.
 */

function ResultsContent() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  const scanId = searchParams.get('id')

  useEffect(() => {
    const fetchRealAnalysis = async () => {
      // 🚀 HANDSHAKE: Checking local storage first for instant mobile feel
      const localData = localStorage.getItem("last_scan");

      if (localData && !scanId) {
        setAnalysisData(JSON.parse(localData));
        setIsLoading(false);
        return;
      }

      if (!scanId) {
        setError("Your skin diary record is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true)
        // 🌍 API SYNC: Fetching from NestJS history endpoint
        const response = await apiClient.get(`/analyzer/history/${scanId}`)
        const data = response.data;

        setAnalysisData({
          overallHealth: data.healthScore || data.overallHealth || 85,
          finding: data.description || data.finding || "Analysis complete.",
          predictions: data.predictions || [],
          status: data.status || "Completed",
          imageUrl: data.imageUrl
        })
      } catch (err: any) {
        setError("Our system is taking a moment to sync. Please try again.");
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
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] md:rounded-[3.5rem] border-t-4 border-[#E1784F] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-[#E1784F] animate-pulse" size={28} fill="currentColor" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-[#E1784F] font-black uppercase tracking-[0.5em] text-[10px]">Syncing Diary</p>
          <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[8px]">Reviewing Patterns</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto space-y-12 md:space-y-32 pb-20 text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12">
        <div className="space-y-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="group flex items-center gap-3 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back home
          </button>
          <h1 className="text-5xl md:text-[9rem] font-black italic tracking-tighter uppercase leading-[0.8] text-white">
            The <br /> <span className="text-[#E1784F]">Report</span>
          </h1>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <div className="text-left md:text-right">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Glow Score</p>
            <div className="flex items-end gap-2">
              <p className="text-6xl font-black italic tracking-tighter text-[#4DB6AC] leading-none">{analysisData?.overallHealth}</p>
              <span className="text-xl font-black opacity-10 mb-1">/100</span>
            </div>
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-2xl">
            <ShieldCheck className="text-[#E1784F]" size={28} />
          </div>
        </div>
      </header>

      {error ? (
        <div className="py-24 text-center space-y-8 bg-white/5 rounded-[3rem] border border-white/5 px-6">
          <AlertCircle className="mx-auto text-red-500/50" size={40} />
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-red-500">{error}</h3>
          <Button onClick={() => router.push('/ai-scanner')} className="px-10 h-16 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">Retry Scan</Button>
        </div>
      ) : analysisData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-16 items-start"
        >
          <div className="space-y-12">
            <SkinAnalysisResults data={analysisData} />
            <div className="bg-white/5 p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl space-y-8">
              <div className="flex items-center gap-3">
                <Fingerprint className="text-[#4DB6AC]" size={20} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4DB6AC]">What we found</h3>
              </div>
              <p className="text-xl md:text-4xl font-black italic uppercase tracking-tighter leading-tight text-white">
                "{analysisData.finding}"
              </p>
              <div className="flex items-start gap-3 pt-6 border-t border-white/5">
                <span className="text-[#E1784F] shrink-0"><Info size={16} /></span>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 leading-relaxed">
                  AI results are for guidance only. Talk to our specialists for expert care.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#4DB6AC]">
                  <Activity size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Step 02</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">Your Next <span className="text-[#4DB6AC]">Step</span></h3>
              </div>
              <div className="pt-4 border-t border-white/5">
                <Questionnaire />
              </div>
            </div>

            <div className="grid gap-4">
              <Button onClick={() => router.push('/ai-scanner')} className="h-14 md:h-16 bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl transition-all">
                Start New Scan
              </Button>
              <Button onClick={() => router.push('/marketplace')} variant="outline" className="h-14 md:h-16 bg-transparent border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:border-[#4DB6AC] transition-all">
                View Care Plan <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}

      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />
    </div>
  )
}

export default function ResultsPage() {
  return (
    <main className="min-h-[100svh] bg-[#050505] text-white p-6 lg:p-16 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(circle_at_70%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-12 h-12 text-[#E1784F] animate-spin" strokeWidth={3} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-[#E1784F]">Syncing Neural Data</p>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </main>
  )
}

export const dynamic = "force-dynamic";