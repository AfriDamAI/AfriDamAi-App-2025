/**
 * 🛡️ AFRIDAM PUBLIC CLINICAL SCANNER
 * Focus: High-Precision Image Handshake for Unauthenticated Users.
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, CheckCircle2, Zap, ZapOff,
  RotateCcw, Scan, Info, ShieldCheck,
  ArrowRight, Binary, Fingerprint, Search, SwitchCamera
} from "lucide-react"
import { analyzePublicSkin } from "@/lib/api-client"

export default function PublicScanner() {
  const router = useRouter()

  const [imgSource, setImgSource] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [status, setStatus] = useState("System Ready")
  const [scanStep, setScanStep] = useState(0)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [isTorchOn, setIsTorchOn] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const analysisSteps = [
    { icon: <Scan size={16} />, text: "Checking Image Clarity" },
    { icon: <Fingerprint size={16} />, text: "Detecting Patterns" },
    { icon: <Binary size={16} />, text: "Matching Clinical Data" },
    { icon: <Search size={16} />, text: "Building Your Skin Diary" },
    { icon: <ShieldCheck size={16} />, text: "Finalizing Safe Routine" }
  ];

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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setIsTorchOn(false)
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails("Please allow camera access in your settings.");
    }
  }

  const toggleCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
  };

  useEffect(() => {
    if (isCapturing) {
      startCamera();
    }
  }, [facingMode]);

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;

    if (!capabilities.torch) {
      setErrorDetails("Flashlight not available on this camera.");
      setTimeout(() => setErrorDetails(null), 3000);
      return;
    }

    try {
      await track.applyConstraints({
        advanced: [{ torch: !isTorchOn }] as any
      });
      setIsTorchOn(!isTorchOn);
    } catch (err) {
      console.error("Flash toggle failed", err);
    }
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
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
      const data = await analyzePublicSkin(imgSource);

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

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#0A0A0A] text-black dark:text-white pb-20">
      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-16 grid lg:grid-cols-2 gap-12 items-start">

        {/* LEFT: BRANDING */}
        <div className="space-y-10">
          <header className="space-y-6 text-left">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center gap-2 text-[10px] font-black tracking-[0.3em] opacity-40 hover:opacity-100 transition-all"
            >
              <ChevronLeft size={14} /> Home
            </button>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">
                Skin <span className="text-[#E1784F]">Scan</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#E1784F] animate-pulse" />
                  <span className="text-[8px] font-black tracking-widest">{status}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="hidden lg:block space-y-4 max-w-sm text-left">
            <p className="text-xs font-medium leading-relaxed opacity-60">
              Our melanin-first AI scans your unique skin patterns to find the best care for your glow. 
              Register to save your results and get personalized care.
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
                            <p className="text-[10px] font-black tracking-[0.3em] text-[#E1784F]">
                              {analysisSteps[scanStep].text}
                            </p>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10">
                      <Scan size={60} />
                      <p className="text-[9px] font-black tracking-widest mt-4">Lens Ready</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* CONTROLS */}
              <div className="max-w-xs mx-auto space-y-4">
                {isCapturing ? (
                  <div className="flex items-center justify-between px-8">
                    <button onClick={toggleCamera} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all">
                      <SwitchCamera size={20} />
                    </button>

                    <button onClick={capture} className="w-20 h-20 rounded-full border-4 border-[#E1784F] p-1 flex items-center justify-center active:scale-90 transition-transform shadow-xl">
                      <div className="w-full h-full rounded-full bg-[#E1784F]" />
                    </button>

                    <button onClick={toggleFlash} className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 ${isTorchOn ? 'bg-[#E1784F] text-white shadow-[0_0_15px_#E1784F]' : 'bg-white/10 text-white'}`}>
                      {isTorchOn ? <Zap size={20} fill="currentColor" /> : <ZapOff size={20} />}
                    </button>
                  </div>
                ) : imgSource && !isAnalyzing ? (
                  <div className="space-y-3">
                    <button onClick={analyze} className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl">
                      Start Analysis <Zap size={14} fill="currentColor" />
                    </button>
                    <button onClick={() => { setImgSource(null); }} className="w-full text-[9px] font-black opacity-40 tracking-widest py-2">
                      Retake Photo
                    </button>
                  </div>
                ) : !isAnalyzing && (
                  <div className="space-y-3">
                    <button onClick={startCamera} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-2">
                      <Scan size={14} /> Take Photo with Camera
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg">
                      <Search size={14} /> Choose Image from Device
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
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
                {errorDetails && <p className="text-center text-red-500 text-[9px] font-black">{errorDetails}</p>}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl mx-auto print:p-0"
            >
              <div className="bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl border border-black/5 dark:border-white/10 print:border-none print:shadow-none">

                {/* TOP SCANNED IMAGE SECTION */}
                <div className="relative h-48 md:h-64 bg-gray-200 dark:bg-white/5">
                  {imgSource && (
                    <img
                      src={imgSource}
                      alt="Clinical Scan"
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  <div className="absolute bottom-6 left-8 md:bottom-10 md:left-12">
                    <p className="text-[9px] font-black tracking-[0.4em] text-[#4DB6AC] mb-2">Scan Successful</p>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-none text-white">
                      Diagnostic <br /> <span className="text-[#E1784F]">Report</span>
                    </h2>
                  </div>
                </div>

                {/* BLURRED CONTENT WRAPPER */}
                <div className="relative border-t border-black/5 dark:border-white/5">
                  {/* LOCK OVERLAY */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-md">
                    <ShieldCheck size={48} className="text-[#E1784F] mb-4" />
                    <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-center mb-2">Analysis Complete</h3>
                    <p className="text-xs md:text-sm font-medium opacity-80 text-center max-w-sm mb-8 leading-relaxed">
                      Your skin analysis has verified results. Sign up to unlock your full clinical diagnosis and a precise personalized routine.
                    </p>
                    <button
                      onClick={() => router.push('/register')}
                      className="w-full max-w-xs bg-[#4DB6AC] text-black h-14 rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                    >
                      Unlock My Results <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setResults(null)}
                      className="mt-6 text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
                    >
                      Scan Again
                    </button>
                  </div>

                  {/* ACTUAL CONTENT (BLURRED OUT) */}
                  <div className="opacity-20 select-none pointer-events-none">
                    <div className="p-8 md:p-12 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar print:max-h-none">
                      {/* FORMATTED CLINICAL FINDINGS */}
                      <div className="space-y-6">
                    {results.description ? (
                      results.description.split('\n').map((line: string, index: number) => {
                        const cleanLine = line.replace(/\*/g, '').trim();
                        if (!cleanLine) return null;

                        // Header Detection (1., 2., 3., etc)
                        if (cleanLine.match(/^\d\./)) {
                          return (
                            <h4 key={index} className="text-[#E1784F] text-[10px] font-black tracking-widest pt-4 border-t border-black/5 dark:border-white/5">
                              {cleanLine}
                            </h4>
                          );
                        }
                        // Detail Content
                        return (
                          <p key={index} className="text-xs md:text-sm font-medium leading-relaxed opacity-80 dark:text-gray-300">
                            {cleanLine}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-center opacity-40 italic">Processing clinical details...</p>
                    )}
                  </div>

                  {/* METADATA SUMMARY */}
                  <div className="flex justify-between items-center py-6 px-8 bg-gray-50 dark:bg-white/5 rounded-3xl">
                    <div className="text-left">
                      <p className="text-[8px] font-black tracking-widest opacity-40">Reference ID</p>
                      <p className="text-[10px] font-bold">#{results.id.toString().slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black tracking-widest opacity-40">Status</p>
                      <p className="text-[10px] font-bold text-[#4DB6AC] italic">Verified Analysis</p>
                    </div>
                  </div>
                </div>

                {/* ACTIONS SECTION */}
                <div className="p-8 space-y-4 print:hidden">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black h-16 rounded-[1.5rem] font-black text-[9px] tracking-widest active:scale-95 transition-all"
                    >
                      Save PDF
                    </button>
                    <button
                      onClick={() => setResults(null)}
                      className="bg-gray-100 dark:bg-white/5 h-16 rounded-[1.5rem] font-black text-[9px] tracking-widest active:scale-95 transition-all"
                    >
                      New Scan
                    </button>
                  </div>

                  <button
                    onClick={() => router.push('/register')}
                    className="w-full bg-[#4DB6AC] text-black h-16 rounded-[1.5rem] font-black tracking-[0.2em] text-[10px] shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    Create Profile to Track History <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => router.push(`/marketplace?focus=${results.finding}`)}
                    className="w-full bg-[#E1784F] text-white h-16 rounded-[1.5rem] font-black tracking-[0.2em] text-[10px] shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    View Recommended Products <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}
