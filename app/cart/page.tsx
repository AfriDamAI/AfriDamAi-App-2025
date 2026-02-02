/**
 * 🛡️ AFRIDAM CARE SHOP: YOUR BAG (Rule 6 Synergy)
 * Version: 2026.1.22 (Paystack & Handshake Alignment)
 * Focus: High-Precision Checkout & Soft Tone.
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingBag, ChevronLeft, Trash2,
  Plus, Minus, Lock, ArrowRight, ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/providers/auth-provider"
import { initializePayment } from "@/lib/api-client"
import { usePaystackPayment } from "react-paystack"

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()

  // 🛡️ OGA SYNC: In a real app, you'd pull this from a Cart Context or API
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  /**
   * 💳 PAYSTACK HANDSHAKE
   * Converting the total shopping bag amount to Naira.
   */
  const config = {
    reference: `CART-${Date.now()}`,
    email: user?.email || "",
    amount: totalAmount * 100 * 1650, // $ to Naira sync
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  }

  const initializePaystack = usePaystackPayment(config)

  const handleCheckout = async () => {
    if (totalAmount === 0) return
    setIsLoading(true)

    try {
      // 🚀 Rule 6: Handshake with your backend transaction logic
      await initializePayment({
        plan: "PRODUCT_PURCHASE",
        amount: totalAmount
      })

      initializePaystack({
        onSuccess: () => router.push('/dashboard/orders'),
        onClose: () => setIsLoading(false)
      })
    } catch (err) {
      console.error("Checkout sync failed")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors pb-32 lg:pb-10 text-left">

      {/* 1. HEADER */}
      <nav className="max-w-screen-xl mx-auto px-6 h-24 flex items-center justify-between">
        <button
          onClick={() => router.push('/marketplace')}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shop</span>
        </button>
        <h1 className="text-lg font-black italic tracking-tighter uppercase">Your <span className="text-[#E1784F]">Bag</span></h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* ITEM LIST */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-5 p-4 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-[#E1784F]/20 transition-all"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/10 shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[12px] font-black uppercase italic tracking-tight leading-none">{item.name}</h3>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#E1784F] mt-2">₦{item.price}</p>
                        </div>
                        <button className="text-red-500 opacity-20 hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white dark:bg-black rounded-full border border-black/5 dark:border-white/10 px-2 py-1">
                          <button className="p-1 opacity-40"><Minus size={12} /></button>
                          <span className="px-3 text-[10px] font-black">{item.quantity}</span>
                          <button className="p-1 text-[#E1784F]"><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SUMMARY PANEL */}
            <aside className="space-y-6 lg:sticky lg:top-32">
              <div className="p-8 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] shadow-2xl space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center opacity-40">
                    <span className="text-[9px] font-black uppercase tracking-widest">Subtotal</span>
                    <span className="text-[10px] font-black">₦{totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center opacity-40">
                    <span className="text-[9px] font-black uppercase tracking-widest">Shipping</span>
                    <span className="text-[10px] font-black italic">Free</span>
                  </div>
                  <div className="h-px bg-white/10 dark:bg-black/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-widest">Your Total</span>
                    <span className="text-2xl font-black italic tracking-tighter">₦{totalAmount}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-[#E1784F]/20 active:scale-95 transition-all"
                >
                  {isLoading ? "Syncing..." : "Pay Now"} <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 opacity-30">
                <Lock size={12} className="text-[#4DB6AC]" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Safe & Secure checkout</span>
              </div>
            </aside>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="py-24 text-center space-y-8 bg-gray-50 dark:bg-white/5 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-white/5">
            <div className="w-20 h-20 bg-white dark:bg-black rounded-full flex items-center justify-center mx-auto shadow-sm">
              <ShoppingBag size={28} className="opacity-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Your bag is empty</h2>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Let's find something for your glow</p>
            </div>
            <Button
              onClick={() => router.push('/marketplace')}
              className="px-10 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[9px] font-black uppercase tracking-widest"
            >
              Go to Shop
            </Button>
          </div>
        )}
      </div>

      {/* MOBILE STICKY CHECKOUT BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 p-6 lg:hidden z-50">
          <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Total</p>
              <p className="text-xl font-black italic tracking-tighter">₦{totalAmount}</p>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex-1 h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#E1784F]/20"
            >
              Checkout <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}