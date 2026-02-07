"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
    CheckCircle2, XCircle, Loader2,
    ArrowRight, LayoutDashboard, ShoppingBag,
    ShieldCheck, AlertCircle, Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import environment from "@/lib/environment"

/**
 * 🛡️ AFRIDAM CARE HUB: PAYMENT VERIFICATION PORTAL
 * Version: 2026.2.5
 * Focus: Unified Transaction Response Handling (Success/Failure)
 */

function PaymentSuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const reference = searchParams.get('reference') || searchParams.get('trxref')

    const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading')
    const [message, setMessage] = useState("Verifying your transaction...")
    const [transactionData, setTransactionData] = useState<any>(null)

    useEffect(() => {
        if (!reference) {
            setStatus('error')
            setMessage("No transaction reference found.")
            return
        }

        const verifyTransaction = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`${environment.backendUrl}/transactions/verify/${reference}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                })

                const result = await response.json()

                if (response.ok && result.status === 'SUCCESS') {
                    setStatus('success')
                    setMessage("Your transaction was successful!")
                    setTransactionData(result)
                } else {
                    setStatus('failed')
                    setMessage(result.message || "Transaction verification failed.")
                }
            } catch (err: any) {
                console.error("Verification error:", err)
                setStatus('error')
                setMessage("An error occurred while verifying your transaction.")
            }
        }

        verifyTransaction()
    }, [reference])

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="space-y-8 animate-pulse">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-white/10 rounded-[2.5rem] mx-auto flex items-center justify-center">
                            <Loader2 size={48} className="animate-spin text-[#4DB6AC]" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Verifying <br /> <span className="text-[#4DB6AC]">Payment</span></h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{message}</p>
                        </div>
                    </div>
                )

            case 'success':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-10"
                    >
                        <div className="relative inline-block">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                className="w-24 h-24 bg-[#4DB6AC] text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-[#4DB6AC]/40"
                            >
                                <CheckCircle2 size={48} strokeWidth={3} />
                            </motion.div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-4 -right-4 text-[#E1784F]"
                            >
                                <Sparkles size={32} />
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                                Payment <br /> <span className="text-[#4DB6AC]">Secured</span>
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] space-y-4 text-left">
                            <div className="flex justify-between items-center pb-4 border-b border-black/5 dark:border-white/5">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Reference</span>
                                <span className="text-[10px] font-mono font-bold text-[#E1784F]">{reference}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Status</span>
                                <span className="text-[10px] font-black uppercase text-[#4DB6AC]">Completed</span>
                            </div>
                            {transactionData?.amount && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Amount Paid</span>
                                    <span className="text-[10px] font-black">₦{transactionData.amount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full h-20 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
                            >
                                <LayoutDashboard size={18} /> Return to Hub
                            </button>
                        </div>
                    </motion.div>
                )

            case 'failed':
            case 'error':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-10"
                    >
                        <div className="w-24 h-24 bg-red-500 text-white rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-red-500/40">
                            <XCircle size={48} strokeWidth={3} />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                                Payment <br /> <span className="text-red-500">Unsuccessful</span>
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/plans')}
                                className="w-full h-20 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
                            >
                                <AlertCircle size={18} /> Try Again
                            </button>

                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full h-16 bg-transparent text-black dark:text-white border border-black/10 dark:border-white/10 rounded-2xl font-black uppercase text-[8px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                            >
                                <LayoutDashboard size={14} /> Back to Dashboard
                            </button>
                        </div>
                    </motion.div>
                )
        }
    }

    return (
        <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex items-center justify-center p-6 relative overflow-hidden text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4DB6AC]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>

                <div className="pt-12 flex flex-col items-center gap-3 opacity-20">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#4DB6AC]" />
                        <span className="text-[7px] font-black uppercase tracking-[0.5em]">Verified by AfriDam Secure</span>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
                <Loader2 className="w-12 h-12 animate-spin text-[#E1784F]" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    )
}
