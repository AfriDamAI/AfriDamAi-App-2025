"use client"

import React, { useState } from "react"
import { Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { forgotPassword } from "@/lib/api-client"

interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ForgotPasswordForm({ onSuccess, onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      await forgotPassword(email.trim())
      setSuccess(true)
      setEmail("")

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to process request. Please try again."
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
            Check your email for password reset instructions
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 rounded-[2rem] px-10 py-7 text-lg font-bold focus:outline-none focus:border-[#E1784F]"
          placeholder="EMAIL ADDRESS"
          required
          disabled={success}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || success}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#E1784F] text-white font-black uppercase py-4 rounded-[2rem] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : success ? (
          "SENT"
        ) : (
          "SEND RESET LINK"
        )}
      </motion.button>

      {onCancel && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-bold text-black/50 dark:text-white/50 hover:text-[#E1784F] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}
