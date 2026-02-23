"use client"

import React, { useState } from "react"
import { Shield, ArrowRight, Loader2, X, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function AccessRecoveryCodePage() {
  const router = useRouter()
  const [recoveryCode, setRecoveryCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = () => router.push("/login")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!recoveryCode.trim()) {
      setError("Please enter your Access Recovery code.")
      return
    }

    if (recoveryCode.trim().length < 6) {
      setError("Recovery code must be at least 6 characters long.")
      return
    }

    setIsLoading(true)

    try {
      // Simulate recovery code validation - in production, add backend validation
      setSuccess(true)

      // Redirect to new password page with recovery token
      setTimeout(() => {
        router.push(`/recover-access/new-password?token=${recoveryCode.trim()}`)
      }, 1500)
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Invalid recovery code. Please check and try again."
      setError(typeof message === "string" ? message : "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden text-left">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#E1784F]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#4DB6AC]/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-12 relative z-10">
        <div className="text-center space-y-8">
          <motion.div className="w-20 h-20 bg-[#E1784F] text-white rounded-[2.2rem] flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Shield className="w-10 h-10" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase italic leading-[0.8] text-center">
              Access <br /> <span className="text-[#E1784F]">Recovery.</span>
            </h1>
            <p className="text-base md:text-lg opacity-50 font-bold max-w-lg mx-auto">
              Enter your Access Recovery code to regain account access.
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handleCancel}
            className="absolute -top-12 -right-2 p-4 text-black/20 dark:text-white/20 hover:text-[#E1784F] z-[100]"
          >
            <X className="w-8 h-8" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-4 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-4 px-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 dark:text-green-400 text-[10px] font-black uppercase flex items-center gap-3"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Recovery code verified! Redirecting...
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <input
                type="text"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                maxLength={50}
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 rounded-[2rem] px-10 py-7 text-lg font-bold focus:outline-none focus:border-[#E1784F] text-center tracking-widest"
                placeholder="PASTE YOUR RECOVERY CODE HERE"
                required
                disabled={success}
              />
              <p className="text-xs font-bold opacity-40 px-4 text-center">
                You should have saved this code when setting up account recovery
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || success}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#E1784F] text-white font-black uppercase py-8 rounded-[2.5rem] flex items-center justify-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : success ? (
                "CODE VERIFIED"
              ) : (
                <>
                  VERIFY RECOVERY CODE <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-bold text-black/50 dark:text-white/50 hover:text-[#E1784F] transition-colors"
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
