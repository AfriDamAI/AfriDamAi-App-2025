"use client"

import { useEffect, useState } from "react"
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  LogOut, 
  Activity,
  ChevronRight,
  ShoppingBag,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Zap,
  Camera,
  Clock,
  User as UserIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider" 
import { AppointmentView } from "@/components/dashboard/appointment-view"
import { getHistory, type ScanRecord } from "@/lib/history-manager"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function DashboardPage() {
  // 🛡️ OGA FIX: Added 'requiresOnboarding' from our updated provider
  const { user, signOut, isLoading, requiresOnboarding } = useAuth()
  const { theme } = useTheme() 
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([])

  useEffect(() => {
    if (!isLoading) {
      // 1. No user? Back to landing.
      if (!user) {
        router.push("/")
        return
      }

      // 2. 🛡️ THE GATEKEEPER: If they MUST onboard, send them there.
      // But only if we are sure they haven't finished.
      if (requiresOnboarding) {
        console.log("Onboarding required, redirecting...");
        router.push("/onboarding")
        return
      }

      // 3. Load history only if they are a full user
      const history = getHistory().slice(0, 3)
      setRecentScans(history)
    }
  }, [user, isLoading, requiresOnboarding, router])

  if (isLoading || !user || (requiresOnboarding && activeTab === "home")) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 bg-[#E1784F] rounded-[2rem] flex items-center justify-center font-black text-white shadow-[0_0_50px_rgba(225,120,79,0.3)]"
      >A</motion.div>
    </div>
  )

  const displayName = user.firstName || "Friend";

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-hidden">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="w-72 border-r border-border p-8 space-y-10 bg-card/50 backdrop-blur-3xl z-20 sticky top-0 h-screen hidden md:flex flex-col">
        <div className="px-2 cursor-pointer" onClick={() => router.push('/')}>
           <img src="/logo.png" alt="AfriDam AI" className="h-10 w-auto object-contain" />
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "home", label: "Home", icon: LayoutDashboard },
            { id: "scanner", label: "Skin Scanner", icon: Activity, path: "/ai-scanner" },
            { id: "checker", label: "Safety Check", icon: Sparkles, path: "/ai-checker" },
            { id: "marketplace", label: "Care Shop", icon: ShoppingBag, path: "/ecommerce" },
            { id: "appointment", label: "Chat a Doctor", icon: Stethoscope },
            { id: "history", label: "My Diary", icon: HistoryIcon, path: "/history" }
          ].map((link) => (
            <button 
              key={link.id}
              onClick={() => link.path ? router.push(link.path) : setActiveTab(link.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                activeTab === link.id ? "bg-[#E1784F] text-white shadow-xl shadow-[#E1784F]/20" : "text-muted-foreground hover:text-[#E1784F]"
              }`}
            >
              <link.icon size={16} /> {link.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-border flex items-center justify-between px-2">
           <button onClick={() => signOut?.()} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-all flex items-center gap-2">
             <LogOut size={14} /> Sign Out
           </button>
           <div onClick={() => router.push('/profile')} className="w-12 h-12 rounded-2xl bg-[#E1784F]/10 border border-[#E1784F]/20 flex items-center justify-center cursor-pointer hover:bg-[#E1784F]/20 transition-all">
              <UserIcon size={18} className="text-[#E1784F]" />
           </div>
        </div>
      </aside>

      {/* --- MOBILE NAVIGATION --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/60 backdrop-blur-3xl border-t border-white/5 z-50 flex md:hidden justify-around items-center p-5 pb-8">
        {[
           { id: "home", icon: LayoutDashboard, label: "Home" },
           { id: "scanner", icon: Camera, label: "Scan", path: "/ai-scanner" },
           { id: "checker", icon: Sparkles, label: "Check", path: "/ai-checker" },
           { id: "marketplace", icon: ShoppingBag, label: "Shop", path: "/ecommerce" },
           { id: "appointment", icon: Stethoscope, label: "Doctor" }
        ].map((link) => (
          <button 
            key={link.id} 
            onClick={() => link.path ? router.push(link.path) : setActiveTab(link.id)}
            className={`flex flex-col items-center gap-1.5 px-3 py-1 transition-all ${activeTab === link.id ? "text-[#E1784F]" : "text-muted-foreground/60"}`}
          >
            <link.icon size={22} />
            <span className="text-[7px] font-black uppercase tracking-widest">{link.label}</span>
          </button>
        ))}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 h-[100svh] overflow-y-auto relative bg-background scrollbar-hide no-scrollbar pb-32 md:pb-12">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.06),transparent_70%)] pointer-events-none" />
        
        <header className="flex justify-between items-center mb-12 relative z-10">
           <div className="space-y-1">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-foreground leading-none">Hello, {displayName}</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E1784F]">AfriDam Clinical Dashboard</p>
           </div>
           
           <button onClick={() => router.push('/pricing')} className="hidden sm:flex items-center gap-3 px-8 py-4 bg-[#1C1A19] dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
             Upgrade <Zap size={12} fill="currentColor" />
           </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 max-w-5xl mx-auto space-y-10">
            
            {activeTab === "home" && (
              <>
                <motion.section 
                  variants={itemVariants}
                  onClick={() => router.push('/ai-scanner')}
                  className="relative overflow-hidden bg-gradient-to-br from-[#E1784F] to-[#C55A32] p-8 md:p-10 rounded-[3rem] flex items-center justify-between gap-6 cursor-pointer group shadow-2xl border border-white/10"
                >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner"><Camera size={28} /></div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tighter">Skin Scanner</h3>
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Live Analysis</p>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white text-[#E1784F] rounded-2xl flex items-center justify-center shadow-2xl group-hover:translate-x-2 transition-transform"><ArrowRight size={24} /></div>
                </motion.section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} onClick={() => router.push('/ai-checker')} className="p-10 bg-card/40 border border-border rounded-[3rem] space-y-4 hover:border-[#4DB6AC]/50 cursor-pointer shadow-sm group backdrop-blur-sm">
                    <div className="w-12 h-12 bg-[#4DB6AC]/10 text-[#4DB6AC] rounded-2xl flex items-center justify-center group-hover:bg-[#4DB6AC] group-hover:text-white transition-all shadow-inner"><Sparkles size={22}/></div>
                    <h4 className="text-xl font-black italic uppercase">Safety Check</h4>
                    <p className="text-muted-foreground text-[11px] leading-relaxed uppercase font-bold tracking-wider">Analyze ingredients for melanin-rich compatibility.</p>
                  </motion.div>

                  <motion.div variants={itemVariants} onClick={() => setActiveTab('appointment')} className="p-10 bg-card/40 border border-border rounded-[3rem] space-y-4 hover:border-blue-400/50 cursor-pointer shadow-sm group backdrop-blur-sm">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner"><Stethoscope size={22}/></div>
                    <h4 className="text-xl font-black italic uppercase">Chat a Doctor</h4>
                    <p className="text-muted-foreground text-[11px] leading-relaxed uppercase font-bold tracking-wider">Connect with specialists who understand your skin.</p>
                  </motion.div>
                </div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-[#1C1A19] dark:bg-card text-white dark:text-foreground p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-white/5"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/5 blur-[80px] rounded-full" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-[#E1784F] rounded-2xl flex items-center justify-center shadow-xl animate-pulse"><Zap size={24} className="text-white fill-white" /></div>
                    <div>
                        <p className="text-lg font-black italic uppercase tracking-tighter">Urgent Specialist Care</p>
                        <p className="text-[9px] opacity-60 font-black uppercase tracking-[0.3em] mt-1 text-[#E1784F]">Expert clinical consultation</p>
                    </div>
                  </div>
                  <button className="w-full md:w-auto px-10 py-5 bg-[#E1784F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Book Now</button>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">My Diary</h4>
                    <button onClick={() => router.push('/history')} className="text-[9px] font-black uppercase tracking-widest text-[#E1784F] hover:underline">View All</button>
                  </div>
                  {recentScans.length > 0 ? (
                    <div className="space-y-4">
                      {recentScans.map((scan) => (
                        <div key={scan.id} className="p-8 bg-card/60 border border-border rounded-2.5rem flex items-center justify-between group hover:border-[#E1784F]/40 transition-all shadow-sm cursor-pointer">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-[#E1784F] shadow-inner"><Activity size={20}/></div>
                            <div>
                              <p className="text-md font-black italic uppercase text-foreground leading-none mb-1">{scan.results.conditions?.[0]?.name || 'Scan Analysis'}</p>
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{new Date(scan.timestamp).toLocaleDateString(undefined, {month: 'long', day: 'numeric'})}</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 border-2 border-dashed border-border rounded-[3rem] text-center bg-card/20 backdrop-blur-sm">
                       <Clock size={24} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Clinical Records Empty</p>
                    </div>
                  )}
                </motion.div>
              </>
            )}

            {activeTab === "appointment" && (
              <motion.div variants={itemVariants} className="bg-card rounded-[3.5rem] border border-border p-10 shadow-sm relative overflow-hidden">
                 <div className="flex justify-between items-center mb-10">
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter">Clinical Care Team</h2>
                   <button onClick={() => setActiveTab("home")} className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[#E1784F]">Back</button>
                 </div>
                 <AppointmentView />
              </motion.div>
            )}

            <footer className="mt-20 pt-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8 pb-10">
              <div className="flex items-center gap-6">
                <img src="/logo.png" className="h-6 w-auto grayscale opacity-20" alt="AfriDam" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">© 2026 AfriDam AI • Lagos, Nigeria</p>
              </div>
            </footer>

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}