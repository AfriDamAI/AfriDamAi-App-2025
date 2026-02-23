import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, User, Bot, Zap, Info, Loader2 } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { useAuth } from "@/providers/auth-provider" // 🚀 SYNC: Import useAuth to get user context
// 🚀 SYNC: Using the verified chatbot endpoint from api-client
import { sendAnalyzerChatMessage } from "@/lib/api-client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AIChatBot() {
  const { theme } = useTheme();
  const { user } = useAuth(); // 🚀 SYNC: Get user from auth context
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello. I am the AfriDam Wellness Assistant. How can I support your skin health today?"
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  // 🛡️ VIEWPORT SYNC: Auto-scroll to latest insight for mobile users
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping || !user) return; // 🛡️ SYNC: Ensure user is available

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);
    
    try {
      /**
       * 🚀 THE NEURAL HANDSHAKE (Rule 7)
       * Constructing more_info with user data, mirroring the ai-scanner implementation.
       */
      const moreInfo = {
        region: "West Africa",
        country: user.profile?.nationality || "Nigeria",
        known_skintone_type: user.profile?.skinType || "",
        skin_type_last_time_checked: new Date().toISOString(),
        known_skin_condition: user.profile?.skinCondition || "none",
        skin_condition_last_time_checked: new Date().toISOString(),
        gender: (user.profile?.sex || user.sex || "female").toLowerCase(),
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
      
      const data = await sendAnalyzerChatMessage(currentInput, moreInfo);
      
      /**
       * 🛡️ DATA EXTRACTION (Rule 7)
       * Aligned with backend proxy response and apiClient interceptor.
       * The interceptor unwraps 'resultData', so we access 'response' directly.
       */
      const replyText = data?.response || "Neural link active. I am processing your profile data.";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      // 🛡️ Rule 4: Relatable, jargon-free error handling
      console.error("Assistant sync failed", err);
      setMessages(prev => [...prev, {
        id: "error",
        role: "assistant",
        content: "I'm having trouble reaching the clinical database. Please check your signal and try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 🚀 TOGGLE HUB (Mobile Optimized Position) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 right-6 md:bottom-10 md:right-10 z-[999] w-16 h-16 bg-[#4DB6AC] text-white rounded-[1.5rem] shadow-[0_20px_40px_rgba(77,182,172,0.4)] flex items-center justify-center active:scale-90 transition-all group border-2 border-white/10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* 🏛️ CHAT CONSOLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className={`fixed bottom-24 right-4 left-4 md:left-auto md:right-10 z-[998] md:w-[420px] h-[70vh] md:h-[600px] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border flex flex-col overflow-hidden backdrop-blur-3xl transition-all ${
              isDark ? 'bg-[#0A0A0A]/95 border-white/10' : 'bg-white/95 border-black/5'
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/10 blur-3xl rounded-full pointer-events-none" />

            {/* HEADER */}
            <div className="p-8 bg-black text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#4DB6AC] flex items-center justify-center shadow-xl text-black">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div className="text-left space-y-0.5">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Assistant</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#4DB6AC] rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Neural Link Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-20 hover:opacity-100 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* STREAM */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar relative z-10 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      msg.role === 'assistant' ? 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]' : 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]'
                    }`}>
                      {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className={`p-5 rounded-[1.8rem] text-[13px] font-medium leading-relaxed shadow-sm ${
                      msg.role === 'assistant' 
                        ? (isDark ? 'bg-white/5 text-gray-300' : 'bg-black/5 text-gray-700')
                        : 'bg-black dark:bg-white text-white dark:text-black font-bold'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 pl-14">
                   <Loader2 className="animate-spin text-[#4DB6AC]" size={16} />
                   <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Generating Profile Insight</p>
                </div>
              )}
            </div>

            {/* COMPLIANCE FOOTER */}
            <div className="px-8 py-3 bg-gray-50 dark:bg-white/5 flex items-center gap-3 border-y border-gray-100 dark:border-white/10">
               <Info size={12} className="opacity-20 text-[#E1784F]" />
               <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Wellness Guidance Only • Secured Sync</p>
            </div>

            {/* INPUT NODE */}
            <div className="p-6 md:p-8">
              <div className="relative flex items-center group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Inquire about clinical safety..." 
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] px-8 py-6 text-sm font-bold outline-none focus:border-[#4DB6AC] transition-all placeholder:opacity-20 shadow-inner"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-3 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center active:scale-95 shadow-2xl transition-all disabled:opacity-20 group-focus-within:bg-[#E1784F] group-focus-within:text-white"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}