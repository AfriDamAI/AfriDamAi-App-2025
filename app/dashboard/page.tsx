/**
 * 🛡️ AFRIDAM CARE HUB: DASHBOARD
 * Version: 2026.1.1 (Mobile-First Polish)
 * Focus: World-class UI with sharp, non-cluttered navigation
 */

"use client"

import { useEffect, useState } from "react"
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  LogOut, 
  ShoppingBag,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Zap,
  Camera,
  User as UserIcon,
  HeartPulse 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider" 
import { AppointmentView } from "@/components/dashboard/appointment-view"
import { OnboardingSurvey } from "@/components/onboarding-survey"
import { getHistory, type ScanRecord } from "@/lib/history-manager"
import { updateUser } from "@/lib/api-client"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export default function DashboardPage() {
  const { user, signOut, isLoading, mutate } = useAuth()
  const { theme, setTheme } = useTheme() 
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([])

  const requiresOnboarding = user?.onboardingCompleted === false || user?.profile?.onboardingCompleted === false;

  useEffect(() => {
    if (!theme) setTheme('light')
    if (!isLoading) {
      if (!user) {
        router.push("/")
        return
      }
      const history = getHistory().slice(0, 3)
      setRecentScans(history)
    }
  }, [user, isLoading, router, theme, setTheme])

  const handleCompleteOnboarding = async (surveyData: any) => {
    try {
      await updateUser(user.id, { ...surveyData, onboardingCompleted: true });
      await mutate();
    } catch (err) {
      console.error("Profile sync failed:", err);
    }
  }

  if (isLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-12 h-12 bg-[#E1784F] rounded-2xl"
      />
    </div>
  )

  const displayName = user.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase() : "Friend";

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-[#E1784F]/30 overflow-x-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-72 border-r border-border p-8 space-y-10 bg-card/50 backdrop-blur-3xl z-20 sticky top-0 h-screen hidden md:flex flex-col">
        <div className="px-2 cursor-pointer" onClick={() => router.push('/')}>
           <img src="/logo.png" alt="AfriDam AI" className="h-10 w-auto object-contain" />
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: "home", label: "Dashboard", icon: LayoutDashboard },
            { id: "scanner", label: "Skin Health", icon: Camera, path: "/ai-scanner" },
            { id: "checker", label: "Safety Check", icon: Sparkles, path: "/ai-checker" },
            { id: "marketplace", label: "Care Shop", icon: ShoppingBag, path: "/marketplace" },
            { id: "appointment", label: "Care Guide", icon: Stethoscope },
            { id: "history", label: "Skin Diary", icon: HistoryIcon, path: "/history" }
          ].map((link) => (
            <button 
              key={link.id}
              onClick={() => link.path ? router.push(link.path) : setActiveTab(link.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
                activeTab === link.id ? "bg-[#E1784F] text-white shadow-lg" : "text-muted-foreground hover:text-[#E1784F]"
              }`}
            >
              <link.icon size={16} /> {link.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-border flex items-center justify-between px-2">
           <button onClick={() => signOut?.()} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 flex items-center gap-2">
             <LogOut size={14} /> Sign Out
           </button>
           <div onClick={() => router.push('/profile')} className="w-10 h-10 rounded-xl bg-[#E1784F]/10 flex items-center justify-center cursor-pointer">
              <UserIcon size={16} className="text-[#E1784F]" />
           </div>
        </div>
      </aside>

      {/* --- 📱 MOBILE SHARP DOCK (REFINED) --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-card/80 backdrop-blur-2xl border border-[#E1784F]/20 z-50 rounded-[2rem] px-8 py-4 shadow-2xl md:hidden">
        <div className="flex justify-between items-center">
          {[
            { id: "home", icon: LayoutDashboard, label: "Home" },
            { id: "scanner", icon: Camera, label: "Scan", path: "/ai-scanner" },
            { id: "checker", icon: Sparkles, label: "Safety", path: "/ai-checker" }
          ].map((link) => (
            <button 
              key={link.id} 
              onClick={() => link.path ? router.push(link.path) : setActiveTab(link.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === link.id ? "text-[#E1784F]" : "text-muted-foreground/40"}`}
            >
              <link.icon size={20} strokeWidth={activeTab === link.id ? 2.5 : 2} />
              <span className="text-[8px] font-bold uppercase tracking-widest">{link.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-5 md:p-12 lg:p-16 min-h-[100svh] overflow-y-auto relative bg-background pb-40 md:pb-12 scroll-smooth">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
        
        <header className="flex justify-between items-center mb-10 relative z-10 text-left">
           <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Hello, {displayName}</h2>
              <p className="text-sm md:text-lg font-medium text-[#4DB6AC] italic">Check if your skin glows today.</p>
           </div>
           <div onClick={() => router.push('/profile')} className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center md:hidden cursor-pointer">
              <UserIcon size={20} className="text-[#E1784F]" />
           </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 max-w-5xl mx-auto space-y-6 md:space-y-10">
            
            {activeTab === "home" && (
              <>
                {requiresOnboarding && (
                  <motion.section variants={itemVariants} className="bg-white dark:bg-card border border-gray-100 dark:border-border p-8 rounded-[2.5rem] shadow-sm space-y-6 text-left">
                    <h3 className="text-xl font-bold">Start your Journey</h3>
                    <OnboardingSurvey onComplete={handleCompleteOnboarding} />
                  </motion.section>
                )}

                {/* WELLNESS CHAT */}
                <motion.section variants={itemVariants} className="p-6 md:p-8 bg-card border border-[#E1784F]/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-5 text-left relative z-10">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-[#E1784F]"><HeartPulse size={24} /></div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">Wellness Chat</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Speak with our care team for advice.</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('appointment')} className="w-full md:w-auto px-8 py-3 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">Start Chat</button>
                </motion.section>

                {/* SCANNER CARD */}
                <motion.section variants={itemVariants} onClick={() => router.push('/ai-scanner')} className="relative overflow-hidden bg-gradient-to-br from-[#E1784F] to-[#C55A32] p-6 md:p-10 rounded-[2.5rem] flex items-center justify-between cursor-pointer group shadow-xl">
                  <div className="flex items-center gap-4 text-left relative z-10 text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center"><Camera size={24} /></div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">Skin Check</h3>
                      <p className="text-white/70 text-[9px] font-bold uppercase">Check your glow today</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white text-[#E1784F] rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform"><ArrowRight size={18} /></div>
                </motion.section>

                {/* TOOLS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <motion.div variants={itemVariants} onClick={() => router.push('/ai-checker')} className="p-8 bg-card/40 border border-border rounded-[2.5rem] space-y-4 hover:border-[#4DB6AC]/50 cursor-pointer shadow-sm">
                    <div className="w-10 h-10 bg-[#4DB6AC]/10 text-[#4DB6AC] rounded-xl flex items-center justify-center"><Sparkles size={18}/></div>
                    <h4 className="font-bold uppercase tracking-tight">Safety Scan</h4>
                    <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-widest">Safe family skincare.</p>
                  </motion.div>
                  <motion.div variants={itemVariants} onClick={() => router.push('/marketplace')} className="p-8 bg-card/40 border border-border rounded-[2.5rem] space-y-4 hover:border-blue-400/50 cursor-pointer shadow-sm">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><ShoppingBag size={18}/></div>
                    <h4 className="font-bold uppercase tracking-tight">Care Shop</h4>
                    <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-widest">Restoration products.</p>
                  </motion.div>
                </div>
              </>
            )}

            {activeTab === "appointment" && (
              <motion.div variants={itemVariants} className="bg-card rounded-[2.5rem] border border-border p-6 md:p-10 text-left">
                 <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-bold uppercase">Care Team</h2>
                   <button onClick={() => setActiveTab("home")} className="text-[9px] font-black uppercase px-4 py-2 bg-muted rounded-lg">Back</button>
                 </div>
                 <AppointmentView />
              </motion.div>
            )}

            <footer className="mt-12 pt-8 border-t border-border/40 flex flex-col items-center gap-4 pb-20 md:pb-4">
               <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 text-center italic">
                 AfriDam is a skin wellness support tool. Not for medical diagnosis.
               </p>
               <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 text-center">© 2026 AfriDam AI</p>
            </footer>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}