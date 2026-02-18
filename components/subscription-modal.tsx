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
            <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6 z-[200] overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg bg-white dark:bg-[#0A0A0A] rounded-[3rem] overflow-hidden relative shadow-2xl border border-black/5 dark:border-white/10"
                >
                    {/* Header */}
                    <div className="relative h-48 bg-[#E1784F] overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="absolute -bottom-10 -right-10 text-white opacity-20 transform rotate-12">
                            <Sparkles size={180} />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/20 transition-all z-10"
                        >
                            <X size={18} />
                        </button>

                        <div className="relative z-10 text-center text-white px-8">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                Upgrade Your Experience
                            </span>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                                Unlock <br />Premium
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 space-y-10 max-h-[70vh] overflow-y-auto no-scrollbar">
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Unleash Full <span className="text-[#E1784F]">Potential</span></h3>
                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Select a plan to activate instant access to premium tools.</p>
                        </div>
                        
                        <PricingList />
                    </div>

                    <div className="p-8 bg-gray-50 dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Secure checkout via AfriDam Pay</p>
                        <div className="flex gap-2">
                             <div className="w-8 h-4 bg-black/5 dark:bg-white/5 rounded" />
                             <div className="w-8 h-4 bg-black/5 dark:bg-white/5 rounded" />
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    )
}
