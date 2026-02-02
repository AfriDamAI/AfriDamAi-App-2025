"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ShoppingBag, Trash2,
  Plus, Minus, ShieldCheck, ArrowRight,
  CreditCard, Sparkles
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { usePaystackPayment } from "react-paystack"
import { motion, AnimatePresence } from "framer-motion"

/**
 * 🛡️ AFRIDAM CARE HUB: CART & CHECKOUT (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: Mobile-First Checkout & Paystack Handshake.
 */

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()

  // 🚀 MOCK DATA: Ready to be replaced by your Cart Context/Global State
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Melanin Radiance Serum', price: 45, quantity: 1, image: '/placeholder.jpg' }
  ])

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const totalInNaira = subtotal * 1650 // Specialist Sync: Standardizing the rate

  const config = {
    reference: `CART-${Date.now()}`,
    email: user?.email || "guest@afridam.com",
    amount: totalInNaira * 100, // Paystack expects kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_sample",
  }

  const initializePaystack = usePaystackPayment(config)

  const handleCheckout = () => {
    initializePaystack({
      onSuccess: (ref) => router.push(`/marketplace/success?ref=${ref.reference}`),
      onClose: () => console.log("Checkout paused")
    })
  }

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-6 lg:p-20 relative overflow-x-hidden text-left">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_20%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">

        {/* HEADER */}
        <header className="space-y-8">
          <button
            onClick={() => router.push('/marketplace')}
            className="flex items-center gap-3 text-[#E1784F] text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ChevronLeft size={16} /> Back to Shop
          </button>

          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
              Your <br /> <span className="text-[#E1784F]">Cart</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Review your selected care</p>
          </div>
        </header>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">

            {/* ITEM LIST */}
            <div className="space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[2.5rem]"
                  >
                    <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-[12px] font-black uppercase tracking-tight italic leading-none">{item.name}</h3>
                      <p className="text-[10px] font-black text-[#E1784F]">₦{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-4 text-red-500/20 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SUMMARY CARD */}
            <aside className="p-8 bg-black dark:bg-white text-white dark:text-black rounded-[3rem] space-y-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-[9px] font-black uppercase tracking-widest">Subtotal</span>
                  <span className="text-[11px] font-bold">₦{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black italic tracking-tighter">₦{totalInNaira.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#E1784F]/20"
              >
                Checkout <ArrowRight size={16} />
              </button>

              <div className="pt-4 flex flex-col items-center gap-3 opacity-30 text-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-[#4DB6AC]" />
                  <span className="text-[7px] font-black uppercase tracking-widest">Secure Handshake</span>
                </div>
                <p className="text-[6px] font-bold uppercase tracking-widest">Processed via Paystack Secure</p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[3rem]">
            <ShoppingBag size={48} className="opacity-10" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Cart is Empty</h3>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Find a care solution in the shop</p>
            </div>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[9px] tracking-widest"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </main>
  )
}