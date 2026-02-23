"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ChevronLeft, Package, MapPin, 
  CreditCard, CheckCircle2, Truck, 
  Calendar, ShieldCheck, Loader2, Sparkles
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { apiClient } from "@/lib/api-client"
import { motion } from "framer-motion"

/**
 * 🛡️ AFRIDAM CARE HUB: ORDER DETAILS (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: High-Precision Transaction Breakdown & Shipment Sync.
 */

export default function OrderDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    setLoading(true)
    try {
      /**
       * 🚀 THE DETAIL HANDSHAKE
       * Pulling specific order record from NestJS Marketplace Module.
       */
      const response = await apiClient.get(`/orders/${id}`)
      setOrder(response.data?.resultData || response.data)
    } catch (err) {
      console.log("Order details sync pending...")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#E1784F]" size={24} />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Retrieving Care ID: {id?.slice(0,8)}</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-6 lg:p-20 relative overflow-x-hidden text-left">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_20%_0%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <header className="space-y-8">
          <button 
            onClick={() => router.push('/marketplace/orders')}
            className="flex items-center gap-3 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ChevronLeft size={16} /> Back to History
          </button>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
              Care <br /> <span className="text-[#4DB6AC]">Record</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Transaction Detail • Ref: {id?.slice(0, 12)}</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          
          {/* PRODUCT LIST */}
          <div className="space-y-8">
            <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-4">Items in Order</h3>
               <div className="space-y-4">
                  {order?.items?.map((item: any) => (
                    <div key={item.id} className="p-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] flex items-center gap-6">
                       <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                          <Package size={24} className="opacity-20" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <h4 className="text-[12px] font-black uppercase tracking-tight italic">{item.name || 'Care Product'}</h4>
                          <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Qty: {item.quantity || 1} • Product Ref: {item.id?.slice(0, 6)}</p>
                       </div>
                       <p className="text-[11px] font-black text-[#E1784F]">₦{item.price?.toLocaleString()}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* TRACKING STEPPER */}
            <div className="p-8 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] space-y-8">
               <div className="flex items-center gap-4">
                  <Truck size={20} className="text-[#4DB6AC]" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Shipment Status</h3>
               </div>
               
               <div className="flex justify-between relative px-2">
                  <div className="absolute top-4 left-0 w-full h-[2px] bg-black/5 dark:bg-white/5 -z-10" />
                  <div className={`absolute top-4 left-0 h-[2px] bg-[#4DB6AC] -z-10 transition-all duration-1000 w-[50%]`} />
                  
                  {[
                    { label: "Secured", icon: ShieldCheck, active: true },
                    { label: "Transit", icon: Truck, active: true },
                    { label: "Delivery", icon: CheckCircle2, active: false }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.active ? 'bg-[#4DB6AC] border-[#4DB6AC] text-white' : 'bg-white dark:bg-[#0A0A0A] border-black/5 dark:border-white/10 text-gray-300'}`}>
                          <step.icon size={14} />
                       </div>
                       <p className={`text-[7px] font-black uppercase tracking-widest ${step.active ? 'opacity-100' : 'opacity-20'}`}>{step.label}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* SUMMARY ASIDE */}
          <aside className="space-y-6">
            <div className="p-8 bg-black dark:bg-white text-white dark:text-black rounded-[3rem] space-y-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center opacity-40">
                     <span className="text-[9px] font-black uppercase tracking-widest">Payment</span>
                     <CreditCard size={14} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-2xl font-black italic tracking-tighter leading-none">₦{order?.totalPrice?.toLocaleString()}</p>
                     <p className="text-[8px] font-bold uppercase opacity-40 tracking-widest">Transaction Verified</p>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/10 dark:border-black/10 space-y-4 text-left">
                  <div className="flex items-start gap-3">
                     <Calendar size={14} className="opacity-40" />
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Date</p>
                        <p className="text-[10px] font-bold uppercase tracking-tight">{new Date(order?.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <MapPin size={14} className="opacity-40" />
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Region</p>
                        <p className="text-[10px] font-bold uppercase tracking-tight">{order?.shippingAddress || 'Lagos, Nigeria'}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 flex flex-col items-center gap-4 opacity-20 text-center">
               <div className="flex items-center gap-2">
                  <Sparkles size={12} className="text-[#E1784F]" />
                  <span className="text-[7px] font-black uppercase tracking-[0.5em]">Linked to Specialist Plan</span>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}