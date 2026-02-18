/**
 * 🛡️ AFRIDAM PREMIUM: FEATURE LOCKS
 * Reusable components to gate access for free tier users.
 */

"use client"

import { motion } from "framer-motion"
import { Lock, Zap, Download, Share2, ShieldAlert } from "lucide-react"

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <Lock size={120} />
        </div>

        <div className="p-10 md:p-14 space-y-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F] shadow-inner">
            {icon}
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
              {featureName} <span className="text-[#E1784F]">Locked</span>
            </h2>
            <p className="text-xs font-bold opacity-50 uppercase tracking-tight max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid gap-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-black/5">
                <Zap size={14} className="text-[#E1784F]" fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={onUnlock}
              className="w-full py-6 bg-black dark:bg-white text-white dark:text-black rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Upgrade for Instant Access
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="w-full text-[9px] font-black opacity-30 uppercase tracking-[0.3em] hover:opacity-100 transition-all"
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
