"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Camera, 
  Upload, 
  ChevronLeft, 
  Activity,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  Zap,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  ShieldCheck,
  Scan,
  Maximize,
  AlertCircle,
  Lock,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"

export default function UnifiedScanner() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [imgSource, setImgSource] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [status, setStatus] = useState("System Ready")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [isSecure, setIsSecure] = useState<boolean | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSecure(window.isSecureContext);
    }
  }, []);

  const startCamera = async () => {
    setErrorDetails(null)
    if (!window.isSecureContext) {
      setErrorDetails("Hardware access requires a secure (HTTPS) connection.");
      setStatus("Security Block");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorDetails("Browser does not support camera hardware.");
      setStatus("Incompatible");
      return;
    }

    setIsCapturing(true)
    setStatus("Synchronizing...")
    
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      const constraints = {
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = async () => {
          try { if (videoRef.current) await videoRef.current.play(); setStatus("Lens Active"); }
          catch (e) { setStatus("Hardware Blocked"); }
        };
      }
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails(err.message);
      setStatus("Hardware Error")
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
      setImgSource(canvas.toDataURL("image/jpeg"))
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCapturing(false)
      setStatus("Sample Captured")
    }
  }

  /**
   * 🚀 OGA FIX: REAL ANALYSIS LOGIC
   * Connects to your NestJS Backend
   */
  const analyze = async () => {
    if (!imgSource) return;
    
    setIsAnalyzing(true)
    setStatus("Uploading to AI...")
    setScanProgress(10)

    try {
      // 1. Convert Base64 to Blob for Upload
      const response = await fetch(imgSource);
      const blob = await response.blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('file', file);

      setScanProgress(40);
      setStatus("Processing Melanin Nodes...");

      // 3. Call your Backend
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/analyzer/scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Ensure user is logged in
        },
        body: formData,
      });

      if (!apiResponse.ok) throw new Error("AI Service Refused Connection");

      const data = await apiResponse.json();
      setScanProgress(100);

      // 4. Set Real Results
      setResults({
        finding: data.description || "Analysis Complete",
        predictions: data.predictions, // Real JSON from Nathan's AI
        status: data.status || "Success"
      });

      setStatus("Analysis Complete")
    } catch (err: any) {
      console.error("Analysis Failed:", err);
      setErrorDetails("The AI Service is currently busy. Please try again in a moment.");
      setStatus("System Error");
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-10 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(225,120,79,0.15),transparent_80%)] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#4DB6AC]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        <header className="flex justify-between items-center bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-5">
            <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#E1784F]/20 transition-all border border-white/10 group">
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">AI <span className="text-[#E1784F]">Scanner</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]/80">Clinical Skin Intelligence</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border ${errorDetails ? 'bg-red-500/10 border-red-500/20' : 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20'}`}>
            <ShieldCheck size={14} className={errorDetails ? "text-red-500" : "text-[#4DB6AC]"} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${errorDetails ? "text-red-500" : "text-[#4DB6AC]"}`}>{status}</span>
          </div>
        </header>

        {errorDetails && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] flex items-start gap-4 text-red-400">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest leading-none">Security Protocol Alert</p>
               <p className="text-[11px] font-bold opacity-70 leading-relaxed">{errorDetails}</p>
            </div>
          </motion.div>
        )}

        {!results ? (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 relative group">
              <Card className="bg-black border-[1px] border-white/10 overflow-hidden aspect-[4/5] relative rounded-[3.5rem] shadow-[0_0_80px_rgba(0,0,0,1)]">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <motion.video 
                      key="v" 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover scale-x-[-1]" 
                    />
                  ) : imgSource ? (
                    <motion.img 
                      key="i" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      src={imgSource} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <motion.div key="e" className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#E1784F]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative w-28 h-28 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                          <Scan className="w-12 h-12 text-white/40" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Clinical <br/> Viewport</h3>
                        <p className="text-white/30 text-[11px] font-black uppercase tracking-widest max-w-[220px] mx-auto">Activate the lens for a melanin-specific scan.</p>
                      </div>
                      <div className="flex flex-col gap-3 w-full max-w-xs">
                        <Button onClick={startCamera} className="h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_15px_30px_rgba(225,120,79,0.3)] hover:scale-[1.02] transition-all">Open Camera</Button>
                        <Button onClick={() => fileInputRef.current?.click()} className="h-16 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest">Upload Sample</Button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if(file) {
                            const reader = new FileReader();
                            reader.onloadend = () => { setImgSource(reader.result as string); setStatus("Sample Imported"); };
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isAnalyzing && (
                  <motion.div 
                    initial={{ top: "10%" }} animate={{ top: "90%" }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#4DB6AC] to-transparent shadow-[0_0_35px_#4DB6AC] z-30"
                  />
                )}
              </Card>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-50">
                {isCapturing && (
                  <button onClick={capture} className="w-24 h-24 rounded-full bg-white p-1 shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-90 transition-all">
                    <div className="w-full h-full rounded-full border-[8px] border-[#E1784F] bg-white flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-[#E1784F] animate-pulse" />
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[3.5rem] space-y-10 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center gap-4 text-[#E1784F]">
                  <Activity size={22} />
                  <h4 className="font-black uppercase italic text-sm tracking-tight">Clinical Protocol</h4>
                </div>
                <div className="space-y-8">
                  {[
                    { t: "Live AI Processing", d: "Your sample is analyzed by 4 clinical melanin-specific neural networks." },
                    { t: "Global Standard", d: "Validated against the Fitzpatrick Scale for deep skin tones." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <span className="text-[#4DB6AC] font-black text-xs mt-1">0{i+1}</span>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">{item.t}</p>
                         <p className="text-[11px] font-bold text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {imgSource && !isAnalyzing && (
                  <Button onClick={analyze} className="w-full h-22 bg-white text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.5em] shadow-[0_25px_50px_rgba(255,255,255,0.1)] hover:bg-[#E1784F] hover:text-white transition-all">
                    Run AI Analysis <Zap size={16} className="ml-2 fill-current" />
                  </Button>
                )}
                {isAnalyzing && (
                  <div className="w-full py-6 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-[#4DB6AC]" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Neural Link Active: {scanProgress}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pb-32">
            <div className="p-12 md:p-16 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-8 mb-16">
                <div className="w-20 h-20 bg-[#4DB6AC]/10 rounded-[2rem] border border-[#4DB6AC]/20 flex items-center justify-center text-[#4DB6AC]">
                  <CheckCircle2 size={42} />
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Analysis <span className="text-[#4DB6AC]">Live</span></h2>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Node Verified: Clinical Grade</p>
                </div>
              </div>

              {/* 🚀 OGA FIX: DYNAMIC RESULT DISPLAY */}
              <div className="p-10 md:p-12 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col gap-6 mb-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#E1784F]">AI Clinical Finding</p>
                  <h4 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-tight text-white">
                    {results.finding}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {results.predictions && Object.entries(results.predictions).map(([name, score]: any) => (
                    <div key={name} className="px-4 py-2 bg-[#4DB6AC]/20 border border-[#4DB6AC]/30 text-[#4DB6AC] font-black text-[9px] uppercase rounded-lg">
                      {name}: {(score * 100).toFixed(1)}%
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-10 bg-[#E1784F] text-white rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center shadow-inner"><Stethoscope size={36}/></div>
                    <div className="space-y-2 text-left">
                       <p className="text-3xl font-black italic uppercase tracking-tight leading-none">Specialist Review</p>
                       <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest leading-relaxed">Connect with a melanin-specific expert for $15.</p>
                    </div>
                 </div>
                 <Button onClick={() => router.push('/appointment')} className="w-full md:w-auto bg-black text-white px-12 h-20 rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-2xl">Book Now</Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <Button onClick={() => setResults(null)} className="flex-1 h-20 bg-white/5 border border-white/10 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all text-white/40">New Scan</Button>
              <Button onClick={() => router.push('/ecommerce')} className="flex-1 h-20 bg-white text-black rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-[#E1784F] hover:text-white transition-all shadow-2xl">View Solutions <ShoppingBag size={16} className="ml-3" /></Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}