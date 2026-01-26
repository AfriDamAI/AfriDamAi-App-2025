"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, X, Fingerprint, Sparkles } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { login as loginService } from "@/lib/api-client"

export default function LoginPage() {
  const auth = useAuth() as any; 
  const syncAuthState = auth.login || auth.signIn; 
  
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = () => router.push("/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const credentials = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      await auth.signIn(credentials);
      router.replace("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Verification failed. Check your credentials.";
      setError(typeof message === "string" ? message : "Invalid identity response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden text-left">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#E1784F]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#4DB6AC]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-12 relative z-10">
        <div className="text-center space-y-8">
          <motion.div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-[2.2rem] flex items-center justify-center shadow-2xl mx-auto mb-6">
            <span className="font-black text-3xl italic uppercase">A</span>
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-black tracking-tight uppercase italic leading-[0.8] text-center">
              Welcome <br /> <span className="text-[#E1784F]">Back.</span>
            </h1>
          </div>
        </div>

        <div className="relative">
          <button onClick={handleCancel} className="absolute -top-12 -right-2 p-4 text-black/20 dark:text-white/20 hover:text-[#E1784F] z-[100]">
            <X className="w-8 h-8" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 rounded-[2rem] px-10 py-7 text-lg font-bold focus:outline-none focus:border-[#4DB6AC]"
                placeholder="EMAIL ADDRESS"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 rounded-[2rem] px-10 py-7 text-lg font-bold focus:outline-none focus:border-[#E1784F]"
                placeholder="PASSWORD"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase py-8 rounded-[2.5rem] flex items-center justify-center gap-6"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>ENTER HUB <ArrowRight className="w-5 h-5" /></>}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
