/**
 * 🛡️ AFRIDAM SKIN WELLNESS: FAMILY SCANNER
 * Version: 2026.1.2 (Sleek Mobile-First Refactor)
 * Handshake: Fully synced with api-client.ts
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, Activity, CheckCircle2, Stethoscope, Zap,
  RotateCcw, ShieldCheck, Scan, Loader2, Upload, Info, Camera
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
  const [status, setStatus] = useState("Ready")
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
    setStatus("Opening Camera")
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 500, height: 500 },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails("Please enable camera access.");
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
      setImgSource(canvas.toDataURL("image/jpeg", 0.8))
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCapturing(false)
      setStatus("Photo Captured")
    }
  }

  const analyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true)
    setErrorDetails(null)
    setStatus("Analyzing...")
    
    try {
      // 🛡️ REFFERNCE: Using our archived api-client.ts
      const data = await uploadImage(imgSource);
      
      // Robust data check: 
      const finalFinding = data?.description || data?.resultData?.description || "Balance Found";
      
      setResults({ finding: finalFinding });
      setStatus("Complete")
    } catch (err: any) {
      setErrorDetails("Could not connect. Please try again.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (authLoading || !user) return null;

  return (
    <main className="min-h-[100svh] bg-white px-6 py-8 relative">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* HEADER - Sleeker */}
        <header className="flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="p-2 text-gray-400"><ChevronLeft /></button>
          <div className="text-center">
             <h1 className="text-xl font-black uppercase tracking-widest italic">Skin <span className="text-[#E1784F]">Check</span></h1>
             <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em]">{status}</p>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </header>

        {!results ? (
          <div className="space-y-6">
            
            {/* 📸 LENS PORTAL - Shrunk to Square */}
            <div className="relative aspect-square w-full max-w-[320px] mx-auto overflow-hidden rounded-[2.5rem] border-[6px] border-gray-50 shadow-2xl bg-gray-50">
              <AnimatePresence mode="wait">
                {isCapturing ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                ) : imgSource ? (
                  <div className="relative w-full h-full">
                    <img src={imgSource} className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? 'blur-sm grayscale' : ''}`} alt="Captured" />
                    {isAnalyzing && (
                       <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                          <motion.div 
                            initial={{ top: "0%" }} animate={{ top: "100%" }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-0 right-0 h-1 bg-[#4DB6AC] shadow-[0_0_15px_#4DB6AC] z-50"
                          />
                          <Loader2 className="animate-spin text-white mb-2" />
                          <p className="text-white text-[8px] font-black uppercase tracking-widest">Scanning Texture</p>
                       </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-200">
                    <Camera size={40} strokeWidth={1} />
                    <p className="text-[9px] font-black uppercase tracking-widest mt-4">Camera Off</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ERROR LOGGING */}
            {errorDetails && (
              <p className="text-red-400 text-[10px] font-bold text-center uppercase tracking-tighter">{errorDetails}</p>
            )}

            {/* ACTION BUTTONS - Compact */}
            <div className="grid gap-3">
              {isCapturing ? (
                <button onClick={capture} className="w-16 h-16 mx-auto rounded-full border-4 border-[#E1784F] bg-white flex items-center justify-center shadow-xl active:scale-90">
                   <div className="w-10 h-10 rounded-full bg-[#E1784F]" />
                </button>
              ) : imgSource && !isAnalyzing ? (
                <div className="grid gap-3">
                  <button onClick={analyze} className="w-full py-5 bg-[#1A1A1A] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl">
                    Check Now <Zap size={14} fill="currentColor" />
                  </button>
                  <button onClick={() => { setImgSource(null); startCamera(); }} className="text-[10px] font-black text-gray-400 uppercase tracking-widest py-2">Retake</button>
                </div>
              ) : !isAnalyzing && (
                <div className="grid gap-3">
                  <button onClick={startCamera} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Open AI Camera</button>
                  <button onClick={() => fileInputRef.current?.click()} className="py-2 text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Upload size={12} /> From Gallery
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
            </div>
          </div>
        ) : (
          /* RESULTS VIEW - Soft & Standard */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="p-10 bg-gray-50 rounded-[3rem] text-center space-y-6 border border-gray-100">
              <div className="w-16 h-16 bg-[#4DB6AC]/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-[#4DB6AC]" />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.3em]">Analysis Finished</p>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-tight">
                  {results.finding}
                </h2>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 text-left">
                <Info size={14} className="text-gray-300 shrink-0 mt-0.5" />
                <p className="text-[8px] font-bold text-gray-400 uppercase leading-relaxed tracking-tight">
                  Wellness support only. For medical concerns, always see a doctor.
                </p>
              </div>

              <button onClick={() => router.push('/marketplace')} className="w-full py-5 bg-[#1A1A1A] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Shop Safe Products</button>
            </div>
            
            <button onClick={() => setResults(null)} className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <RotateCcw size={14} /> New Scan
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}