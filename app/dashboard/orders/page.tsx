/**
 * 🛡️ AFRIDAM CARE PACKAGES: ORDER HISTORY (Rule 6 Synergy)
 * Version: 2026.1.22 (Schema & Handshake Alignment)
 * Focus: High-Precision Order Tracking & Soft Tone.
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Package, ChevronLeft, MapPin, 
  Calendar, ArrowRight, ShoppingBag, 
  CheckCircle2, Truck, Box
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/providers/auth-provider"
import apiClient from "@/lib/api-client"

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders/my-orders")
        // Rule 7 Sync: NestJS resultData unwrap
        setOrders(response?.data?.resultData || response?.data || [])
      } catch (err) {
        console.error("Order sync paused")
      } finally {
        setIsLoading(false)
      }
    }
    if (user) fetchOrders()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#E1784F]/20 border-t-[#E1784F] rounded-full animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Checking your packages</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors pb-20 text-left">
      
      {/* 1. HEADER */}
      <nav className="max-w-screen-xl mx-auto px-6 h-24 flex items-center justify-between">
        <button 
          onClick={() => router.push('/dashboard')}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Hub</span>
        </button>
        <h1 className="text-lg font-black italic tracking-tighter uppercase">Care <span className="text-[#E1784F]">Packages</span></h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        
        <header className="space-y-2">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Your <span className="text-[#E1784F]">Orders</span></h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Track your skin care essentials</p>
        </header>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 md:p-8 bg-gray-50 dark:bg-white/5 rounded-[2.8rem] border border-black/5 dark:border-white/10 space-y-8"
              >
                {/* ORDER INFO */}
                <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-xl">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Order Number</p>
                      <p className="text-[12px] font-black uppercase italic tracking-tight">#{order.id.slice(-8)}</p>
                      <div className="flex items-center gap-3 mt-1 opacity-50">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Amount Paid</p>
                    <p className="text-2xl font-black italic tracking-tighter text-[#E1784F]">${order.totalAmount}</p>
                  </div>
                </div>

                {/* PROGRESS TRACKER */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#4DB6AC]">
                      {order.status === 'DELIVERED' ? 'Successfully Delivered' : 'Processing Your Care'}
                    </p>
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">Est. 3-5 Days</span>
                  </div>
                  
                  <div className="relative h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: order.status === 'DELIVERED' ? '100%' : 
                               order.status === 'SHIPPED' ? '66%' : 
                               order.status === 'CONFIRMED' ? '33%' : '10%' 
                      }}
                      className="absolute h-full bg-[#E1784F]"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: CheckCircle2, label: 'Confirmed' },
                      { icon: Box, label: 'Packed' },
                      { icon: Truck, label: 'Shipped' },
                      { icon: ShoppingBag, label: 'Home' }
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 opacity-30">
                        <step.icon size={14} />
                        <span className="text-[7px] font-black uppercase tracking-widest">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ADDRESS & ACTION */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-2">
                  <div className="flex items-start gap-3 opacity-60">
                    <MapPin size={16} className="text-[#E1784F] shrink-0" />
                    <p className="text-[10px] font-bold uppercase leading-tight tracking-tight">
                      {order.shippingAddress || "Home Address on File"}
                    </p>
                  </div>
                  <button 
                    onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                    className="w-full md:w-auto h-12 px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    Details <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="py-24 text-center space-y-6 bg-gray-50 dark:bg-white/5 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-white/10">
            <Package size={32} className="mx-auto opacity-10" />
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">No orders yet</h3>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Your care journey is just beginning</p>
            </div>
            <button 
              onClick={() => router.push('/marketplace')}
              className="px-8 h-12 bg-[#E1784F] text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
            >
              Shop Essentials
            </button>
          </div>
        )}
      </div>
    </main>
  )
}