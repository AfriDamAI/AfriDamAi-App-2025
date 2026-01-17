"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Loader2, 
  Zap, 
  AlertCircle, 
  ShieldCheck, 
  ClipboardList, 
  RotateCcw,
  Baby
} from "lucide-react"
import IngredientResults from "@/components/ingredient-results"
import apiClient from "@/lib/api-client"

interface IngredientAnalyzerProps {
  onAnalysisComplete: (results: any) => void
}

export default function IngredientAnalyzer({ onAnalysisComplete }: IngredientAnalyzerProps) {
  const [ingredientText, setIngredientText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!ingredientText.trim()) return;

    setIsAnalyzing(true)
    setError(null)

    try {
      /** * 🚀 OGA FIX: SYNCED WITH TOBI'S AI MODULE
       * Updated path to /ai/analyze-ingredients to match the 8080 Backend push.
       */
      const response = await apiClient.post('/ai/analyze-ingredients', {
        ingredients: ingredientText, // Tobi's new AI module expects 'ingredients' key
        source: 'manual_entry'
      });

      const data = response.data;
      
      // Handle the unwrapped resultData from our interceptor logic
      const payload = data.resultData || data;
      
      // 🛡️ RE-ENFORCED: Aesthetic & Family Data Mapping
      const aestheticResults = {
        productName: "Aesthetic Safety Audit",
        totalIngredients: ingredientText.split(",").length,
        safetyScore: payload.safetyScore || payload.score || 100,
        ingredients: payload.ingredients || [],
        recommendations: payload.recommendations || ["Formula appears balanced for melanin-rich skin."],
        riskLevel: payload.riskLevel || payload.safetyRating || "SAFE",
        isChildSafe: payload.isChildSafe ?? (payload.safetyScore >= 85),
        skinTypeCompatibility: payload.skinTypeCompatibility || payload.compatibility || {
          "Oily": "Good",
          "Dry": "Excellent",
          "Balanced": "Excellent",
          "Sensitive": "Caution"
        }
      };

      setResults(aestheticResults)
      onAnalysisComplete(aestheticResults)
    } catch (err: any) {
      console.error("Aesthetic AI Analysis Failed:", err);
      setError("Aesthetic Node Sync Failed. Check your connection to the care hub.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setIngredientText("")
    setResults(null)
    setError(null)
    onAnalysisComplete(null)
  }

  if (results) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <IngredientResults data={results} onRetry={handleReset} />
        <Button 
          onClick={handleReset} 
          className="w-full h-16 bg-muted/50 border border-border text-muted-foreground rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:text-white transition-all active:scale-95"
        >
          <RotateCcw className="mr-2" size={16} /> Analyze New Formula
        </Button>
      </div>
    )
  }

  return (
    <Card className="p-1 bg-card border-border rounded-[2.8rem] overflow-hidden shadow-2xl relative">
      <div className="p-8 md:p-12 space-y-10 text-left relative z-10">
        <header className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#E1784F]/10 rounded-2xl flex items-center justify-center border border-[#E1784F]/20">
            <ClipboardList className="text-[#E1784F]" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground leading-none">Manual <span className="text-[#E1784F]">Analysis</span></h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Neural INCI Safety Check</p>
          </div>
        </header>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Paste Ingredients</label>
            <div className="flex items-center gap-2">
               <Baby size={12} className="text-[#4DB6AC]" />
               <span className="text-[9px] font-black text-[#4DB6AC] uppercase tracking-widest">Child-Safe Protocol</span>
            </div>
          </div>
          <textarea
            value={ingredientText}
            onChange={(e) => setIngredientText(e.target.value)}
            placeholder="Aqua, Glycerin, Butyrospermum Parkii..."
            className="w-full h-56 p-8 bg-muted/30 border border-border rounded-[2rem] text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-[#E1784F]/20 transition-all outline-none text-sm leading-relaxed italic font-medium resize-none"
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500">
            <AlertCircle size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
          </motion.div>
        )}

        <div className="p-6 bg-[#4DB6AC]/5 border border-[#4DB6AC]/10 rounded-[1.8rem] flex items-start gap-4">
          <ShieldCheck className="text-[#4DB6AC] shrink-0 mt-1" size={20} />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-[#4DB6AC] tracking-widest">Melanin Safety</p>
            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase tracking-tight">
              We cross-reference every component against African skin safety profiles and pediatric compatibility.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !ingredientText.trim()}
            className="flex-1 h-20 bg-[#E1784F] hover:bg-[#ff8e5e] text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl transition-all disabled:opacity-30 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-3" size={20} /> Analyzing...
              </>
            ) : (
              <>Check Formula <Zap className="ml-3 fill-current" size={16} /></>
            )}
          </Button>
          <Button 
            onClick={handleReset} 
            className="h-20 bg-muted/50 text-muted-foreground border border-border rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest px-10 hover:text-foreground transition-all"
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/5 blur-[100px] rounded-full pointer-events-none" />
    </Card>
  )
}