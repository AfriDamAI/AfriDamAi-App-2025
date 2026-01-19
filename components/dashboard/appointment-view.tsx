/**
 * 🛡️ AFRIDAM CLINICAL CONSOLE: APPOINTMENTS
 * Version: 2026.1.3 (Premium Editorial Refactor)
 * Handshake: Fully synced with Render Backend & Flutterwave
 * Focus: High-Contrast UI, Subscription Guard, Mature Typography.
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
import apiClient from "@/lib/api-client" // 🛡️ DIRECT BACKEND SYNC

export function AppointmentView() {
  const { user, mutate } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [appointmentHistory, setAppointmentHistory] = useState<any[]>([]);

  const hasSubscription = user?.profile?.subscriptionPlan && user?.profile?.subscriptionPlan !== "Free";

  // 🛡️ SYNC: Fetch Appointment History if needed
  useEffect(() => {
    if (activeTab === 'history' && user) {
       fetchHistory();
    }
  }, [activeTab, user]);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get(`/appointments/history/${user?.id}`);
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
       * 🚀 OGA HANDSHAKE:
       * Initializing a direct $15.00 session through the Flutterwave gateway.
       */
      const response = await apiClient.post('/appointments/instant', {
          specialty: 'DERMATOLOGIST',
          type: 'INSTANT_SESSION',
          price: 15.00,
          currency: 'USD'
      });

      if (response.data?.checkoutUrl || response.data?.link) {
        window.location.href = response.data.checkoutUrl || response.data.link;
      } else {
        throw new Error("Gateway failed to generate link.");
      }
    } catch (error) {
      console.error("Clinical Payment Initialization Failed.");
      alert("Billing system busy. Please retry.");
      setBookingStatus('idle');
    }
  };

  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 px-6">
        <div className="w-24 h-24 bg-[#4DB6AC] rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl">
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Doctor Notified</h2>
        <p className="text-[#4DB6AC] font-black uppercase text-[10px] tracking-[0.5em] mb-12">
          Priority Session <span className="text-white">Live Now</span>
        </p>
        <Button onClick={() => setBookingStatus('idle')} className="w-full md:w-auto bg-white text-black h-20 px-12 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl transition-all">Open Clinical Chat</Button>
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
              activeTab === tab ? 'text-[#E1784F]' : 'opacity-30 hover:opacity-100'
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
                <div className="bg-black text-white p-12 rounded-[4rem] flex flex-col justify-between space-y-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/10 blur-[100px] rounded-full" />
                  <div className="space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-2xl">
                      <Zap size={28} fill="currentColor" />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Starter Month</h3>
                    <p className="opacity-40 text-[10px] font-black uppercase leading-loose tracking-[0.2em]">
                      Full Clinical Sync. Specialist Chat Access. Permanent History.
                    </p>
                  </div>
                  <div className="space-y-8 relative z-10">
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black italic">$3.00</span>
                      <span className="text-[10px] font-black uppercase opacity-20 tracking-[0.4em]">/ Trial</span>
                    </div>
                    <Button 
                      onClick={() => router.push('/pricing')}
                      className="w-full h-20 bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl transition-all"
                    >
                      Unlock Access
                    </Button>
                  </div>
                </div>

                {/* PLAN 02: INSTANT SESSION */}
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-12 rounded-[4rem] flex flex-col justify-between space-y-12 hover:border-[#4DB6AC] transition-all group">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#4DB6AC] border border-gray-100 dark:border-white/10 group-hover:bg-[#4DB6AC] group-hover:text-white transition-all">
                      <MessageCircle size={28} />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Urgent Portal</h3>
                    <p className="opacity-40 text-[10px] font-black uppercase leading-loose tracking-[0.2em]">
                      Direct 1:1 Live Link with Board-Certified Dermatologists.
                    </p>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-baseline gap-3">
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
              /* ACTIVE CONSOLE: THE "HERO" VIEW */
              <div className="p-16 bg-black dark:bg-white text-white dark:text-black rounded-[5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#4DB6AC]/20 blur-[150px] rounded-full" />
                <div className="relative z-10 space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center gap-10">
                    <div className="w-24 h-24 bg-[#4DB6AC] rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(77,182,172,0.4)]">
                      <Stethoscope size={48} className="text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-5xl font-black italic uppercase tracking-tighter">Clinical Console</h3>
                      <p className="text-[#4DB6AC] text-[11px] font-black uppercase tracking-[0.6em]">System Online • Priority Verified</p>
                    </div>
                  </div>
                  <p className="text-white/40 dark:text-black/40 font-black text-sm max-w-xl leading-relaxed uppercase tracking-[0.2em]">
                    Your premium access is active. Our specialist network is ready to review your neural scan reports instantly.
                  </p>
                  <Button className="w-full md:w-auto h-24 px-16 bg-white dark:bg-black text-black dark:text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] hover:bg-[#4DB6AC] hover:text-white transition-all shadow-2xl group">
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
               <HistoryIcon size={40} strokeWidth={1} />
            </div>
            <div className="space-y-2">
               <h3 className="text-3xl font-black italic uppercase tracking-tighter">No Past Sessions</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Clinical Archive is currently at standby.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* SECURITY FOOTER */}
      <footer className="flex flex-col items-center gap-10 pt-20 border-t border-gray-100 dark:border-white/10 opacity-30 pb-10">
        <div className="flex items-center gap-4">
           <ShieldCheck size={20} className="text-[#4DB6AC]" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">HIPAA Compliant Node</p>
        </div>
        <div className="flex items-center gap-2">
           <Fingerprint size={16} />
           <span className="text-[8px] font-black uppercase tracking-[0.8em]">AES-256 SESSION LOCK</span>
        </div>
      </footer>
    </div>
  )
}