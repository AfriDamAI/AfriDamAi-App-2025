"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, 
  ChevronLeft,
  Activity,
  CheckCircle2,
  Zap,
  Camera,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    setErrorDetails(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setIsCapturing(false);
      setErrorDetails("CAMERA HARDWARE UNREACHABLE.");
    }
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      setImgSource(canvas.toDataURL("image/jpeg"));
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      setIsCapturing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true);
    setScanProgress(20);

    try {
      const response = await fetch(imgSource);
      const blob = await response.blob();
      const file = new File([blob], "label.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('flag', 'ingredient_analysis');

      setScanProgress(50);

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyzer/process-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!apiResponse.ok) throw new Error("AI Node Busy");

      const data = await apiResponse.json();
      
      setResults({
        riskLevel: data.safetyRating || "ANALYSIS COMPLETE",
        safetyScore: data.score || 100,
        flagged: data.flaggedIngredients || [] 
      });

      setScanProgress(100);
    } catch (err) {
      setErrorDetails("NEURAL LINK FAILED. RETRY WITH CLEARER TEXT.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading || !user) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#E1784F]">
       <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <main className="min-h-[100svh] bg-background text-foreground px-6 py-12 md:p-12 lg:p-16 overflow-x-hidden selection:bg-[#E1784F]/30">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">
        
        {/* 🛡️ RE-ENFORCED CLINICAL HEADER */}
        <header className="flex justify-between items-center text-left">
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E1784F] hover:bg-[#E1784F] hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <div className="space-y-1">
               <h1 className="text-3xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-foreground">
                 Safety <span className="text-[#E1784F]">Check</span>
               </h1>
               <div className="flex items-center gap-2">
                 <Sparkles size={12} className="text-[#4DB6AC]" />
                 <span className="text-[9px] md:text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Ingredient Intelligence</span>
               </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 text-[#4DB6AC]">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Protocol</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          
          {/* 📸 SMART CAMERA PORTAL */}
          <div className="relative w-full aspect-[4/5] bg-[#0A0A0A] rounded-[2.5rem] md:rounded-[4rem] border-4 md:border-[12px] border-white/5 overflow-hidden shadow-2xl group">
            <AnimatePresence mode="wait">
              {isCapturing ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {/* Scanner Grid Overlay */}
                  <div className="absolute inset-0 border-[30px] md:border-[60px] border-black/60 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-[#E1784F]/40 rounded-3xl relative">
                       <motion.div 
                         animate={{ top: ["0%", "100%", "0%"] }} 
                         transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                         className="absolute left-0 right-0 h-0.5 bg-[#E1784F] shadow-[0_0_15px_#E1784F]" 
                       />
                    </div>
                  </div>
                  <button onClick={capture} className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-90 transition-all">
                    <div className="w-14 h-14 rounded-full bg-[#E1784F] shadow-lg shadow-[#E1784F]/40" />
                  </button>
                </div>
              ) : imgSource ? (
                <motion.div key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full">
                  <img src={imgSource} className="w-full h-full object-cover" alt="Captured Label" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:border-[#E1784F]/40 transition-all">
                    <Camera className="text-white/20 w-8 h-8 group-hover:text-[#E1784F] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-black uppercase italic text-2xl tracking-tighter">Scan Product Label</p>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">Place ingredients clearly within the frame for AI decoding.</p>
                  </div>
                  <button onClick={startCamera} className="bg-[#E1784F] text-white font-black px-10 py-5 rounded-2xl tracking-[0.2em] text-[10px] uppercase shadow-2xl active:scale-95 transition-all">
                    Initiate Lens
                  </button>
                </div>
              )}
            </AnimatePresence>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12 space-y-6 z-50">
                <Loader2 className="animate-spin text-[#4DB6AC] w-14 h-14" />
                <div className="space-y-2 text-center">
                  <p className="text-[#4DB6AC] font-black uppercase text-[10px] tracking-[0.4em] animate-pulse italic">Sequencing: {scanProgress}%</p>
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">Running Melanin-Safety cross-check</p>
                </div>
              </div>
            )}
          </div>

          {/* 📊 REAL-TIME RESULTS PANEL */}
          <div className="space-y-8 text-left">
            {errorDetails && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                    {errorDetails}
                </div>
            )}

            <AnimatePresence mode="wait">
              {results ? (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                  <div className={`p-8 md:p-12 rounded-[3rem] border ${results.safetyScore < 60 ? 'bg-red-500/5 border-red-500/20' : 'bg-[#4DB6AC]/5 border-[#4DB6AC]/20'}`}>
                    <div className="flex justify-between items-start mb-12">
                       <div className="space-y-2">
                          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground leading-none">{results.riskLevel}</h2>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Safety Profile</p>
                       </div>
                       <div className={`text-5xl md:text-7xl font-black italic tracking-tighter ${results.safetyScore < 60 ? 'text-red-500' : 'text-[#4DB6AC]'}`}>
                           {results.safetyScore}<span className="text-sm md:text-lg">/100</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                      {results.flagged.length > 0 ? results.flagged.map((ing: any, i: number) => (
                        <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex gap-4 items-start">
                          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                            <AlertTriangle size={18} />
                          </div>
                          <div>
                            <p className="font-black text-xs uppercase tracking-widest text-foreground">{ing.name}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed mt-2">{ing.note}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-8 bg-[#4DB6AC]/10 rounded-[2rem] border border-[#4DB6AC]/20 flex gap-4 items-center">
                            <div className="w-10 h-10 bg-[#4DB6AC] rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
                                <CheckCircle2 size={20} />
                            </div>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#4DB6AC]">This formula is melanin-approved.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => setResults(null)} className="h-20 bg-white/5 text-muted-foreground border border-white/5 rounded-[1.8rem] font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                       <RotateCcw size={16} /> New Scan
                    </button>
                    <button onClick={() => router.push('/marketplace')} className="h-20 bg-[#E1784F] text-white rounded-[1.8rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-[#E1784F]/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                      Safe Alternatives <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ) : imgSource && !isAnalyzing ? (
                <div className="space-y-6 pt-6">
                  <button onClick={handleAnalyze} className="w-full bg-foreground text-background font-black h-20 md:h-24 rounded-[2rem] text-xs md:text-sm tracking-[0.4em] uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                    Decode Profile <Zap size={18} fill="currentColor" />
                  </button>
                  <button onClick={() => setImgSource(null)} className="w-full text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:text-[#E1784F] transition-colors">
                    Reset Camera Lens
                  </button>
                </div>
              ) : (
                 <div className="pt-20 lg:pt-32 text-center space-y-6 opacity-30">
                    <div className="relative mx-auto w-24 h-24">
                       <Activity size={60} className="mx-auto text-foreground animate-pulse" />
                       <div className="absolute inset-0 bg-[#E1784F]/20 blur-3xl rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-foreground">Awaiting Input Signal</p>
                      <p className="text-[8px] font-black uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">System ready for label analysis and ingredient cross-reference.</p>
                    </div>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}