"use client"

import { useState } from "react"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Stethoscope, 
  ShieldCheck, 
  X,
  CreditCard,
  History,
  CalendarCheck,
  Globe,
  UserRound,
  GraduationCap // Ensure this matches the usage below
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const SPECIALTIES = [
  {
    id: "spec1",
    role: "Consultant Dermatologist",
    description: "Expert clinical diagnosis for complex skin conditions and melanin-rich pathology.",
    focus: "Medical Dermatology",
    icon: Stethoscope,
    price: 25000,
  },
  {
    id: "spec2",
    role: "Clinical Nurse Specialist",
    description: "Specialized care coordination, routine dermal monitoring, and AI result verification.",
    focus: "Nursing & Monitoring",
    icon: GraduationCap, // FIXED: Changed from graduationCap to GraduationCap
    price: 15000,
  },
  {
    id: "spec3",
    role: "Skincare Consultant",
    description: "Guidance on product regimens and maintenance for healthy, radiant skin.",
    focus: "Aesthetic Health",
    icon: UserRound,
    price: 10000,
  }
];

export function AppointmentView() {
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const selectedSpecialty = SPECIALTIES.find(s => s.id === selectedSpecId);

  const handleBooking = () => {
    setBookingStatus('processing');
    // Simulate production API delay
    setTimeout(() => setBookingStatus('success'), 2000);
  };

  const resetView = () => {
    setSelectedSpecId(null);
    setSelectedTime(null);
    setBookingStatus('idle');
  };

  if (bookingStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-card rounded-[3rem] border border-border animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-[#4DB6AC]/20 rounded-full flex items-center justify-center mb-8 ring-8 ring-[#4DB6AC]/5">
          <CheckCircle2 className="w-12 h-12 text-[#4DB6AC]" />
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground mb-4">Request Received</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-10 font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed">
          Your request for a <span className="text-[#E1784F]">{selectedSpecialty?.role}</span> has been logged. You will be matched with a specialist shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button onClick={resetView} variant="outline" className="flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest py-6">New Booking</Button>
          <Button onClick={() => { resetView(); setActiveTab('history'); }} className="flex-1 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest py-6 shadow-xl shadow-[#E1784F]/20">History</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 transition-colors duration-500">
      <div className="flex gap-8 border-b border-border pb-2">
        <button 
          onClick={() => setActiveTab('book')}
          className={`flex items-center gap-2 pb-4 px-1 text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${activeTab === 'book' ? 'text-[#E1784F] border-[#E1784F]' : 'text-muted-foreground border-transparent'}`}
        >
          <CalendarCheck size={16} /> Choose Specialty
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 pb-4 px-1 text-[10px] uppercase tracking-widest font-black transition-all border-b-2 ${activeTab === 'history' ? 'text-[#E1784F] border-[#E1784F]' : 'text-muted-foreground border-transparent'}`}
        >
          <History size={16} /> History
        </button>
      </div>

      {activeTab === 'book' ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="grid gap-6">
              {SPECIALTIES.map((spec) => (
                <div 
                  key={spec.id}
                  onClick={() => { setSelectedSpecId(spec.id); setSelectedTime(null); }}
                  className={`group bg-card p-8 rounded-[2.5rem] cursor-pointer transition-all border-2 ${selectedSpecId === spec.id ? 'border-[#E1784F] bg-[#E1784F]/5 shadow-sm' : 'border-border hover:border-[#4DB6AC]/50'}`}
                >
                  <div className="flex flex-col sm:flex-row gap-8 items-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-colors ${selectedSpecId === spec.id ? 'bg-[#E1784F] text-white shadow-xl' : 'bg-muted text-[#4DB6AC]'}`}>
                      <spec.icon size={36} />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-2xl font-black italic uppercase text-foreground leading-none">{spec.role}</h3>
                      <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.3em] mt-2 mb-4">{spec.focus}</p>
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-tight leading-relaxed max-w-lg">{spec.description}</p>
                    </div>

                    <div className="sm:border-l border-border sm:pl-8 text-center sm:text-right w-full sm:w-32">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Fee</p>
                        <span className="text-2xl font-black text-foreground">₦{(spec.price/1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedSpecId && (
              <motion.aside 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:w-96"
              >
                <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-2xl sticky top-24">
                  <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#E1784F]">Clinical Booking</h3>
                    <button onClick={() => setSelectedSpecId(null)}><X size={20} className="text-muted-foreground hover:text-foreground" /></button>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">Select Arrival Time</p>
                      <div className="grid grid-cols-2 gap-3">
                        {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map(time => (
                          <button 
                            key={time} 
                            onClick={() => setSelectedTime(time)} 
                            className={`py-4 rounded-xl text-[10px] font-black transition-all border-2 ${selectedTime === time ? 'bg-[#4DB6AC] border-[#4DB6AC] text-white shadow-lg shadow-[#4DB6AC]/20' : 'border-border text-foreground hover:bg-muted'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-border">
                      <div className="flex justify-between mb-8">
                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.4em]">Consult Fee</span>
                        <span className="text-xl font-black text-foreground">₦{selectedSpecialty?.price.toLocaleString()}</span>
                      </div>
                      <Button 
                        disabled={!selectedTime || bookingStatus === 'processing'} 
                        onClick={handleBooking} 
                        className="w-full h-16 rounded-2xl bg-[#E1784F] text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-[#E1784F]/30 active:scale-[0.98] transition-all"
                      >
                        {bookingStatus === 'processing' ? "Syncing..." : "Pay & Confirm"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-muted/30 rounded-[3rem] border border-dashed border-border p-12">
          <History className="w-12 h-12 text-muted-foreground mb-6 opacity-20" />
          <h3 className="text-xl font-black italic uppercase text-foreground">Clinical Logs Empty</h3>
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-2">Past consultations will be archived here.</p>
        </div>
      )}
    </div>
  )
}