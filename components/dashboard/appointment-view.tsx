"use client"

import { useState } from "react"
import { 
  CheckCircle2, 
  Stethoscope, 
  ShieldCheck, 
  History,
  Zap,
  MessageCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

export function AppointmentView() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const hasSubscription = user?.profile?.subscriptionPlan && user?.profile?.subscriptionPlan !== "Free";

  const handleInstantPay = async () => {
    const token = localStorage.getItem('token');
    
    // 🛡️ RE-ENFORCED: Check for auth before initializing payment
    if (!token) {
      alert("Please sign in to access clinical sessions.");
      return;
    }

    setBookingStatus('processing');
    try {
      // 🛡️ RE-ENFORCED: Standardizing API endpoint to match NestJS clinical node
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/instant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          specialty: 'DERMATOLOGIST',
          type: 'INSTANT_SESSION',
          price: 15.00
        })
      });

      if (!response.ok) throw new Error("Network Response Fail");

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback for direct success if payment is handled internally
        setTimeout(() => setBookingStatus('success'), 2000);
      }
    } catch (error) {
      console.error("Clinical Payment Initialization Failed:", error);
      setBookingStatus('idle');
    }
  };

  // SUCCESS VIEW RENDER (REMAINS UNCHANGED)
  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-10 md:py-20 text-center animate-in zoom-in-95 px-4">
        <div className="w-20 h-20 bg-[#4DB6AC]/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#4DB6AC]/5 border border-[#4DB6AC]/20">
          <CheckCircle2 className="w-10 h-10 text-[#4DB6AC]" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-foreground">Doctor Notified</h2>
        <p className="text-muted-foreground font-bold uppercase text-[9px] tracking-[0.4em] mb-10 max-w-[250px]">
          Priority Session <span className="text-[#E1784F]">Active</span>
        </p>
        <Button onClick={() => setBookingStatus('idle')} className="w-full md:w-auto bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest px-10 h-16 shadow-2xl active:scale-95">Open Live Chat</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 pb-20 md:pb-10">
      {/* TABS LAYER */}
      <div className="flex gap-8 border-b border-border overflow-x-auto no-scrollbar">
        {['book', 'history'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] font-black transition-all border-b-2 ${activeTab === tab ? 'text-[#E1784F] border-[#E1784F]' : 'text-muted-foreground border-transparent opacity-40'}`}
          >
            {tab === 'book' ? (hasSubscription ? "Clinical Console" : "Access Specialist") : "Past Sessions"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'book' ? (
          <motion.div 
            key="book"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-6 md:gap-10"
          >
            {!hasSubscription ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 🏷️ STARTER MONTH */}
                <div className="bg-[#1C1A19] p-8 rounded-[3rem] flex flex-col justify-between space-y-10 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/10 blur-[60px] rounded-full" />
                  <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-2xl">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Starter Month</h3>
                    <p className="opacity-40 text-[9px] font-bold uppercase leading-relaxed tracking-wider">
                      Unlock clinical history and specialist chat for your first 30 days.
                    </p>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black italic">$3</span>
                      <span className="text-[8px] font-black uppercase opacity-30 tracking-[0.3em]">/ Trial Period</span>
                    </div>
                    <Button 
                      onClick={() => router.push('/pricing')}
                      className="w-full h-16 bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all"
                    >
                      Unlock Access
                    </Button>
                  </div>
                </div>

                {/* 🏷️ INSTANT SESSION */}
                <div className="bg-card border border-border p-8 rounded-[3rem] flex flex-col justify-between space-y-10 hover:border-[#4DB6AC]/30 transition-all shadow-sm group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-[#4DB6AC]/10 rounded-2xl flex items-center justify-center text-[#4DB6AC] border border-[#4DB6AC]/20">
                      <MessageCircle size={20} />
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Urgent Session</h3>
                    <p className="text-muted-foreground text-[9px] font-bold uppercase leading-relaxed opacity-40 tracking-wider">
                      Priority dermal analysis via encrypted live chat. Instant start.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-foreground italic">$15</span>
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.3em]">/ Per Session</span>
                    </div>
                    <Button 
                      disabled={bookingStatus === 'processing'}
                      onClick={handleInstantPay}
                      className="w-full h-16 bg-muted/50 text-foreground hover:bg-[#4DB6AC] hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
                    >
                      {bookingStatus === 'processing' ? <Loader2 className="animate-spin" /> : 'Initialize Session'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* 🛡️ SUBSCRIBED: Clinical Console */
              <div className="p-10 bg-[#1C1A19] rounded-[3.5rem] text-white relative overflow-hidden border border-white/5 shadow-2xl">
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#4DB6AC]/10 blur-[100px] rounded-full" />
                <div className="relative z-10 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 bg-[#4DB6AC] rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-[#4DB6AC]/20">
                      <Stethoscope size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter">Clinical Console</h3>
                      <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.4em] mt-1">Specialist Network Online</p>
                    </div>
                  </div>
                  <p className="text-white/40 font-bold text-xs max-w-lg leading-loose uppercase tracking-widest">
                    Your care plan covers unlimited expert consultations. Your data is ready for review.
                  </p>
                  <Button className="w-full md:w-auto h-20 px-16 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] hover:bg-[#4DB6AC] hover:text-white transition-all shadow-2xl active:scale-95">
                    Open Channel
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 opacity-20 px-6"
          >
            <History className="w-12 h-12 mb-4" strokeWidth={1.5} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em]">System Archive Empty</h3>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* DATA SAFETY LEGEND */}
      <div className="flex items-center justify-center gap-4 pt-12 opacity-30 pb-10">
        <ShieldCheck size={14} className="text-[#4DB6AC]" />
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">HIPAA Compliant Node • 256-bit Encrypted</span>
      </div>
    </div>
  )
}