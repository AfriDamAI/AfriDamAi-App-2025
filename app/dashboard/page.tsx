"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Scan, MessageSquare, History, User as UserIcon, 
  Settings, Zap, Home, ShoppingBag, ArrowRight, Sparkles, Loader2
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getScanHistory, initializePayment } from "@/lib/api-client"
import { usePaystackPayment } from "react-paystack"

/**
 * 🛡️ AFRIDAM WELLNESS HUB (Rule 6 Precision Sync)
 * Version: 2026.01.26
 * Focus: Handshake Resilience & Mobile Ergonomics.
 */

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth() as any
  
  // 🚀 RULE 3: Strict state typing to prevent .map crashes
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

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
        // 🛡️ HANDSHAKE: Your interceptor already unwraps resultData, 
        // but we add a safety check for array integrity.
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
    amount: 15 * 100 * 1650, // USD 15 to NGN conversion
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

  const SidebarItem = ({ icon: Icon, label, path }: any) => (
    <button 
      onClick={() => router.push(path)}
      className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold opacity-40 hover:opacity-100 transition-all rounded-2xl group"
    >
      <Icon size={20} className="group-hover:text-[#E1784F] transition-colors" />
      <span className="uppercase tracking-widest text-[10px]">{label}</span>
    </button>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col lg:flex-row relative">
      
      {/* 🌪️ AMBIANCE: Noise overlay for Rule 6 Texture */}
      <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 🖥️ PC SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-gray-100 dark:border-white/10 h-screen sticky top-0 p-8 space-y-10 z-10 bg-white dark:bg-[#050505]">
        <div className="px-4 text-left">
           <h1 className="text-xl font-black italic tracking-tighter uppercase">AFRIDAM <span className="text-[#E1784F]">AI</span></h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={Home} label="Home Hub" path="/dashboard" />
          <SidebarItem icon={Scan} label="AI Scanner" path="/ai-scanner" />
          <SidebarItem icon={MessageSquare} label="Specialists" path="/specialist" />
          <SidebarItem icon={ShoppingBag} label="Care Shop" path="/marketplace" />
          <SidebarItem icon={History} label="Clinical Diary" path="/history" />
          <SidebarItem icon={Settings} label="Settings" path="/settings" />
        </nav>

        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-[#E1784F] flex items-center justify-center text-white text-[11px] font-black italic shadow-lg">
               {initials}
             </div>
             <span className="text-[10px] font-black uppercase tracking-tight truncate">{firstName}</span>
          </div>
          <button onClick={() => router.push('/profile')} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
            Manage Profile
          </button>
        </div>
      </aside>

      {/* 📱 MOBILE HUB CONTAINER */}
      <div className="flex-1 pb-32 lg:pb-10 z-10">
        <header className="px-8 pt-12 pb-6 flex justify-between items-center text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.4rem] bg-[#E1784F] flex items-center justify-center text-white font-black text-sm italic shadow-xl">
              {initials}
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Hello, {firstName}</h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#4DB6AC] mt-2">Ready for your skin check?</p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-8 space-y-12">
          
          {/* ⚡ URGENT HELP: RULE 6 CINEMATIC CARD */}
          <section className="relative overflow-hidden group rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-[#E1784F]/10 p-8">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#E1784F]/10 text-[#E1784F] rounded-full w-fit">
                  <Zap size={10} fill="currentColor" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Priority Service</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Dermatologist <br/>Review</h3>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-tight max-w-[240px] leading-relaxed">
                  Verified specialist clinical feedback within 24 hours.
                </p>
              </div>
              <button 
                onClick={handleConsultation}
                className="w-full md:w-auto bg-[#E1784F] text-white px-12 py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
              >
                Book for $15
              </button>
            </div>
          </section>

          {/* ACTION CARDS: RULE 1 MOBILE ERGONOMICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => router.push('/ai-scanner')} className="group relative h-60 bg-black dark:bg-white text-white dark:text-black rounded-[3.5rem] p-10 flex flex-col justify-between items-start text-left overflow-hidden shadow-2xl">
              <div className="absolute right-[-15%] top-[-15%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <Scan size={260} strokeWidth={1} />
              </div>
              <div className="w-14 h-14 rounded-3xl bg-[#E1784F] flex items-center justify-center shadow-lg"><Scan size={28} className="text-white" /></div>
              <div>
                <h3 className="text-4xl font-black italic uppercase leading-none tracking-tighter">AI Skin<br/>Analysis</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-5 opacity-40 flex items-center gap-2">Initiate Scan <ArrowRight size={12} /></p>
              </div>
            </button>

            <button onClick={handleConsultation} className="group relative h-60 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3.5rem] p-10 flex flex-col justify-between items-start text-left hover:border-[#E1784F]/30 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-3xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center"><MessageSquare size={28} /></div>
              <div>
                <h3 className="text-4xl font-black italic uppercase leading-none tracking-tighter">Verified<br/>Advice</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-5 opacity-40 flex items-center gap-2">Expert Consultation <ArrowRight size={12} /></p>
              </div>
            </button>
          </div>

          {/* CLINICAL DIARY: RULE 5 JARGON-FREE UI */}
          <section className="space-y-8 text-left pb-10">
            <div className="flex items-center justify-between px-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Clinical Diary</h4>
              <button onClick={() => router.push('/history')} className="text-[9px] font-black uppercase tracking-widest text-[#4DB6AC]">View All</button>
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
                    onClick={() => router.push(`/scanner/results/${scan.id}`)} 
                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-[2.8rem] border border-transparent hover:border-[#E1784F]/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.6rem] overflow-hidden bg-gray-200 dark:bg-white/10">
                         <img src={scan.imageUrl || "/placeholder.jpg"} alt="clinical scan" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="text-[12px] font-black uppercase italic tracking-tight leading-none mb-1">{scan.label || "Daily Analysis"}</h5>
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

      {/* 🤖 RULE 6: FLOATING AI HANDSHAKE */}
      <div className="fixed bottom-32 right-8 z-[70] lg:bottom-12 lg:right-12">
        <button 
          onClick={() => router.push('/chat')} 
          className="w-20 h-20 bg-[#E1784F] rounded-[1.8rem] shadow-[0_20px_50px_rgba(225,120,79,0.3)] flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all group"
        >
          <Sparkles size={32} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* 📱 RULE 1: MOBILE NAVIGATION HUB */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 flex justify-around items-center px-10 lg:hidden z-50 pb-6">
        <button onClick={() => router.push('/dashboard')} className="p-4 text-[#E1784F] transition-all"><Home size={26} /></button>
        <button onClick={() => router.push('/scanner')} className="p-4 opacity-20 hover:opacity-100 transition-all"><Scan size={26} /></button>
        <button onClick={handleConsultation} className="p-4 opacity-20 hover:opacity-100 transition-all"><Zap size={26} /></button>
        <button onClick={() => router.push('/profile')} className="p-4 opacity-20 hover:opacity-100 transition-all"><UserIcon size={26} /></button>
      </div>
    </main>
  )
}