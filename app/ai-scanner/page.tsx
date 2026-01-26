/**
 * 🛡️ AFRIDAM CLINICAL SCANNER (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: High-Precision Image Handshake & Mobile-First Result Mapping.
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
import { analyzeSkinWithUserData } from "@/lib/api-client"

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

  /** 🛡️ RULE 4: Simple Language. No Medical Jargon. */
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
        video: { facingMode: "environment", width: 1080, height: 1080 }, // Change to environment for back camera
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
        // Remove scale-x for back camera accuracy
        ctx.drawImage(videoRef.current, 0, 0)
      }
      setImgSource(canvas.toDataURL("image/jpeg", 0.9))
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCapturing(false)
      setStatus("Image Locked")
    }
  }

  const analyze = async () => {
    if (!imgSource || !user) return;
    setIsAnalyzing(true)
    setErrorDetails(null)
    setStatus("Scanning...")
    
    try {
      /**
       * 🚀 THE NEURAL HANDSHAKE (Rule 7)
       * Sending data to backend with full user context using CSP-compliant apiClient
       */
      
      // Populate more_info with user data - matching exact API spec
      const moreInfo = {
        region: "West Africa",
        country: user.profile?.nationality || "Nigeria",
        known_skintone_type: user.profile?.skinType || "brown",
        skin_type_last_time_checked: new Date().toISOString(),
        known_skin_condition: user.profile?.skinCondition || "none",
        skin_condition_last_time_checked: new Date().toISOString(),
        gender: user.profile?.sex || user.sex || "female",
        age: user.profile?.age || 0,
        known_body_lotion: user.profile?.bodyLotion || "unknown",
        known_body_lotion_brand: user.profile?.bodyLotionBrand || "unknown",
        known_allergies: (user.profile?.allergies && Array.isArray(user.profile.allergies) && user.profile.allergies.length > 0) 
          ? user.profile.allergies 
          : ["none"],
        known_last_skin_treatment: user.profile?.lastSkinTreatment || new Date().toISOString(),
        known_last_consultation_with_afridermatologists: user.profile?.lastConsultation || new Date().toISOString(),
        user_activeness_on_app: "very_high"
      }
      
      // Call the API with user context
      const data = await analyzeSkinWithUserData(imgSource, moreInfo);
      
      /**
       * 📊 DATA MAPPING
       * findings: The main AI observation.
       * recommendations: Care recommendations.
       * description: Full analysis.
       */
      const analysisData = {
        finding: data?.label || data?.description || "Analysis complete",
        recommendations: data?.recommendations || [],
        description: data?.description || "",
        severity: data?.severity_score || data?.severity || 0,
        conditions: data?.conditions || [],
        image: imgSource,
        id: data?.id || "TEMP-" + Date.now()
      };
      
      setResults(analysisData);
      setStatus("Analysis Complete")
    } catch (err: any) {
      console.error("AI Scan Error:", err);
      setErrorDetails("The AI Brain is busy. Please check your internet and try again.");
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
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
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
                    <button onClick={startCamera} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-2">
                      <Scan size={14} /> Take Photo with Camera
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg">
                      <Search size={14} /> Choose Image from Device
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImgSource(reader.result as string);
                            setStatus("Image Selected");
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
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
                    <p className="text-[8px] font-mono uppercase">#{results.id.toString().slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.3em]">AI Diagnosis</p>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">
                    {results.finding}
                  </h2>
                </div>

                {results.description && (
                  <div className="py-6 border-y border-white/10 dark:border-black/10 space-y-3">
                    <p className="text-[9px] font-black text-[#4DB6AC] uppercase tracking-[0.3em]">Analysis Details</p>
                    <p className="text-sm font-medium opacity-70 leading-relaxed">{results.description}</p>
                  </div>
                )}

                {results.conditions && results.conditions.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-[#4DB6AC] uppercase tracking-[0.3em]">Detected Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {results.conditions.map((condition: string, idx: number) => (
                        <span key={idx} className="px-4 py-2 bg-white/10 dark:bg-black/10 rounded-full text-[9px] font-bold uppercase tracking-tight">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {results.recommendations && results.recommendations.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.3em]">Recommended Care</p>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-sm font-medium opacity-70">
                          <span className="text-[#E1784F]">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.severity !== undefined && (
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-[#4DB6AC] uppercase tracking-[0.3em]">Severity Score</p>
                    <div className="w-full bg-white/10 dark:bg-black/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4DB6AC] to-[#E1784F]" 
                        style={{ width: `${Math.min(results.severity, 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] font-mono opacity-50">{results.severity}%</p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 dark:border-black/10 space-y-4">
                  <button onClick={() => router.push(`/marketplace?focus=${results.finding}`)} className="w-full py-5 bg-white dark:bg-black text-black dark:text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 group">
                    View Care Plan <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => router.push('/specialist')} className="w-full py-5 border border-white/20 dark:border-black/20 text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 group hover:bg-white/5">
                    Consult Specialist <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => router.push('/history')} className="w-full py-5 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 text-[#4DB6AC] rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2">
                    View in History <ArrowRight size={14} />
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