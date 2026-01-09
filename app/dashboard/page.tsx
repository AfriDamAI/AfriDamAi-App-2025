"use client"

import { useEffect, useState } from "react"
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  LogOut, 
  Activity,
  User as UserIcon,
  ChevronRight,
  Search,
  ShoppingBag,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Heart,
  Zap,
  Camera,
  Clock
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
  const { user, signOut, isLoading } = useAuth()
  const { theme } = useTheme() 
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([])

  const isDark = theme === "dark"

  useEffect(() => {
    if (!isLoading && !user) router.push("/")
    // Load recent history (Top 3)
    const history = getHistory().slice(0, 3)
    setRecentScans(history)
  }, [user, isLoading, router])

  if (isLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-12 h-12 bg-[#E1784F] rounded-full flex items-center justify-center font-black text-white shadow-2xl"
      >A</motion.div>
    </div>
  )

  const displayName = user.firstName || "Friend";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-hidden">
      
      {/* --- 1. SIDEBAR --- */}
      <aside className="w-full md:w-72 border-r border-border p-6 space-y-10 bg-card/50 backdrop-blur-3xl z-20 sticky top-0 h-screen hidden md:flex flex-col">
        <div className="px-2 cursor-pointer" onClick={() => router.push('/')}>
           <img 
             src="/logo.png" 
             alt="AfriDam AI" 
             className={`h-10 w-auto object-contain transition-all ${isDark ? 'brightness-100' : 'brightness-90'}`} 
           />
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: "home", label: "Home", icon: LayoutDashboard },
            { id: "scanner", label: "Skin Scanner", icon: Activity, path: "/ai-scanner" },
            { id: "checker", label: "Safety Check", icon: Search, path: "/ai-checker" },
            { id: "marketplace", label: "Care Shop", icon: ShoppingBag, path: "/marketplace" },
            { id: "appointment", label: "Chat a Doctor", icon: Stethoscope },
            { id: "history", label: "My Diary", icon: HistoryIcon, path: "/history" }
          ].map((link) => (
            <button 
              key={link.id}
              onClick={() => link.path ? router.push(link.path) : setActiveTab(link.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                activeTab === link.id 
                ? "bg-[#E1784F] text-white shadow-lg shadow-[#E1784F]/20" 
                : "text-muted-foreground hover:text-[#E1784F] hover:bg-[#E1784F]/5"
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
           <div onClick={() => router.push('/profile')} className="w-10 h-10 rounded-full border-2 border-border overflow-hidden cursor-pointer hover:border-[#E1784F] transition-all">
              {user.profile?.avatarUrl ? <img src={user.profile.avatarUrl} className="w-full h-full object-cover" alt="Profile" /> : <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] font-bold">JD</div>}
           </div>
        </div>
      </aside>

      {/* --- 2. MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 max-h-screen overflow-y-auto relative bg-background">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.04),transparent_70%)] pointer-events-none" />
        
        <header className="flex justify-between items-center mb-10 relative z-10">
           <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-foreground">Hello, {displayName}</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E1784F]">Your skin is glowing today</p>
           </div>
           
           <button 
             onClick={() => router.push('/pricing')}
             className="hidden sm:flex items-center gap-3 px-6 py-3 bg-[#1C1A19] dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
           >
             Upgrade <Zap size={12} fill="currentColor" />
           </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-6xl mx-auto space-y-10"
          >
            {activeTab === "home" && (
              <>
                {/* --- SCANNER CARD --- */}
                <motion.section 
                  variants={itemVariants}
                  onClick={() => router.push('/ai-scanner')}
                  className="relative overflow-hidden bg-gradient-to-br from-[#E1784F] via-[#F0A287] to-[#C55A32] p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group hover:scale-[1.01] transition-all shadow-xl"
                >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-sm border border-white/20 group-hover:rotate-12 transition-transform">
                      <Camera size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Skin Scanner</h3>
                      <p className="text-white/80 text-[11px] font-medium max-w-[200px]">Quick, private analysis for your skin.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60 opacity-0 group-hover:opacity-100 transition-all">Start Scan</span>
                    <div className="w-12 h-12 bg-white text-[#E1784F] rounded-xl flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.section>

                {/* TWO COLUMN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    variants={itemVariants}
                    onClick={() => router.push('/ai-checker')}
                    className="p-8 bg-[#F0F9F8] dark:bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[2.5rem] space-y-4 hover:border-[#4DB6AC] transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="w-10 h-10 bg-[#4DB6AC] text-white rounded-xl flex items-center justify-center shadow-md"><Search size={18}/></div>
                    <h4 className="text-lg font-black italic uppercase text-foreground">Safety Check</h4>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">Check if your products are gentle enough for the family.</p>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    onClick={() => setActiveTab('appointment')}
                    className="p-8 bg-blue-50/50 dark:bg-blue-400/5 border border-blue-400/20 rounded-[2.5rem] space-y-4 hover:border-blue-400 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md"><Stethoscope size={18}/></div>
                    <h4 className="text-lg font-black italic uppercase text-foreground">Chat a Doctor</h4>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">Connect with specialists who understand melanin-rich skin.</p>
                  </motion.div>
                </div>

                {/* --- RECENT ACTIVITY SECTION --- */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Recent Activity</h4>
                    <button onClick={() => router.push('/history')} className="text-[9px] font-black uppercase tracking-widest text-[#E1784F] hover:opacity-70">View Diary</button>
                  </div>

                  {recentScans.length > 0 ? (
                    <div className="space-y-3">
                      {recentScans.map((scan) => (
                        <div key={scan.id} className="p-5 bg-card border border-border rounded-3xl flex items-center justify-between group hover:border-[#E1784F]/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scan.type === 'skin' ? 'bg-blue-500/10 text-blue-500' : 'bg-[#4DB6AC]/10 text-[#4DB6AC]'}`}>
                              {scan.type === 'skin' ? <Activity size={18}/> : <Search size={18}/>}
                            </div>
                            <div>
                              <p className="text-[11px] font-black italic uppercase tracking-tight text-foreground">{scan.results.conditions?.[0]?.name || (scan.type === 'skin' ? 'Skin Glow Check' : 'Safety Analysis')}</p>
                              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(scan.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-muted-foreground group-hover:text-[#E1784F] group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-border rounded-[2.5rem] text-center">
                       <Clock size={20} className="mx-auto text-muted-foreground mb-3 opacity-30" />
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">No recent scans found</p>
                    </div>
                  )}
                </motion.div>

                {/* --- PORTABLE SPECIALIST CARD --- */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-[#1C1A19] dark:bg-[#F7F3EE] text-white dark:text-[#1C1A19] p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#E1784F]/20 blur-[40px] rounded-full" />
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-10 h-10 bg-[#E1784F] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                       <Zap size={16} className="text-white fill-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black italic uppercase tracking-widest">Urgent Specialist Care</p>
                        <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest mt-1">Direct expert advice in minutes.</p>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-[#E1784F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#E1784F]/20">
                    Book for $15
                  </button>
                </motion.div>
              </>
            )}

            {/* --- CHAT A DOCTOR VIEW --- */}
            {activeTab === "appointment" && (
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Our Care Team</h2>
                    <button onClick={() => setActiveTab("home")} className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]">Back Home</button>
                </div>
                <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
                   <AppointmentView />
                </div>
              </motion.div>
            )}

            {/* --- COMPACT FOOTER --- */}
            <motion.footer variants={itemVariants} className="mt-20 pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 pb-10">
              <div className="flex items-center gap-4">
                <img src="/logo.png" className="h-5 w-auto grayscale opacity-30" alt="AfriDam" />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">
                  © 2026 AfriDam AI • Made with Pride in Lagos, Nigeria
                </p>
              </div>
              <div className="flex gap-6 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">
                <span className="hover:text-[#E1784F] cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-[#E1784F] cursor-pointer transition-colors">Terms</span>
                <span className="hover:text-[#E1784F] cursor-pointer transition-colors">Clinical Protocol</span>
              </div>
            </motion.footer>

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}