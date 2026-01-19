/**
 * 🛡️ AFRIDAM WELLNESS HUB: DASHBOARD (FAST-TRACK VERSION)
 * Sync: lib/api-client.ts
 * Focus: High-Contrast UI, Mobile-First, Instant Onboarding Exit.
 */

"use client"

import { useEffect, useState } from "react"
import { 
  LayoutDashboard, ShoppingBag, Stethoscope, Sparkles, 
  ArrowRight, Camera, User as UserIcon, HeartPulse, MessageSquare
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { OnboardingSurvey } from "@/components/onboarding-survey"
import { updateUser } from "@/lib/api-client"

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
}

export default function DashboardPage() {
  const { user, signOut, isLoading, mutate } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [hasJustFinished, setHasJustFinished] = useState(false);

  /**
   * 🛡️ THE "EXPRESS" BYPASS: 
   * We set this to false so the onboarding survey never shows up.
   * Your users go straight to the scanner.
   */
  const requiresOnboarding = false; 

  useEffect(() => {
    if (!isLoading && !user) router.push("/")
    
    // 🚀 AUTO-SYNC: If user isn't marked as onboarded in DB, we do it silently.
    if (user && user.onboardingCompleted !== true) {
      handleSilentOnboarding();
    }
  }, [user, isLoading, router])

  const handleSilentOnboarding = async () => {
    try {
      await updateUser(user?.id, { onboardingCompleted: true });
      await mutate();
    } catch (err) {
      console.error("Silent sync failed, but we are moving on.");
    }
  }

  const handleCompleteOnboarding = async (surveyData: any = {}) => {
    setHasJustFinished(true);
    try {
      await updateUser(user?.id, { ...surveyData, onboardingCompleted: true });
      await mutate();
    } catch (err) {
      setHasJustFinished(false);
      console.error("Profile update failed.");
    }
  }

  if (isLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex flex-col md:flex-row overflow-x-hidden selection:bg-primary/20">
      
      {/* --- TACTICAL SIDEBAR (Desktop) --- */}
      <aside className="w-72 border-r border-border/50 p-8 space-y-10 bg-card/30 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
        <div className="px-2 mb-4">
           <img src="/logo.png" alt="AfriDam AI" className="h-10 w-auto invert dark:invert-0" />
        </div>
        <nav className="flex-1 space-y-3">
          {[
            { id: "home", label: "Overview", icon: LayoutDashboard },
            { id: "scanner", label: "AI Scanner", icon: Camera, path: "/ai-scanner" },
            { id: "checker", label: "Ingredient Check", icon: Sparkles, path: "/ai-checker" },
            { id: "marketplace", label: "Care Shop", icon: ShoppingBag, path: "/marketplace" },
            { id: "appointment", label: "Care Guide", icon: Stethoscope },
          ].map((link) => (
            <button 
              key={link.id}
              onClick={() => link.path ? router.push(link.path) : setActiveTab(link.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all border ${
                activeTab === link.id 
                ? "bg-primary text-white border-primary shadow-xl scale-[1.02]" 
                : "text-muted-foreground border-transparent hover:bg-secondary/50"
              }`}
            >
              <link.icon size={16} /> {link.label}
            </button>
          ))}
        </nav>
        <button onClick={() => signOut?.()} className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors">
          Log Out
        </button>
      </aside>

      {/* --- MAIN CONTENT (Mobile First) --- */}
      <main className="flex-1 p-5 md:p-12 lg:p-16 relative pb-32">
        <header className="flex justify-between items-center mb-10">
           <div className="text-left">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                {activeTab === "home" ? `Hello, ${user.firstName || 'Chief'}` : activeTab}
              </h2>
              <p className="text-xs md:text-sm font-bold text-primary italic uppercase tracking-[0.2em] mt-2 opacity-80">
                Premium Skin Intelligence
              </p>
           </div>
           <div onClick={() => router.push('/profile')} className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center cursor-pointer hover:border-primary transition-all">
              <UserIcon size={20} className="text-primary" />
           </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={itemVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto space-y-8">
            
            {activeTab === "home" && (
              <>
                {requiresOnboarding ? (
                  <section className="bg-card border-2 border-primary/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Personalize Your Care</h3>
                      <OnboardingSurvey onComplete={handleCompleteOnboarding} />
                    </div>
                  </section>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {/* HERO ACTION: SCANNER */}
                    <div onClick={() => router.push('/ai-scanner')} className="group relative bg-primary rounded-[2.5rem] p-10 text-white overflow-hidden cursor-pointer shadow-2xl shadow-primary/20">
                      <div className="relative z-10 flex justify-between items-end">
                        <div className="text-left space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full">New Scan Available</span>
                          <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">AI Skin Scanner</h3>
                          <p className="opacity-80 text-xs font-medium max-w-[200px]">Get a clinical-grade health analysis in seconds.</p>
                        </div>
                        <div className="w-16 h-16 bg-white text-primary rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ArrowRight size={28} />
                        </div>
                      </div>
                      <Camera className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
                    </div>

                    {/* SECONDARY TOOLS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div onClick={() => router.push('/ai-checker')} className="p-8 bg-card border border-border/50 rounded-[2.5rem] hover:border-primary/50 transition-all cursor-pointer group">
                        <Sparkles className="text-primary mb-4 group-hover:rotate-12 transition-transform" size={32} />
                        <h4 className="font-black uppercase text-lg tracking-tighter italic">Ingredient Checker</h4>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Verify safety labels instantly.</p>
                      </div>
                      <div onClick={() => router.push('/marketplace')} className="p-8 bg-card border border-border/50 rounded-[2.5rem] hover:border-primary/50 transition-all cursor-pointer group">
                        <ShoppingBag className="text-primary mb-4 group-hover:rotate-12 transition-transform" size={32} />
                        <h4 className="font-black uppercase text-lg tracking-tighter italic">Curated Shop</h4>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Verified skin-safe products.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "appointment" && <div className="p-10 text-center">Care Guide Content Coming Soon</div>}
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={() => setActiveTab('appointment')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 md:hidden"
        >
          <MessageSquare size={24} />
        </button>
      </main>
    </div>
  )
}