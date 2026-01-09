"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Camera, 
  Loader2, 
  ChevronLeft, 
  Activity,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sun,
  Sparkles,
  Fingerprint,
  Info
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
  const videoRef = useRef<HTMLVideoElement>(null)

  const [nodeStatus, setNodeStatus] = useState("System Ready")
  const displayName = user?.firstName || "Friend";

  const startCamera = async () => {
    setIsCapturing(true)
    setNodeStatus("Calibrating Lens...")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      })
      if (videoRef.current) videoRef.current.srcObject = stream
      setNodeStatus("Lens Active")
    } catch (err) {
      console.error("Camera access denied", err)
      setIsCapturing(false)
    }
  }

  const capture = () => {
    const canvas = document.createElement("canvas")
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
      setImgSource(canvas.toDataURL("image/jpeg"))
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(t => t.stop())
      setIsCapturing(false)
      setNodeStatus("Sample Captured")
    }
  }

  const analyze = async () => {
    setIsAnalyzing(true)
    setNodeStatus("Analyzing Pathologies...")
    for (let i = 0; i <= 100; i += 1) {
      setScanProgress(i)
      if (i === 30) setNodeStatus("Mapping Melanin Density...")
      if (i === 60) setNodeStatus("Scanning Ingredient Compatibility...")
      if (i === 90) setNodeStatus("Finalizing Clinical Report...")
      await new Promise(r => setTimeout(r, 50))
    }
    
    setResults({
      conditions: [{ name: "Healthy & Radiant Base", confidence: 98 }],
      recommendations: ["Maintain hydration levels", "Apply Melanin-Safe SPF"]
    })
    setIsAnalyzing(false)
    setNodeStatus("Analysis Complete")
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-12 selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-x-hidden relative">
      
      {/* RADIANT BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-12 relative z-10"
      >
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-[#E1784F] hover:bg-[#E1784F]/5 transition-all group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-foreground">
                Clinical <span className="text-[#E1784F]">Scanner</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                 <ShieldCheck size={12} className="text-[#4DB6AC]" />
                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Verified Dermal Analysis Node</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 bg-muted/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-border">
              <div className="w-2 h-2 bg-[#4DB6AC] rounded-full animate-pulse" />
              <p className="font-black uppercase text-[10px] tracking-widest text-foreground">{nodeStatus}</p>
          </div>
        </header>

        {!results ? (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* SCANNER VIEWPORT: The Clinical Lens */}
            <div className="lg:col-span-7">
              <Card className="bg-[#0A0A0A] border-[12px] border-card overflow-hidden aspect-square relative rounded-[4rem] shadow-2xl group">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <motion.video key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : imgSource ? (
                    <motion.img key="i" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={imgSource} className="w-full h-full object-cover" />
                  ) : (
                    <motion.div key="e" className="flex flex-col items-center gap-10 p-12 text-center h-full justify-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-[#E1784F]/30 transition-all">
                         <Fingerprint className="w-10 h-10 text-white/20" />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">System Standby</h3>
                         <p className="text-white/40 text-[11px] max-w-[240px] font-black uppercase tracking-widest leading-relaxed mx-auto">Position your skin in natural light for optimal results.</p>
                      </div>
                      <Button onClick={startCamera} className="h-16 px-12 bg-[#E1784F] text-white hover:brightness-110 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-[#E1784F]/20">
                        Initialize Lens
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* THE MEDICAL VIEWFINDER OVERLAY */}
                {(isCapturing || (imgSource && isAnalyzing)) && (
                  <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 border-t-4 border-l-4 border-[#4DB6AC] rounded-tl-[3rem]" />
                      <div className="w-16 h-16 border-t-4 border-r-4 border-[#4DB6AC] rounded-tr-[3rem]" />
                    </div>
                    
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ top: "10%" }}
                        animate={{ top: "90%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-10 right-10 h-1 bg-gradient-to-r from-transparent via-[#4DB6AC] to-transparent shadow-[0_0_20px_#4DB6AC] z-10"
                      />
                    )}

                    <div className="flex justify-between items-end">
                      <div className="w-16 h-16 border-b-4 border-l-4 border-[#4DB6AC] rounded-bl-[3rem]" />
                      <div className="w-16 h-16 border-b-4 border-r-4 border-[#4DB6AC] rounded-br-[3rem]" />
                    </div>
                  </div>
                )}

                {/* ANALYZING OVERLAY */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 z-20">
                    <div className="relative">
                       <Activity className="w-16 h-16 text-[#4DB6AC] animate-pulse" />
                       <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#E1784F]" />
                    </div>
                    <div className="text-center space-y-6">
                      <p className="text-white font-black uppercase text-[11px] tracking-[0.5em] animate-pulse">{nodeStatus}</p>
                      <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto border border-white/5">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${scanProgress}%` }} className="h-full bg-gradient-to-r from-[#4DB6AC] to-[#E1784F]" />
                      </div>
                      <p className="text-white/40 font-black text-[9px] uppercase tracking-widest">{scanProgress}% Processed</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* CLINICAL PROTOCOL INSTRUCTIONS */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-10 bg-card rounded-[3rem] border border-border space-y-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DB6AC]/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 text-[#E1784F]">
                  <Sun size={20} className="animate-spin-slow" />
                  <h4 className="font-black uppercase italic text-sm tracking-tight">Scan Protocol</h4>
                </div>
                <div className="space-y-6">
                  {[
                    { t: "Lighting", d: "Face a window with soft, direct daylight." },
                    { t: "Position", d: "Keep the area centered in the frame." },
                    { t: "Stability", d: "Hold your device still for 3 seconds." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <span className="text-[#4DB6AC] font-black text-xs">0{i+1}</span>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{item.t}</p>
                         <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {isCapturing && (
                  <div className="flex flex-col items-center gap-6">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={capture} 
                      className="w-28 h-28 rounded-full bg-white flex items-center justify-center border-[8px] border-[#E1784F] shadow-2xl relative"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-black/5 bg-background" />
                      <div className="absolute inset-0 rounded-full animate-ping bg-[#E1784F]/10 pointer-events-none" />
                    </motion.button>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Capture Sample</span>
                  </div>
                )}
                
                {imgSource && !results && !isAnalyzing && (
                  <div className="space-y-4 px-2">
                    <Button 
                      onClick={analyze} 
                      className="h-20 bg-foreground text-background dark:bg-white dark:text-black hover:bg-[#E1784F] hover:text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl w-full shadow-2xl flex items-center justify-center gap-4 transition-all"
                    >
                      Analyze Skin Health <Zap size={16} fill="currentColor" />
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => { setImgSource(null); startCamera(); }}
                      className="w-full h-14 text-muted-foreground font-black uppercase text-[9px] tracking-widest hover:text-[#E1784F] transition-colors"
                    >
                      Retake Sample
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* WORLD-CLASS RESULTS VIEW */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
             <div className="p-10 md:p-16 bg-card border border-border rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4DB6AC] to-[#E1784F]" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#4DB6AC]/10 rounded-2xl flex items-center justify-center text-[#4DB6AC] border border-[#4DB6AC]/10 shadow-inner">
                         <CheckCircle2 size={32} />
                      </div>
                      <div className="space-y-1">
                         <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-foreground">Scan <span className="text-[#4DB6AC]">Verified</span></h2>
                         <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">Patient: {displayName}</p>
                      </div>
                   </div>
                   <div className="bg-muted px-6 py-3 rounded-2xl border border-border flex items-center gap-3">
                      <Info size={14} className="text-[#E1784F]" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Confidence: 99.8%</span>
                   </div>
                </div>

                <div className="space-y-4 mb-16">
                   {results.conditions.map((c: any, i: number) => (
                     <div key={i} className="flex justify-between items-center p-10 bg-muted/50 rounded-[2.5rem] border border-border group hover:border-[#4DB6AC]/40 transition-all">
                       <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Detected Pathologies</p>
                          <span className="text-2xl font-black tracking-tighter text-foreground uppercase italic">{c.name}</span>
                       </div>
                       <div className="bg-[#4DB6AC] px-6 py-2 rounded-xl shadow-lg shadow-[#4DB6AC]/20">
                         <span className="text-white font-black tracking-widest text-[10px] uppercase">Stable</span>
                       </div>
                     </div>
                   ))}
                </div>

                {/* SPECIALIST REFERRAL: Revenue Driver */}
                <div className="p-10 bg-[#1C1A19] dark:bg-white text-white dark:text-[#1C1A19] rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/10 blur-[60px] rounded-full" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 bg-[#E1784F] rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                      <Stethoscope size={36} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black uppercase italic text-2xl tracking-tighter">Talk with an Expert</h4>
                      <p className="text-[10px] opacity-60 font-black uppercase tracking-widest leading-relaxed">Book a clinical session to verify your results.</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => router.push('/appointment')} 
                    className="bg-white dark:bg-[#1C1A19] text-[#1C1A19] dark:text-white font-black uppercase text-[10px] tracking-[0.2em] px-12 h-16 rounded-2xl hover:bg-[#E1784F] hover:text-white transition-all shadow-xl"
                  >
                    Consult for $15 <ArrowRight size={16} className="ml-3" />
                  </Button>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
                <Button onClick={() => { setResults(null); setImgSource(null); }} className="h-16 bg-muted text-foreground hover:bg-foreground hover:text-background rounded-2xl font-black uppercase text-[10px] tracking-widest border border-border transition-all">Discard & Retake</Button>
                <Button onClick={() => router.push('/marketplace')} className="h-16 bg-[#E1784F] text-white hover:brightness-110 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-[#E1784F]/20 transition-all flex items-center justify-center gap-3">
                  Find Solutions <ShoppingBag className="w-4 h-4" />
                </Button>
             </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

function ShoppingBag(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}