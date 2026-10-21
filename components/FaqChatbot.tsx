"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  ShieldCheck,
  Scan,
  Store,
  CreditCard,
  ShoppingBag,
  Headphones,
  ArrowRight
} from "lucide-react"

// --- COMPREHENSIVE AFRIDAM AI KNOWLEDGE DATABASE ---
interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  keywords: string[]
}

const FAQ_DATABASE: FAQItem[] = [
  // --- GENERAL PLATFORM IDENTITY ---
  {
    id: "g1",
    category: "General",
    question: "What is AfriDam AI and how does it work?",
    answer: "AfriDam AI is a health-tech platform and B2B skin intelligence model specialized in melanin-rich skin (Fitzpatrick Phototypes IV–VI). Our clinician-verified AI analyzes skin concerns instantly from a photo and provides personalized, doctor-approved routine recommendations and tele-dermatology access.",
    keywords: ["name", "platform", "what is this platform", "afridam", "afridam ai", "about", "overview"]
  },

  // --- ROUTINE RECOMMENDATIONS ---
  {
    id: "m3",
    category: "Shop My Routine",
    question: "How does ‘Shop My Routine’ select products?",
    answer: "After your skin scan, our model matches your findings (acne, hyperpigmentation, eczema) with skin-conscious products connected directly to live retail inventory, including Jumia. You can see real-time pricing and stock availability before purchasing.",
    keywords: ["recommendations", "match", "buy after scan", "product match", "routine products", "jumia", "shop my routine", "inventory"]
  },
  {
    id: "m4",
    category: "Shop My Routine",
    question: "Are all recommended products safe for melanin-rich skin?",
    answer: "Yes. Recommended products are filtered to favor non-comedogenic formulations, avoid known post-inflammatory hyperpigmentation (PIH) triggers, and suit darker skin phototypes.",
    keywords: ["safe", "safe products", "bleaching free", "quality", "verified products", "PIH", "melanin-rich"]
  },

  // --- B2B & BRAND INTEGRATIONS ---
  {
    id: "v3",
    category: "B2B & Brand Integrations",
    question: "How can skincare brands and pharmacies integrate the model?",
    answer: "We offer a plug-and-play B2B API and software suite. Brands can embed our instant skin-scanning widget into e-commerce checkouts or mobile apps to build customer trust and drive conversion, with catalog linking to Jumia and other retail inventory for live product recommendations.",
    keywords: ["widget", "integrate", "shopify", "api", "b2b", "embed", "brand shop", "catalog linking", "software"]
  },
  {
    id: "v4",
    category: "B2B & Brand Integrations",
    question: "How can enterprise brands get started?",
    answer: "Click ‘Book a Demo’ on our homepage or contact hello@afridamai.com to review integration specifications and API licensing terms.",
    keywords: ["enterprise", "brand", "get started", "book a demo", "API licensing", "integration specs"]
  },

  // --- SUPPORT & CONTACT ---
  {
    id: "sp1",
    category: "Support",
    question: "How can I contact AfriDam AI customer support?",
    answer: "For any inquiries, order support, account assistance, or vendor support, you can reach our team directly at hello@afridamai.com. We operate 24/7 to assist you.",
    keywords: ["support", "contact", "email", "help", "customer service", "reach out", "human support"]
  },
  {
    id: "sp2",
    category: "Support",
    question: "What is the official contact email for AfriDam AI?",
    answer: "The official and only contact email for AfriDam AI is hello@afridamai.com. Feel free to message us anytime!",
    keywords: ["official mail", "mail", "contact email", "hello@afridamai.com", "address"]
  },

  // --- SCANNER TOPICS ---
  {
    id: "s1",
    category: "AI Scanner & Accuracy",
    question: "How does the AI skin scanner work?",
    answer: "Take or upload a photo of your skin concern. Our model, trained on 57,000+ clinician-annotated dark-skin images, analyzes visual patterns, maps areas such as texture, dark spots, and redness, and delivers an instant visual analysis report with care guidance and ingredient safety insights.",
    keywords: ["how scanner work", "scanner", "technology", "scan face", "dark skin scan", "ingredient safety", "ingredient analyzer", "product ingredients"]
  },
  {
    id: "s2",
    category: "AI Scanner & Accuracy",
    question: "How do I start my first skin scan?",
    answer: "Click ‘Start Skin Scan’ on our landing page. You can get preliminary visual results without downloading an app or registering first.",
    keywords: ["start scan", "how to scan", "use app", "take photo"]
  },

  // --- CONSULTATIONS & SECURITY ---
  {
    id: "d1",
    category: "Consultations & Security",
    question: "Can I consult with certified dermatologists on AfriDam AI?",
    answer: "Yes. After your scan, select ‘Consult a Dermatologist’ to book a one-on-one virtual tele-dermatology session with licensed specialists across Nigeria and international networks.",
    keywords: ["doctor", "dermatologist", "consultation", "telehealth", "book appointment"]
  },

  // --- PRICING & PLANS ---
  {
    id: "p1",
    category: "Pricing",
    question: "Is AfriDam AI free to use?",
    answer: "We offer a Free tier that includes basic AI skin scans and ingredient safety checks. Our Pro tier unlocks unlimited detailed skin analyses, routine tracking, and discounted specialist consultation fees.",
    keywords: ["free", "cost", "price", "pricing", "subscription", "plans"]
  },

  // --- PRIVACY & SECURITY ---
  {
    id: "pr1",
    category: "Consultations & Security",
    question: "Is my facial photo and personal health data secure?",
    answer: "Yes. Image data is encrypted in transit using TLS 1.3 and at rest using AES-256, in line with NDPA and GDPR privacy standards. We never sell raw personal health data.",
    keywords: ["privacy", "data", "secure", "photo safe", "encryption"]
  }
]

