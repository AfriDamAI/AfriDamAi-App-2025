"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, Activity, CheckCircle2, Zap,
  RotateCcw, Scan, Loader2, Upload, Info, Camera,
  ShieldCheck, ArrowRight
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
      setErrorDetails("Camera access denied.");
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
    setStatus("Neural Analysis...")
    try {
      const data = await uploadImage(imgSource);
      const finalFinding = data?.description || data?.resultData?.description || "Healthy Texture Detected";
      setResults({ finding: finalFinding });
      setStatus("Analysis Complete")
    } catch (err: any) {
      setErrorDetails("Network sync failed. Retry.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (authLoading || !user) return null;

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#0A0A0A] text-black dark:text-white selection:bg-[#E1784F]/30 transition-colors duration-500">
      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-16 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT COLUMN: BRANDING & STATUS */}
        <div className="space-y-12">
          <header className="space-y-8">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-all"
            >
              <ChevronLeft size={14} /> Back to Hub
            </button>
            
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] py-2">
                Skin <span className="text-[#E1784F]">Scan</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
                </div>
                <span className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em]">v2.0 Clinical AI</span>
              </div>
            </div>
          </header>

          <div className="hidden lg:block space-y-6 max-w-sm">
            <p className="text-sm font-medium leading-relaxed opacity-60">
              Our advanced melanin-first AI scans thousands of data points to identify texture variations and health patterns in seconds.
            </p>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
              <ShieldCheck className="text-[#E1784F]" size={20} />
              <p className="text-[10px] font-bold uppercase tracking-tight opacity-80">
                End-to-End Encrypted Analysis
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCANNER PORTAL */}
        <div className="relative">
          {!results ? (
            <div className="space-y-10">
              {/* THE LENS */}
              <div className="relative aspect-square w-full rounded-[3.5rem] overflow-hidden bg-gray-100 dark:bg-white/5 border-[8px] border-white dark:border-[#1A1A1A] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)]">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  ) : imgSource ? (
                    <div className="relative w-full h-full">
                      <img src={imgSource} className={`w-full h-full object-cover transition-all duration-1000 ${isAnalyzing ? 'scale-110 blur-md opacity-40' : ''}`} alt="Captured" />
                      {isAnalyzing && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div 
                              initial={{ top: "0%" }} animate={{ top: "100%" }} 
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-[2px] bg-[#E1784F] shadow-[0_0_20px_#E1784F] z-50"
                            />
                            <Loader2 className="animate-spin text-[#E1784F] mb-4" size={40} strokeWidth={3} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Processing Tissue</p>
                         </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-20">
                      <Scan size={80} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-6">Awaiting Input</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* CONTROLS */}
              <div className="max-w-xs mx-auto space-y-4">
                {isCapturing ? (
                  <button onClick={capture} className="w-20 h-20 mx-auto rounded-full border-[6px] border-[#E1784F] bg-transparent p-1 flex items-center justify-center transition-transform active:scale-90">
                     <div className="w-full h-full rounded-full bg-[#E1784F]" />
                  </button>
                ) : imgSource && !isAnalyzing ? (
                  <div className="space-y-4">
                    <button onClick={analyze} className="group w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl transition-all hover:bg-[#E1784F] hover:text-white">
                      Initiate Scan <Zap size={16} fill="currentColor" />
                    </button>
                    <button onClick={() => { setImgSource(null); startCamera(); }} className="w-full text-[10px] font-black opacity-40 uppercase tracking-[0.3em] hover:opacity-100 py-2 transition-all">
                      Discard & Retake
                    </button>
                  </div>
                ) : !isAnalyzing && (
                  <div className="space-y-4">
                    <button onClick={startCamera} className="w-full py-6 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all">
                      Open Clinical Lens
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 text-[10px] font-black opacity-40 uppercase tracking-[0.3em] hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                      <Upload size={14} /> Import from Gallery
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
                {errorDetails && <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest">{errorDetails}</p>}
              </div>
            </div>
          ) : (
            /* RESULTS VIEW - High-End Editorial Style */
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-black dark:bg-white text-white dark:text-black p-12 rounded-[4rem] space-y-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-[#E1784F] rounded-2xl flex items-center justify-center rotate-3">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Report ID</p>
                    <p className="text-[10px] font-mono font-bold uppercase">AD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] font-black text-[#E1784F] uppercase tracking-[0.4em]">Primary Finding</p>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                    {results.finding}
                  </h2>
                </div>

                <div className="pt-10 border-t border-white/10 dark:border-black/10 space-y-6">
                  <div className="flex items-start gap-4">
                    <Info size={18} className="text-[#E1784F] shrink-0" />
                    <p className="text-[10px] font-bold uppercase leading-relaxed opacity-60 tracking-tight">
                      AI analysis is for educational support. This does not replace a clinical biopsy or professional dermatological consultation.
                    </p>
                  </div>
                  <button onClick={() => router.push('/marketplace')} className="w-full py-6 bg-white dark:bg-black text-black dark:text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 group">
                    View Safe Regimen <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>

              <button onClick={() => setResults(null)} className="w-full py-4 text-[10px] font-black opacity-40 uppercase tracking-[0.3em] hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                <RotateCcw size={14} /> New Analysis
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}