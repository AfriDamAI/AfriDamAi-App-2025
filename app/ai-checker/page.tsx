/**
 * 🛡️ AFRIDAM SAFETY LAB: INGREDIENT CHECKER
 * Version: 2026.1.2 (Premium Editorial Refactor)
 * Handshake: Fully synced with lib/api-client.ts
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, ChevronLeft, CheckCircle2, Zap, Camera,
  RotateCcw, AlertTriangle, Upload, Baby, Info, ShoppingBag, 
  ArrowRight, Scan, FlaskConical
} from "lucide-react"
import { analyzeIngredients } from "@/lib/api-client"

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
  const [status, setStatus] = useState("Standby");

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    setStatus("Activating Lens");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: 1080, height: 1080 } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setIsCapturing(false);
      setStatus("Sensor Error");
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
      setStatus("Input Locked");
    }
  };

  const handleAnalyze = async () => {
    const input = imgSource || manualText;
    if (!input) return;
    setIsAnalyzing(true);
    setStatus("Molecular Review...");
    try {
      const data = await analyzeIngredients(input);
      const payload = data?.resultData || data;
      setResults({
        riskLevel: payload?.riskLevel || "Balanced",
        safetyScore: payload?.safetyScore || 100,
        isChildSafe: payload?.isChildSafe ?? true,
        summary: payload?.description || "Safe for daily skincare regimens."
      });
      setStatus("Complete");
    } catch (err) {
      setStatus("Sync Failure");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#0A0A0A] text-black dark:text-white transition-colors duration-500">
      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-16 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT: STATUS & BRAND */}
        <div className="space-y-12">
          <header className="space-y-8">
            <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all">
              <ChevronLeft size={14} /> Back to Hub
            </button>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] py-2">
                Safety <span className="text-[#E1784F]">Check</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
                </div>
                <span className="text-[9px] font-bold opacity-40 uppercase tracking-[0.2em]">Molecular Analysis</span>
              </div>
            </div>
          </header>

          <div className="hidden lg:block space-y-8 max-w-sm">
            <p className="text-sm font-medium leading-relaxed opacity-60">
              Verify every chemical in your products. Our AI cross-references ingredients against clinical safety databases for families.
            </p>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#E1784F] uppercase tracking-[0.3em]">Manual Entry</label>
              <textarea 
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="List ingredients here..."
                className="w-full h-32 p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] text-sm focus:ring-1 focus:ring-[#E1784F] outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE LAB */}
        <div className="relative">
          {!results ? (
            <div className="space-y-10">
              <div className="relative aspect-square w-full rounded-[3.5rem] overflow-hidden bg-gray-100 dark:bg-white/5 border-[8px] border-white dark:border-[#1A1A1A] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)]">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : imgSource ? (
                    <div className="relative w-full h-full">
                      <img src={imgSource} className={`w-full h-full object-cover transition-all duration-1000 ${isAnalyzing ? 'scale-110 blur-lg opacity-40' : ''}`} alt="Label" />
                      {isAnalyzing && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div 
                              animate={{ top: ["0%", "100%", "0%"] }} 
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-[2px] bg-[#E1784F] shadow-[0_0_20px_#E1784F] z-50"
                            />
                            <FlaskConical className="animate-bounce text-[#E1784F] mb-4" size={40} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Breaking Down Label</p>
                         </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-20">
                      <Scan size={80} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-6">Scan Product Label</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="max-w-xs mx-auto space-y-4">
                {isCapturing ? (
                  <button onClick={capture} className="w-20 h-20 mx-auto rounded-full border-[6px] border-[#E1784F] bg-transparent p-1 flex items-center justify-center transition-transform active:scale-90">
                     <div className="w-full h-full rounded-full bg-[#E1784F]" />
                  </button>
                ) : (imgSource || manualText) && !isAnalyzing ? (
                  <button onClick={handleAnalyze} className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl transition-all hover:bg-[#E1784F] hover:text-white">
                    Start Analysis <Zap size={16} fill="currentColor" />
                  </button>
                ) : !isAnalyzing && (
                  <div className="space-y-4">
                    <button onClick={startCamera} className="w-full py-6 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all">
                      Open AI Camera
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 text-[10px] font-black opacity-40 uppercase tracking-[0.3em] hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                      <Upload size={14} /> Upload Label
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
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-black dark:bg-white text-white dark:text-black p-12 rounded-[4rem] space-y-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-start">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center rotate-3 ${results.safetyScore < 70 ? 'bg-red-500' : 'bg-[#E1784F]'}`}>
                     {results.safetyScore < 70 ? <AlertTriangle size={32} className="text-white" /> : <CheckCircle2 size={32} className="text-white" />}
                  </div>
                  {results.isChildSafe && (
                    <div className="bg-white/10 dark:bg-black/10 px-4 py-2 rounded-full flex items-center gap-2 border border-white/20 dark:border-black/20">
                       <Baby size={14} className="text-[#E1784F]" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Pediatric Safe</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-[4rem] md:text-[6rem] font-black italic tracking-tighter leading-none">{results.safetyScore}<span className="text-sm opacity-30 ml-2">pts</span></p>
                  <h3 className="text-xl font-black uppercase tracking-[0.2em] opacity-80">{results.riskLevel} Rating</h3>
                </div>

                <div className="pt-10 border-t border-white/10 dark:border-black/10 space-y-6 text-left">
                  <p className="text-[11px] font-bold uppercase leading-relaxed opacity-60 tracking-tight">
                    {results.summary}
                  </p>
                  <button onClick={() => router.push('/marketplace')} className="w-full py-6 bg-white dark:bg-black text-black dark:text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 group">
                    Shop Safe Alternatives <ShoppingBag size={16} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
              <button onClick={() => {setResults(null); setImgSource(null); setManualText("");}} className="w-full py-4 text-[10px] font-black opacity-40 uppercase tracking-[0.3em] hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                <RotateCcw size={14} /> Reset Lab
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}