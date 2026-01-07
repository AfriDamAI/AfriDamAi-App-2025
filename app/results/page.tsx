"use client"

import { useState, useEffect } from "react"
import SkinAnalysisResults from "@/components/skin-analyzer-results"
import Questionnaire from "@/components/questionnaire"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { addToHistory } from "@/lib/history-manager"
import { useRouter } from "next/navigation"
import { Loader2, ChevronLeft, CheckCircle, ArrowRight } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [recordId, setRecordId] = useState<string | null>(null)

  useEffect(() => {
    // Simulate AI clinical analysis processing
    const timer = setTimeout(() => {
      const mockData = {
        overallHealth: 78,
        conditions: [
          {
            name: "Mild Acne",
            severity: "mild",
            confidence: 92,
            description: "Small comedones detected on forehead and chin",
            recommendation: "Use gentle exfoliants 2-3 times weekly",
          },
          {
            name: "Dryness",
            severity: "moderate",
            confidence: 85,
            description: "Dry patches detected on cheeks",
            recommendation: "Increase hydration with moisturizers containing hyaluronic acid",
          },
          {
            name: "Uneven Tone",
            severity: "mild",
            confidence: 78,
            description: "Minor pigmentation variations",
            recommendation: "Use vitamin C serum for brightening",
          },
        ],
        recommendations: [
          "Use a gentle cleanser twice daily",
          "Apply SPF 30+ sunscreen daily",
          "Stay hydrated with 8+ glasses of water",
          "Consider a dermatologist consultation for persistent acne",
        ],
        productSuggestions: [
          { name: "Gentle Cleanser", category: "Cleanser", reason: "Non-irritating for acne-prone skin" },
          { name: "Hyaluronic Acid Serum", category: "Serum", reason: "Hydration for dry patches" },
          { name: "Vitamin C Serum", category: "Serum", reason: "Brightening for uneven tone" },
          { name: "Broad Spectrum SPF 30", category: "Sunscreen", reason: "Daily UV protection" },
        ],
      }
      setAnalysisData(mockData)

      const record = addToHistory({
        type: "skin",
        results: {
          conditions: mockData.conditions,
        },
      })
      if (record) {
        setRecordId(record.id)
      }

      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#1C1A19] flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 text-[#E1784F] animate-spin mx-auto" />
          <p className="text-[#F7F3EE] font-black uppercase tracking-[0.4em] text-xs">
            Synthesizing Dermal Data...
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
              Analysis <span className="text-[#E1784F]">Report</span>
            </h1>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Health Score</p>
             <p className="text-3xl font-black text-[#4DB6AC]">{analysisData?.overallHealth}%</p>
          </div>
        </div>

        {analysisData ? (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Main Components */}
            <SkinAnalysisResults data={analysisData} />
            
            <div className="bg-[#151312] border border-white/5 rounded-[3rem] p-8 md:p-12">
               <Questionnaire />
            </div>

            {/* Save Notification */}
            {recordId && (
              <div className="p-6 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-3xl flex items-center gap-4">
                <CheckCircle className="text-[#4DB6AC]" />
                <p className="text-sm font-bold text-[#F7F3EE]">
                  This report has been archived in your{" "}
                  <Link href="/history" className="text-[#4DB6AC] underline decoration-2 underline-offset-4">
                    Clinical History
                  </Link>
                </p>
              </div>
            )}

            {/* Quick Navigation Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10">
              <Button 
                onClick={() => router.push('/ai-scanner')}
                className="h-20 bg-[#E1784F] hover:brightness-110 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs"
              >
                New Skin Scan
              </Button>
              <Button 
                onClick={() => router.push('/ai-checker')}
                variant="outline"
                className="h-20 bg-transparent border-white/10 hover:bg-white/5 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs"
              >
                Check Ingredients
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="h-20 bg-transparent border-white/10 hover:bg-white/5 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs"
              >
                User Portal
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <p className="text-gray-500 font-bold italic">No data available for synthesis.</p>
          </div>
        )}
      </div>
    </main>
  )
}