"use client"

/**
 * 🛡️ AFRIDAM WELLNESS HUB (Rule 6 Synergy)
 * Version: 2026.1.22 (Direct Client.ts Handshake)
 * Focus: Soft Tone, specialist access, and Paystack integration.
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Scan, MessageSquare, History, User as UserIcon, 
  Settings, Zap, Home, ShoppingBag, ArrowRight, Activity, Sparkles
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getScanHistory, initializePayment } from "@/lib/api-client"
import { usePaystackPayment } from "react-paystack"

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // 🛡️ OGA NAME SYNC: Personalizing for Obey
  const firstName = user?.firstName || "Obey"
  const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : "O"

  useEffect(() => {
    if (!authLoading && !user) router.push("/")
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getScanHistory()
        // Rule 7 Sync: Unwrapping history from resultData
        setHistory(response?.resultData || response || [])
      } catch (err) {
        console.error("Diary sync failed")
      } finally {
        setLoadingHistory(false)
      }
    }
    if (user) fetchHistory()
  }, [user])

  /**
   * 💳 PAYSTACK CONFIGURATION
   * Rule 7: Strictly following the handshake in client.ts
   */
  const config = {
    reference: `REF-${Date.now()}`,
    email: user?.email || "",
    amount: 15 * 100 * 1650, // $15 USD to Naira sync
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  }

  const initializePaystack = usePaystackPayment(config)

  const handleConsultation = async () => {
    try {
      /** 🚀 DIRECT CLIENT.TS HANDSHAKE
       * We trigger the backend intent first, then open the board.
       */
      await initializePayment({ plan: "INSTANT_CONSULTATION", amount: 15 })
      
      initializePaystack({
        onSuccess: () => router.push('/specialist/chat'),
        onClose: () => console.log("Payment Cancelled")
      })
    } catch (err) {
      console.error("Payment Sync Failed")
    }
  }

  if (authLoading || !user) return null

  const SidebarItem = ({ icon: Icon, label, path }: any) => (
    <button 
      onClick={() => router.push(path)}
      className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold opacity-40 hover:opacity-100 transition-all rounded-2xl group"
    >
      <Icon size={20} className="group-hover:text-[#E1784F]" />
      <span className="uppercase tracking-widest text-[10px]">{label}</span>
    </button>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] text-black dark:text-white flex flex-col lg:flex-row">
      
      {/* 🖥️ PC SIDEBAR PANEL */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-gray-100 dark:border-white/10 h-screen sticky top-0 p-8 space-y-10">
        <div className="px-4 text-left">
           <h1 className="text-xl font-black italic tracking-tighter">AFRIDAM <span className="text-[#E1784F]">AI</span></h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={Home} label="Home Hub" path="/dashboard" />
          <SidebarItem icon={Scan} label="AI Scanner" path="/scanner" />
          <SidebarItem icon={MessageSquare} label="Specialists" path="/specialist" />
          <SidebarItem icon={ShoppingBag} label="Care Shop" path="/marketplace" />
          <SidebarItem icon={History} label="Skin Diary" path="/history" />
          <SidebarItem icon={Settings} label="Settings" path="/settings" />
        </nav>

        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#E1784F] flex items-center justify-center text-white text-[10px] font-black italic">
               {initials}
             </div>
             <span className="text-[10px] font-black uppercase tracking-tight">{firstName}</span>
          </div>
          <button onClick={() => router.push('/profile')} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[8px] font-black uppercase tracking-widest">
            Profile
          </button>
        </div>
      </aside>

      {/* 📱 MAIN CONTENT AREA */}
      <div className="flex-1 pb-32 lg:pb-10">
        <nav className="px-6 pt-10 pb-4 lg:py-12 flex justify-between items-center text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E1784F] flex items-center justify-center text-white font-black text-xs italic shadow-lg shadow-[#E1784F]/20">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">Hello, {firstName}</h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#4DB6AC] mt-1">Check if your skin glows today</p>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 space-y-10">
          {/* 💳 $15 URGENT HELP CARD */}
          <section className="relative overflow-hidden group rounded-[2.8rem] bg-gray-50 dark:bg-white/5 border border-[#E1784F]/10">
            <div className="relative p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#E1784F]/10 text-[#E1784F] rounded-full w-fit">
                  <Zap size={10} fill="currentColor" />
                  <span className="text-[8px] font-black uppercase tracking-widest leading-none">Quick Sync</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Specialist Chat</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-tight max-w-xs leading-relaxed">
                  Connect with a specialist now for a soft, relatable review of your skin health.
                </p>
              </div>
              <button 
                onClick={handleConsultation}
                className="w-full md:w-auto bg-[#E1784F] text-white px-10 py-5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all"
              >
                Pay $15 now
              </button>
            </div>
          </section>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button onClick={() => router.push('/scanner')} className="group relative h-52 bg-black dark:bg-white text-white dark:text-black rounded-[3rem] p-10 flex flex-col justify-between items-start text-left overflow-hidden shadow-2xl">
              <div className="absolute right-[-10%] top-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <Scan size={200} strokeWidth={1} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E1784F] flex items-center justify-center shadow-lg"><Scan size={24} className="text-white" /></div>
              <div>
                <h3 className="text-3xl font-black italic uppercase leading-none tracking-tighter">Scan My<br/>Skin</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-4 opacity-40 flex items-center gap-2">AI Glow Audit <ArrowRight size={10} /></p>
              </div>
            </button>

            <button onClick={handleConsultation} className="group relative h-52 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 flex flex-col justify-between items-start text-left hover:border-[#E1784F]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center"><MessageSquare size={24} /></div>
              <div>
                <h3 className="text-3xl font-black italic uppercase leading-none tracking-tighter">Chat a<br/>Specialist</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-4 opacity-40 flex items-center gap-2">Expert Guide <ArrowRight size={10} /></p>
              </div>
            </button>
          </div>

          {/* Skin Diary Section */}
          <section className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 px-4 text-left">My Skin Diary</h4>
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="flex flex-col gap-3">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />)}
                </div>
              ) : history.length > 0 ? (
                history.map((scan: any, idx) => (
                  <div key={idx} onClick={() => router.push(`/scanner/results/${scan.id}`)} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-transparent hover:border-[#E1784F]/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-[1.5rem] overflow-hidden bg-gray-200 dark:bg-white/10 shadow-inner">
                         <img src={scan.imageUrl || "/placeholder.jpg"} alt="scan" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <h5 className="text-[11px] font-black uppercase italic tracking-tight">{scan.label || "Glow Check"}</h5>
                        <p className="text-[9px] font-bold opacity-30 uppercase">{new Date(scan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="opacity-10" />
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Your diary is waiting for your first scan</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 🤖 FLOATING AI CHAT (Dashboard Exclusive) */}
      <div className="fixed bottom-28 right-6 z-[70] lg:bottom-10 lg:right-10">
        <button 
          onClick={() => router.push('/chat')} 
          className="w-16 h-16 bg-[#E1784F] rounded-[1.5rem] shadow-[0_20px_50px_-10px_rgba(225,120,79,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
        >
          <Sparkles size={28} />
        </button>
      </div>

      {/* 📱 MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 h-22 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-gray-100 dark:border-white/10 flex justify-around items-center px-8 lg:hidden z-50 pb-2">
        <button onClick={() => router.push('/dashboard')} className="p-3 text-[#E1784F]"><Home size={24} /></button>
        <button onClick={() => router.push('/scanner')} className="p-3 opacity-20"><Scan size={24} /></button>
        <button onClick={handleConsultation} className="p-3 opacity-20"><Zap size={24} /></button>
        <button onClick={() => router.push('/profile')} className="p-3 opacity-20"><UserIcon size={24} /></button>
      </div>
    </main>
  )
}