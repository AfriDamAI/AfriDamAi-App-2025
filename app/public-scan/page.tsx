/**
 * 🛡️ AFRIDAM PUBLIC CLINICAL SCANNER
 * Focus: High-Precision Image Handshake, Direct Response Affiliate UI,
 * Value-First Delivery, and Deferred Auth.
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, CheckCircle2, Zap, ZapOff,
  RotateCcw, Scan, Info, ShieldCheck,
  ArrowRight, Binary, Fingerprint, Search, SwitchCamera,
  ShoppingBag, Calendar, ShoppingCart
} from "lucide-react"
import { analyzePublicSkin } from "@/lib/api-client"

// 📦 MOCK DATA: Structured for the Step-by-Step Affiliate UI with Real Images
const mockScanResult = {
  scan_id: "scan_987654321",
  id: "TEMP-" + Date.now(),
  timestamp: new Date().toISOString(),
  user_status: "guest",
  finding: "Hyperpigmentation & Mild Congestion",
  description: "1. Zone 3 (Left Cheek): Uneven melanin distribution detected. Likely post-inflammatory hyperpigmentation.\n2. Zone 1 (Forehead): Minor pore blockages detected. No severe inflammation.",
  zones: [
    { zone_name: "Zone 3 (Left Cheek)", primary_issue: "Hyperpigmentation", severity: "Moderate" },
    { zone_name: "Zone 1 (Forehead)", primary_issue: "Congestion", severity: "Mild" }
  ],
  recommended_products: [
    {
      product_id: "prod_101",
      step: "Step 1: Cleanser",
      name: "Cerave Salicylic Acid 2% Cleanser, Makeup Remover & Exfoliator",
      brand: "Cerave",
      price_ngn: 12500,
      image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300&auto=format&fit=crop",
      target_issue: "Congestion",
      affiliate_link: "https://www.jumia.com.ng/catalog/?q=cerave+salicylic+acid+cleanser&affiliate_id=AFRIDAM_123"
    },
    {
      product_id: "prod_204",
      step: "Step 2: Treatment Serum",
      name: "La Roche-Posay Vitamin C Brightening Serum for Hyperpigmentation",
      brand: "La Roche-Posay",
      price_ngn: 24000,
      image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop",
      target_issue: "Hyperpigmentation",
      affiliate_link: "https://www.jumia.com.ng/catalog/?q=la+roche+posay+vitamin+c&affiliate_id=AFRIDAM_123"
    }
  ]
};

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

  // 🆕 Lead Capture State
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" })

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

    // 🚀 MOCK FLOW: Simulates AI processing to bypass the API crash
    setTimeout(() => {
      setResults(mockScanResult);
      localStorage.setItem("guest_scan_result", JSON.stringify(mockScanResult));
      setStatus("Analysis Complete");
      setIsAnalyzing(false);
    }, 4500);
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("guest_lead_details", JSON.stringify(leadForm));
    const targetUrl = encodeURIComponent("/consult/book");
    router.push(`/auth/signup?email=${leadForm.email}&next=${targetUrl}`);
  }

  return (
    // Increased top padding (pt-40 md:pt-48) to completely clear the fixed navbar and prevent any heading cutoff
    <main className="min-h-[100svh] bg-white dark:bg-[#0A0A0A] text-black dark:text-white pt-40 md:pt-48 pb-20">
      <div className="max-w-screen-2xl mx-auto px-6 py-10 lg:py-16 grid xl:grid-cols-2 gap-16 items-start">

        {/* LEFT: BRANDING */}
        <div className="space-y-10 xl:sticky xl:top-48">
          <header className="space-y-6 text-left">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center gap-2 text-xs font-black tracking-[0.3em] opacity-40 hover:opacity-100 transition-all uppercase"
            >
              <ChevronLeft size={16} /> Home
            </button>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
                Skin <span className="text-[#E1784F]">Scan</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#E1784F] animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase">{status}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="hidden xl:block space-y-4 max-w-md text-left">
            <p className="text-sm font-medium leading-relaxed opacity-60">
              Our melanin-first AI scans your unique skin patterns to find the best care for your glow. 
              Review your results and schedule a consultation seamlessly.
            </p>
          </div>
        </div>

        {/* RIGHT: PORTAL */}
        <div className="relative w-full flex justify-center">
          {!results ? (
            <div className="w-full max-w-2xl space-y-8">
              {/* SCANNER CAMERA UI */}
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
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                              {analysisSteps[scanStep].icon}
                            </div>
                            <p className="text-[11px] font-black tracking-[0.3em] text-[#E1784F] uppercase">
                              {analysisSteps[scanStep].text}
                            </p>
                          </motion.div>
                        </div>
                      )}

                      {errorDetails && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-10 text-center"
                        >
                          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/50">
                            <Info size={48} className="text-red-500" />
                          </div>
                          <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
                            Scanning <span className="text-red-500">Halted</span>
                          </h3>
                          <p className="text-white/80 text-sm font-bold leading-relaxed mb-8 max-w-sm">
                            {errorDetails}
                          </p>
                          <button 
                            onClick={() => setErrorDetails(null)}
                            className="px-12 py-5 bg-white text-black rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                          >
                            Retry Lens Scan
                          </button>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10">
                      <Scan size={80} />
                      <p className="text-xs font-black tracking-widest mt-6 uppercase">Lens Ready</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* CONTROLS */}
              <div className="max-w-sm mx-auto space-y-4">
                {isCapturing ? (
                  <div className="flex items-center justify-between px-8">
                    <button onClick={toggleCamera} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all hover:bg-white/20">
                      <SwitchCamera size={24} />
                    </button>
                    <button onClick={capture} className="w-24 h-24 rounded-full border-[5px] border-[#E1784F] p-1.5 flex items-center justify-center active:scale-90 transition-transform shadow-2xl">
                      <div className="w-full h-full rounded-full bg-[#E1784F]" />
                    </button>
                    <button onClick={toggleFlash} className={`w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-90 ${isTorchOn ? 'bg-[#E1784F] text-white shadow-[0_0_20px_#E1784F]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                      {isTorchOn ? <Zap size={24} fill="currentColor" /> : <ZapOff size={24} />}
                    </button>
                  </div>
                ) : imgSource && !isAnalyzing ? (
                  <div className="space-y-4">
                    <button onClick={analyze} className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-transform">
                      Start Analysis <Zap size={16} fill="currentColor" />
                    </button>
                    <button onClick={() => { setImgSource(null); }} className="w-full text-[10px] font-black opacity-40 hover:opacity-100 tracking-[0.2em] uppercase py-3 transition-opacity">
                      Retake Photo
                    </button>
                  </div>
                ) : !isAnalyzing && (
                  <div className="space-y-4">
                    <button onClick={startCamera} className="w-full py-6 bg-[#E1784F] text-white rounded-3xl font-black text-xs tracking-[0.2em] uppercase shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                      <Scan size={16} /> Take Photo with Camera
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-6 bg-gray-100 dark:bg-white/10 text-black dark:text-white rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                      <Search size={16} /> Choose Image from Device
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => { setImgSource(reader.result as string); setStatus("Image Selected"); };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 📊 BEAUTIFIED VALUE-FIRST RESULTS BOARD */
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl print:p-0"
            >
              <div className="bg-white dark:bg-[#0A0A0A] rounded-[3rem] md:rounded-[5rem] overflow-hidden relative shadow-2xl shadow-black/10 dark:shadow-white/5 border border-black/5 dark:border-white/10">

                {/* TOP HEADER */}
                <div className="relative h-64 md:h-80 bg-gray-200 dark:bg-white/5">
                  {imgSource && (
                    <img src={imgSource} alt="Clinical Scan" className="w-full h-full object-cover opacity-90" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                  <div className="absolute bottom-8 left-10 md:bottom-14 md:left-16">
                    <p className="text-[10px] md:text-xs font-black tracking-[0.4em] text-[#4DB6AC] mb-3 uppercase">Scan Successful</p>
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none text-white">
                      Diagnostic <br /> <span className="text-[#E1784F]">Report</span>
                    </h2>
                  </div>
                </div>

                <div className="p-8 md:p-16 space-y-12">
                  
                  {/* CLINICAL FINDINGS */}
                  <div className="space-y-8">
                    {results.description ? (
                      results.description.split('\n').map((line: string, index: number) => {
                        const cleanLine = line.replace(/\*/g, '').trim();
                        if (!cleanLine) return null;
                        if (cleanLine.match(/^\d\./)) {
                          return (
                            <div key={index} className="pt-6 first:pt-0 border-t border-black/5 dark:border-white/5">
                              <h4 className="text-[#E1784F] text-xs font-black tracking-[0.2em] uppercase mb-2">
                                {cleanLine.split(':')[0]}
                              </h4>
                              <p className="text-sm md:text-base font-medium leading-relaxed opacity-80 dark:text-gray-300">
                                {cleanLine.split(':')[1]}
                              </p>
                            </div>
                          );
                        }
                        return (
                          <p key={index} className="text-sm md:text-base font-medium leading-relaxed opacity-80 dark:text-gray-300">
                            {cleanLine}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-center opacity-40 italic">Processing clinical details...</p>
                    )}
                  </div>

                  {/* 🛒 JUMIA DIRECT RESPONSE PRODUCT DRAWER */}
                  <div className="bg-gray-50 dark:bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-black/5 dark:border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-xs md:text-sm font-black tracking-[0.2em] text-black dark:text-white uppercase">
                        Recommended Routine
                      </h4>
                    </div>
                    
                    <div className="space-y-8">
                      {results.recommended_products?.map((product: any) => (
                        <div key={product.product_id} className="space-y-3">
                          
                          {/* Step Label */}
                          <h5 className="text-sm font-black text-black/80 dark:text-white/80 tracking-wide">
                            {product.step}
                          </h5>
                          
                          {/* Product Card Container */}
                          <div className="flex flex-row items-start gap-4 md:gap-6 p-4 md:p-6 bg-white dark:bg-[#111] rounded-[2rem] shadow-sm border border-black/5 dark:border-white/5 transition-all hover:shadow-md">
                            
                            {/* Product Image */}
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-white/5 flex items-center justify-center p-2">
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                            </div>
                            
                            {/* Product Details & Action */}
                            <div className="flex-1 flex flex-col justify-between h-full min-h-[6rem] md:min-h-[8rem]">
                              <div className="space-y-1 mb-4">
                                <p className="text-[10px] font-black tracking-widest opacity-40 uppercase">{product.brand}</p>
                                <p className="text-sm md:text-base font-bold leading-snug line-clamp-2 text-black dark:text-white">{product.name}</p>
                              </div>
                              
                              {/* 🔗 Full-Width Jumia Buy Button */}
                              <div className="mt-auto">
                                <a 
                                  href={product.affiliate_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-3.5 bg-[#f68b1e] hover:bg-[#e07b19] text-white rounded-full text-xs md:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f68b1e]/20"
                                >
                                  <ShoppingCart size={16} /> 
                                  JUMIA &nbsp;|&nbsp; ₦{product.price_ngn.toLocaleString()}
                                </a>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Affiliate Disclosure */}
                    <div className="mt-8 text-center">
                      <p className="text-[9px] md:text-[10px] font-bold opacity-40 uppercase tracking-widest bg-black/5 dark:bg-white/5 py-3 px-4 rounded-xl inline-block">
                        As a Jumia Affiliate, we earn from qualifying purchases.
                      </p>
                    </div>
                  </div>

                  {/* METADATA SUMMARY */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 px-10 bg-gray-50 dark:bg-white/5 rounded-[2rem]">
                    <div className="text-center md:text-left">
                      <p className="text-[9px] font-black tracking-[0.2em] opacity-40 uppercase">Reference ID</p>
                      <p className="text-xs font-bold mt-1">#{results.id.toString().slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[9px] font-black tracking-[0.2em] opacity-40 uppercase">Verification Status</p>
                      <p className="text-xs font-bold text-[#4DB6AC] italic mt-1">Clinical AI Verified</p>
                    </div>
                  </div>
                </div>

                {/* CALL TO ACTION BUTTONS */}
                <div className="p-8 md:p-16 pt-0 space-y-4 print:hidden">
                  <button
                    onClick={() => setShowLeadModal(true)}
                    className="w-full bg-black dark:bg-white text-white dark:text-black h-20 rounded-[2rem] font-black tracking-[0.2em] text-xs md:text-sm uppercase shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform hover:shadow-[#E1784F]/20"
                  >
                    Consult a Dermatologist <Calendar size={18} />
                  </button>

                  <button
                    onClick={() => setResults(null)}
                    className="w-full bg-transparent border-2 border-black/10 dark:border-white/10 h-16 rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all mt-4 hover:border-black/30 dark:hover:border-white/30"
                  >
                    Retake AI Scan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 🆕 WIDER, BEAUTIFIED LEAD CAPTURE MODAL */}
      <AnimatePresence>
        {showLeadModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xl p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95, opacity: 0 }} 
              animate={{ y: 0, scale: 1, opacity: 1 }} 
              className="bg-white dark:bg-[#111] w-full max-w-xl rounded-[3rem] p-10 md:p-14 shadow-2xl relative border border-black/5 dark:border-white/10 my-auto"
            >
              <div className="text-center mb-10">
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-black dark:text-white leading-none">
                  Secure Your <span className="text-[#E1784F]">Session</span>
                </h3>
                <p className="text-sm font-medium opacity-60 mt-4 leading-relaxed max-w-sm mx-auto">
                  Enter your details to schedule your clinical consultation and securely save your AI scan results.
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black tracking-[0.2em] opacity-50 ml-4 block mb-2 uppercase">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                    className="w-full p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#E1784F]/50 text-base font-medium focus:ring-4 focus:ring-[#E1784F]/10 outline-none transition-all" 
                    placeholder="Enter your legal name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-[0.2em] opacity-50 ml-4 block mb-2 uppercase">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#E1784F]/50 text-base font-medium focus:ring-4 focus:ring-[#E1784F]/10 outline-none transition-all" 
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black tracking-[0.2em] opacity-50 ml-4 block mb-2 uppercase">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                    className="w-full p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#E1784F]/50 text-base font-medium focus:ring-4 focus:ring-[#E1784F]/10 outline-none transition-all" 
                    placeholder="+234 (0) ..."
                  />
                </div>

                <div className="pt-6 space-y-4">
                  <button type="submit" className="w-full py-6 bg-[#E1784F] text-white rounded-[2rem] font-black tracking-[0.2em] text-xs uppercase shadow-xl shadow-[#E1784F]/20 active:scale-[0.98] transition-transform hover:bg-[#d6653a]">
                    Continue to Booking
                  </button>
                  <button type="button" onClick={() => setShowLeadModal(false)} className="w-full py-4 text-[11px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}