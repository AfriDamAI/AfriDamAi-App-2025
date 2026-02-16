"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, X, Star, Zap, Crown, Loader2, ArrowRight } from "lucide-react"
import environment from "@/lib/environment"
import { jwtDecode } from "jwt-decode"

interface PricingPlan {
  id: string
  name: string
  price: number
  type: string
  period: string
  description: string[]
  features: string[]
  createdAt: string
  updatedAt: string
}

interface PlanDisplay extends PricingPlan {
  icon: any
  color: string
  textColor: string
  buttonColor: string
  popular: boolean
  notIncluded?: string[]
}

export function PricingList() {
  const router = useRouter()
  const [plans, setPlans] = useState<PlanDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [isCreatingSubscription, setIsCreatingSubscription] = useState<string | null>(null)

  useEffect(() => {
    fetchPricingPlans()
  }, [])

  const fetchPricingPlans = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("/api/pricing-plans", {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch pricing plans")
      }
      const data = await response.json()
      const mappedPlans: PlanDisplay[] = data.map((plan: any, index: number) => {
        const designConfigs = [
          {
            icon: Star,
            color: "bg-gray-50 dark:bg-white/5",
            textColor: "text-black dark:text-white",
            buttonColor: "bg-black dark:bg-white text-white dark:text-black",
            popular: false,
          },
          {
            icon: Zap,
            color: "bg-[#E1784F]",
            textColor: "text-white",
            buttonColor: "bg-white text-[#E1784F]",
            popular: true,
          },
          {
            icon: Crown,
            color: "bg-black dark:bg-white",
            textColor: "text-white dark:text-black",
            buttonColor: "bg-[#E1784F] text-white",
            popular: false,
          },
        ]
        const config = designConfigs[index % designConfigs.length]
        const features = Array.isArray(plan.features) ? plan.features : Array.isArray(plan.description) ? plan.description : []
        return { ...plan, features, ...config, notIncluded: [] }
      })
      setPlans(mappedPlans)
      setError(null)
    } catch (err) {
      console.error("Error fetching pricing plans:", err)
      setError("Failed to load pricing plans. Please log in to view plans.")
    } finally {
      setLoading(false)
    }
  }

  const handleChoosePlan = async (plan: PlanDisplay) => {
    setIsCreatingSubscription(plan.id)
    setSubscriptionError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const decodedToken: any = jwtDecode(token)
      const userId = decodedToken.sub

      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + 30)

      const response = await fetch(`${environment.backendUrl}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          planId: plan.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.id) {
        throw new Error(result.message || "Failed to create subscription.")
      }

      const subscriptionId = result.id
      router.push(`/transaction?subscriptionId=${subscriptionId}&price=${plan.price}&name=${encodeURIComponent(plan.name)}`)
    } catch (err: any) {
      setSubscriptionError(err.message)
    } finally {
      setIsCreatingSubscription(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#E1784F]" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Syncing Plans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{error}</p>
          <button
            onClick={fetchPricingPlans}
            className="px-8 py-3 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#d16a3f] transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {subscriptionError && (
        <div className="p-4 bg-red-500/10 rounded-2xl flex items-center gap-3">
          <X className="text-red-500" size={16} />
          <p className="text-[10px] font-black uppercase text-red-500 tracking-tight">{subscriptionError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 ${plan.color} ${plan.textColor} shadow-2xl flex flex-col h-full`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap z-10">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-inner">
                <plan.icon size={24} />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter">{plan.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-black tracking-tighter">₦{plan.price}</span>
                <span className="ml-2 text-[9px] font-bold uppercase tracking-widest opacity-60">{plan.period}</span>
              </div>
            </div>

            <div className="flex-1 space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={12} strokeWidth={3} className="shrink-0 mt-0.5 opacity-80" />
                  <span className="text-[10px] font-bold leading-relaxed uppercase tracking-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleChoosePlan(plan)}
              disabled={isCreatingSubscription === plan.id}
              className={`w-full py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] shadow-xl active:scale-95 transition-all ${plan.buttonColor} disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isCreatingSubscription === plan.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Select {plan.name} <ArrowRight size={12} /></>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
