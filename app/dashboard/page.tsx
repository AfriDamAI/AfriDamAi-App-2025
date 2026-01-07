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
  ArrowUpRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider" 
import { AppointmentView } from "@/components/dashboard/appointment-view"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuth()
  const { theme } = useTheme() 
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const isDark = theme === "dark"

  useEffect(() => {
    if (!isLoading && !user) router.push("/")
  }, [user, isLoading, router])

  if (isLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-16 bg-[#E1784F] rounded-2xl flex items-center justify-center font-black text-white shadow-2xl"
      >A</motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-hidden">
      
      {/* --- 1. SIDEBAR: FULLY CONNECTED --- */}
      <aside className="w-full md:w-80 border-r border-border p-8 space-y-12 bg-muted/30 backdrop-blur-3xl z-20 sticky top-0 h-screen hidden md:flex flex-col">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex flex-col items-center gap-4 px-2 cursor-pointer mb-6 border-b border-border pb-10" 
          onClick={() => router.push('/')}
        >
           <img 
             src="/logo.png" 
             alt="AfriDam AI Logo" 
             className={`w-32 h-auto object-contain transition-all ${isDark ? 'brightness-100' : 'brightness-90'}`} 
           />
           <div className="text-center">
             <span className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.5em]">Clinical Portal</span>
           </div>
        </motion.div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] px-4 mb-4 text-center">Command Center</p>
          
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "scanner", label: "AI Scanner", icon: Activity, path: "/ai-scanner" },
            { id: "checker", label: "Ingredient Checker", icon: Search, path: "/ai-checker" },
            { id: "marketplace", label: "Marketplace", icon: ShoppingBag, path: "/marketplace" },
            { id: "appointment", label: "Doctor Chat", icon: Stethoscope },
            { id: "history", label: "Logs", icon: HistoryIcon, path: "/history" }
          ].map((link) => (
            <button 
              key={link.id}
              onClick={() => {
                if (link.path) {
                    router.push(link.path); // External route
                } else {
                    setActiveTab(link.id); // Internal dashboard tab
                }
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-[11px] uppercase tracking-widest font-black transition-all ${
                activeTab === link.id ? "bg-[#E1784F] text-white shadow-2xl shadow-[#E1784F]/20" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon size={18} /> {link.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-border">
           <button onClick={() => signOut?.()} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
             <LogOut size={18} /> Terminate Session
           </button>
        </div>
      </aside>

      {/* --- 2. MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 max-h-screen overflow-y-auto relative bg-background">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
        
        <header className="flex justify-between items-center mb-16 relative z-10">
           <div className="flex items-center gap-3 bg-muted px-5 py-2.5 rounded-full border border-border backdrop-blur-md">
              <span className="w-2 h-2 bg-[#4DB6AC] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DB6AC]">Clinical Node Active</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-foreground uppercase tracking-tighter italic leading-none">{user.firstName} {user.lastName}</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1">ID: {user.email?.split('@')[0].toUpperCase()}</p>
              </div>
              <div onClick={() => router.push('/profile')} className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center cursor-pointer hover:border-[#E1784F]/50 transition-all group shadow-sm">
                <UserIcon size={22} className="text-muted-foreground group-hover:text-[#E1784F] transition-colors" />
              </div>
           </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10 max-w-7xl mx-auto"
          >
            {activeTab === "overview" && (
              <div className="space-y-10">
                {/* 3. HERO CTA: CONNECTED TO SCANNER */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-[#E1784F] to-[#C55A32] p-10 md:p-16 rounded-[4rem] relative overflow-hidden group shadow-2xl shadow-[#E1784F]/20 cursor-pointer text-white"
                  onClick={() => router.push('/ai-scanner')}
                >
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                   <div className="relative z-10 max-w-xl space-y-6">
                      <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                        Instant <br /> AI Analysis
                      </h2>
                      <p className="opacity-90 text-lg font-medium leading-relaxed">
                        Immediate clinical-grade skin assessment optimized for melanin-rich dermal data.
                      </p>
                      <div className="pt-4 flex items-center gap-4 font-black uppercase text-xs tracking-[0.3em]">
                        Start Scanning <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                   </div>
                </motion.div>

                {/* 4. FEATURE CARDS: FULLY CONNECTED */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: ShoppingBag, label: "Marketplace", sub: "Vetted Products", color: "#4DB6AC", path: "/marketplace" },
                    { icon: Search, label: "Ingredient Checker", sub: "Safety Analysis", color: "#E1784F", path: "/ai-checker" },
                    { icon: Stethoscope, label: "Doctor Chat", sub: "Specialist Access", color: isDark ? "#888" : "#444", tab: "appointment" }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (stat.tab) {
                            setActiveTab(stat.tab); // Internal tab switch
                        } else if (stat.path) {
                            router.push(stat.path); // External page redirect
                        }
                      }}
                      className="bg-card border border-border p-10 rounded-[3.5rem] transition-all cursor-pointer group relative overflow-hidden shadow-md"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-[0.08]" style={{ backgroundColor: stat.color }} />
                      <stat.icon className="mb-8 group-hover:scale-110 transition-transform" size={32} style={{ color: stat.color }} />
                      <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2 text-foreground">{stat.label}</h3>
                      <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">{stat.sub}</p>
                      <ArrowUpRight className="absolute bottom-10 right-10 text-muted-foreground group-hover:text-[#E1784F] transition-colors" size={24} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* --- 5. APPOINTMENT VIEW TAB --- */}
            {activeTab === "appointment" && (
              <motion.div variants={itemVariants} className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                  <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-foreground leading-none">
                      Expert <span className="text-[#E1784F]">Consultation</span>
                    </h2>
                    <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] mt-4">
                      Pan-African Specialist Network • Lagos & Nairobi
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("overview")} 
                    className="flex items-center gap-2 bg-muted px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E1784F] hover:text-white transition-all shadow-sm"
                  >
                    Back to Overview
                  </button>
                </div>
                
                <div className="bg-card rounded-[3.5rem] border border-border p-8 md:p-12 shadow-sm">
                   <AppointmentView />
                </div>
              </motion.div>
            )}

            {/* --- 6. LOGS (HISTORY) VIEW TAB --- */}
            {activeTab === "history" && (
              <motion.div variants={itemVariants} className="space-y-10">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-foreground leading-none">
                      Clinical <span className="text-[#4DB6AC]">Logs</span>
                    </h2>
                    <button 
                      onClick={() => setActiveTab("overview")} 
                      className="flex items-center gap-2 bg-muted px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E1784F] hover:text-white transition-all"
                    >
                      Back to Overview
                    </button>
                 </div>

                 <div className="bg-muted/30 rounded-[3rem] border border-dashed border-border p-20 text-center">
                    <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                    <h3 className="text-xl font-black italic uppercase text-foreground">No Logs Detected</h3>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] mt-4">Scan history will appear after your first AI analysis.</p>
                    <button 
                      onClick={() => router.push('/ai-scanner')}
                      className="mt-10 px-10 py-4 bg-foreground text-background rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4DB6AC] hover:text-white transition-all"
                    >
                      Start First Scan
                    </button>
                 </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}