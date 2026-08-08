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
  Stethoscope,
  Scan,
  Store,
  CreditCard,
  Lock,
  ShoppingBag,
  Headphones,
  ArrowRight
} from "lucide-react"

// --- COMPREHENSIVE AFRIDAM AI KNOWLEDGE DATABASE ---
interface FAQItem {
  id: string
  category: "General" | "Marketplace" | "Vendors" | "Scanner" | "Safety" | "Doctors" | "Support" | "Pricing" | "Privacy"
  question: string
  answer: string
  keywords: string[]
}

const FAQ_DATABASE: FAQItem[] = [
  // --- GENERAL PLATFORM IDENTITY ---
  {
    id: "g1",
    category: "General",
    question: "What is the name of this platform and what does it do?",
    answer: "This platform is AfriDam AI — a clinical AI skin diagnostic and e-commerce marketplace engine specifically engineered for dark skin (melanin-rich skin). We provide deep AI skin scanning, tele-dermatology consultations, safe skincare ingredient verification, and an approved vendor marketplace.",
    keywords: ["name", "platform", "what is this platform", "afridam", "afridam ai", "about", "overview"]
  },

  // --- MARKETPLACE & PRODUCTS ---
  {
    id: "m1",
    category: "Marketplace",
    question: "What is the AfriDam AI Marketplace?",
    answer: "The AfriDam Marketplace is an e-commerce hub featuring dermatologically verified skincare products specifically formulated for dark skin. Every product in our marketplace is laboratory-verified to be 100% free of toxic bleaching agents, harmful steroids, and severe irritants.",
    keywords: ["marketplace", "shop", "buy products", "store", "ecommerce", "creams", "products"]
  },
  {
    id: "m2",
    category: "Marketplace",
    question: "How do product recommendations work on the Marketplace?",
    answer: "After completing your AI skin scan, our engine matches your skin's diagnostic profile (hyperpigmentation, acne, hydration, etc.) with safe, verified products available directly in our Marketplace.",
    keywords: ["recommendations", "match", "buy after scan", "product match", "routine products"]
  },
  {
    id: "m3",
    category: "Marketplace",
    question: "Are all Marketplace products safe for melanin-rich skin?",
    answer: "Yes! All vendor products listed in the AfriDam Marketplace undergo strict chemical and ingredient audits before approval to prevent hyperpigmentation triggers and skin damage.",
    keywords: ["safe", "safe products", "bleaching free", "quality", "verified products"]
  },

  // --- VENDORS & BRAND ONBOARDING ---
  {
    id: "v1",
    category: "Vendors",
    question: "How do I join AfriDam AI as an approved vendor?",
    answer: "You can apply directly on our Homepage by navigating to the 'Join as Vendor' section! Step 1: Submit your brand details. Step 2: Upload product safety & ingredient sheets for clinical verification. Step 3: Once verified, your products will be featured in our Marketplace and AI recommendation engine.",
    keywords: ["join vendor", "become vendor", "vendor", "join as vendor", "sell on afridam", "brand partner", "apply", "vendor form"]
  },
  {
    id: "v2",
    category: "Vendors",
    question: "Where can I find the Vendor Application form?",
    answer: "Scroll down to the 'Join as Vendor' section on our homepage or click 'Care Hub' -> 'Vendor Portal'. You can also contact our team directly at hello@afridamai.com.",
    keywords: ["vendor form", "vendor link", "where to apply", "application form", "vendor section"]
  },
  {
    id: "v3",
    category: "Vendors",
    question: "How can skincare brands integrate the AI widget into their shop?",
    answer: "We offer e-commerce brands a simple 1-line script or Shopify widget. When embedded on your online store, your customers can scan their face and receive instant product recommendations directly from your store inventory.",
    keywords: ["widget", "integrate", "shopify", "api", "b2b", "embed", "1-line script", "brand shop"]
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
    category: "Scanner",
    question: "How does the AI skin scanner work?",
    answer: "AfriDam AI is trained on over 40,000+ verified clinical dark skin datasets (Fitzpatrick Scale IV–VI). Simply snap or upload a selfie, and our engine analyzes hyperpigmentation, acne grade, texture, and hydration within seconds.",
    keywords: ["how scanner work", "scanner", "technology", "scan face", "dark skin scan"]
  },
  {
    id: "s2",
    category: "Scanner",
    question: "How do I start my first skin scan?",
    answer: "Navigate to the 'Care Hub' tab on our platform or visit app.afridamai.com. Click 'Start Scan', grant camera permissions or upload a photo, and view your diagnostic report immediately.",
    keywords: ["start scan", "how to scan", "use app", "take photo"]
  },

  // --- SAFETY & INGREDIENTS ---
  {
    id: "sf1",
    category: "Safety",
    question: "What is the Product Ingredient Analyzer?",
    answer: "Our Product Ingredient Analyzer scans beauty product labels or ingredient text to detect harmful steroids, toxic bleaching chemicals (like mercury or high-dose hydroquinone), and irritants unsafe for dark skin.",
    keywords: ["ingredient", "analyzer", "chemicals", "bleaching", "steroids", "safe"]
  },

  // --- TELE-DOCTORS ---
  {
    id: "d1",
    category: "Doctors",
    question: "Can I consult with certified dermatologists on AfriDam AI?",
    answer: "Yes! If your scan detects a condition requiring professional medical care, you can book virtual consultations with board-certified dermatologists specializing in melanin-rich skin health.",
    keywords: ["doctor", "dermatologist", "consultation", "telehealth", "book appointment"]
  },

  // --- PRICING & PLANS ---
  {
    id: "p1",
    category: "Pricing",
    question: "Is AfriDam AI free to use?",
    answer: "We offer a Free tier that includes basic AI skin scans and ingredient safety checks. Our Pro tier unlocks unlimited deep clinical scans, routine tracking, and discounted specialist consultation fees.",
    keywords: ["free", "cost", "price", "pricing", "subscription", "plans"]
  },

  // --- PRIVACY & SECURITY ---
  {
    id: "pr1",
    category: "Privacy",
    question: "Is my facial photo and personal health data secure?",
    answer: "All facial images and personal health records are encrypted using end-to-end medical-grade standards. Your photos are analyzed securely and are never sold or shared without your explicit consent.",
    keywords: ["privacy", "data", "secure", "photo safe", "encryption"]
  }
]

