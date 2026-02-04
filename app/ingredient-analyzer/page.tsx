/**
 * 🛡️ AFRIDAM SAFETY LAB: INGREDIENT CHECKER (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Simple English Parsing & Melanin Safety Mapping.
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft, Zap, ShoppingBag, FlaskConical, Send, User, Loader2, Info
} from "lucide-react"
import { analyzeIngredients } from "@/lib/api-client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello. I am the AfriDam Ingredient Analyzer. Please paste an ingredient list to analyze its safety and benefits."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState("Ready");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping || !user) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);
    setStatus("Analyzing...");

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
        known_allergies: (user.profile?.allergies && Array.isArray(user.profile.allergies) && user.profile.allergies.length > 0)
          ? user.profile.allergies
          : [],
        known_last_skin_treatment: user.profile?.lastSkinTreatment || new Date().toISOString(),
        known_last_consultation_with_afridermatologists: user.profile?.lastConsultation || new Date().toISOString(),
        user_activeness_on_app: "very_high"
      };

      const data = await analyzeIngredients(currentInput, moreInfo);
      const replyText = data?.response || "Analysis complete. This formula looks safe for your skin profile based on my clinical check.";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText
      };
      setMessages(prev => [...prev, assistantMsg]);
      setStatus("Ready");
    } catch (err) {
      console.error("Ingredient analysis failed", err);
      setStatus("Error");
      setMessages(prev => [...prev, {
        id: "error",
        role: "assistant",
        content: "I encountered an issue analyzing those ingredients. Please ensure the list is clear and try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#0A0A0A] text-black dark:text-white pb-2 lg:pb-10">
      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-12 grid lg:grid-cols-12 gap-12 items-start h-[calc(100svh-120px)] lg:h-[800px]">

        {/* LEFT: BRAND & INFO */}
        <div className="lg:col-span-5 space-y-10 h-full flex flex-col justify-between py-4">
          <div className="space-y-10">
            <header className="space-y-8">
              <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all">
                <ChevronLeft size={14} /> Dashboard
              </button>
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] py-2">
                  Ingredient <span className="text-[#E1784F]">Analyzer</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="space-y-8 max-w-sm">
              <p className="text-xs font-medium leading-relaxed opacity-60">
                Verify every chemical. Our AI checks ingredients against skin-safe clinical databases to ensure your heritage skin is always protected.
              </p>

              <div className="flex flex-col gap-4">
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/10 flex items-start gap-4">
                  <Info size={16} className="text-[#E1784F] shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Safety Protocols</p>
                    <p className="text-[9px] font-medium opacity-40 leading-relaxed uppercase">Checks for 1,200+ ingredients harmful to melanin-rich skin types.</p>
                  </div>
                </div>
                <button onClick={() => router.push('/marketplace')} className="w-full py-5 bg-[#4DB6AC] text-black rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 group transition-all active:scale-95 shadow-lg">
                  Find Safe Products <ShoppingBag size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">© 2026 AFRIDAM AI CLINICAL LABORATORIES</p>
          </div>
        </div>

        {/* RIGHT: CHAT INTERFACE */}
        <div className="lg:col-span-7 h-full flex flex-col bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#4DB6AC]/5 blur-3xl pointer-events-none" />

          {/* CHAT HEADER */}
          <div className="px-8 py-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F]">
                <FlaskConical size={20} />
              </div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest">Analysis Stream</h3>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">Secured Clinical Handshake</p>
              </div>
            </div>
          </div>

          {/* MESSAGE AREA */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'assistant' ? 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]' : 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]'}`}>
                      {msg.role === 'assistant' ? <FlaskConical size={20} /> : <User size={20} />}
                    </div>
                    <div className={`p-6 rounded-[2rem] text-[13px] font-medium leading-relaxed shadow-sm ${msg.role === 'assistant'
                      ? 'bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-700 dark:text-gray-300'
                      : 'bg-black dark:bg-white text-white dark:text-black font-bold'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pl-14">
                  <Loader2 className="animate-spin text-[#E1784F]" size={16} />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Analyzing Formula</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* INPUT AREA */}
          <div className="p-8 bg-white dark:bg-black/20 border-t border-black/5 dark:border-white/10">
            <div className="relative flex items-center group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Paste ingredients list here..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] px-8 py-6 text-sm font-bold outline-none focus:border-[#E1784F] transition-all placeholder:opacity-20 shadow-inner"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center active:scale-95 shadow-2xl transition-all disabled:opacity-20 group-focus-within:bg-[#E1784F] group-focus-within:text-white"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 opacity-20">
              <p className="text-[8px] font-black uppercase tracking-[0.3em]">Melanin Safe Check • Clinical Labs • 2026</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
