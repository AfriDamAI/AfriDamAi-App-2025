"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Scan, MessageSquare, History, User, 
  Settings, Zap, Clock, ShieldCheck, 
  ArrowRight, CreditCard, Sparkles, Activity, Home, ShoppingBag
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getScanHistory } from "@/lib/api-client"

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push("/")
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getScanHistory()
        setHistory(data || [])
      } catch (err) {
        console.error("Failed to load history")
      } finally {
        setLoadingHistory(false)
      }
    }
    if (user) fetchHistory()
  }, [user])

  if (authLoading || !user) return null

  const SidebarItem = ({ icon: Icon, label, path }: any) => (
    <button 
      onClick={() => router.push(path)}
      className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold opacity-40 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-white/5 transition-all rounded-2xl group"
    >
      <Icon size={20} className="group-hover:text-[#E1784F]" />
      <span className="uppercase tracking-widest text-[10px]">{label}</span>
    </button>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] text-black dark:text-white transition-colors duration-500 flex">
      
      {/* 🖥️ PC SIDEBAR PANEL */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-gray-100 dark:border-white/10 h-screen sticky top-0 p-8 space-y-10">
        <div className="px-4">
          <img src="/logo.png" alt="Logo" className="h-8 dark:invert" />
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={Home} label="Hub" path="/dashboard" />
          <SidebarItem icon={Scan} label="AI Scanner" path="/scanner" />
          <SidebarItem icon={MessageSquare} label="Specialists" path="/specialist" />
          <SidebarItem icon={ShoppingBag} label="Marketplace" path="/marketplace" />
          <SidebarItem icon={History} label="History" path="/history" />
          <SidebarItem icon={Settings} label="Settings" path="/settings" />
        </nav>

        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#E1784F] flex items-center justify-center text-white text-[10px] font-black italic">
               {user?.name?.charAt(0)}
             </div>
             <span className="text-[10px] font-black uppercase tracking-tighter truncate">{user?.name}</span>
          </div>
          <button onClick={() => router.push('/profile')} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest">
            View Profile
          </button>
        </div>
      </aside>

      {/* 📱 MAIN CONTENT AREA */}
      <div className="flex-1 pb-32 lg:pb-10">
        {/* top navigation */}
        <nav className="max-w-screen-xl mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 rounded-full bg-[#E1784F] flex items-center justify-center text-white font-black text-xs italic">
              {user?.name?.charAt(0) || "U"}
            </div>
            <h2 className="text-lg font-bold">Hello, {user?.name?.split(' ')[0] || 'Obey'}</h2>
          </div>
          <div className="hidden lg:block">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Clinical Intelligence Hub</p>
          </div>
          
          <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]">
              {user?.tier === 'premium' ? 'Premium Account' : 'Free Account'}
            </span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <header className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Dash<span className="text-[#E1784F]">board</span>
            </h1>
            <p className="text-sm font-medium opacity-50">Check if your skin glows today.</p>
          </header>

          {/* $15 instant consultation - SHRUNK & CLEANED */}
          <section className="relative overflow-hidden group rounded-[2rem] border border-[#E1784F]/30">
            <div className="absolute inset-0 bg-[#E1784F] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center gap-2 px-2 py-1 bg-[#E1784F] text-white rounded-full w-fit mx-auto md:mx-0">
                  <Zap size={10} fill="currentColor" />
                  <span className="text-[8px] font-black uppercase tracking-widest">No Waiting Time</span>
                </div>
                <h3 className="text-xl font-black italic uppercase leading-none">Instant specialist consultation</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-tight max-w-xs">
                  Connect with a certified dermatologist for immediate clinical advice.
                </p>
              </div>
              <button 
                onClick={() => router.push('/consultation/instant')}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:scale-105 transition-all"
              >
                Consult now <span className="text-[#E1784F]">$15</span>
              </button>
            </div>
          </section>

          {/* main actions grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={() => router.push('/scanner')}
              className="group relative h-56 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] p-8 flex flex-col justify-between items-start text-left overflow-hidden"
            >
              <div className="absolute right-[-5%] top-[-5%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <Scan size={180} strokeWidth={1} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E1784F] flex items-center justify-center">
                <Scan size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase leading-none">AI Skin<br/>Analysis</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-3 opacity-50 flex items-center gap-2">
                  Start scan <ArrowRight size={10} />
                </p>
              </div>
            </button>

            <button 
              onClick={() => router.push('/specialist')}
              className="group relative h-56 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between items-start text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase leading-none">Chat a<br/>specialist</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-3 opacity-50 flex items-center gap-2">
                  Care guide <ArrowRight size={10} />
                </p>
              </div>
            </button>
          </div>

          {/* scanning history section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Scanning History</h4>
              <History size={14} className="opacity-20" />
            </div>

            <div className="space-y-4">
              {loadingHistory ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-[2rem]" />)}
                </div>
              ) : history.length > 0 ? (
                history.map((scan: any, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 group hover:border-[#E1784F] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-200">
                         <img src={scan.imageUrl || "/placeholder.jpg"} alt="scan" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-black uppercase italic tracking-tight">{scan.label || "Texture Scan"}</h5>
                        <p className="text-[9px] font-bold opacity-30 uppercase">{new Date(scan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={() => router.push(`/scanner/results/${scan.id}`)} className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
                      <ArrowRight size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                  <Activity size={32} className="mx-auto opacity-10 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30">No scans recorded yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* floating ai chatbot */}
      <div className="fixed bottom-24 right-6 z-40 lg:bottom-10 lg:right-10">
        <button 
          onClick={() => router.push('/chat')}
          className="w-14 h-14 bg-[#E1784F] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
        >
          <Sparkles size={24} />
        </button>
      </div>

      {/* mobile bottom panel */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 flex justify-around items-center px-6 lg:hidden z-50">
        <button onClick={() => router.push('/dashboard')} className="p-3 text-[#E1784F]"><Home size={22} /></button>
        <button onClick={() => router.push('/scanner')} className="p-3 opacity-30"><Scan size={22} /></button>
        <button onClick={() => router.push('/specialist')} className="p-3 opacity-30"><MessageSquare size={22} /></button>
        <button onClick={() => router.push('/profile')} className="p-3 opacity-30"><User size={22} /></button>
      </div>
    </main>
  )
}