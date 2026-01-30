"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, X, ArrowLeft, Star, Zap, Crown, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import environment from "@/lib/environment" // Import environment
import { jwtDecode } from 'jwt-decode' // Import jwtDecode

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

export default function PlansPage() {
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
            const token = localStorage.getItem('token')
            const response = await fetch('/api/pricing-plans', {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch pricing plans')
            }
            const data = await response.json()
            const mappedPlans: PlanDisplay[] = data.map((plan: any, index: number) => {
                const designConfigs = [
                    { icon: Star, color: "bg-gray-100 dark:bg-zinc-800", textColor: "text-black dark:text-white", buttonColor: "bg-black dark:bg-white text-white dark:text-black", popular: false },
                    { icon: Zap, color: "bg-[#E1784F]", textColor: "text-white", buttonColor: "bg-white text-[#E1784F]", popular: true },
                    { icon: Crown, color: "bg-black dark:bg-white", textColor: "text-white dark:text-black", buttonColor: "bg-[#E1784F] text-white", popular: false }
                ]
                const config = designConfigs[index % designConfigs.length]
                const features = Array.isArray(plan.features) ? plan.features : Array.isArray(plan.description) ? plan.description : []
                return { ...plan, features, ...config, notIncluded: [] }
            })
            setPlans(mappedPlans)
            setError(null)
        } catch (err) {
            console.error('Error fetching pricing plans:', err)
            setError('Failed to load pricing plans. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const handleChoosePlan = async (plan: PlanDisplay) => {
        setIsCreatingSubscription(plan.id)
        setSubscriptionError(null)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error("You must be logged in to subscribe.")
            }

            const decodedToken: any = jwtDecode(token)
            const userId = decodedToken.sub // Assuming 'sub' is the userId claim in the token

            const startDate = new Date()
            const endDate = new Date()
            endDate.setDate(startDate.getDate() + 30)

            const response = await fetch(`${environment.backendUrl}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userId, // Include userId
                    planId: plan.id,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                })
            })

            const result = await response.json()

            if (!response.ok || !result.id) { // Check for result.id as per Postman example
                throw new Error(result.message || "Failed to create subscription.")
            }

            const subscriptionId = result.id // Get ID directly from result as per Postman example
            router.push(`/transaction?subscriptionId=${subscriptionId}&price=${plan.price}&name=${encodeURIComponent(plan.name)}`)

        } catch (err: any) {
            setSubscriptionError(err.message)
        } finally {
            setIsCreatingSubscription(null)
        }
    }

    return (
        <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white relative overflow-hidden">
            <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <header className="relative z-10 px-8 pt-12 pb-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <button
                    onClick={() => router.back()}
                    className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center hover:bg-[#E1784F] hover:text-white transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black italic tracking-tighter uppercase">Subscription <span className="text-[#E1784F]">Plans</span></h1>
                <div className="w-12" />
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 pb-32">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                        Choose Your <br /><span className="text-[#E1784F]">Wellness Journey</span>
                    </h2>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-40 max-w-md mx-auto">
                        Unlock the full potential of Afridam AI with our tailored subscription tiers.
                    </p>
                </div>

                {subscriptionError && (
                    <div className="text-center mb-8 p-4 bg-red-500/10 rounded-xl">
                        <p className="text-red-500 font-bold">{subscriptionError}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center space-y-4">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#E1784F]" />
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">Loading plans...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center space-y-4 max-w-md">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                                <X className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60">{error}</p>
                            <button
                                onClick={fetchPricingPlans}
                                className="px-6 py-3 rounded-2xl bg-[#E1784F] text-white font-black uppercase text-xs tracking-widest hover:bg-[#d16a3f] transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="overflow-x-auto overflow-y-visible pb-8 -mx-8 px-8 scrollbar-hide">
                            <div className="flex gap-8 min-w-max md:min-w-0 md:grid md:grid-cols-3 md:gap-8">
                                {plans.map((plan, idx) => (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`relative p-8 md:p-10 rounded-[3rem] ${plan.color} ${plan.textColor} shadow-2xl flex flex-col h-full min-w-[320px] md:min-w-0`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                                                Most Popular
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                                <plan.icon size={28} />
                                            </div>
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{plan.name}</h3>
                                            <div className="mt-4 flex items-baseline">
                                                <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                                                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest opacity-60">{plan.period}</span>
                                            </div>
                                            <div className="mt-4 space-y-1">
                                                {Array.isArray(plan.description) ? (
                                                    plan.description.map((desc, i) => (
                                                        <p key={i} className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                                                            {desc}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                                                        {plan.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 mb-10">
                                            {plan.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <Check size={14} strokeWidth={3} className="shrink-0 mt-0.5 opacity-80" />
                                                    <span className="text-xs font-bold leading-relaxed">{feature}</span>
                                                </div>
                                            ))}
                                            {plan.notIncluded && plan.notIncluded.length > 0 && plan.notIncluded.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3 opacity-40">
                                                    <X size={14} strokeWidth={3} className="shrink-0 mt-0.5" />
                                                    <span className="text-xs font-bold leading-relaxed line-through">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handleChoosePlan(plan)}
                                            disabled={isCreatingSubscription === plan.id}
                                            className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all ${plan.buttonColor} disabled:opacity-50`}
                                        >
                                            {isCreatingSubscription === plan.id ? (
                                                <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                                            ) : (
                                                `Choose ${plan.name}`
                                            )}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {plans.length > 1 && (
                            <div className="md:hidden flex justify-center gap-2 mt-6">
                                {plans.map((_, idx) => (
                                    <div key={idx} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}

