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
  RefreshCcw
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
    ingredients?: Ingredient[]
    allergens?: string[]
    irritants?: string[]
    recommendations?: string[]
    skinTypeCompatibility?: Record<string, string>
  }
  onRetry?: () => void
}

export default function IngredientResults({ data, onRetry }: IngredientResultsProps) {
  const getSafetyStyles = (safety: string) => {
    switch (safety) {
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
    switch (safety) {
      case "safe": return <CheckCircle2 size={14} />
      case "caution": return <AlertTriangle size={14} />
      case "avoid": return <Skull size={14} />
      default: return <Info size={14} />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* 🛡️ 1. CLINICAL SAFETY SCORE */}
      <Card className="p-8 bg-card border-border backdrop-blur-3xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <ShieldCheck size={140} />
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Safety Index</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Neural Formulation Audit</p>
          </div>
          {/* 🛡️ OGA FIX: Threshold adjusted to 80% for clinical responsibility */}
          <div className={`text-6xl font-black italic ${data.safetyScore >= 80 ? 'text-[#4DB6AC]' : 'text-red-500'}`}>
            {data.safetyScore}%
          </div>
        </div>
        <Progress value={data.safetyScore} className="h-3 bg-muted" />
      </Card>

      {/* ⚠️ 2. CRITICAL ALERTS */}
      {(data.allergens?.length || 0) > 0 && (
        <Card className="p-8 border-red-500/20 bg-red-500/5 rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-2">
            <AlertTriangle size={16} /> Flagged Components
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.allergens?.map((item, index) => (
              <span key={index} className="px-5 py-2.5 bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-500/20">
                {item}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* 🧪 3. INGREDIENT BREAKDOWN */}
      <div className="space-y-6">
        <h3 className="text-lg font-black italic uppercase tracking-tighter text-foreground flex items-center gap-2">
          <Droplets className="text-[#E1784F]" size={20} /> Formula Breakdown
        </h3>
        
        <div className="grid gap-4">
          {data.ingredients && data.ingredients.length > 0 ? (
            data.ingredients.map((ingredient, index) => (
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
            /* 🛡️ OGA FIX: Empty State Protection */
            <div className="p-12 text-center border-2 border-dashed border-border rounded-[2.5rem] space-y-4">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Analysis yielded no text detections</p>
               <button onClick={onRetry} className="inline-flex items-center gap-2 text-[#E1784F] text-[9px] font-black uppercase tracking-widest">
                 <RefreshCcw size={14} /> Retake Sample
               </button>
            </div>
          )}
        </div>
      </div>

      {/* 🧬 4. PHENOTYPE MATCH */}
      {data.skinTypeCompatibility && (
        <div className="space-y-4">
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-foreground">Phenotype Match</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(data.skinTypeCompatibility).map(([skinType, compatibility]) => (
              <Card key={skinType} className="p-5 bg-card border-border rounded-2xl text-center">
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

      {/* ⚡ 5. APPLICATION PROTOCOL */}
      <Card className="p-10 bg-[#E1784F] text-white rounded-[3.5rem] shadow-2xl shadow-[#E1784F]/20 relative overflow-hidden">
        <Zap className="absolute -right-4 -bottom-4 text-white/10" size={180} />
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 relative z-10">Application Protocol</h3>
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

      {/* 🛡️ 6. CLINICAL DISCLAIMER */}
      <div className="p-8 bg-muted/30 border border-border rounded-[2rem] flex items-start gap-5 opacity-40">
        <ShieldCheck size={24} className="text-muted-foreground shrink-0" />
        <p className="text-[9px] font-black leading-relaxed uppercase tracking-[0.1em]">
          AfriDam AI provides data-driven clinical insights. This is not a substitute for professional medical advice. If you experience irritation, discontinue use and consult our Expert Hub.
        </p>
      </div>
    </div>
  )
}