interface Message {
  id: string
  sender: "bot" | "user"
  text: string
  time: string
  showVendorCTA?: boolean
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
      text: "Hello! 👋 I am the AfriDam AI Virtual Assistant. Ask me anything about our dark skin scanner, Marketplace, tele-dermatologists, or how to join as an approved vendor!",
      time: formatTime(new Date())
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

  const triggerBotResponse = (questionText: string, answerText: string, isVendorRelated: boolean = false, isSupportRelated: boolean = false) => {
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
        showVendorCTA: isVendorRelated,
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

    const isVendorRelated = ["vendor", "join", "seller", "partner", "brand", "apply"].some(kw => cleanQuery.includes(kw))
    const isSupportRelated = ["contact", "email", "support", "help", "reach", "mail", "hello@afridamai.com"].some(kw => cleanQuery.includes(kw))

    // Find best match using full-text and keyword match
    const foundMatch = FAQ_DATABASE.find(item => 
      item.question.toLowerCase().includes(cleanQuery) ||
      item.keywords.some(kw => cleanQuery.includes(kw))
    )

    const responseAnswer = foundMatch
      ? foundMatch.answer
      : "I don't have an exact answer for that specific question yet, but you can explore our Marketplace, check out our Knowledge Bank, or email our support team directly at hello@afridamai.com!"

    triggerBotResponse(
      rawInput, 
      responseAnswer, 
      isVendorRelated || foundMatch?.category === "Vendors",
      isSupportRelated || foundMatch?.category === "Support"
    )
  }

  const filteredQuestions = activeCategory === "All" 
    ? FAQ_DATABASE 
    : FAQ_DATABASE.filter(q => q.category === activeCategory)

