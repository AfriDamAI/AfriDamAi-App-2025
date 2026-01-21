/**
 * 🛡️ AFRIDAM MOLECULAR AUDIT: RESULTS (Rule 7 Sync)
 * Version: 2026.1.4 (Formula Purity Alignment)
 * Focus: High-Precision Ingredient Parsing & Pediatric Safety.
 */

"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Zap,
  Droplets,
  Skull,
  RefreshCcw,
  Baby,
  Sparkles
} from "lucide-react"

interface Ingredient {
  name: string
  type?: string
  safety: "safe" | "caution" | "avoid"
  description?: string
  concerns?: string[]
}

interface IngredientResultsProps {
  data: {
    productName?: string
    totalIngredients?: number
    safetyScore: number
    isChildSafe?: boolean 
    ingredients?: Ingredient[]
    allergens?: string[]
    irritants?: string[]
    recommendations?: string[]
    skinTypeCompatibility?: Record<string, string>
  }
  onRetry?: () => void
}

export default function IngredientResults({ data, onRetry }: IngredientResultsProps) {
  
  /**
   * 🚀 THE MOLECULAR HANDSHAKE (Rule 7)
   * We ensure defaults are set if the AI is still "Thinking" or 
   * if the backend payload is partially empty.
   */
  const score = data.safetyScore ?? 85;
  const ingredientList = data.ingredients || [];
  const babySafe = data.isChildSafe ?? false;

  const getSafetyStyles = (safety: string) => {
    switch (safety.toLowerCase()) {
      case "safe":
        return "bg-[#4DB6AC]/10 text-[#4DB6AC] border-[#4DB6AC]/20"
      case "caution":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "avoid":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-white/5 text-white/40 border-white/10"
    }
  }

  const getSafetyIcon = (safety: string) => {
    switch (safety.toLowerCase()) {
      case "safe": return <CheckCircle2 size={14} />
      case "caution": return <AlertTriangle size={14} />
      case "avoid": return <Skull size={14} />
      default: return <Info size={14} />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* 👶 1. PEDIATRIC SAFETY BADGE */}
      {babySafe && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-[#4DB6AC]/10 border-2 border-[#4DB6AC]/30 rounded-[2rem] flex items-center justify-between shadow-lg shadow-[#4DB6AC]/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#4DB6AC] rounded-full flex items-center justify-center text-white shadow-inner">
              <Baby size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4DB6AC]">Baby-Safe Verified</p>
              <p className="text-[9px] font-bold text-[#4DB6AC]/70 uppercase tracking-widest">Molecularly Safe for infants</p>
            </div>
          </div>
          <Sparkles className="text-[#4DB6AC] opacity-40" size={20} />
        </motion.div>
      )}

      {/* 🛡️ 2. AESTHETIC SAFETY SCORE */}
      <Card className="p-8 bg-card border-border backdrop-blur-3xl rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <ShieldCheck size={140} />
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Aesthetic Index</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]">Formula Purity Audit</p>
          </div>
          <div className={`text-6xl font-black italic ${score >= 75 ? 'text-[#4DB6AC]' : 'text-red-500'}`}>
            {score}%
          </div>
        </div>
        <Progress value={score} className="h-3 bg-muted" />
      </Card>

      {/* ⚠️ 3. SENSITIVITY ALERTS */}
      {((data.allergens?.length || 0) > 0 || (data.irritants?.length || 0) > 0) && (
        <Card className="p-8 border-red-500/20 bg-red-500/5 rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-2">
            <AlertTriangle size={16} /> Sensitivity Triggers
          </h3>
          <div className="flex flex-wrap gap-3">
            {[...(data.allergens || []), ...(data.irritants || [])].map((item, index) => (
              <span key={index} className="px-5 py-2.5 bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-500/20">
                {item}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* 🧪 4. FORMULA BREAKDOWN */}
      <div className="space-y-6">
        <h3 className="text-lg font-black italic uppercase tracking-tighter text-foreground flex items-center gap-2">
          <Droplets className="text-[#E1784F]" size={20} /> INCI Profile
        </h3>
        
        <div className="grid gap-4">
          {ingredientList.length > 0 ? (
            ingredientList.map((ingredient, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 bg-card border-border hover:border-[#E1784F]/30 transition-all rounded-[1.8rem] group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-[#4DB6AC] transition-colors">
                          {ingredient.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getSafetyStyles(ingredient.safety)}`}>
                          {getSafetyIcon(ingredient.safety)} {ingredient.safety}
                        </span>
                      </div>
                      {ingredient.description && (
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed max-w-xl italic">
                          "{ingredient.description}"
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-border rounded-[2.5rem] space-y-4 opacity-50">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Neural scan yielding no text detections</p>
               <button onClick={onRetry} className="inline-flex items-center gap-2 text-[#E1784F] text-[9px] font-black uppercase tracking-widest hover:underline">
                 <RefreshCcw size={14} /> Re-Sample Formula
               </button>
            </div>
          )}
        </div>
      </div>

      {/* 🧬 5. MELANIN COMPATIBILITY */}
      {data.skinTypeCompatibility && (
        <div className="space-y-4">
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-foreground">Melanin-Rich Fit</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(data.skinTypeCompatibility).map(([skinType, compatibility]) => (
              <Card key={skinType} className="p-5 bg-card border-border rounded-2xl text-center hover:border-[#4DB6AC]/50 transition-colors">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">{skinType}</p>
                <p className={`text-[10px] font-black uppercase italic ${
                    compatibility === "Excellent" || compatibility === "Good" ? "text-[#4DB6AC]" : "text-yellow-500"
                  }`}
                >
                  {compatibility}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ⚡ 6. CARE PROTOCOL */}
      <Card className="p-10 bg-[#E1784F] text-white rounded-[3.5rem] shadow-2xl shadow-[#E1784F]/20 relative overflow-hidden group">
        <Zap className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-700" size={180} />
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 relative z-10">Care Protocol</h3>
        <ul className="space-y-6 relative z-10">
          {(data.recommendations || ["Perform a 24-hour patch test before full application."]).map((rec, index) => (
            <li key={index} className="flex items-start gap-5">
              <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center shrink-0 text-xs font-black">
                {index + 1}
              </div>
              <span className="text-xs font-bold leading-relaxed uppercase tracking-tight">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 🛡️ 7. AESTHETIC DISCLAIMER */}
      <div className="p-8 bg-muted/30 border border-border rounded-[2rem] flex items-start gap-5 opacity-60">
        <Info size={24} className="text-[#E1784F] shrink-0" />
        <p className="text-[9px] font-black leading-relaxed uppercase tracking-[0.1em]">
          Disclaimer: Analysis is based on available INCI data and is not a clinical medical diagnosis. If irritation occurs, discontinue use and consult our Expert Hub or a professional.
        </p>
      </div>
    </div>
  )
}