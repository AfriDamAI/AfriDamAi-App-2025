"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Loader2, 
  ChevronLeft,
  Activity,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Camera,
  Heart,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
      console.error("Camera Error:", err);
      setIsCapturing(false);
      setErrorDetails("Could not access camera hardware.");
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

  /**
   * 🚀 OGA FIX: REAL INGREDIENT ANALYSIS
   * Connects to backend: /analyzer/process-request
   */
  const handleAnalyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true);
    setScanProgress(20);

    try {
      // 1. Prepare Data
      const response = await fetch(imgSource);
      const blob = await response.blob();
      const file = new File([blob], "label.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('flag', 'ingredient_analysis');

      setScanProgress(50);

      // 2. Call your Backend
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/analyzer/process-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (!apiResponse.ok) throw new Error("AI Node Busy");

      const data = await apiResponse.json();
      
      // 3. Set real results from Nathan's AI
      setResults({
        riskLevel: data.safetyRating || "ANALYSIS COMPLETE",
        safetyScore: data.score || 100,
        flagged: data.flaggedIngredients || [] 
      });

      setScanProgress(100);
    } catch (err) {
      console.error("Analysis Failed:", err);
      setErrorDetails("Neural link failed. Ensure the label is clear.");
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
    <main className="min-h-screen bg-background text-foreground p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-white/5 pb-10">
          <div className="flex items-center gap-8">
            <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#E1784F] transition-all">
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col">
               <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                 Product <span className="text-[#E1784F]">Safety Check</span>
               </h1>
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-2 italic">Clinical Ingredient Analysis</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 opacity-50 text-[#4DB6AC]">
             <ShieldCheck size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">Melanin-Safe Protocol</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* CAMERA CARD */}
          <Card className="aspect-[4/5] bg-[#0A0A0A] rounded-[3.5rem] border-8 border-white/5 overflow-hidden relative shadow-2xl">
            <AnimatePresence mode="wait">
              {isCapturing ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button onClick={capture} className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-[#E1784F] bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#E1784F] animate-pulse" />
                  </button>
                </div>
              ) : imgSource ? (
                <motion.img key="i" initial={{ scale: 1.1 }} animate={{ scale: 1 }} src={imgSource} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                    <Camera className="text-white/20 w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-black uppercase italic text-xl">Scan Product Label</p>
                    <p className="text-white/30 text-xs font-medium max-w-[200px]">Center the ingredients list for accurate detection.</p>
                  </div>
                  <Button onClick={startCamera} className="bg-[#E1784F] text-white font-black px-10 h-16 rounded-2xl tracking-widest text-[10px] uppercase shadow-2xl hover:bg-[#ff8e5e]">
                    Start Lens
                  </Button>
                </div>
              )}
            </AnimatePresence>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 space-y-6 z-50">
                <div className="relative">
                    <Loader2 className="animate-spin text-[#4DB6AC] w-16 h-16" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-6 h-6" />
                </div>
                <p className="text-[#4DB6AC] font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Neural Decoding: {scanProgress}%</p>
              </div>
            )}
          </Card>

          {/* RESULTS PANEL */}
          <div className="space-y-8">
            {errorDetails && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest">
                    {errorDetails}
                </div>
            )}

            <AnimatePresence>
              {results ? (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                  <div className={`p-10 rounded-[3rem] border ${results.safetyScore < 60 ? 'bg-red-500/5 border-red-500/20' : 'bg-[#4DB6AC]/5 border-[#4DB6AC]/20'}`}>
                    <div className="flex justify-between items-start mb-10">
                       <div className="space-y-2">
                          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-white">{results.riskLevel}</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Clinical Safety Rating</p>
                       </div>
                       <div className={`text-5xl font-black italic tracking-tighter ${results.safetyScore < 60 ? 'text-red-500' : 'text-[#4DB6AC]'}`}>
                           {results.safetyScore}<span className="text-sm">/100</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                      {results.flagged.length > 0 ? results.flagged.map((ing: any, i: number) => (
                        <div key={i} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex gap-4">
                          <AlertTriangle className="text-[#E1784F] shrink-0" size={18} />
                          <div>
                            <p className="font-black text-xs uppercase tracking-widest text-white">{ing.name}</p>
                            <p className="text-xs text-white/40 font-medium leading-relaxed mt-2">{ing.note}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-6 bg-[#4DB6AC]/10 rounded-[2rem] border border-[#4DB6AC]/20 flex gap-4">
                            <CheckCircle2 className="text-[#4DB6AC]" size={18} />
                            <p className="text-xs font-black uppercase tracking-widest text-[#4DB6AC]">No harmful melanin-inhibitors detected.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setResults(null)} className="h-16 bg-white/5 text-white/40 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest">
                       <RotateCcw size={14} className="mr-2" /> Reset
                    </Button>
                    <Button onClick={() => router.push('/marketplace')} className="h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">
                      Find Alternatives
                    </Button>
                  </div>
                </motion.div>
              ) : imgSource && !isAnalyzing ? (
                <div className="space-y-6 pt-10">
                  <Button onClick={handleAnalyze} className="w-full bg-white text-black font-black h-20 rounded-[2rem] text-xs tracking-[0.4em] uppercase shadow-2xl hover:bg-[#E1784F] hover:text-white transition-all">
                    Start AI Decode <Zap size={16} className="ml-2" />
                  </Button>
                  <Button onClick={() => setImgSource(null)} className="w-full text-white/20 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-all">
                    Discard Image
                  </Button>
                </div>
              ) : (
                 <div className="pt-20 text-center opacity-20">
                    <Heart size={64} className="mx-auto mb-6 text-white animate-pulse" />
                    <p className="font-black uppercase tracking-[0.4em] text-[10px] text-white">Clinical Node Awaiting Scan</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}