interface Message {
  id: string
  sender: "bot" | "user"
  text: string
  time: string
  showBusinessCTA?: boolean
  showSupportCTA?: boolean
}

function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

export default function FaqChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! 👋 I am Godspower, the AfriDam AI Virtual Assistant. Ask me about skin scans, personalized routines, dermatologist consultations, or B2B integrations.",
      // This message renders on both server and client, which can use different time zones.
      time: "Now"
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [inputQuery, setInputQuery] = useState("")

  // Refs for scrolling container strictly inside the chat component
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Internal scroll function that DOES NOT jump the outer webpage
  const scrollToBottomInternal = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottomInternal()
  }, [messages, isTyping])

  const triggerBotResponse = (questionText: string, answerText: string, isBusinessRelated: boolean = false, isSupportRelated: boolean = false) => {
    if (isTyping) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: questionText,
      time: formatTime(new Date())
    }

    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: answerText,
        time: formatTime(new Date()),
        showBusinessCTA: isBusinessRelated,
        showSupportCTA: isSupportRelated
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 750)
  }

  const handleSubmitInput = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputQuery.trim() || isTyping) return

    const rawInput = inputQuery.trim()
    const cleanQuery = rawInput.toLowerCase()
    setInputQuery("")

    const isBusinessRelated = ["brand", "business", "enterprise", "integrate", "integration", "api", "software", "b2b", "demo"].some(kw => cleanQuery.includes(kw))
    const isSupportRelated = ["contact", "email", "support", "help", "reach", "mail", "hello@afridamai.com"].some(kw => cleanQuery.includes(kw))

    // Find best match using full-text and keyword match
    const foundMatch = FAQ_DATABASE.find(item => 
      item.question.toLowerCase().includes(cleanQuery) ||
      item.keywords.some(kw => cleanQuery.includes(kw))
    )

    const responseAnswer = foundMatch
      ? foundMatch.answer
      : "I don't have an exact answer for that specific question yet. Explore the Knowledge Bank or contact our support team at hello@afridamai.com."

    triggerBotResponse(
      rawInput, 
      responseAnswer, 
      isBusinessRelated || foundMatch?.category === "B2B & Brand Integrations",
      isSupportRelated || foundMatch?.category === "Support"
    )
  }

  const filteredQuestions = activeCategory === "All" 
    ? FAQ_DATABASE 
    : FAQ_DATABASE.filter(q => q.category === activeCategory)

  const categories = [
    { label: "All", icon: Sparkles },
    { label: "General", icon: Sparkles },
    { label: "Shop My Routine", icon: ShoppingBag },
    { label: "B2B & Brand Integrations", icon: Store },
    { label: "AI Scanner & Accuracy", icon: Scan },
    { label: "Consultations & Security", icon: ShieldCheck },
    { label: "Support", icon: Headphones },
    { label: "Pricing", icon: CreditCard }
  ]

  return (
    <section 
      id="faq" 
      className="w-full py-10 sm:py-16 md:py-20 bg-gradient-to-br from-orange-50 via-white to-teal-50 dark:from-[#0D0914] dark:via-[#170E20] dark:to-[#0A1624] text-slate-900 dark:text-white flex flex-col justify-center items-center px-3 sm:px-6 md:px-8 relative overflow-hidden selection:bg-[#E1784F]/30"
    >
      {/* BRAND COLOR GLOW ACCENTS IN BACKGROUND */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E1784F]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#4DB6AC]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E1784F]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="max-w-3xl text-center space-y-3 mb-8 md:mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/[0.06] border border-black/10 dark:border-white/15 text-[#E1784F] text-xs sm:text-sm font-bold uppercase tracking-widest backdrop-blur-md shadow-inner">
          <Sparkles size={15} className="text-[#4DB6AC]" />
          <span>Interactive Knowledge Assistant</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-tight text-center">
          GOT QUESTIONS? <span className="bg-gradient-to-r from-[#E1784F] via-[#F2936E] to-[#4DB6AC] bg-clip-text text-transparent whitespace-nowrap">ASK AFRIDAM AI</span>
        </h2>

        <p className="text-slate-600 dark:text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-2 font-normal">
          Explore personalized routines, our AI skin scanner, B2B integrations, or contact support at <strong className="text-slate-900 dark:text-white font-semibold underline decoration-[#4DB6AC]">hello@afridamai.com</strong>.
        </p>
      </div>

      {/* CHATBOX CONTAINER - Enhanced Dimensions & Vibrancy */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-black/[0.03] to-black/[0.01] dark:from-white/[0.08] dark:to-white/[0.02] border border-black/10 dark:border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col md:flex-row h-[780px] md:h-[620px] relative z-10">
        
        {/* LEFT SIDEBAR: TOPICS & KNOWLEDGE BANK */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-[#E1784F]/10 via-white/50 dark:via-black/50 to-[#4DB6AC]/10 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/15 p-3.5 sm:p-5 flex flex-col justify-between h-[280px] md:h-full shrink-0">
          <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 dark:text-white/70">
                Knowledge Bank
              </span>
              <button 
                onClick={() => setMessages([{
                  id: "welcome-reset",
                  sender: "bot",
                  text: "Chat cleared! How else can I assist you with AfriDam AI?",
                  time: formatTime(new Date())
                }])}
                className="text-xs sm:text-sm text-slate-400 dark:text-white/50 hover:text-[#E1784F] transition-colors flex items-center gap-1 font-semibold"
                title="Clear Chat"
              >
                <RefreshCw size={13} /> Clear
              </button>
            </div>

            {/* Category Badges (Horizontal Scroll with Hidden Scrollbars) */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeCategory === cat.label
                        ? "bg-gradient-to-r from-[#E1784F] to-[#d8683e] text-white shadow-lg shadow-[#E1784F]/30"
                        : "bg-black/5 dark:bg-white/[0.07] text-slate-600 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/15 hover:text-slate-900 dark:hover:text-white border border-black/5 dark:border-white/5"
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Questions List - Enlarged font & spacious padding */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
              {filteredQuestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => triggerBotResponse(
                    item.question, 
                    item.answer, 
                    item.category === "B2B & Brand Integrations",
                    item.category === "Support"
                  )}
                  disabled={isTyping}
                  className="w-full text-left p-3 sm:p-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.09] border border-black/10 dark:border-white/10 hover:border-[#4DB6AC]/50 hover:shadow-[0_0_15px_rgba(77,182,172,0.15)] transition-all duration-200 group flex items-start justify-between gap-2.5 text-xs sm:text-sm md:text-base font-medium text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white disabled:opacity-50"
                >
                  <span className="line-clamp-2 leading-snug">{item.question}</span>
                  <ChevronRight size={16} className="text-slate-400 dark:text-white/40 group-hover:text-[#4DB6AC] shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer Stats */}
          <div className="pt-2.5 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-white/50 font-medium shrink-0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#4DB6AC]" /> Beauty & Aesthetics Routines
            </span>
            <span className="text-slate-700 dark:text-white/70 font-semibold">57k+ Scans</span>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE CHAT WINDOW */}
        <div className="w-full md:w-7/12 flex-1 flex flex-col justify-between bg-gradient-to-br from-white/60 via-orange-50/30 to-teal-50/30 dark:from-black/60 dark:via-[#120B18]/70 dark:to-[#0A1624]/70 relative overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#E1784F] to-[#4DB6AC] flex items-center justify-center text-white shadow-md">
                  <Bot size={20} />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black absolute bottom-0 right-0 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  AfriDam AI Assistant
                </h3>
                <p className="text-xs text-[#4DB6AC] font-semibold uppercase tracking-wider">
                  Always Online • Beauty, Routines & Support
                </p>
              </div>
            </div>
          </div>

          {/* Messages Container - Increased text sizes & dynamic bubbles */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2.5 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E1784F]/20 border border-[#E1784F]/50 flex items-center justify-center text-[#E1784F] shrink-0 mb-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[85%] p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#E1784F] to-[#d8683e] text-white rounded-br-none font-medium"
                        : "bg-black/[0.04] dark:bg-white/[0.08] border border-black/10 dark:border-white/15 text-slate-800 dark:text-white/95 rounded-bl-none backdrop-blur-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Interactive B2B CTA Card */}
                    {msg.showBusinessCTA && (
                      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[#E1784F]/30 to-[#4DB6AC]/30 border border-[#E1784F]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Explore a B2B Integration</p>
                          <p className="text-xs text-slate-700 dark:text-white/80">Book a demo to discuss API integration and catalog linking.</p>
                        </div>
                        <a
                          href="/brand-onboarding"
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#E1784F] hover:bg-[#c9623b] px-3 py-1.5 rounded-lg transition-all shrink-0 shadow-md"
                        >
                          <span>Book a Demo</span>
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    )}

                    {/* Interactive Support Email CTA Card */}
                    {msg.showSupportCTA && (
                      <div className="mt-3 p-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Direct Email Support</p>
                          <p className="text-xs text-[#4DB6AC] font-semibold">hello@afridamai.com</p>
                        </div>
                        <a
                          href="mailto:hello@afridamai.com"
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#4DB6AC] hover:bg-[#3ca399] px-3 py-1.5 rounded-lg transition-all shrink-0 shadow-md"
                        >
                          <span>Send Email</span>
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    )}

                    <span
                      className={`block text-xs mt-1.5 text-right ${
                        msg.sender === "user" ? "text-white/80" : "text-slate-400 dark:text-white/50"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/10 dark:bg-white/15 border border-black/20 dark:border-white/25 flex items-center justify-center text-slate-700 dark:text-white shrink-0 mb-0.5">
                      <User size={15} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 text-slate-400 dark:text-white/50 text-xs sm:text-sm pl-1 pt-1"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E1784F]/20 border border-[#E1784F]/50 flex items-center justify-center text-[#E1784F] shrink-0">
                  <Bot size={15} />
                </div>
                <div className="flex items-center gap-2 bg-black/5 dark:bg-white/[0.08] px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/15">
                  <span className="text-slate-600 dark:text-white/70 font-medium text-xs sm:text-sm">AfriDam AI is typing</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DB6AC] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Input Bar */}
          <form
            onSubmit={handleSubmitInput}
            className="p-3 sm:p-4 border-t border-black/10 dark:border-white/15 bg-white/60 dark:bg-black/60 backdrop-blur-md flex items-center gap-2.5 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about skin scans, routines, B2B integrations, or support..."
              disabled={isTyping}
              className="flex-1 bg-black/5 dark:bg-white/[0.07] border border-black/10 dark:border-white/15 focus:border-[#E1784F] rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/50 focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-r from-[#E1784F] to-[#d8683e] hover:from-[#d8683e] hover:to-[#c4572f] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-[#E1784F]/30"
              aria-label="Send Message"
            >
              <Send size={18} />
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
