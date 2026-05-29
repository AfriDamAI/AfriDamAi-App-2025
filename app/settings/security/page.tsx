"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, Lock, ShieldCheck, 
  Eye, EyeOff, Loader2, Key,
  Fingerprint, CheckCircle2, AlertCircle
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { apiClient } from "@/lib/api-client"

/**
 * 🛡️ AFRIDAM SECURITY & PRIVACY (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Password Handshake & Mobile-First Privacy Controls.
 */

export default function SecurityPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [diagnosticSharingOverride, setDiagnosticSharingOverride] = useState<boolean | null>(null)
  const [privacyLoading, setPrivacyLoading] = useState(false)

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const savedDiagnosticSharing = (user?.profile as any)?.diagnosticSharing
  const diagnosticSharing = diagnosticSharingOverride ?? (typeof savedDiagnosticSharing === "boolean" ? savedDiagnosticSharing : true)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (passwords.new !== passwords.confirm) {
      setError("The new passwords do not match.")
      return
    }

    if (!user?.id || !user?.email) return

    setIsLoading(true)
    try {
      // Step 1: verify current password by re-authenticating
      await apiClient.post(`/auth/user/login`, {
        email: user.email,
        password: passwords.current
      })

      // Step 2: update the password
      await apiClient.put(`/users/${user.id}`, {
        password: passwords.new
      })

      setIsSuccess(true)
      setPasswords({ current: "", new: "", confirm: "" })
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError("Current password is incorrect.")
      } else {
        setError("Could not update password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleDiagnosticSharing = async () => {
    const nextValue = !diagnosticSharing
    setDiagnosticSharingOverride(nextValue)
    setPrivacyLoading(true)

    try {
      await apiClient.put(`/users/${user?.id}`, {
        profile: { diagnosticSharing: nextValue }
      })
    } catch (err: any) {
      console.warn("Privacy setting sync failed.", err)
    } finally {
      setPrivacyLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-6 lg:p-20 relative overflow-x-hidden text-left">
      
      {/* 🏛️ CINEMATIC ACCENT */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_20%_0%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <header className="space-y-8">
          <button 
            onClick={() => router.push('/settings')}
            className="flex items-center gap-3 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ChevronLeft size={16} /> Back to Settings
          </button>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-black dark:text-white">
              Login & <br /> <span className="text-[#4DB6AC]">Security</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Protect your skin health records</p>
          </div>
        </header>

        {/* PASSWORD FORM */}
        <section className="space-y-10">
          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-[#4DB6AC]/10 text-[#4DB6AC] flex items-center justify-center">
                  <Key size={20} />
               </div>
               <h3 className="text-[11px] font-black uppercase tracking-widest">Update Password</h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[9px] font-black uppercase tracking-widest">
                   <AlertCircle size={14} /> {error}
                </div>
              )}

              <div className="space-y-4">
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-6 px-8 text-[11px] font-bold outline-none focus:border-[#4DB6AC] transition-all"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>

                 <input 
                    type="password"
                    placeholder="New Password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-6 px-8 text-[11px] font-bold outline-none focus:border-[#4DB6AC] transition-all"
                    required
                 />

                 <input 
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-6 px-8 text-[11px] font-bold outline-none focus:border-[#4DB6AC] transition-all"
                    required
                 />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-16 rounded-2xl font-black uppercase text-[9px] tracking-[0.4em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  isSuccess ? 'bg-[#4DB6AC] text-white' : 'bg-black dark:bg-white text-white dark:text-black'
                }`}
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : isSuccess ? <><CheckCircle2 size={18} /> Securely Saved</> : "Update Password"}
              </button>
            </form>
          </div>

          {/* PRIVACY CONTROL */}
          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E1784F]/10 text-[#E1784F] flex items-center justify-center">
                   <ShieldCheck size={20} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest">Privacy Controls</h3>
             </div>
             
             <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-tight">Diagnostic Sharing</p>
                   <p className="text-[8px] font-bold uppercase opacity-30 tracking-tighter">Anonymously help our AI improve for African skin</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDiagnosticSharing}
                  disabled={privacyLoading}
                  aria-pressed={diagnosticSharing}
                  aria-label="Toggle diagnostic sharing"
                  className={`w-12 h-6 rounded-full relative transition-all disabled:opacity-60 disabled:cursor-wait ${
                    diagnosticSharing ? "bg-[#4DB6AC]" : "bg-gray-200 dark:bg-white/10"
                  }`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    diagnosticSharing ? "right-1" : "left-1"
                   }`} />
                </button>
             </div>
          </div>
        </section>

        <footer className="pt-10 flex flex-col items-center gap-4 opacity-20">
           <div className="flex items-center gap-3">
              <Fingerprint size={16} className="text-[#4DB6AC]" />
              <span className="text-[7px] font-black uppercase tracking-[0.5em]">Identity Protection Enabled</span>
           </div>
        </footer>
      </div>
    </main>
  )
}
