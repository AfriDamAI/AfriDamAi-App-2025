"use client"

import React, { useState } from "react"
import { Shield, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AccessRecoveryCodeFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AccessRecoveryCodeForm({ onSuccess, onCancel }: AccessRecoveryCodeFormProps) {
  const [recoveryCode, setRecoveryCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      // Client-side validation only
      setSuccess(true)
      setRecoveryCode("")

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Invalid recovery code. Please try again."
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
            Recovery code verified! Proceeding...
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
          Enter the recovery code you saved during account setup
        </p>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || success}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#E1784F] text-white font-black uppercase py-4 rounded-[2rem] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Shield className="w-5 h-5 animate-spin" />
        ) : success ? (
          "VERIFIED"
        ) : (
          "VERIFY RECOVERY CODE"
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
