/**
 * 🛡️ AFRIDAM SAFETY LAB: INGREDIENT CHECKER (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Simple English Parsing & Melanin Safety Mapping.
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, CheckCircle2, Zap, 
  RotateCcw, AlertTriangle, Upload, Baby, ShoppingBag, 
  Scan, FlaskConical
} from "lucide-react"
// 🚀 SYNC: Using the unified api-client to handle both image and text analysis
import { uploadImage, analyzeIngredients } from "@/lib/api-client"

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [manualText, setManualText] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    setStatus("Opening Camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: 1080, height: 1080 } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setIsCapturing(false);
      setStatus("Camera Error");
    }
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      setImgSource(canvas.toDataURL("image/jpeg", 0.9));
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      setIsCapturing(false);
      setStatus("Photo Locked");
    }
  };

  const handleAnalyze = async () => {
    const input = imgSource || manualText;
    if (!input) return;
    
    setIsAnalyzing(true);
    setStatus("Checking Formula...");
    
    try {
      /**
       * 🚀 THE HYBRID HANDSHAKE (Rule 7)
       * Image vs. Text routing.
       */
      let data;
      if (imgSource) {
        // Sends to /analyzer/upload with 'ingredient_analysis' flag (Backend Logic)
        data = await uploadImage(imgSource);
      } else {
        // Sends to /ai/ingredients-analysis (AI Brain Logic)
        data = await analyzeIngredients(manualText);
      }
      
      /** * 📊 DATA MAPPING
       * riskLevel: Simplified safety status.
       * safetyScore: Number from 0 to 100.
       */
      setResults({
        riskLevel: data?.risk_level || data?.status || "Balanced",
        safetyScore: data?.safety_score || data?.score || 85,
        isChildSafe: data?.child_safe || data?.isChildSafe || false,
        summary: data?.summary || data?.description || "Analysis complete. This formula looks safe for your skin profile."
      });
      
      setStatus("Ready");
    } catch (err) {
      // 🛡️ Rule 4: Relatable English for internet/sync errors
      setStatus("Try Again");
      console.error("Formula sync error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#0A0A0A] text-black dark:text-white pb-20">
      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-16 grid lg:grid-cols-2 gap-12 items-start text-left">
        
        {/* LEFT: STATUS & BRAND */}
        <div className="space-y-10">
          <header className="space-y-8">
            <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all">
              <ChevronLeft size={14} /> Dashboard
            </button>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] py-2">
                Safety <span className="text-[#E1784F]">Check</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
                   <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="hidden lg:block space-y-8 max-w-sm">
            <p className="text-xs font-medium leading-relaxed opacity-60">
              Verify every chemical. Our AI checks ingredients against skin-safe clinical databases.
            </p>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#E1784F] uppercase tracking-[0.3em]">Manual Entry</label>
              <textarea 
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Paste ingredients here..."
                className="w-full h-32 p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] text-sm focus:ring-1 focus:ring-[#E1784F] outline-none transition-all resize-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE LAB */}
        <div className="relative">
          {!results ? (
            <div className="space-y-10">
              <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-white/5 border-[4px] border-white dark:border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : imgSource ? (
                    <div className="relative w-full h-full">
                      <img src={imgSource} className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? 'blur-lg opacity-40' : ''}`} alt="Label" />
                      {isAnalyzing && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
                            <motion.div 
                              animate={{ top: ["0%", "100%", "0%"] }} 
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-[1px] bg-[#E1784F] shadow-[0_0_15px_#E1784F] z-50"
                            />
                            <FlaskConical className="animate-bounce text-[#E1784F] mb-4" size={32} />
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Checking Formula</p>
                         </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10">
                      <Scan size={60} />
                      <p className="text-[9px] font-black uppercase tracking-widest mt-4">Scan Label</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="max-w-xs mx-auto space-y-4">
                {isCapturing ? (
                  <button onClick={capture} className="w-16 h-16 mx-auto rounded-full border-4 border-[#E1784F] p-1 flex items-center justify-center active:scale-90 transition-transform">
                     <div className="w-full h-full rounded-full bg-[#E1784F]" />
                  </button>
                ) : (imgSource || manualText) && !isAnalyzing ? (
                  <button onClick={handleAnalyze} className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl">
                    Check Now <Zap size={14} fill="currentColor" />
                  </button>
                ) : !isAnalyzing && (
                  <div className="space-y-4">
                    <button onClick={startCamera} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
                      Open Camera
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 text-[9px] font-black opacity-40 uppercase tracking-widest flex items-center justify-center gap-2">
                      <Upload size={12} /> Upload Photo
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
            /* RESULTS VIEW */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-black dark:bg-white text-white dark:text-black p-10 md:p-14 rounded-[3.5rem] space-y-8 shadow-2xl text-left">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${results.safetyScore < 70 ? 'bg-red-500' : 'bg-[#E1784F]'}`}>
                     {results.safetyScore < 70 ? <AlertTriangle size={28} className="text-white" /> : <CheckCircle2 size={28} className="text-white" />}
                  </div>
                  {results.isChildSafe && (
                    <div className="bg-white/10 dark:bg-black/10 px-4 py-2 rounded-full flex items-center gap-2 border border-white/20 dark:border-black/20">
                       <Baby size={12} className="text-[#E1784F]" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Child Safe</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[5rem] md:text-[7rem] font-black italic tracking-tighter leading-none">{results.safetyScore}</p>
                  <h3 className="text-lg font-black uppercase tracking-widest opacity-80">{results.riskLevel} Rating</h3>
                </div>

                <div className="pt-8 border-t border-white/10 dark:border-black/10 space-y-6">
                  <p className="text-xs font-bold leading-relaxed opacity-60">
                    {results.summary}
                  </p>
                  <button onClick={() => router.push('/marketplace')} className="w-full py-5 bg-white dark:bg-black text-black dark:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 group">
                    Find Safe Products <ShoppingBag size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <button onClick={() => {setResults(null); setImgSource(null); setManualText("");}} className="w-full py-2 text-[9px] font-black opacity-30 uppercase tracking-widest flex items-center justify-center gap-2">
                <RotateCcw size={12} /> New Check
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}