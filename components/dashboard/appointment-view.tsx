"use client"

import { useState } from "react"
import { 
  CheckCircle2, 
  Stethoscope, 
  ShieldCheck, 
  History,
  Zap,
  Lock,
  ArrowRight,
  UserCheck,
  MessageCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export function AppointmentView() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Logic: Check if user is a subscriber
  const hasSubscription = user?.profile?.subscriptionPlan && user?.profile?.subscriptionPlan !== "Free";

  const handleInstantPay = () => {
    setBookingStatus('processing');
    // Logic for the $15 one-time checkout
    setTimeout(() => setBookingStatus('success'), 2000);
  };

  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-[#4DB6AC]/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#4DB6AC]" />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-foreground">Doctor Notified</h2>
        <p className="text-muted-foreground font-bold uppercase text-[9px] tracking-widest mb-10">
          Your $15 session is active. A specialist will join the chat in <span className="text-[#E1784F]">~5 mins</span>.
        </p>
        <Button onClick={() => setBookingStatus('idle')} className="bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest px-10 h-14">Open Chat</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex gap-8 border-b border-border">
        <button 
          onClick={() => setActiveTab('book')}
          className={`pb-4 text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${activeTab === 'book' ? 'text-[#E1784F] border-[#E1784F]' : 'text-muted-foreground border-transparent'}`}
        >
          {hasSubscription ? "Consult Specialist" : "Access Specialist"}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-4 text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${activeTab === 'history' ? 'text-[#E1784F] border-[#E1784F]' : 'text-muted-foreground border-transparent'}`}
        >
          Past Sessions
        </button>
      </div>

      {activeTab === 'book' ? (
        <div className="grid lg:grid-cols-1 md:gap-10">
          {!hasSubscription ? (
            /* --- THE CHOICE SCREEN FOR NON-SUBSCRIBERS --- */
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* OPTION 1: STARTER TRIAL (UPDATED TO $3) */}
              <div className="bg-[#1C1A19] dark:bg-[#F7F3EE] p-8 rounded-[2.5rem] flex flex-col justify-between space-y-8 text-white dark:text-[#1C1A19] relative overflow-hidden group border-2 border-transparent hover:border-[#E1784F]/30 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/20 blur-3xl rounded-full" />
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Starter Month</h3>
                  <p className="opacity-60 text-[10px] font-bold uppercase leading-relaxed">
                    Unlock full clinical access and specialist chat for your first 30 days. Perfect for new members.
                  </p>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic">$3</span>
                    <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">/ First Month</span>
                  </div>
                  <Button 
                    onClick={() => router.push('/pricing')}
                    className="w-full h-14 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl"
                  >
                    Unlock Starter Access
                  </Button>
                </div>
              </div>

              {/* OPTION 2: INSTANT ONE-TIME CHAT */}
              <div className="bg-card border-2 border-border p-8 rounded-[2.5rem] flex flex-col justify-between space-y-8 hover:border-[#4DB6AC] transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-[#4DB6AC]/10 rounded-2xl flex items-center justify-center text-[#4DB6AC]">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-foreground">Urgent One-Time Session</h3>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase leading-relaxed opacity-70">
                    Need an answer now without a plan? Get a priority one-time consultation today.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-foreground italic">$15</span>
                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">/ Session</span>
                  </div>
                  <Button 
                    onClick={handleInstantPay}
                    className="w-full h-14 bg-muted text-foreground hover:bg-[#4DB6AC] hover:text-white rounded-xl font-black uppercase text-[9px] tracking-widest transition-all"
                  >
                    Start $15 Session
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* --- THE ACTIVE STATE FOR SUBSCRIBERS --- */
            <div className="p-10 bg-gradient-to-br from-[#1C1A19] to-black rounded-[3rem] text-white relative overflow-hidden border border-white/5 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/10 blur-[80px] rounded-full" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#4DB6AC] rounded-2xl flex items-center justify-center shadow-lg">
                    <Stethoscope size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Clinical Console</h3>
                    <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.3em] mt-1">Direct Specialist Line Active</p>
                  </div>
                </div>
                <p className="text-white/70 font-medium text-sm max-w-lg leading-relaxed italic">
                  As a Care Plan member, you have priority access to our clinical team. Start a session to review your recent scans or discuss your skin progress.
                </p>
                <Button className="h-16 px-12 bg-white text-[#1C1A19] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#E1784F] hover:text-white transition-all shadow-2xl">
                  Start Consultation
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4 opacity-40">
          <History className="w-10 h-10 mb-2" />
          <h3 className="text-sm font-black uppercase tracking-widest">No Past Logs</h3>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-3 pt-6 opacity-30">
        <ShieldCheck size={12} className="text-[#4DB6AC]" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Verified clinical specialists only</span>
      </div>
    </div>
  )
}