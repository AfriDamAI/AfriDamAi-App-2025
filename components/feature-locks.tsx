import { motion } from "framer-motion"
import { Lock, Zap, Download, Share2, ShieldAlert, Sparkles, Check, X, ArrowRight } from "lucide-react"

interface FeatureLockProps {
  featureName: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
  onUnlock: () => void;
  onClose?: () => void;
}

export function FeatureLock({ 
  featureName, 
  icon, 
  description, 
  benefits,
  onUnlock,
  onClose
}: FeatureLockProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg bg-[#0A0A0A] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
        {/* Header Section */}
        <div className="relative h-64 bg-[#E1784F] flex flex-col items-center justify-center overflow-hidden">
          {/* Background Sparkle Icon */}
          <div className="absolute -right-8 -bottom-8 text-white/20 transform rotate-12 scale-150">
            <Sparkles size={200} strokeWidth={1} />
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/20 transition-all z-20 shadow-lg"
            >
              <X size={20} />
            </button>
          )}

          <div className="relative z-10 text-center space-y-4">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Upgrade Your Experience
            </span>
            <div className="flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
                Unlock <br /> {featureName}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 md:p-12 space-y-8 bg-black">
          <p className="text-[11px] font-bold opacity-50 uppercase tracking-[0.1em] leading-relaxed text-center max-w-sm mx-auto">
            {description}
          </p>

          <div className="space-y-6">
            {benefits.map((benefit: string, i: number) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className="w-10 h-10 rounded-full bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F] shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  <Check size={16} strokeWidth={4} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-tight text-white">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={onUnlock}
              className="w-full py-6 bg-[#E1784F] text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Upgrade & Unlock Now <ArrowRight size={14} />
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="w-full text-[10px] font-black opacity-30 uppercase tracking-[0.3em] hover:opacity-100 transition-all text-center"
              >
                Maybe Later
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/** 📜 SCAN HISTORY LOCK SCREEN **/
export function HistoryLock({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8 bg-gray-50/50 dark:bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-black/5 dark:border-white/5">
      <div className="w-20 h-20 rounded-full bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F]">
        <Lock size={32} />
      </div>
      <div className="space-y-3 max-w-sm">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Scan Library <span className="text-[#E1784F]">is Locked</span></h3>
        <p className="text-[10px] font-bold opacity-40 uppercase tracking-tight leading-relaxed">
          Premium members can track their skin progress over time and access historical diagnostic reports.
        </p>
      </div>
      <button 
        onClick={onUnlock}
        className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
      >
        Unlock Clinical History
      </button>
    </div>
  )
}

/** 📸 SCREENSHOT LOCK (PREVENTATIVE) **/
export function ScreenshotLock({ onUnlock, onClose }: { onUnlock: () => void, onClose: () => void }) {
  return (
    <FeatureLock
      featureName="Screenshots"
      icon={<ShieldAlert size={32} />}
      description="Protecting clinical results requires a premium handshake. Direct captures are restricted on the free tier."
      benefits={[
        "Prevent metadata leaks",
        "Clinical result integrity",
        "Unlimited data exports"
      ]}
      onUnlock={onUnlock}
      onClose={onClose}
    />
  )
}

/** 📥 DOWNLOAD PDF LOCK **/
export function DownloadLock({ onUnlock, onClose }: { onUnlock: () => void, onClose: () => void }) {
  return (
    <FeatureLock
      featureName="PDF Exports"
      icon={<Download size={32} />}
      description="Download your clinical diagnostic results as high-precision PDF reports for your dermatologist."
      benefits={[
        "Dermatologist ready reports",
        "Full ingredient breakdown",
        "High-res scan exports"
      ]}
      onUnlock={onUnlock}
      onClose={onClose}
    />
  )
}

/** 🔗 SHARING LOCK **/
export function SharingLock({ onUnlock, onClose }: { onUnlock: () => void, onClose: () => void }) {
  return (
    <FeatureLock
      featureName="Secure Sharing"
      icon={<Share2 size={32} />}
      description="Directly share your verified clinical analysis with specialists via the AfriDam secure gateway."
      benefits={[
        "Encrypted medical pipe",
        "Direct specialist routing",
        "One-click consultations"
      ]}
      onUnlock={onUnlock}
      onClose={onClose}
    />
  )
}

/** 🏷️ INLINE LOCKED BADGE **/
export function LockedBadge({ feature, size = "md" }: { feature: string, size?: "sm" | "md" }) {
  return (
    <div className={`
      flex items-center gap-2 bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20 rounded-full w-fit
      ${size === "sm" ? "px-2 py-0.5 text-[7px]" : "px-3 py-1 text-[9px]"}
      font-black uppercase tracking-widest
    `}>
      <Lock size={size === "sm" ? 8 : 10} fill="currentColor" />
      {feature}
    </div>
  )
}
/** 📤 UPLOAD LOCK **/
export function UploadLock({ onUnlock, onClose }: { onUnlock: () => void, onClose: () => void }) {
  return (
    <FeatureLock
      featureName="Image Upload"
      icon={<Download size={32} className="rotate-180" />} // Rotated download icon as upload
      description="Uploading existing photos for analysis is a premium feature. Free tier supports real-time camera scanning only."
      benefits={[
        "Analyze past photos",
        "Higher resolution uploads",
        "Gallery integration"
      ]}
      onUnlock={onUnlock}
      onClose={onClose}
    />
  )
}
