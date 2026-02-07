"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, ShoppingBag, Package, 
  Clock, CheckCircle2, Truck, 
  ExternalLink, Loader2, Search
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { apiClient } from "@/lib/api-client"
import { motion, AnimatePresence } from "framer-motion"

/**
 * 🛡️ AFRIDAM CARE HUB: ORDER HISTORY (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: Mobile-First Transaction Tracking & Specialist Tone.
 */

export default function OrderHistoryPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push("/login")
    if (user) fetchOrders()
  }, [user, authLoading])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      /**
       * 🚀 THE COMMERCE HANDSHAKE
       * Pulling transaction history from the Marketplace module.
       */
      const response = await apiClient.get(`/orders/user/${user?.id}`)
      setOrders(response.data?.resultData || response.data || [])
    } catch (err) {
      console.log("Order sync pending...")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const isDone = status.toLowerCase() === 'delivered' || status.toLowerCase() === 'completed'
    return (
      <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${
        isDone ? 'bg-[#4DB6AC]/10 text-[#4DB6AC]' : 'bg-[#E1784F]/10 text-[#E1784F]'
      }`}>
        {isDone ? <CheckCircle2 size={10} /> : <Truck size={10} />}
        {status}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-6 lg:p-20 relative overflow-x-hidden text-left">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-[radial-gradient(circle_at_80%_0%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <header className="space-y-8">
          <button 
            onClick={() => router.push('/marketplace')}
            className="flex items-center gap-3 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ChevronLeft size={16} /> Back to Market
          </button>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
              Care <br /> <span className="text-[#E1784F]">Orders</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Your purchase history and tracking</p>
          </div>
        </header>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#E1784F]" size={24} />
            <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Syncing Transactions</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-6">
            <AnimatePresence>
              {orders.map((order, i) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black uppercase tracking-widest opacity-30">
                        {new Date(order.createdAt).toLocaleDateString()} • Ref: {order.id.slice(0, 8)}
                       </p>
                       <h3 className="text-xl font-black italic uppercase tracking-tighter">Order Secured</h3>
                    </div>
                    <StatusBadge status={order.status || "In Transit"} />
                  </div>

                  <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-tight italic">
                        {order.items?.length || 1} Item(s) • Total: <span className="text-[#E1784F]">₦{order.totalPrice?.toLocaleString() || "0"}</span>
                       </p>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/marketplace/orders/${order.id}`)}
                      className="w-full md:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      View Details <ExternalLink size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[3rem]">
            <ShoppingBag size={48} className="opacity-10" />
            <div className="space-y-2 px-6">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter">No Orders Yet</h3>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Your care journey will appear here once you shop.</p>
            </div>
            <button 
              onClick={() => router.push('/marketplace')}
              className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[9px] tracking-widest"
            >
              Go To Market
            </button>
          </div>
        )}
      </div>
    </main>
  )
}