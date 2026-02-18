"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Sparkles, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { PricingList } from "./pricing-list"

interface SubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-[250] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#0A0A0A] rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/10"
        >
          {/* Header Section */}
          <div className="relative h-64 bg-[#E1784F] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Sparkle Icon */}
            <div className="absolute -right-8 -bottom-8 text-white/20 transform rotate-12 scale-150">
              <Sparkles size={200} />
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/20 transition-all z-20 shadow-lg"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 text-center space-y-4">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Upgrade Your Experience
              </span>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
                Unlock <br /> Premium
              </h2>
            </div>
          </div>

          {/* Features Section */}
          <div className="p-10 md:p-12 space-y-8 bg-black">
            <div className="space-y-8">
              <FeatureItem 
                title="Unlimited AI Scans" 
                description="Get unlimited access to our advanced skin analysis AI." 
              />
              <FeatureItem 
                title="Priority Specialist Review" 
                description="Skip the queue and get your results reviewed faster." 
              />
              <FeatureItem 
                title="Advanced Analytics" 
                description="Track your skin's progress with detailed charts and history." 
              />
            </div>

            <button
              onClick={() => {
                onClose();
                router.push('/plans');
              }}
              className="w-full py-6 mt-4 bg-[#E1784F] text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              View All Plans <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function FeatureItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="w-10 h-10 rounded-full bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F] shrink-0 shadow-inner group-hover:scale-110 transition-transform">
        <Check size={16} strokeWidth={4} />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-black uppercase tracking-tight text-white leading-none">{title}</h4>
        <p className="text-[11px] font-bold opacity-40 uppercase tracking-tight leading-relaxed max-w-[280px]">
          {description}
        </p>
      </div>
    </div>
  )
}
