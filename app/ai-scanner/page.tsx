/**
 * 🛡️ AFRIDAM NEURAL CORE: AESTHETIC SCANNER
 * Version: 2026.1.0 (Skincare & Beauty Focused)
 * Target: Women & Children's Skin Safety
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Camera, 
  ChevronLeft, 
  Activity,
  CheckCircle2,
  Stethoscope,
  Zap,
  RotateCcw,
  ShoppingBag,
  ShieldCheck,
  Scan,
  Loader2,
  Upload,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"

export default function UnifiedScanner() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
  const [imgSource, setImgSource] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [status, setStatus] = useState("Aesthetic Node Ready")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // 🛡️ RE-ENFORCED: Data Privacy Guard
  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setErrorDetails(null)
    setIsCapturing(true)
    setStatus("Syncing Hardware...")
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user", 
          width: { ideal: 1080 }, 
          height: { ideal: 1080 } 
        },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStatus("Lens Online")
      }
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails("CAMERA_ACCESS_DENIED: Check browser permissions.");
      setStatus("Hardware Offline")
    }
  }

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Mirror the image to match the video preview
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(videoRef.current, 0, 0)
      }
      setImgSource(canvas.toDataURL("image/jpeg", 0.9))
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCapturing(false)
      setStatus("Sample Isolated")
    }
  }

  const analyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true)
    setStatus("Analyzing Texture...")
    
    try {
      const response = await fetch(imgSource);
      const blob = await response.blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('flag', 'aesthetic_analysis');

      /** * 🚀 OGA FIX: SYNCED WITH TOBI'S BACKEND
       * Path changed from /analyzer to /ai to match his latest deployment.
       */
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/analyze-skin`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      if (!apiResponse.ok) throw new Error("Cloud Sync Failed");

      const data = await apiResponse.json();
      
      // Handle the unwrapped resultData from our interceptor logic
      const payload = data.resultData || data;

      setResults({ 
        finding: payload.description || "Aesthetic Analysis Complete", 
        predictions: payload.predictions || {} 
      });
      setStatus("Analysis Verified")
    } catch (err: any) {
      setErrorDetails("NEURAL_SYNC_ERROR: Please check connection.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (authLoading || !user) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#E1784F] gap-6">
       <Loader2 className="animate-spin w-12 h-12" />
       <p className="font-black uppercase text-[10px] tracking-[0.5em] italic">Initializing Aesthetic Node...</p>
    </div>
  );

  return (
    <main className="min-h-[100svh] bg-background text-foreground px-6 py-12 md:p-16 lg:p-20 overflow-x-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(225,120,79,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-20 relative z-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-center text-left">
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/dashboard')} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E1784F] hover:bg-[#E1784F] hover:text-white transition-all shadow-xl">
              <ChevronLeft size={24} />
            </button>
            <div className="space-y-1">
               <h1 className="text-4xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none text-foreground">
                 Skin <span className="text-[#E1784F]">Health</span>
               </h1>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-[#4DB6AC]" />
                 <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.4em] italic">{status}</span>
               </div>
            </div>
          </div>
        </header>

        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* 📸 LENS PORTAL */}
            <div className="w-full lg:col-span-7 relative">
              <div className="bg-[#0A0A0A] border-8 md:border-[16px] border-white/5 overflow-hidden aspect-square relative rounded-[3rem] md:rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <div className="relative w-full h-full">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-2/3 h-2/3 border-2 border-dashed border-[#E1784F]/30 rounded-full animate-[spin_15s_linear_infinite]" />
                            <div className="absolute inset-0 border-[40px] md:border-[80px] border-black/50" />
                        </div>
                    </div>
                  ) : imgSource ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                        <img src={imgSource} className="w-full h-full object-cover" alt="Captured" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-10">
                      <div className="w-32 h-32 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center">
                        <Scan className="w-12 h-12 text-[#E1784F]" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Beauty Lens Ready</h3>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] leading-loose max-w-[240px] mx-auto">Analyze your glow and texture in real-time.</p>
                      </div>
                      <div className="flex flex-col gap-4 w-full max-w-sm">
                        <button onClick={startCamera} className="h-20 bg-[#E1784F] text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl active:scale-95 transition-all">Enable Beauty-Stream</button>
                        <button onClick={() => fileInputRef.current?.click()} className="h-20 bg-white/5 text-white/40 border border-white/10 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-3">
                            <Upload size={16} /> Upload Archive
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if(file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setImgSource(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center space-y-8">
                     <Loader2 className="animate-spin text-[#4DB6AC] w-20 h-20" />
                     <p className="text-[#4DB6AC] font-black uppercase text-[11px] tracking-[0.5em] animate-pulse italic">Sequencing Beauty Matrix...</p>
                     <motion.div 
                        initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-[#4DB6AC] shadow-[0_0_30px_#4DB6AC] z-40"
                      />
                  </div>
                )}
              </div>

              {isCapturing && (
                <button onClick={capture} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white p-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)] active:scale-90 transition-all z-30">
                  <div className="w-full h-full rounded-full border-4 border-[#E1784F] bg-white flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#E1784F] shadow-inner animate-pulse" />
                  </div>
                </button>
              )}
            </div>

            {/* AESTHETIC FRAMEWORK SIDEBAR */}
            <div className="w-full lg:col-span-5 space-y-10">
              <div className="p-12 bg-card/40 border border-border rounded-[4rem] space-y-12 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-4 text-[#E1784F]">
                  <Activity size={24} />
                  <h4 className="font-black uppercase italic text-lg tracking-[0.2em]">Aesthetic Framework</h4>
                </div>
                
                <div className="space-y-10">
                  {[
                    { t: "Neural Analysis", d: "Texture optimization for melanin-rich skin." },
                    { t: "Maternal Safety", d: "Formulation safety scores for mothers & children." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-8 items-start">
                      <span className="text-[#4DB6AC] font-black text-xs pt-1">0{i+1}</span>
                      <div className="space-y-2">
                         <p className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">{item.t}</p>
                         <p className="text-xs font-bold text-muted-foreground leading-relaxed italic">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {imgSource && !isAnalyzing && (
                  <button onClick={analyze} className="w-full h-24 bg-foreground text-background rounded-[2rem] font-black uppercase text-xs tracking-[0.5em] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl">
                    ANALYZE GLOW <Zap size={20} fill="currentColor" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* AESTHETIC RESULTS VIEW */
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
            <div className="p-12 md:p-24 bg-card border border-border rounded-[4rem] md:rounded-[6rem] backdrop-blur-3xl text-left relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DB6AC]/5 blur-[100px] rounded-full" />
              
              <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
                <div className="w-20 h-20 bg-[#4DB6AC]/10 rounded-[2rem] border border-[#4DB6AC]/30 flex items-center justify-center text-[#4DB6AC] shadow-xl">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-foreground leading-none">Analysis <span className="text-[#4DB6AC]">Synchronized</span></h2>
                  <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.5em] mt-2">Aesthetic Evaluation Finalized</p>
                </div>
              </div>

              <div className="p-10 md:p-16 bg-white/5 rounded-[3rem] border border-white/5 space-y-10 mb-12">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#E1784F] mb-4">Aesthetic Evaluation</p>
                  <h4 className="text-3xl md:text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-foreground">{results.finding}</h4>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {results.predictions && Object.entries(results.predictions).map(([name, score]: any) => (
                    <div key={name} className="px-8 py-4 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 text-[#4DB6AC] font-black text-[10px] uppercase rounded-2xl tracking-widest italic">
                      {name}: {(score * 100).toFixed(1)}% Match
                    </div>
                  ))}
                </div>
              </div>

              {/* 🛡️ GOOGLE PLAY COMPLIANCE: AESTHETIC DISCLAIMER */}
              <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex gap-4 items-start mb-12">
                 <Info size={20} className="text-blue-500 mt-1 shrink-0" />
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                   Disclaimer: This aesthetic evaluation is for skincare beauty and wellness purposes only. It is not a medical diagnosis. Always consult a professional for clinical concerns.
                 </p>
              </div>

              {/* UPSELL: Aesthetic Consultation */}
              <div className="p-10 md:p-16 bg-[#E1784F] text-white rounded-[3.5rem] flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="flex items-center gap-8 text-left relative z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center shadow-inner"><Stethoscope size={36}/></div>
                    <div className="space-y-2">
                       <p className="text-3xl md:text-4xl font-black italic uppercase leading-none">Aesthetic Consultant</p>
                       <p className="text-[11px] font-bold uppercase opacity-80 tracking-widest max-w-sm">Discuss your beauty routine and safety with a board-certified professional.</p>
                    </div>
                 </div>
                 <button onClick={() => router.push('/appointment')} className="w-full lg:w-auto h-24 px-16 bg-black text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.5em] shadow-2xl active:scale-95 transition-all relative z-10">START CONSULTATION</button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <button onClick={() => setResults(null)} className="flex-1 h-24 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] text-muted-foreground hover:bg-white/10 transition-all flex items-center justify-center gap-4">
                 <RotateCcw size={20} /> NEW ANALYSIS
              </button>
              <button onClick={() => router.push('/marketplace')} className="flex-1 h-24 bg-foreground text-background rounded-[2rem] font-black uppercase text-xs tracking-[0.5em] shadow-2xl transition-all flex items-center justify-center gap-4">
                 BROWSE BEAUTY SHOP <ShoppingBag size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}