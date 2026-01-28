"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Sparkles, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

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
                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F] shrink-0">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-wide">Unlimited AI Scans</h4>
                                    <p className="text-xs opacity-60 mt-1">Get unlimited access to our advanced skin analysis AI.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F] shrink-0">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-wide">Priority Specialist Review</h4>
                                    <p className="text-xs opacity-60 mt-1">Skip the queue and get your results reviewed faster.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F] shrink-0">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-wide">Advanced Analytics</h4>
                                    <p className="text-xs opacity-60 mt-1">Track your skin's progress with detailed charts and history.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/plans')}
                            className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-[#c9623c]"
                        >
                            View All Plans <ArrowRight size={14} />
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    )
}
