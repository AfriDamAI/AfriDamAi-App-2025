/**
 * 🛡️ AFRIDAM CLINICAL SCANNER (Rule 6 Synergy)
 * Version: 2026.1.13 (Handshake & Property Alignment)
 * Focus: High-Precision Image Handshake & Error Resiliency.
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, CheckCircle2, Zap,
  RotateCcw, Scan, Info, ShieldCheck, 
  ArrowRight, Binary, Fingerprint, Search
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { uploadImage } from "@/lib/api-client"

export default function UnifiedScanner() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
  const [imgSource, setImgSource] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [status, setStatus] = useState("System Ready")
  const [scanStep, setScanStep] = useState(0)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  /** 🛡️ RULE 4: No Jargon. 'Diagnosis' changed to 'Skin Diary' */
  const analysisSteps = [
    { icon: <Scan size={16} />, text: "Checking Image Clarity" },
    { icon: <Fingerprint size={16} />, text: "Detecting Patterns" },
    { icon: <Binary size={16} />, text: "Matching Clinical Data" },
    { icon: <Search size={16} />, text: "Building Your Skin Diary" },
    { icon: <ShieldCheck size={16} />, text: "Finalizing Safe Routine" }
  ];

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
      }, 3000); 
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, analysisSteps.length]);

  const startCamera = async () => {
    setErrorDetails(null)
    setIsCapturing(true)
    setStatus("Activating Lens")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1080, height: 1080 },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails("Please allow camera access in your settings.");
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
      setImgSource(canvas.toDataURL("image/jpeg", 0.9))
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCapturing(false)
      setStatus("Image Locked")
    }
  }

  const analyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true)
    setErrorDetails(null)
    setStatus("Scanning...")
    
    try {
      /**
       * 🚀 THE NEURAL HANDSHAKE (Rule 6)
       * We check multiple fields to handle Tobi's backend flexibility.
       */
      const data = await uploadImage(imgSource);
      
      const analysisData = {
        finding: data?.finding || data?.description || data?.status || "Analysis complete.",
        predictions: data?.predictions || {},
        overallHealth: data?.overallHealth || data?.overall_health || 85,
        image: imgSource,
        id: data?.id || data?.scanId
      };
      
      setResults(analysisData);
      setStatus("Ready")
    } catch (err: any) {
      setErrorDetails("The AI Brain is busy. Please try one more time.");
      setStatus("Try Again")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (authLoading || !user) return null;

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#0A0A0A] text-black dark:text-white pb-20">
      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-16 grid lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT: BRANDING */}
        <div className="space-y-10">
          <header className="space-y-6 text-left">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all"
            >
              <ChevronLeft size={14} /> Dashboard
            </button>
            
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                Skin <span className="text-[#E1784F]">Scan</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-[#E1784F] animate-pulse" />
                   <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="hidden lg:block space-y-4 max-w-sm text-left">
            <p className="text-xs font-medium leading-relaxed opacity-60">
              Our melanin-first AI scans your unique skin patterns to find the best care for your glow.
            </p>
          </div>
        </div>

        {/* RIGHT: PORTAL */}
        <div className="relative">
          {!results ? (
            <div className="space-y-8">
              <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-white/5 border-4 border-white dark:border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  ) : imgSource ? (
                    <div className="relative w-full h-full">
                      <img src={imgSource} className={`w-full h-full object-cover ${isAnalyzing ? 'blur-md opacity-50 scale-105' : ''} transition-all duration-700`} alt="Skin Capture" />
                      {isAnalyzing && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                            <motion.div 
                              initial={{ top: "0%" }} animate={{ top: "100%" }} 
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-[1px] bg-[#E1784F] shadow-[0_0_15px_#E1784F]"
                            />
                            <motion.div 
                              key={scanStep}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-col items-center gap-4 text-white text-center"
                            >
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                {analysisSteps[scanStep].icon}
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]">
                                {analysisSteps[scanStep].text}
                              </p>
                            </motion.div>
                         </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10">
                      <Scan size={60} />
                      <p className="text-[9px] font-black uppercase tracking-widest mt-4">Lens Ready</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* CONTROLS */}
              <div className="max-w-xs mx-auto space-y-4">
                {isCapturing ? (
                  <button onClick={capture} className="w-16 h-16 mx-auto rounded-full border-4 border-[#E1784F] p-1 flex items-center justify-center active:scale-90 transition-transform">
                     <div className="w-full h-full rounded-full bg-[#E1784F]" />
                  </button>
                ) : imgSource && !isAnalyzing ? (
                  <div className="space-y-3">
                    <button onClick={analyze} className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl">
                      Start Analysis <Zap size={14} fill="currentColor" />
                    </button>
                    <button onClick={() => { setImgSource(null); startCamera(); }} className="w-full text-[9px] font-black opacity-40 uppercase tracking-widest py-2">
                      Retake Photo
                    </button>
                  </div>
                ) : !isAnalyzing && (
                  <div className="space-y-3">
                    <button onClick={startCamera} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg">
                      Open Camera
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 text-[9px] font-black opacity-40 uppercase tracking-widest flex items-center justify-center gap-2">
                      <Scan size={12} /> Upload Gallery
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
                )}
                {errorDetails && <p className="text-center text-red-500 text-[9px] font-black uppercase">{errorDetails}</p>}
              </div>
            </div>
          ) : (
            /* RESULTS HUB */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-black dark:bg-white text-white dark:text-black p-8 md:p-12 rounded-[3rem] space-y-8 text-left shadow-2xl">
                <div className="flex justify-between items-start">
                  <CheckCircle2 size={40} className="text-[#E1784F]" />
                  <div className="text-right opacity-30">
                    <p className="text-[8px] font-black uppercase tracking-widest">Afla-ID</p>
                    <p className="text-[8px] font-mono uppercase">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.3em]">AI Observation</p>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">
                    {results.finding}
                  </h2>
                </div>

                <div className="pt-8 border-t border-white/10 dark:border-black/10 space-y-6">
                  <button onClick={() => router.push('/marketplace')} className="w-full py-5 bg-white dark:bg-black text-black dark:text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 group">
                    View Care Plan <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <button onClick={() => setResults(null)} className="w-full py-2 text-[9px] font-black opacity-30 uppercase tracking-widest flex items-center justify-center gap-2">
                <RotateCcw size={12} /> New Scan
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}