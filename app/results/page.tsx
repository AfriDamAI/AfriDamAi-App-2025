"use client"

import { useState, useEffect } from "react"
import SkinAnalysisResults from "@/components/skin-analyzer-results"
import Questionnaire from "@/components/questionnaire"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ChevronLeft, CheckCircle, ArrowRight, AlertCircle } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Get the record ID from the URL (sent by the UnifiedScanner)
  const scanId = searchParams.get('id')

  useEffect(() => {
    const fetchRealAnalysis = async () => {
      // If there's no ID, we can't show real results
      if (!scanId) {
        setError("No active scan record found. Please perform a new scan.")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        // 🚀 OGA FIX: Fetch the actual record from your NestJS Backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/analyzer/${scanId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        })

        if (!response.ok) throw new Error("Could not retrieve clinical data")

        const data = await response.json()
        
        // Map the backend data to what the UI expects
        setAnalysisData({
          overallHealth: data.healthScore || 85, // Fallback if not in DB
          finding: data.description,
          predictions: data.predictions,
          status: data.status,
          imageUrl: data.imageUrl
        })
      } catch (err: any) {
        console.error("Fetch Error:", err)
        setError("Failed to synchronize with AI Node.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRealAnalysis()
  }, [scanId])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#1C1A19] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
             <Loader2 className="w-16 h-16 text-[#E1784F] animate-spin mx-auto" />
             <div className="absolute inset-0 bg-[#E1784F]/20 blur-2xl rounded-full animate-pulse" />
          </div>
          <p className="text-[#F7F3EE] font-black uppercase tracking-[0.4em] text-xs">
            Decoding Neural Scan...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#1C1A19] text-[#F7F3EE] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.3em] mb-4 hover:brightness-110"
            >
              <ChevronLeft size={14} /> Back to Portal
            </button>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              Clinical <span className="text-[#E1784F]">Report</span>
            </h1>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
             <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1 text-right">Score</p>
                <p className="text-3xl font-black text-[#4DB6AC]">{analysisData?.overallHealth}%</p>
             </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-20 bg-red-500/5 rounded-[3rem] border border-red-500/10 space-y-6">
            <AlertCircle className="mx-auto text-red-500" size={48} />
            <p className="text-red-400 font-bold italic">{error}</p>
            <Button onClick={() => router.push('/ai-scanner')} className="bg-[#E1784F]">Try Again</Button>
          </div>
        ) : analysisData ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Real Data plugged into the Results Component */}
            <SkinAnalysisResults data={analysisData} />
            
            <div className="bg-[#151312] border border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-2xl">
               <div className="mb-10">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Personal <span className="text-[#4DB6AC]">Protocol</span></h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/20">Refine your results with local context</p>
               </div>
               <Questionnaire />
            </div>

            <div className="p-8 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-[2.5rem] flex items-center gap-6">
                <div className="w-12 h-12 bg-[#4DB6AC] rounded-full flex items-center justify-center text-black">
                   <CheckCircle size={24} />
                </div>
                <p className="text-sm font-bold text-[#F7F3EE] leading-relaxed">
                  This report is now permanent. Access it anytime in your{" "}
                  <Link href="/dashboard" className="text-[#4DB6AC] underline decoration-2 underline-offset-4">
                    Clinical History
                  </Link>
                </p>
            </div>

            {/* Quick Navigation Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10">
              <Button 
                onClick={() => router.push('/ai-scanner')}
                className="h-20 bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl"
              >
                New Skin Scan
              </Button>
              <Button 
                onClick={() => router.push('/ai-checker')}
                variant="outline"
                className="h-20 bg-transparent border-white/10 hover:bg-white/5 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px]"
              >
                Check Ingredients
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="h-20 bg-transparent border-white/10 hover:bg-white/5 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px]"
              >
                User Portal
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}