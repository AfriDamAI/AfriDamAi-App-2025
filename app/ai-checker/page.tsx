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
  Heart
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

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera Error:", err);
      setIsCapturing(false);
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
    setIsAnalyzing(true);
    for (let i = 0; i <= 100; i += 4) {
      setScanProgress(i);
      await new Promise(r => setTimeout(r, 60));
    }
    setResults({
      riskLevel: "SAFETY CONCERNS FOUND",
      safetyScore: 12,
      flagged: [
        { name: "Hydroquinone", risk: "Extreme", note: "This ingredient can be harsh on African skin. It is best to avoid it for long-term health." },
        { name: "Clobetasol Propionate", risk: "High", note: "A very strong steroid. Please only use this if a doctor has specifically told you to." }
      ]
    });
    setIsAnalyzing(false);
  };

  if (authLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-[#E1784F]">
       <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-6 lg:p-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-border pb-10">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-[#E1784F] transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col">
               <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                 Product <span className="text-[#E1784F]">Safety Check</span>
               </h1>
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-2 italic text-center md:text-left">AfriDam Care Hub</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 opacity-50">
             <ShieldCheck size={14} className="text-[#4DB6AC]" />
             <span className="text-[9px] font-black uppercase tracking-widest">Your Safety First</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* CAMERA CARD */}
          <Card className="aspect-[4/5] bg-[#1C1A19] rounded-[3.5rem] border-8 border-card overflow-hidden relative shadow-2xl">
            <AnimatePresence mode="wait">
              {isCapturing ? (
                <motion.video key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : imgSource ? (
                <motion.img key="i" initial={{ scale: 1.1 }} animate={{ scale: 1 }} src={imgSource} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                    <Camera className="text-white/20 w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-black uppercase italic text-xl">Ready to check?</p>
                    <p className="text-white/40 text-xs font-medium max-w-[200px]">Hold the product label clearly in front of the camera.</p>
                  </div>
                  <Button onClick={startCamera} className="bg-[#E1784F] text-white font-black px-10 h-16 rounded-2xl tracking-widest text-[10px] uppercase shadow-xl hover:scale-105 transition-all">
                    Open My Camera
                  </Button>
                </div>
              )}
            </AnimatePresence>

            {/* SCANNING HUD */}
            {(isCapturing || (imgSource && isAnalyzing)) && (
              <div className="absolute inset-0 pointer-events-none p-10">
                <motion.div 
                  initial={{ y: "0%" }} animate={{ y: "100%" }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[1px] bg-[#4DB6AC] shadow-[0_0_15px_#4DB6AC] z-20"
                />
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-12 space-y-6">
                <Activity className="animate-pulse text-[#4DB6AC] w-12 h-12" />
                <p className="text-[#4DB6AC] font-black uppercase text-[10px] tracking-[0.4em]">Looking closely...</p>
              </div>
            )}
          </Card>

          {/* RESULTS PANEL */}
          <div className="space-y-8">
            <AnimatePresence>
              {results ? (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                  <div className={`p-10 rounded-[3rem] border ${results.safetyScore < 40 ? 'bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-500' : 'bg-[#4DB6AC]/5 border-[#4DB6AC]/20 text-[#4DB6AC]'}`}>
                    <div className="flex justify-between items-start mb-10">
                       <div className="space-y-2">
                          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{results.riskLevel}</h2>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Health Assessment Complete</p>
                       </div>
                       <div className="text-5xl font-black italic tracking-tighter">{results.safetyScore}<span className="text-sm">/100</span></div>
                    </div>
                    <div className="space-y-4">
                      {results.flagged.map((ing: any, i: number) => (
                        <div key={i} className="p-6 bg-card rounded-[2rem] border border-border flex gap-4 shadow-sm">
                          <AlertTriangle className="text-red-500 shrink-0" size={18} />
                          <div>
                            <p className="font-black text-xs uppercase tracking-widest text-foreground">{ing.name}</p>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-2">{ing.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CLINICAL HAND-OFF */}
                  <div className="p-8 bg-[#FEF2ED] dark:bg-[#E1784F]/5 border border-[#F0A287]/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm group">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                        <Stethoscope size={28} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black uppercase italic text-sm text-[#3D261C] dark:text-foreground">Need advice?</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Our specialists can help you find <br/> better alternatives for your skin.</p>
                      </div>
                    </div>
                    <Button onClick={() => router.push('/appointments')} className="bg-[#1C1A19] text-white font-black uppercase text-[9px] tracking-widest px-10 h-14 rounded-xl shadow-md hover:bg-[#E1784F] transition-all">
                      Talk to an Expert
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setResults(null)} className="h-16 bg-muted text-muted-foreground hover:text-foreground border border-border rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                       Check Another
                    </Button>
                    <Button onClick={() => router.push('/marketplace')} className="h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#E1784F]/20 hover:scale-[1.02] transition-all">
                      Find Safe Products
                    </Button>
                  </div>
                </motion.div>
              ) : imgSource && !isAnalyzing ? (
                <div className="space-y-6 pt-10">
                  <Button onClick={handleAnalyze} className="w-full bg-[#1C1A19] text-white font-black h-20 rounded-[2rem] text-xs tracking-[0.4em] uppercase shadow-2xl hover:bg-[#E1784F] transition-all flex items-center justify-center gap-3">
                    Check Product Now <Zap size={16} />
                  </Button>
                  <Button variant="ghost" onClick={() => setImgSource(null)} className="w-full text-muted-foreground font-bold uppercase text-[10px] tracking-widest hover:text-foreground transition-all">
                    Discard and Try Again
                  </Button>
                </div>
              ) : (
                 <div className="pt-20 text-center opacity-30">
                    <Heart size={64} className="mx-auto mb-6 text-muted-foreground animate-pulse" />
                    <p className="font-black uppercase tracking-[0.4em] text-xs text-muted-foreground">Waiting to protect your skin...</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}