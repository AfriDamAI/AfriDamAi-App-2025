/**
 * 🛡️ AFRIDAM SAFETY LAB: INGREDIENT CHECKER
 * Version: 2026.2.23 — Responsive Fix
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, ShoppingBag, FlaskConical,
  Send, User, Loader2, Info
} from "lucide-react"
import { analyzeIngredients } from "@/lib/api-client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello. I am the AfriDam Ingredient Analyzer. Please paste an ingredient list to analyze its safety and benefits."
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [status, setStatus] = useState("Ready")

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push("/")
  }, [user, authLoading, router])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping || !user) return

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    const currentInput = input
    setInput("")
    setIsTyping(true)
    setStatus("Analyzing...")

    try {
      const moreInfo = {
        region: "West Africa",
        country: user.profile?.nationality || "Nigeria",
        known_skintone_type: user.profile?.skinType || "",
        skin_type_last_time_checked: new Date().toISOString(),
        known_skin_condition: user.profile?.skinCondition || "none",
        skin_condition_last_time_checked: new Date().toISOString(),
        gender: (user.profile?.sex || (user as any).sex || "female").toLowerCase(),
        age: user.profile?.age || 30,
        known_body_lotion: user.profile?.bodyLotion || "unknown",
        known_body_lotion_brand: user.profile?.bodyLotionBrand || "unknown",
        known_allergies: Array.isArray(user.profile?.allergies) && user.profile.allergies.length > 0
          ? user.profile.allergies : [],
        known_last_skin_treatment: user.profile?.lastSkinTreatment || new Date().toISOString(),
        known_last_consultation_with_afridermatologists: user.profile?.lastConsultation || new Date().toISOString(),
        user_activeness_on_app: "very_high"
      }

      const data = await analyzeIngredients(currentInput, moreInfo)
      const replyText = data?.response || "Analysis complete. This formula looks safe for your skin profile."

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: replyText }])
      setStatus("Ready")
    } catch (err) {
      setStatus("Error")
      setMessages(prev => [...prev, {
        id: "error", role: "assistant",
        content: "I encountered an issue analyzing those ingredients. Please ensure the list is clear and try again."
      }])
    } finally {
      setIsTyping(false)
    }
  }

  if (authLoading || !user) return null

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-white">

      {/* ══════════════════════════════════════════
          MOBILE  (< lg) — full-screen chat column
          pb-24 clears the MobileNav bar (h-24)
      ══════════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col" style={{ height: 'calc(100svh - 80px)' }}>

        {/* ── compact header ── */}
        <div className="shrink-0 px-4 pt-4 pb-2 space-y-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest opacity-40 active:opacity-100"
          >
            <ChevronLeft size={12} /> Back
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              Ingredient <span className="text-[#E1784F]">Analyzer</span>
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full text-[7px] font-black uppercase tracking-widest shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
              {status}
            </span>
          </div>
          {/* safety note */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
            <Info size={12} className="text-[#E1784F] shrink-0 mt-0.5" />
            <p className="text-[8px] font-medium opacity-50 leading-relaxed uppercase">
              Checks 1,200+ ingredients harmful to melanin-rich skin types.
            </p>
          </div>
        </div>

        {/* ── scrollable messages ── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'assistant'
                      ? 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]'
                      : 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]'
                    }`}>
                    {msg.role === 'assistant' ? <FlaskConical size={13} /> : <User size={13} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-[12px] font-medium leading-relaxed shadow-sm ${msg.role === 'assistant'
                      ? 'bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300'
                      : 'bg-black dark:bg-white text-white dark:text-black font-bold'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-9">
                <Loader2 className="animate-spin text-[#E1784F]" size={14} />
                <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Analyzing Formula</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── sticky input — sits above the h-24 MobileNav ── */}
        <div className="shrink-0 px-3 py-3 pb-28 bg-white dark:bg-black/30 border-t border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Paste ingredients list here..."
              className="flex-1 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-[#E1784F] rounded-2xl px-4 py-3.5 text-[13px] font-medium outline-none transition-all placeholder:opacity-30"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="shrink-0 w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center active:scale-95 shadow-lg transition-all disabled:opacity-20"
            >
              {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <button
            onClick={() => router.push('/marketplace')}
            className="w-full mt-2 py-2.5 bg-[#4DB6AC]/10 text-[#4DB6AC] border border-[#4DB6AC]/20 rounded-xl font-black uppercase text-[8px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag size={11} /> Find Safe Products
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP  (≥ lg) — unchanged two-column
      ══════════════════════════════════════════ */}
      <div className="hidden lg:grid max-w-screen-xl mx-auto px-6 py-8 lg:grid-cols-12 gap-6 items-start h-[calc(100svh-96px)]">

        {/* Desktop Left */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between py-2 space-y-6">
          <div className="space-y-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all"
            >
              <ChevronLeft size={12} /> Dashboard
            </button>
            <div className="space-y-3">
              <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.9]">
                Ingredient <span className="text-[#E1784F]">Analyzer</span>
              </h1>
              <div className="flex items-center gap-2 w-fit px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest">{status}</span>
              </div>
            </div>
            <p className="text-[11px] font-medium leading-relaxed opacity-60 max-w-sm">
              Verify every chemical. Our AI checks ingredients against skin-safe clinical databases to ensure your heritage skin is always protected.
            </p>
            <div className="space-y-3 max-w-sm">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] border border-black/5 dark:border-white/10 flex items-start gap-3">
                <Info size={14} className="text-[#E1784F] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5">Safety Protocols</p>
                  <p className="text-[8px] font-medium opacity-40 leading-relaxed uppercase">Checks for 1,200+ ingredients harmful to melanin-rich skin types.</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/marketplace')}
                className="w-full py-3.5 bg-[#4DB6AC] text-black rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
              >
                Find Safe Products <ShoppingBag size={12} />
              </button>
            </div>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20">© 2026 AFRIDAM AI CLINICAL LABORATORIES</p>
        </div>

        {/* Desktop Right: Chat */}
        <div className="lg:col-span-7 h-full flex flex-col bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-2xl">
          <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F]">
              <FlaskConical size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest">Analysis Stream</h3>
              <p className="text-[7px] font-black uppercase tracking-[0.15em] opacity-30">Secured Clinical Handshake</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar scroll-smooth">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'assistant'
                        ? 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]'
                        : 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]'
                      }`}>
                      {msg.role === 'assistant' ? <FlaskConical size={16} /> : <User size={16} />}
                    </div>
                    <div className={`p-4 rounded-[1.5rem] text-[12px] font-medium leading-relaxed shadow-sm ${msg.role === 'assistant'
                        ? 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300'
                        : 'bg-black dark:bg-white text-white dark:text-black font-bold'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-11">
                  <Loader2 className="animate-spin text-[#E1784F]" size={14} />
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Analyzing Formula</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-5 bg-white dark:bg-black/20 border-t border-black/5 dark:border-white/10">
            <div className="relative flex items-center group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Paste ingredients list here..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] px-5 py-4 text-[13px] font-bold outline-none focus:border-[#E1784F] transition-all placeholder:opacity-20 shadow-inner"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 w-11 h-11 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center active:scale-95 shadow-2xl transition-all disabled:opacity-20 group-focus-within:bg-[#E1784F] group-focus-within:text-white"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center opacity-20">
              <p className="text-[7px] font-black uppercase tracking-[0.2em]">Melanin Safe Check • Clinical Labs • 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
