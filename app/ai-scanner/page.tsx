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
  ArrowRight,
  Upload
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
  const [scanProgress, setScanProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [status, setStatus] = useState("System Ready")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setErrorDetails(null)
    setIsCapturing(true)
    setStatus("Syncing...")
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStatus("Lens Active")
      }
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails("Camera hardware unreachable.");
      setStatus("Hardware Error")
    }
  }

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(videoRef.current, 0, 0)
      }
      setImgSource(canvas.toDataURL("image/jpeg"))
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCapturing(false)
      setStatus("Captured")
    }
  }

  const analyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true)
    setScanProgress(10)
    try {
      const response = await fetch(imgSource);
      const blob = await response.blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('flag', 'skin_analysis');

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyzer/process-request`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });

      const data = await apiResponse.json();
      setResults({ finding: data.description || "Analysis Complete", predictions: data.predictions });
      setStatus("Complete")
    } catch (err: any) {
      setErrorDetails("NEURAL LINK BUSY. RETRY SCAN.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (authLoading || !user) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#E1784F]">
       <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <main className="min-h-[100svh] bg-background text-foreground px-6 py-12 md:p-12 lg:p-16 overflow-x-hidden selection:bg-[#E1784F]/30">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-10%,rgba(225,120,79,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 md:space-y-16 relative z-10">
        
        {/* 🛡️ RE-ENFORCED CLINICAL HEADER */}
        <header className="flex justify-between items-center text-left">
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E1784F] hover:bg-[#E1784F] hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <div className="space-y-1">
               <h1 className="text-3xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-foreground">
                 Skin <span className="text-[#E1784F]">Scanner</span>
               </h1>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={12} className="text-[#4DB6AC]" />
                 <span className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">{status}</span>
               </div>
            </div>
          </div>
        </header>

        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
            
            {/* 📸 SMART LENS PORTAL */}
            <div className="w-full lg:col-span-7 relative group">
              <div className="bg-[#0A0A0A] border-4 md:border-[12px] border-white/5 overflow-hidden aspect-square relative rounded-[2.5rem] md:rounded-[4rem] shadow-2xl">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <div className="relative w-full h-full">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                        <div className="absolute inset-0 border-[30px] md:border-[60px] border-black/60 pointer-events-none">
                            <div className="w-full h-full border-2 border-dashed border-[#E1784F]/40 rounded-3xl" />
                        </div>
                    </div>
                  ) : imgSource ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                        <img src={imgSource} className="w-full h-full object-cover" alt="Captured" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-8">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#E1784F]/40 transition-all">
                        <Scan className="w-10 h-10 text-white/20 group-hover:text-[#E1784F] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Initiate Scan</h3>
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">Center your face in the lens for AI sequencing.</p>
                      </div>
                      <div className="flex flex-col gap-4 w-full max-w-xs">
                        <button onClick={startCamera} className="h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all">Open Lens</button>
                        <button onClick={() => fileInputRef.current?.click()} className="h-16 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                            <Upload size={14} /> Upload Sample
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
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-40 flex flex-col items-center justify-center space-y-6">
                     <Loader2 className="animate-spin text-[#4DB6AC] w-14 h-14" />
                     <p className="text-[#4DB6AC] font-black uppercase text-[10px] tracking-[0.4em] animate-pulse italic">Sequencing Sample...</p>
                     <motion.div 
                        initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-[#4DB6AC] shadow-[0_0_20px_#4DB6AC] z-30"
                      />
                  </div>
                )}
              </div>

              {isCapturing && (
                <button onClick={capture} className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white p-1 shadow-2xl active:scale-90 transition-all">
                  <div className="w-full h-full rounded-full border-4 border-[#E1784F] bg-white flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#E1784F] shadow-lg shadow-[#E1784F]/40 animate-pulse" />
                  </div>
                </button>
              )}
            </div>

            {/* 🛡️ PROTOCOL PANEL */}
            <div className="w-full lg:col-span-5 space-y-8 text-left">
              <div className="p-10 bg-card/40 border border-border rounded-[3rem] space-y-10 backdrop-blur-3xl relative">
                <div className="flex items-center gap-3 text-[#E1784F]">
                  <Activity size={20} />
                  <h4 className="font-black uppercase italic text-sm tracking-[0.1em]">Clinical Protocol</h4>
                </div>
                <div className="space-y-8">
                  {[
                    { t: "AI Synthesis", d: "Analysis powered by melanin-specific neural networks." },
                    { t: "Privacy Lock", d: "Clinical data is encrypted and HIPAA-aligned." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <span className="text-[#4DB6AC] font-black text-xs">0{i+1}</span>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{item.t}</p>
                         <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {imgSource && !isAnalyzing && (
                  <button onClick={analyze} className="w-full h-20 bg-foreground text-background rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl">
                    Finalize Analysis <Zap size={18} fill="currentColor" />
                  </button>
                )}
              </div>

              {errorDetails && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                    {errorDetails}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 🏆 CLINICAL RESULTS VIEW */
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 pb-20">
            <div className="p-8 md:p-16 bg-card/40 border border-border rounded-[3.5rem] md:rounded-[5rem] backdrop-blur-3xl text-left">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-[#4DB6AC]/10 rounded-[1.5rem] border border-[#4DB6AC]/20 flex items-center justify-center text-[#4DB6AC]">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground">Analysis <span className="text-[#4DB6AC]">Live</span></h2>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Verified Biological Signal</p>
                </div>
              </div>

              <div className="p-8 md:p-12 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6 mb-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#E1784F]">Diagnostic Finding</p>
                <h4 className="text-2xl md:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-tight text-foreground">{results.finding}</h4>
                <div className="flex flex-wrap gap-3 pt-4">
                  {results.predictions && Object.entries(results.predictions).map(([name, score]: any) => (
                    <div key={name} className="px-5 py-2.5 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 text-[#4DB6AC] font-black text-[9px] uppercase rounded-xl">
                      {name}: {(score * 100).toFixed(1)}% Confidence
                    </div>
                  ))}
                </div>
              </div>

              {/* REVENUE GENERATION CARD */}
              <div className="p-8 md:p-12 bg-[#E1784F] text-white rounded-[3rem] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
                 <div className="flex items-center gap-6 text-left">
                    <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center shadow-inner"><Stethoscope size={28}/></div>
                    <div className="space-y-1">
                       <p className="text-2xl font-black italic uppercase leading-none">Consult Expert</p>
                       <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Verify this scan with a certified specialist.</p>
                    </div>
                 </div>
                 <button onClick={() => router.push('/appointment')} className="w-full lg:w-auto bg-black text-white px-10 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Book Clinical Review</button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <button onClick={() => setResults(null)} className="flex-1 h-20 bg-white/5 border border-white/5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest text-muted-foreground hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                 <RotateCcw size={16} /> New Scan
              </button>
              <button onClick={() => router.push('/ecommerce')} className="flex-1 h-20 bg-foreground text-background rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3">
                 Find Recommended Care <ShoppingBag size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}