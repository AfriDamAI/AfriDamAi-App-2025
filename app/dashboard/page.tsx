"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Scan, MessageSquare, History, User as UserIcon,
  Settings, Zap, Home, ShoppingBag, ArrowRight, Sparkles, Loader2, X, FlaskConical
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getScanHistory, initializePayment, getImageUrl } from "@/lib/api-client"
import { usePaystackPayment } from "react-paystack"
import { SubscriptionModal } from "@/components/subscription-modal"
import { hasFeatureAccess, SubscriptionTier } from "@/app/tier-config/route"
import { LockedBadge, DownloadLock, SharingLock } from "@/components/feature-locks"
import Link from "next/link"

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
  const [lockType, setLockType] = useState<"download" | "sharing" | null>(null)

  const firstName = user?.firstName || user?.displayName?.split(' ')[0] || "User"
  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || user.firstName?.charAt(1) || ''}`.toUpperCase()
    : "A"

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

      <div className="flex-1 pb-32 lg:pb-10 z-10">
        <header className="px-8 pt-12 pb-6 flex justify-between items-center text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.4rem] bg-[#E1784F] flex items-center justify-center text-white font-black text-sm italic shadow-xl overflow-hidden">
              {user?.profile?.avatarUrl ? (
                <img 
                  src={getImageUrl(user.profile.avatarUrl)!} 
                  alt={firstName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Hello, {firstName}</h2>
                <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${user?.subscriptionTier && user.subscriptionTier !== 'free' ? 'bg-[#4DB6AC]/10 text-[#4DB6AC] border-[#4DB6AC]/20' : 'bg-[#E1784F]/10 text-[#E1784F] border-[#E1784F]/20'}`}>
                  {user?.subscriptionTier && user.subscriptionTier !== 'free' ? 'Premium' : 'Free Plan'}
                </div>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#4DB6AC] mt-2">Ready for your skin check?</p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-8 space-y-12">
          {/* ⚡ URGENT HELP CARD */}
          <section className="relative overflow-hidden group rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-[#E1784F]/10 p-8">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#E1784F]/10 text-[#E1784F] rounded-full w-fit">
                  <Zap size={10} fill="currentColor" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Priority Service</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Specialist <br />Review</h3>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tight max-w-[240px] leading-relaxed">
                  Verified specialist clinical feedback within 24 hours.
                </p>
              </div>
              <button onClick={handleConsultation} className="w-full md:w-auto bg-[#E1784F] text-white px-12 py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                Book for ₦15000
              </button>
            </div>
          </section>

          {/* ACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => router.push('/ai-scanner')} className="group relative h-60 bg-black dark:bg-white text-white dark:text-black rounded-[3.5rem] p-10 flex flex-col justify-between items-start text-left overflow-hidden shadow-2xl">
              <div className="absolute right-[-15%] top-[-15%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Scan size={260} strokeWidth={1} />
              </div>
              <div className="w-14 h-14 rounded-3xl bg-[#E1784F] flex items-center justify-center shadow-lg"><Scan size={28} className="text-white" /></div>
              <div>
                <h3 className="text-4xl font-black italic uppercase leading-none tracking-tighter">AI Skin<br />Analysis</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-5 opacity-40 flex items-center gap-2">Initiate Scan <ArrowRight size={12} /></p>
              </div>
            </button>
            <Link href="/ingredient-analyzer" className="group relative h-60 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3.5rem] p-10 flex flex-col justify-between items-start text-left hover:border-[#E1784F]/30 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-3xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center"><FlaskConical size={28} /></div>
              <div>
                <h3 className="text-4xl font-black italic uppercase leading-none tracking-tighter">Ingredient<br />Analyzer</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-5 opacity-40 flex items-center gap-2">View Analyzer <ArrowRight size={12} /></p>
              </div>
            </Link>
          </div>

          {/* CLINICAL DIARY SECTION */}
          <section className="space-y-8 text-left pb-10">
            <div className="flex items-center justify-between px-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Clinical Diary</h4>
              {!hasFeatureAccess((user?.subscriptionTier as SubscriptionTier) || 'free', 'skinDiary') ? (
                <button onClick={() => setSubscriptionModalOpen(true)}>
                  <LockedBadge feature="Locked" size="sm" />
                </button>
              ) : (
                <button onClick={() => router.push('/history')} className="text-[9px] font-black uppercase tracking-widest text-[#4DB6AC]">View All</button>
              )}
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {loadingHistory ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-28 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />)}
                  </div>
                ) : history.length > 0 ? (
                  history.slice(0, 3).map((scan, idx) => (
                    <motion.div
                      key={scan.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      // 🛡️ UPDATED: Open Modal with record data (check access)
                      onClick={() => {
                        if (hasFeatureAccess((user?.subscriptionTier as SubscriptionTier) || 'free', 'skinDiary')) {
                          setSelectedRecord(scan);
                        } else {
                          setSubscriptionModalOpen(true);
                        }
                      }}
                      className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-[2.8rem] border border-transparent hover:border-[#E1784F]/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shrink-0 bg-[#4DB6AC]/10 text-[#4DB6AC]">
                          <Zap size={28} />
                        </div>
                        <div>
                          <h5 className="text-[12px] font-black uppercase italic tracking-tight leading-none mb-1">{scan.label || "Diagnostic Review"}</h5>
                          <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{new Date(scan.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-black/5 dark:border-white/5 flex items-center justify-center opacity-20 group-hover:opacity-100 group-hover:text-[#E1784F] transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-24 text-center bg-gray-50 dark:bg-white/5 rounded-[3.5rem] border-2 border-dashed border-black/5 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Your Clinical Diary is empty</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
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
              className="w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl border border-black/5 dark:border-white/10"
            >
              {/* MODAL HEADER / IMAGE */}
              <div className="relative h-48 md:h-64 bg-gray-900">
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
                  className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#E1784F] transition-all"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-8 left-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] mb-2">Verified Analysis</p>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                    Diagnostic <span className="text-[#E1784F]">Report</span>
                  </h2>
                </div>
              </div>

              {/* MODAL CONTENT: Clinical Findings Parser */}
              <div className="p-10 md:p-14 space-y-8 max-h-[50vh] overflow-y-auto no-scrollbar">
                <div className="space-y-6">
                  {selectedRecord.description ? (
                    selectedRecord.description.split('\n').map((line: string, i: number) => {
                      const cleanLine = line.replace(/\*/g, '').trim();
                      if (!cleanLine) return null;
                      if (cleanLine.match(/^\d\./)) {
                        return (
                          <h4 key={i} className="text-[#E1784F] text-[10px] font-black uppercase tracking-widest pt-6 border-t border-black/5 dark:border-white/5 first:border-none first:pt-0">
                            {cleanLine}
                          </h4>
                        );
                      }
                      return <p key={i} className="text-xs md:text-sm font-medium leading-relaxed opacity-70 dark:text-gray-300">{cleanLine}</p>;
                    })
                  ) : (
                    <p className="text-center opacity-30 italic text-sm">Clinical details pending verification.</p>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER ACTIONS */}
              <div className="p-10 grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (!hasFeatureAccess((user?.subscriptionTier as SubscriptionTier) || 'free', 'downloads')) {
                      setLockType("download");
                      return;
                    }
                    window.print();
                  }}
                  className="h-16 md:h-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="h-16 md:h-20 bg-[#E1784F] text-white rounded-3xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SubscriptionModal isOpen={subscriptionModalOpen} onClose={() => setSubscriptionModalOpen(false)} />

      {/* 🛡️ PREMIUM FEATURES LOCKS */}
      <AnimatePresence>
        {lockType === "download" && (
          <DownloadLock 
            onUnlock={() => {
              setLockType(null)
              setSubscriptionModalOpen(true)
            }} 
            onClose={() => setLockType(null)} 
          />
        )}
        {lockType === "sharing" && (
          <SharingLock 
            onUnlock={() => {
              setLockType(null)
              setSubscriptionModalOpen(true)
            }} 
            onClose={() => setLockType(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  )
}