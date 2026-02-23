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
import { useCart } from "@/hooks/use-cart"
import { apiClient } from "@/lib/api-client"
import { Order } from "@/lib/types"

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, fetchCart, updateQuantity, removeFromCart, loading: cartLoading } = useCart()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchCart(user.id)
      // Hydrate product details
      const fetchProducts = async () => {
        try {
          const res = await apiClient.get('/products')
          setProducts(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
          console.error("Failed to fetch products for hydration", err)
        }
      }
      fetchProducts()
    }
  }, [user, fetchCart])

  const handleRemoveFromCart = (productId: string) => {
    if (user) {
      removeFromCart(user.id, productId)
    }
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (user && newQuantity >= 1) {
      updateQuantity(user.id, productId, newQuantity)
    }
  }

  // Synergy Fix: Map products to items for display
  const enrichedItems = cart?.items?.map(item => {
    const product = products.find(p => p.id === item.productId)
    return {
      ...item,
      productName: product?.name || item.productName || item.productId,
      productImage: product?.imageUrl || item.productImage,
      price: Number(product?.basePrice || item.price || 0)
    }
  }) || []

  const totalAmount = enrichedItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0)

  const handleCreateOrder = async () => {
    if (!user || enrichedItems.length === 0) return

    setIsCreatingOrder(true)
    try {
      const orderData = {
        shippingAddress: "To be confirmed",
        items: enrichedItems.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      }

      // console.log("🛒 ATTEMPTING ORDER CREATION (Simplified Path):", orderData);

      const newOrder = await apiClient.post<Order>('/orders', orderData)
      // console.log("🛒 ORDER CREATED SUCCESS:", newOrder.data);
      router.push(`/transaction?orderId=${newOrder.data.id}`)
    } catch (error: any) {
      console.error("🛒 ORDER CREATION FAILURE:", error.response?.data || error.message)
    } finally {
      setIsCreatingOrder(false)
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
        <h1 className="text-lg font-black italic tracking-tighter uppercase ml-auto mr-auto">Your <span className="text-[#E1784F]">Bag</span></h1>

        {enrichedItems.length > 0 && (
          <button
            onClick={() => user && useCart.getState().clearCart(user.id)}
            className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
            <span>Clear Bag</span>
          </button>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {enrichedItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* ITEM LIST */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {enrichedItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-5 p-4 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-[#E1784F]/20 transition-all"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/10 shrink-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <ShoppingBag size={24} className="opacity-10" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div className="max-w-[150px]">
                          <h3 className="text-[12px] font-black uppercase italic tracking-tight leading-none truncate block">
                            {item.productName}
                          </h3>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#E1784F] mt-2">₦{item.price.toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleRemoveFromCart(item.productId)} className="text-red-500 opacity-20 hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white dark:bg-black rounded-full border border-black/5 dark:border-white/10 px-2 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 opacity-40 hover:opacity-100 transition-opacity"
                          >
                            <Minus size={12} />
                          </button>

                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) {
                                handleUpdateQuantity(item.productId, val);
                              }
                            }}
                            className="bg-transparent text-[10px] font-black w-10 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />

                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 text-[#E1784F] hover:scale-110 transition-transform"
                          >
                            <Plus size={12} />
                          </button>
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
                    <span className="text-[10px] font-black">₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center opacity-40">
                    <span className="text-[9px] font-black uppercase tracking-widest">Shipping</span>
                    <span className="text-[10px] font-black italic">Free</span>
                  </div>
                  <div className="h-px bg-white/10 dark:bg-black/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-widest">Your Total</span>
                    <span className="text-2xl font-black italic tracking-tighter">₦{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || cartLoading}
                  className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-[#E1784F]/20 active:scale-95 transition-all"
                >
                  {isCreatingOrder ? "Creating Order..." : "Create Order"} <ArrowRight size={16} className="ml-2" />
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
      {enrichedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 p-6 lg:hidden z-50">
          <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Total</p>
              <p className="text-xl font-black italic tracking-tighter">₦{totalAmount.toLocaleString()}</p>
            </div>
            <Button
              onClick={handleCreateOrder}
              disabled={isCreatingOrder || cartLoading}
              className="flex-1 h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#E1784F]/20"
            >
              {isCreatingOrder ? "Creating..." : "Create Order"} <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
