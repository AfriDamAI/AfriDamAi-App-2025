/**
 * 🛡️ AFRIDAM CLINICAL CONSOLE: APPOINTMENTS (Rule 7 Sync)
 * Version: 2026.1.4 (Handshake & Sync Alignment)
 * Focus: High-Precision Specialist Access & Billing Handshake.
 */

"use client"

import { useState, useEffect } from "react"
import { 
  CheckCircle2, 
  Stethoscope, 
  ShieldCheck, 
  History as HistoryIcon,
  Zap,
  MessageCircle,
  Loader2,
  ChevronRight,
  Fingerprint
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import apiClient from "@/lib/api-client"

export function AppointmentView() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [appointmentHistory, setAppointmentHistory] = useState<any[]>([]);

  // 🛡️ RULE 7: Subscription Logic Sync
  const hasSubscription = user?.profile?.subscriptionPlan && user?.profile?.subscriptionPlan !== "Free";

  useEffect(() => {
    if (activeTab === 'history' && user?.id) {
       fetchHistory();
    }
  }, [activeTab, user?.id]);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get(`/appointments/history/${user?.id}`);
      // Rule 7: Unpack resultData if present via interceptor
      setAppointmentHistory(response.data || []);
    } catch (err) {
      console.error("Clinical history sync failed.");
    }
  };

  const handleInstantPay = async () => {
    if (bookingStatus === 'processing') return;
    setBookingStatus('processing');

    try {
      /**
       * 🚀 THE HANDSHAKE (Rule 7)
       * Initializing a direct 1:1 specialist link. 
       * Redirects to the Flutterwave/Paystack secure checkout.
       */
      const response = await apiClient.post('/transactions/initiate', {
          plan: 'URGENT_CONSULTATION',
          amount: 15.00,
          type: 'APPOINTMENT'
      });

      const checkoutUrl = response.data?.checkoutUrl || response.data?.link;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Clinical gateway handshake failed.");
      }
    } catch (error) {
      console.error("Payment Initialization Failed.");
      setBookingStatus('idle');
    }
  };

  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 px-6">
        <div className="w-24 h-24 bg-[#4DB6AC] rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-[#4DB6AC]/20">
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">Doctor Notified</h2>
        <p className="text-[#4DB6AC] font-black uppercase text-[10px] tracking-[0.5em] mb-12">
          Priority Session <span className="text-white">Live Now</span>
        </p>
        <Button onClick={() => router.push('/specialist')} className="w-full md:w-auto bg-white text-black h-20 px-12 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl transition-all">Open Clinical Chat</Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 md:space-y-20 pb-20">
      {/* WORLD-CLASS TABS */}
      <div className="flex gap-12 border-b border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar">
        {['book', 'history'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-6 whitespace-nowrap text-[11px] uppercase tracking-[0.4em] font-black transition-all relative ${
              activeTab === tab ? 'text-[#E1784F]' : 'opacity-30 hover:opacity-100 text-white'
            }`}
          >
            {tab === 'book' ? (hasSubscription ? "Clinical Console" : "Specialist Access") : "Session Archive"}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#E1784F] rounded-full" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'book' ? (
          <motion.div 
            key="book"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-12"
          >
            {!hasSubscription ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* PLAN 01: STARTER TRIAL */}
                <div className="bg-black text-white p-12 rounded-[4rem] flex flex-col justify-between min-h-[500px] relative overflow-hidden shadow-2xl border border-white/5">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/10 blur-[100px] rounded-full" />
                  <div className="space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-[#E1784F]/40">
                      <Zap size={28} fill="currentColor" />
                    </div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Starter <br/> Access</h3>
                    <p className="opacity-40 text-[10px] font-black uppercase leading-loose tracking-[0.2em]">
                      Clinical Sync. Expert Support. <br/> Permanent Archive.
                    </p>
                  </div>
                  <div className="space-y-8 relative z-10">
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black italic">$3.00</span>
                      <span className="text-[10px] font-black uppercase opacity-20 tracking-[0.4em]">/ Month</span>
                    </div>
                    <Button 
                      onClick={() => router.push('/pricing')}
                      className="w-full h-20 bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl transition-all"
                    >
                      Initialize Access
                    </Button>
                  </div>
                </div>

                {/* PLAN 02: INSTANT SESSION */}
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-12 rounded-[4rem] flex flex-col justify-between min-h-[500px] hover:border-[#4DB6AC] transition-all group">
                  <div className="space-y-6 text-black dark:text-white">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#4DB6AC] border border-gray-100 dark:border-white/10 group-hover:bg-[#4DB6AC] group-hover:text-white transition-all shadow-sm">
                      <MessageCircle size={28} />
                    </div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Urgent <br/> Link</h3>
                    <p className="opacity-40 text-[10px] font-black uppercase leading-loose tracking-[0.2em]">
                      Live 1:1 Connection with <br/> Board-Certified Specialists.
                    </p>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-baseline gap-3 text-black dark:text-white">
                      <span className="text-6xl font-black italic">$15.00</span>
                      <span className="text-[10px] font-black uppercase opacity-20 tracking-[0.4em]">/ Single Pay</span>
                    </div>
                    <Button 
                      disabled={bookingStatus === 'processing'}
                      onClick={handleInstantPay}
                      className="w-full h-20 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] transition-all active:scale-95 shadow-2xl"
                    >
                      {bookingStatus === 'processing' ? <Loader2 className="animate-spin" /> : 'Request Session'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE CONSOLE */
              <div className="p-16 bg-white dark:bg-white/5 text-black dark:text-white rounded-[5rem] relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#4DB6AC]/10 blur-[150px] rounded-full" />
                <div className="relative z-10 space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center gap-10">
                    <div className="w-24 h-24 bg-[#4DB6AC] rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(77,182,172,0.2)]">
                      <Stethoscope size={48} className="text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-5xl font-black italic uppercase tracking-tighter">Clinical Console</h3>
                      <p className="text-[#4DB6AC] text-[11px] font-black uppercase tracking-[0.6em]">Specialist Network Online</p>
                    </div>
                  </div>
                  <p className="text-black/40 dark:text-white/40 font-black text-sm max-w-xl leading-relaxed uppercase tracking-[0.2em]">
                    Your premium clinical link is active. Our specialist network is ready to review your neural scan history and care diary.
                  </p>
                  <Button onClick={() => router.push('/specialist')} className="w-full md:w-auto h-24 px-16 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] hover:bg-[#4DB6AC] hover:text-white transition-all shadow-2xl group">
                    Enter Live Channel <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ARCHIVE VIEW */
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 px-10 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[4rem]"
          >
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center opacity-20">
               <HistoryIcon size={40} strokeWidth={1} className="text-white" />
            </div>
            <div className="space-y-2">
               <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">No Past Sessions</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic text-white">Clinical Archive is currently at standby.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* SECURITY FOOTER */}
      <footer className="flex flex-col items-center gap-10 pt-20 border-t border-gray-100 dark:border-white/10 opacity-30 pb-10">
        <div className="flex items-center gap-4 text-white">
           <ShieldCheck size={20} className="text-[#4DB6AC]" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">HIPAA Compliant Protocol</p>
        </div>
        <div className="flex items-center gap-2 text-white">
           <Fingerprint size={16} />
           <span className="text-[8px] font-black uppercase tracking-[0.8em]">AES-256 SESSION LOCK</span>
        </div>
      </footer>
    </div>
  )
}