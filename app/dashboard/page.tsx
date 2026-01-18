/**
 * 🛡️ AFRIDAM WELLNESS HUB: DASHBOARD
 * Version: 2026.1.1 (Sync & State Fix)
 * Focus: Ensuring the Onboarding form vanishes instantly after use.
 */

"use client"

import { useEffect, useState } from "react"
import { 
  LayoutDashboard, History as HistoryIcon, LogOut, ShoppingBag,
  Stethoscope, Sparkles, ArrowRight, Camera, User as UserIcon, HeartPulse 
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
  
  // 🛡️ SINCERITY FIX: Local state to force the form to vanish instantly
  const [hasJustFinished, setHasJustFinished] = useState(false);

  // Check if user still needs to fill the form
  const requiresOnboarding = user && user.onboardingCompleted !== true && !hasJustFinished;

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

  /**
   * 🛡️ SAVING YOUR PROFILE
   */
  const handleCompleteOnboarding = async (surveyData: any = {}) => {
    // 1. Instantly hide the form so the user feels the "World-Class" speed
    setHasJustFinished(true);

    try {
      // 2. REFERENCE: Using our archived api-client to update the backend
      await updateUser(user?.id, { 
        ...surveyData, 
        onboardingCompleted: true 
      });
      
      // 3. Refresh the global user data so the Profile page is correct
      await mutate();
      
    } catch (err) {
      // If it fails, we allow the form back so they can try again
      setHasJustFinished(false);
      console.error("Profile update failed. Re-trying...");
    }
  }

  if (isLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 bg-[#E1784F] rounded-xl animate-pulse" />
    </div>
  )

  const displayName = user.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase() : "Friend";

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col md:flex-row overflow-x-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 border-r border-border p-8 space-y-10 bg-card/50 backdrop-blur-3xl z-20 sticky top-0 h-screen hidden md:flex flex-col">
        <div className="px-2 cursor-pointer" onClick={() => router.push('/')}>
           <img src="/logo.png" alt="AfriDam AI" className="h-8 w-auto object-contain" />
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: "home", label: "Dashboard", icon: LayoutDashboard },
            { id: "scanner", label: "Skin Health", icon: Camera, path: "/ai-scanner" },
            { id: "checker", label: "Safety Check", icon: Sparkles, path: "/ai-checker" },
            { id: "marketplace", label: "Care Shop", icon: ShoppingBag, path: "/marketplace" },
            { id: "appointment", label: "Care Guide", icon: Stethoscope },
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

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 min-h-[100svh] relative bg-background pb-32">
        <header className="flex justify-between items-center mb-10 text-left">
           <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Hello, {displayName}</h2>
              <p className="text-sm md:text-lg font-bold text-[#4DB6AC] italic uppercase tracking-tight">Check your glow today.</p>
           </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-6">
            
            {activeTab === "home" && (
              <>
                {/* 🛡️ THE PROFILE SETUP FORM */}
                {requiresOnboarding ? (
                  <motion.section variants={itemVariants} className="bg-white border-2 border-[#E1784F]/5 p-8 rounded-[2.5rem] shadow-sm space-y-6 text-left">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Set up your profile</h3>
                      <button onClick={() => handleCompleteOnboarding()} className="text-[8px] font-black uppercase tracking-widest text-gray-300">Skip</button>
                    </div>
                    <OnboardingSurvey onComplete={handleCompleteOnboarding} />
                  </motion.section>
                ) : (
                  <div className="space-y-6">
                    {/* MAIN SCANNER BUTTON */}
                    <motion.section variants={itemVariants} onClick={() => router.push('/ai-scanner')} className="bg-gradient-to-br from-[#E1784F] to-[#C55A32] p-8 rounded-[2.5rem] flex items-center justify-between cursor-pointer shadow-xl text-white">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"><Camera size={24} /></div>
                        <div>
                          <h3 className="text-xl font-bold uppercase italic tracking-tighter">Start Skin Check</h3>
                          <p className="opacity-70 text-[9px] font-black uppercase tracking-widest">Analyze your texture</p>
                        </div>
                      </div>
                      <ArrowRight size={20} />
                    </motion.section>

                    {/* TOOLS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div onClick={() => router.push('/ai-checker')} className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 bg-[#4DB6AC]/10 text-[#4DB6AC] rounded-xl flex items-center justify-center"><Sparkles size={18}/></div>
                        <h4 className="font-black uppercase text-sm tracking-widest">Safety Scan</h4>
                        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Check ingredients for family safety.</p>
                      </div>
                      <div onClick={() => router.push('/marketplace')} className="p-8 bg-gray-50 rounded-[2.5rem] space-y-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><ShoppingBag size={18}/></div>
                        <h4 className="font-black uppercase text-sm tracking-widest">Care Shop</h4>
                        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Shop curated safe products.</p>
                      </div>
                    </div>

                    {/* WELLNESS CHAT */}
                    <motion.section variants={itemVariants} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-[#E1784F] rounded-2xl flex items-center justify-center"><HeartPulse size={24} /></div>
                        <div>
                          <h3 className="text-lg font-black uppercase italic tracking-tighter">Wellness Chat</h3>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Talk to our care team.</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('appointment')} className="w-full md:w-auto px-10 py-4 bg-[#1A1A1A] text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Start Chat</button>
                    </motion.section>
                  </div>
                )}
              </>
            )}

            {activeTab === "appointment" && (
              <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 text-left border border-gray-50">
                 <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black uppercase italic tracking-tighter">Care Guide</h2>
                   <button onClick={() => setActiveTab("home")} className="text-[9px] font-black uppercase px-4 py-2 bg-gray-50 rounded-lg">Back</button>
                 </div>
                 <AppointmentView />
              </motion.div>
            )}

            <footer className="mt-12 opacity-30 text-center">
               <p className="text-[7px] font-black uppercase tracking-[0.4em]">AfriDam AI • Built with Pride</p>
            </footer>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}