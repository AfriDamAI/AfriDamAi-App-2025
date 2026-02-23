"use client"

import React, { useState } from "react"
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { resetPassword } from "@/lib/api-client"

interface RecoveryPasswordFormProps {
  token: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function RecoveryPasswordForm({ token, onSuccess, onCancel }: RecoveryPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
        throw new Error("Invalid recovery token")
      }

      await resetPassword(token, password)
      setSuccess(true)

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. Your recovery code may be invalid or expired."
      setError(typeof message === "string" ? message : "An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
        className="w-full bg-[#4DB6AC] text-black font-black uppercase py-4 rounded-[2rem] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : success ? (
          "PASSWORD UPDATED"
        ) : (
          "RESET PASSWORD"
        )}
      </motion.button>

      {onCancel && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-bold text-black/50 dark:text-white/50 hover:text-[#4DB6AC] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}
