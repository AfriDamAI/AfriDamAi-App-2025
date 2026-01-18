/**
 * 🛡️ AFRIDAM SKIN WELLNESS: FAMILY SCANNER
 * Version: 2026.1.1 (High-End AI Experience)
 * Target: African Women, Children & Families
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
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
import { useAuth } from "@/providers/auth-provider"
import { uploadImage } from "@/lib/api-client"

export default function UnifiedScanner() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
  const [imgSource, setImgSource] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [status, setStatus] = useState("Ready for Check")
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
    setStatus("Starting camera...")
    
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
        setStatus("Camera is On")
      }
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails("Check camera permissions in your settings.");
      setStatus("Camera Offline")
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
      setStatus("Photo Ready")
    }
  }

  const analyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true)
    setStatus("Running AI Scan...")
    
    try {
      // 🚀 THE HANDSHAKE: Sending physical file blob to Tobi's backend
      const data = await uploadImage(imgSource);
      const payload = data.resultData || data;

      setResults({ 
        finding: payload.description || "Safe & Balanced Glow", 
        predictions: payload.predictions || {} 
      });
      setStatus("Check Finished")
    } catch (err: any) {
      setErrorDetails("Connection error. Please try again.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (authLoading || !user) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#E1784F] gap-4">
       <Loader2 className="animate-spin w-10 h-10" />
       <p className="font-bold uppercase text-[10px] tracking-widest">Opening Hub...</p>
    </div>
  );

  return (
    <main className="min-h-[100svh] bg-white text-foreground px-5 py-10 md:p-16 overflow-x-hidden relative">
      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER */}
        <header className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#E1784F] active:scale-95 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="space-y-0.5 text-left">
             <h1 className="text-3xl font-bold tracking-tight text-gray-900">
               Skin <span className="text-[#E1784F]">Check</span>
             </h1>
             <div className="flex items-center gap-2">
               <ShieldCheck size={12} className="text-[#4DB6AC]" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status}</span>
             </div>
          </div>
        </header>

        {!results ? (
          <div className="flex flex-col gap-8">
            
            {/* 📸 LENS PORTAL - Sharp & Fitted View */}
            <div className="w-full relative">
              <div className="bg-[#F8F8F8] border-4 border-white overflow-hidden aspect-[4/5] relative rounded-[3rem] shadow-xl">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  ) : imgSource ? (
                    <div className="w-full h-full relative">
                        <img src={imgSource} className="w-full h-full object-cover" alt="Captured" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
                      <div className="w-20 h-20 rounded-3xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        <Scan className="w-8 h-8 text-[#E1784F] opacity-30" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">Take a Photo</h3>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">Use clear lighting for best results.</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                {/* 🛡️ THE SCANNING LASER ANIMATION */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center">
                    <motion.div 
                      initial={{ top: "0%" }} 
                      animate={{ top: "100%" }} 
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-[#4DB6AC] shadow-[0_0_20px_#4DB6AC] z-40"
                    />
                     <Loader2 className="animate-spin text-white w-12 h-12 mb-4" />
                     <p className="text-white font-bold text-[10px] uppercase tracking-widest animate-pulse">Running Skin Check...</p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3 mt-6">
                {isCapturing ? (
                  <button onClick={capture} className="w-20 h-20 mx-auto rounded-full border-4 border-[#E1784F] bg-white flex items-center justify-center active:scale-90 transition-all shadow-lg">
                     <div className="w-14 h-14 rounded-full bg-[#E1784F]" />
                  </button>
                ) : imgSource && !isAnalyzing ? (
                  <>
                    <button onClick={analyze} className="w-full h-16 bg-[#1A1A1A] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                      Start Skin Check <Zap size={16} />
                    </button>
                    <button onClick={() => { setImgSource(null); startCamera(); }} className="w-full h-16 bg-white text-gray-400 border border-gray-100 rounded-2xl font-bold uppercase text-[11px] tracking-widest">Retake Photo</button>
                  </>
                ) : !isAnalyzing && (
                  <>
                    <button onClick={startCamera} className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-md active:scale-95 transition-all">Enable AI Camera</button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full h-16 bg-white text-gray-500 border border-gray-200 rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2">
                        <Upload size={14} /> Upload Archive
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImgSource(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </>
                )}
              </div>
            </div>

            {/* RELATABLE BENEFITS */}
            <div className="space-y-4">
                {[
                  { t: "Skin Wellness", d: "Designed for melanin-rich African skin health." },
                  { t: "Safe for Family", d: "Care scores for mothers and children." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-3xl flex gap-4 items-start text-left">
                    <Activity size={18} className="text-[#E1784F] mt-1" />
                    <div className="space-y-1">
                       <p className="text-[11px] font-bold uppercase tracking-wide text-gray-900">{item.t}</p>
                       <p className="text-xs text-gray-500 leading-relaxed font-medium italic">{item.d}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="p-8 md:p-12 bg-white border border-gray-100 rounded-[3rem] shadow-sm text-center relative overflow-hidden">
              <div className="flex flex-col items-center gap-4 mb-8">
                <CheckCircle2 size={48} className="text-green-500" />
                <h2 className="text-3xl font-bold text-gray-900">Check Finished</h2>
              </div>

              <div className="p-6 bg-gray-50 rounded-3xl mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E1784F] mb-2">Our Results</p>
                <h4 className="text-2xl font-bold text-gray-900 leading-tight">{results.finding}</h4>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start mb-8 text-left">
                 <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                 <p className="text-[10px] font-medium text-blue-800 leading-relaxed uppercase tracking-tight">
                   Disclaimer: This check is for wellness purposes and is not a medical diagnosis. Always see a professional for health concerns.
                 </p>
              </div>

              <button onClick={() => router.push('/appointment')} className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                <Stethoscope size={16} /> Talk to a Professional
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => setResults(null)} className="w-full h-16 bg-white border border-gray-200 rounded-2xl font-bold uppercase text-[11px] tracking-widest text-gray-400">
                 NEW SCAN
              </button>
              <button onClick={() => router.push('/marketplace')} className="w-full h-16 bg-[#1A1A1A] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-lg">
                 SHOP SKIN CARE
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}