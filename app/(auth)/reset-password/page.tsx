"use client"

import React, { useState, useEffect } from "react"
import { Lock, ArrowRight, Loader2, X, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { resetPassword } from "@/lib/api-client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.")
    }
  }, [token])

  const handleCancel = () => router.push("/login")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      if (!token) {
        throw new Error("Invalid reset token")
      }

      await resetPassword(token, password)
      setSuccess(true)

      // Redirect to login after success
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. Please try again or request a new link."
      setError(typeof message === "string" ? message : "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden text-left">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#4DB6AC]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#E1784F]/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-12 relative z-10">
        <div className="text-center space-y-8">
          <motion.div className="w-20 h-20 bg-[#4DB6AC] text-white rounded-[2.2rem] flex items-center justify-center shadow-2xl mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight uppercase italic leading-[0.8] text-center">
              New <br /> <span className="text-[#4DB6AC]">Password.</span>
            </h1>
            <p className="text-base md:text-lg opacity-50 font-bold max-w-lg mx-auto">
              Create a strong password to secure your account.
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handleCancel}
            className="absolute -top-12 -right-2 p-4 text-black/20 dark:text-white/20 hover:text-[#4DB6AC] z-[100]"
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
                  Password reset successfully! Redirecting...
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 rounded-[2rem] px-10 py-7 text-lg font-bold focus:outline-none focus:border-[#4DB6AC] pr-16"
                  placeholder="NEW PASSWORD"
                  required
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-[#4DB6AC] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 rounded-[2rem] px-10 py-7 text-lg font-bold focus:outline-none focus:border-[#4DB6AC] pr-16"
                  placeholder="CONFIRM PASSWORD"
                  required
                  disabled={success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-[#4DB6AC] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-xs font-bold opacity-40 px-4">
                Password must be at least 8 characters long.
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || success}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#4DB6AC] text-black font-black uppercase py-8 rounded-[2.5rem] flex items-center justify-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : success ? (
                "PASSWORD UPDATED"
              ) : (
                <>
                  RESET PASSWORD <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-bold text-black/50 dark:text-white/50 hover:text-[#4DB6AC] transition-colors"
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