  const categories = [
    { label: "All", icon: Sparkles },
    { label: "Marketplace", icon: ShoppingBag },
    { label: "Vendors", icon: Store },
    { label: "Scanner", icon: Scan },
    { label: "Safety", icon: ShieldCheck },
    { label: "Doctors", icon: Stethoscope },
    { label: "Support", icon: Headphones },
    { label: "Pricing", icon: CreditCard },
    { label: "Privacy", icon: Lock }
  ]

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-[#050505] text-white flex flex-col justify-center items-center px-3 sm:px-6 md:px-8 selection:bg-[#E1784F]/30">
      
      {/* HEADER SECTION */}
      <div className="max-w-3xl text-center space-y-2.5 mb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[#E1784F] text-[11px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md">
          <Sparkles size={13} className="text-[#4DB6AC]" />
          <span>Interactive Knowledge Assistant</span>
        </div>
        
        <h2 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight uppercase italic leading-tight text-center">
          GOT QUESTIONS? <span className="text-[#E1784F] whitespace-nowrap">ASK AFRIDAM AI</span>
        </h2>

        <p className="text-white/60 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto px-2">
          Explore our Marketplace, diagnostic scanner, vendor onboarding, or contact support directly at <strong className="text-white">hello@afridamai.com</strong>.
        </p>
      </div>

      {/* CHATBOX CONTAINER - Mobile Responsive Height & Flex Layout */}
      <div className="w-full max-w-5xl bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[720px] md:h-[580px] relative">
        
        {/* LEFT SIDEBAR: TOPICS & KNOWLEDGE BANK */}
        <div className="w-full md:w-5/12 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 p-3 sm:p-4 flex flex-col justify-between h-[230px] md:h-full shrink-0">
          <div className="space-y-2.5 flex-1 flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white/50">
                Knowledge Bank
              </span>
              <button 
                onClick={() => setMessages([{
                  id: "welcome-reset",
                  sender: "bot",
                  text: "Chat cleared! How else can I assist you with AfriDam AI?",
                  time: formatTime(new Date())
                }])}
                className="text-[10px] sm:text-[11px] text-white/40 hover:text-[#E1784F] transition-colors flex items-center gap-1 font-semibold"
                title="Clear Chat"
              >
                <RefreshCw size={12} /> Clear
              </button>
            </div>

            {/* Category Badges (Horizontal Scroll with Hidden Scrollbars) */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeCategory === cat.label
                        ? "bg-[#E1784F] text-white shadow-md shadow-[#E1784F]/20"
                        : "bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <IconComponent size={12} />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Questions List (Vertical Scroll with Custom Dark Scrollbars) */}
            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
              {filteredQuestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => triggerBotResponse(
                    item.question, 
                    item.answer, 
                    item.category === "Vendors",
                    item.category === "Support"
                  )}
                  disabled={isTyping}
                  className="w-full text-left p-2.5 sm:p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#4DB6AC]/40 transition-all duration-200 group flex items-start justify-between gap-2 text-[11px] sm:text-xs font-medium text-white/80 hover:text-white disabled:opacity-50"
                >
                  <span className="line-clamp-2 leading-snug">{item.question}</span>
                  <ChevronRight size={13} className="text-white/30 group-hover:text-[#4DB6AC] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer Stats */}
          <div className="pt-2 mt-1 border-t border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] text-white/40 font-medium shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#4DB6AC]" /> Verified Vendors & Products
            </span>
            <span>40k+ Scans</span>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE CHAT WINDOW */}
        <div className="w-full md:w-7/12 flex-1 flex flex-col justify-between bg-black/70 relative overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#E1784F] to-[#4DB6AC] flex items-center justify-center text-white shadow-md">
                  <Bot size={18} />
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 border-2 border-black absolute bottom-0 right-0 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  AfriDam AI Assistant
                </h3>
                <p className="text-[9px] sm:text-[10px] text-[#4DB6AC] font-semibold uppercase tracking-wider">
                  Always Online • Clinical, Marketplace & Support
                </p>
              </div>
            </div>
          </div>

          {/* Messages Container (Strict Internal Scroll to prevent page jump) */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E1784F]/20 border border-[#E1784F]/40 flex items-center justify-center text-[#E1784F] shrink-0 mb-0.5">
                      <Bot size={13} />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                      msg.sender === "user"
                        ? "bg-[#E1784F] text-white rounded-br-none font-medium"
                        : "bg-white/[0.06] border border-white/10 text-white/90 rounded-bl-none backdrop-blur-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Interactive Vendor CTA Card */}
                    {msg.showVendorCTA && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-gradient-to-r from-[#E1784F]/20 to-[#4DB6AC]/20 border border-[#E1784F]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-white">Join as an Approved Vendor</p>
                          <p className="text-[10px] text-white/70">Fill out our Vendor Registration Form on the Homepage.</p>
                        </div>
                        <a
                          href="/#join-as-vendor"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E1784F] hover:text-white bg-white/10 hover:bg-[#E1784F] px-2.5 py-1.5 rounded-lg transition-all shrink-0"
                        >
                          <span>Go to Homepage</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>
                    )}

                    {/* Interactive Support Email CTA Card */}
                    {msg.showSupportCTA && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-white">Direct Email Support</p>
                          <p className="text-[10px] text-white/70">hello@afridamai.com</p>
                        </div>
                        <a
                          href="mailto:hello@afridamai.com"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4DB6AC] hover:text-white bg-white/10 hover:bg-[#4DB6AC] px-2.5 py-1.5 rounded-lg transition-all shrink-0"
                        >
                          <span>Send Email</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>
                    )}

                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        msg.sender === "user" ? "text-white/70" : "text-white/40"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mb-0.5">
                      <User size={13} />
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
                className="flex items-center gap-2 text-white/40 text-xs pl-1 pt-1"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E1784F]/20 border border-[#E1784F]/40 flex items-center justify-center text-[#E1784F] shrink-0">
                  <Bot size={13} />
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-white/60 font-medium text-[10px] sm:text-[11px]">AfriDam AI is typing</span>
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
            className="p-2.5 sm:p-3 border-t border-white/10 bg-black/90 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about skin scans, marketplace, vendors, or email support..."
              disabled={isTyping}
              className="flex-1 bg-white/[0.05] border border-white/10 focus:border-[#E1784F] rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E1784F] hover:bg-[#d0673e] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-[#E1784F]/20"
              aria-label="Send Message"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}