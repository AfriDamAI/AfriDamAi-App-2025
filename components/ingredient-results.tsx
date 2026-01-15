"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Zap,
  Droplets,
  Skull
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
}

export default function IngredientResults({ data }: IngredientResultsProps) {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🛡️ CLINICAL SAFETY SCORE */}
      <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-3xl rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <ShieldCheck size={140} />
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Safety Index</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Neural Formulation Audit</p>
          </div>
          <div className={`text-6xl font-black italic ${data.safetyScore > 70 ? 'text-[#4DB6AC]' : 'text-red-500'}`}>
            {data.safetyScore}%
          </div>
        </div>
        <Progress value={data.safetyScore} className="h-2 bg-white/5" />
      </Card>

      {/* ⚠️ CRITICAL ALERTS (Allergens & Irritants Combined) */}
      {(data.allergens?.length || 0) > 0 && (
        <Card className="p-6 border-red-500/20 bg-red-500/5 rounded-[2rem]">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} /> Flagged Components
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.allergens?.map((item, index) => (
              <span key={index} className="px-4 py-2 bg-red-500/10 rounded-xl text-[10px] font-black uppercase text-red-400 border border-red-500/20">
                {item}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* 🧪 INGREDIENT BREAKDOWN */}
      <div className="space-y-4">
        <h3 className="text-lg font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          <Droplets className="text-[#E1784F]" size={20} /> Formula Breakdown
        </h3>
        <div className="grid gap-3">
          {data.ingredients?.map((ingredient, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 bg-white/5 border-white/10 hover:bg-white/10 transition-all rounded-2xl group">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#4DB6AC] transition-colors">
                        {ingredient.name}
                      </h4>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getSafetyStyles(ingredient.safety)}`}>
                        {getSafetyIcon(ingredient.safety)} {ingredient.safety}
                      </span>
                    </div>
                    {ingredient.description && (
                      <p className="text-[11px] text-white/30 font-medium leading-relaxed max-w-xl">
                        {ingredient.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🧬 SKIN TYPE COMPATIBILITY */}
      {data.skinTypeCompatibility && (
        <div className="space-y-4">
          <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Phenotype Match</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(data.skinTypeCompatibility).map(([skinType, compatibility]) => (
              <Card key={skinType} className="p-4 bg-white/5 border-white/10 rounded-2xl text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">{skinType}</p>
                <p className={`text-xs font-black uppercase italic ${
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

      {/* 💡 CLINICAL RECOMMENDATIONS */}
      <Card className="p-8 bg-[#E1784F] text-white rounded-[3rem] shadow-2xl shadow-[#E1784F]/20 relative overflow-hidden">
        <Zap className="absolute -right-4 -bottom-4 text-white/10" size={150} />
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 relative z-10">Application Protocol</h3>
        <ul className="space-y-4 relative z-10">
          {(data.recommendations || ["Perform a 24-hour patch test before full application."]).map((rec, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center shrink-0 text-[10px] font-black">
                {index + 1}
              </div>
              <span className="text-xs font-bold leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 🛡️ DISCLAIMER */}
      <div className="p-6 border border-white/5 rounded-2xl flex items-start gap-4 opacity-30">
        <ShieldCheck size={20} className="shrink-0" />
        <p className="text-[9px] font-bold leading-relaxed uppercase tracking-[0.1em]">
          AfriDam AI provides data-driven insights. This is not medical advice. Consult a dermatologist for persistent skin reactions.
        </p>
      </div>
    </div>
  )
}