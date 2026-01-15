"use client"

import { useState } from "react"
import { 
  CheckCircle2, 
  Stethoscope, 
  ShieldCheck, 
  History,
  Zap,
  MessageCircle,
  ArrowRight
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
    setBookingStatus('processing');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/instant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          specialty: 'DERMATOLOGIST',
          type: 'INSTANT_SESSION',
          price: 15.00
        })
      });

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setTimeout(() => setBookingStatus('success'), 2000);
      }
    } catch (error) {
      console.error("Payment Initialization Failed", error);
      setBookingStatus('idle');
      alert("Consultation service temporarily unavailable.");
    }
  };

  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-10 md:py-20 text-center animate-in zoom-in-95 px-4">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#4DB6AC]/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#4DB6AC]" />
        </div>
        <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-2 text-foreground">Doctor Notified</h2>
        <p className="text-muted-foreground font-bold uppercase text-[8px] md:text-[9px] tracking-widest mb-10 max-w-[250px] md:max-w-none">
          Your $15 session is active. A specialist will join the chat in <span className="text-[#E1784F]">~5 mins</span>.
        </p>
        <Button onClick={() => setBookingStatus('idle')} className="w-full md:w-auto bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest px-10 h-14">Open Chat</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 pb-20 md:pb-10">
      {/* TABS - MOBILE FRIENDLY SCROLLING */}
      <div className="flex gap-6 md:gap-8 border-b border-border overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('book')}
          className={`pb-4 whitespace-nowrap text-[9px] md:text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${activeTab === 'book' ? 'text-[#E1784F] border-[#E1784F]' : 'text-muted-foreground border-transparent'}`}
        >
          {hasSubscription ? "Consult Specialist" : "Access Specialist"}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-4 whitespace-nowrap text-[9px] md:text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${activeTab === 'history' ? 'text-[#E1784F] border-[#E1784F]' : 'text-muted-foreground border-transparent'}`}
        >
          Past Sessions
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'book' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-6 md:gap-10"
          >
            {!hasSubscription ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* OPTION 1: STARTER TRIAL */}
                <div className="bg-[#1C1A19] dark:bg-[#F7F3EE] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-between space-y-6 md:space-y-8 text-white dark:text-[#1C1A19] relative overflow-hidden group border-2 border-transparent hover:border-[#E1784F]/30 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#E1784F]/20 blur-3xl rounded-full" />
                  <div className="space-y-3 md:space-y-4 relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E1784F] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tight">Starter Month</h3>
                    <p className="opacity-60 text-[8px] md:text-[10px] font-bold uppercase leading-relaxed">
                      Unlock full clinical access and specialist chat for your first 30 days.
                    </p>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-black italic">$3</span>
                      <span className="text-[8px] font-black uppercase opacity-60 tracking-widest">/ First Month</span>
                    </div>
                    <Button 
                      onClick={() => router.push('/pricing')}
                      className="w-full h-12 md:h-14 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[8px] md:text-[9px] tracking-widest shadow-xl"
                    >
                      Unlock Access
                    </Button>
                  </div>
                </div>

                {/* OPTION 2: INSTANT SESSION */}
                <div className="bg-card border-2 border-border p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-between space-y-6 md:space-y-8 hover:border-[#4DB6AC] transition-all group">
                  <div className="space-y-3 md:space-y-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#4DB6AC]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#4DB6AC]">
                      <MessageCircle size={20} />
                    </div>
                    <h3 className="text-lg md:text-xl font-black italic uppercase tracking-tight text-foreground">Urgent Session</h3>
                    <p className="text-muted-foreground text-[8px] md:text-[10px] font-bold uppercase leading-relaxed opacity-70">
                      Need an answer now? Get a priority one-time consultation today.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-black text-foreground italic">$15</span>
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">/ Session</span>
                    </div>
                    <Button 
                      disabled={bookingStatus === 'processing'}
                      onClick={handleInstantPay}
                      className="w-full h-12 md:h-14 bg-muted text-foreground hover:bg-[#4DB6AC] hover:text-white rounded-xl font-black uppercase text-[8px] md:text-[9px] tracking-widest transition-all"
                    >
                      {bookingStatus === 'processing' ? 'Connecting...' : 'Start Session'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* SUBSCRIBED VIEW */
              <div className="p-6 md:p-10 bg-gradient-to-br from-[#1C1A19] to-black rounded-[2rem] md:rounded-[3rem] text-white relative overflow-hidden border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-[#E1784F]/10 blur-[80px] rounded-full" />
                <div className="relative z-10 space-y-6 md:space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#4DB6AC] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <Stethoscope size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Clinical Console</h3>
                      <p className="text-[#4DB6AC] text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mt-1">Direct Specialist Line Active</p>
                    </div>
                  </div>
                  <p className="text-white/70 font-medium text-xs md:text-sm max-w-lg leading-relaxed italic">
                    As a Care Plan member, you have priority access to our clinical team. Start a session now.
                  </p>
                  <Button className="w-full md:w-auto h-14 md:h-16 px-12 bg-white text-[#1C1A19] rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-[#E1784F] hover:text-white transition-all shadow-2xl">
                    Start Consultation
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px] text-center space-y-4 opacity-40 px-6"
          >
            <History className="w-8 h-8 md:w-10 md:h-10 mb-2" />
            <h3 className="text-[10px] font-black uppercase tracking-widest">No Past Logs Found</h3>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-center justify-center gap-3 pt-6 opacity-30 pb-10 md:pb-0">
        <ShieldCheck size={12} className="text-[#4DB6AC]" />
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em]">Verified clinical specialists only</span>
      </div>
    </div>
  )
}