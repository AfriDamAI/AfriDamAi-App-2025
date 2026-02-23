"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Scan, MessageSquare, History, User as UserIcon,
  Settings, Zap, Home, ShoppingBag, ArrowRight, Sparkles, Loader2, X, FlaskConical
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getScanHistory, initializePayment } from "@/lib/api-client"
import { usePaystackPayment } from "react-paystack"
import { SubscriptionModal } from "@/components/subscription-modal"

/**
 * 🛡️ AFRIDAM WELLNESS HUB (Rule 6 Precision Sync)
 * Version: 2026.01.26
 * Focus: Integrated Clinical Modal & Dashboard History Sync.
 */

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth() as any

  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  // 🛡️ NEW: State for the clinical report modal
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)

  const firstName = user?.firstName || user?.displayName?.split(' ')[0] || "User"
  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || user.firstName?.charAt(1) || ''}`.toUpperCase()
    : "A"

  // Check if user has a restricted plan (free tier or test test plan)
  const planName = user?.plan?.name?.toLowerCase() || ''
  const isRestrictedPlan = planName === 'free tier' || planName === 'test test plan' || planName === 'test plan'

  useEffect(() => {
    if (!authLoading && !user) router.push("/login")
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getScanHistory(user?.id || '')
        const data = response?.data || response || []
        setHistory(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Clinical Diary sync pending...")
      } finally {
        setLoadingHistory(false)
      }
    }
    if (user?.id) fetchHistory()
  }, [user?.id])

  // 💳 PAYSTACK HANDSHAKE
  const config = {
    reference: `AFR-${Date.now()}`,
    email: user?.email || "clinical@afridamai.com",
    amount: 15 * 100 * 1650,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_sample",
  }

  const initializePaystack = usePaystackPayment(config)

  const handleConsultation = async () => {
    try {
      await initializePayment({ plan: "INSTANT_CONSULTATION", amount: 15 })
      initializePaystack({
        onSuccess: (reference: any) => {
          router.push(`/specialist/chat?ref=${reference.reference}`)
        },
        onClose: () => console.log("Handshake Interrupted")
      })
    } catch (err) {
      console.error("Consultation routing failed")
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <Loader2 className="animate-spin text-[#E1784F]" size={32} />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col relative">
      <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="flex-1 pb-20 lg:pb-8 z-10">
        <header className="px-5 pt-8 pb-4 flex justify-between items-center text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#E1784F] flex items-center justify-center text-white font-black text-sm italic shadow-xl">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-black italic capitalize tracking-tighter leading-none">Hello, {firstName}</h2>
              <p className="text-[8px] font-black tracking-widest text-[#4DB6AC] mt-1">Ready for your skin check?</p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-5 space-y-8">
          {/* ⚡ URGENT HELP CARD */}
          <section className="relative overflow-hidden group rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-[#E1784F]/10 p-6">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2 px-2.5 py-0.5 bg-[#E1784F]/10 text-[#E1784F] rounded-full w-fit">
                  <Zap size={9} fill="currentColor" />
                  <span className="text-[7px] font-black tracking-[0.15em]">Priority Service</span>
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter leading-none">Specialist <br />Review</h3>
                <p className="text-[9px] font-bold opacity-50 tracking-tight max-w-[200px] leading-relaxed">
                  Verified specialist clinical feedback within 24 hours.
                </p>
              </div>
              <button onClick={() => router.push('/appointment')} className="w-full md:w-auto bg-[#E1784F] text-white px-8 py-4 rounded-xl font-black text-[9px] tracking-[0.15em] shadow-2xl active:scale-95 transition-all">
                Book for ₦15000
              </button>
            </div>
          </section>

          {/* ACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button onClick={() => router.push('/ai-scanner')} className="group relative h-48 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] p-6 flex flex-col justify-between items-start text-left overflow-hidden shadow-2xl">
              <div className="absolute right-[-15%] top-[-15%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Scan size={200} strokeWidth={1} />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#E1784F] flex items-center justify-center shadow-lg"><Scan size={22} className="text-white" /></div>
              <div>
                <h3 className="text-3xl font-black italic leading-none tracking-tighter">AI Skin<br />Analysis</h3>
                <p className="text-[8px] font-black tracking-[0.2em] mt-3 opacity-40 flex items-center gap-2">Initiate Scan <ArrowRight size={10} /></p>
              </div>
            </button>
            <button onClick={() => router.push("/ingredient-analyzer")} className="group relative h-48 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-between items-start text-left hover:border-[#E1784F]/30 transition-all shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center"><Sparkles size={22} /></div>
              <div>
                <h3 className="text-3xl font-black italic leading-none tracking-tighter">Ingredients<br />Analyzer</h3>
                <p className="text-[8px] font-black tracking-[0.2em] mt-3 opacity-40 flex items-center gap-2">Verify every chemical<ArrowRight size={10} /></p>
              </div>
            </button>
          </div>

          {/* CLINICAL DIARY SECTION */}
          <section className="space-y-5 text-left pb-6">
            <div className="flex items-center justify-between px-3">
              <h4 className="text-[9px] font-black tracking-[0.4em] opacity-30">Clinical Diary</h4>
              <button 
                onClick={() => !isRestrictedPlan && router.push('/history')} 
                disabled={isRestrictedPlan}
                className={`text-[8px] font-black tracking-widest ${isRestrictedPlan ? 'opacity-30 cursor-not-allowed' : 'text-[#4DB6AC] cursor-pointer'}`}
              >
                View All
              </button>
            </div>
            {isRestrictedPlan && (
              <div className="px-3 py-2 bg-[#E1784F]/10 rounded-xl border border-[#E1784F]/20">
                <p className="text-[8px] font-bold text-[#E1784F] tracking-wide">
                  🔒 Upgrade your plan to access Clinical Diary history
                </p>
              </div>
            )}
            <div className="space-y-3">
              <AnimatePresence>
                {loadingHistory ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 dark:bg-white/5 rounded-[2rem] animate-pulse" />)}
                  </div>
                ) : history.length > 0 ? (
                  history.slice(0, 3).map((scan, idx) => (
                    <motion.div
                      key={scan.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      // 🛡️ UPDATED: Open Modal with record data only if not restricted
                      onClick={() => !isRestrictedPlan && setSelectedRecord(scan)}
                      className={`flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent transition-all group ${
                        isRestrictedPlan 
                          ? 'cursor-not-allowed opacity-50' 
                          : 'hover:border-[#E1784F]/20 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#4DB6AC]/10 text-[#4DB6AC]">
                          <Zap size={22} />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-black italic tracking-tight leading-none mb-0.5">{scan.label || "Diagnostic Review"}</h5>
                          <p className="text-[8px] font-bold opacity-30 tracking-widest">{new Date(scan.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className={`w-9 h-9 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center transition-all ${
                        isRestrictedPlan 
                          ? 'opacity-20' 
                          : 'opacity-20 group-hover:opacity-100 group-hover:text-[#E1784F]'
                      }`}>
                        <ArrowRight size={14} />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-16 text-center bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-black/5 dark:border-white/5">
                    <p className="text-[9px] font-black tracking-[0.3em] opacity-20">Your Clinical Diary is empty</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* UPGRADE BUTTON FOR FREE TIER */}
          {user?.plan?.name?.toLowerCase() === 'test plan' && (
            <div className="pb-6">
              <button 
                onClick={() => setSubscriptionModalOpen(true)} 
                className="w-full py-3.5 bg-gradient-to-r from-[#E1784F] to-[#4DB6AC] text-white rounded-xl font-black text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Upgrade to Premium Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🛡️ CLINICAL MODAL UI: INJECTED FOR DASHBOARD SYNC */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6 z-[200] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-2xl border border-black/5 dark:border-white/10"
            >
              {/* MODAL HEADER / IMAGE */}
              <div className="relative h-40 md:h-52 bg-gray-900">
                {selectedRecord.imageUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${selectedRecord.imageUrl}`}
                    alt="Clinical Scan"
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#E1784F] transition-all"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-6 left-8">
                  <p className="text-[8px] font-black tracking-[0.3em] text-[#4DB6AC] mb-1">Verified Analysis</p>
                  <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white leading-none">
                    Diagnostic <span className="text-[#E1784F]">Report</span>
                  </h2>
                </div>
              </div>

              {/* MODAL CONTENT: Clinical Findings Parser */}
              <div className="p-6 md:p-8 space-y-5 max-h-[50vh] overflow-y-auto no-scrollbar">
                <div className="space-y-4">
                  {selectedRecord.description ? (
                    selectedRecord.description.split('\n').map((line: string, i: number) => {
                      const cleanLine = line.replace(/\*/g, '').trim();
                      if (!cleanLine) return null;
                      if (cleanLine.match(/^\d\./)) {
                        return (
                          <h4 key={i} className="text-[#E1784F] text-[9px] font-black tracking-widest pt-4 border-t border-black/5 dark:border-white/5 first:border-none first:pt-0">
                            {cleanLine}
                          </h4>
                        );
                      }
                      return <p key={i} className="text-[11px] md:text-[13px] font-medium leading-relaxed opacity-70 dark:text-gray-300">{cleanLine}</p>;
                    })
                  ) : (
                    <p className="text-center opacity-30 italic text-sm">Clinical details pending verification.</p>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER ACTIONS */}
              <div className="p-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.print()}
                  className="h-12 md:h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-[9px] tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="h-12 md:h-14 bg-[#E1784F] text-white rounded-2xl font-black text-[9px] tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SubscriptionModal isOpen={subscriptionModalOpen} onClose={() => setSubscriptionModalOpen(false)} />
    </main>
  )
}