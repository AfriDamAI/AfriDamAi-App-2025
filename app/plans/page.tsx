"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, X, ArrowLeft, Star, Zap, Crown } from "lucide-react"

export default function PlansPage() {
    const router = useRouter()

    const plans = [
        {
            name: "Standard",
            price: "$3",
            period: "/month",
            description: "Essential features for casual users",
            features: [
                "3 AI Skin Scans per month",
                "Basic Skin Analysis",
                "Community Access",
                "Standard Support"
            ],
            notIncluded: [
                "Priority Specialist Review",
                "Detailed Ingredient Analysis",
                "Progress Tracking"
            ],
            icon: Star,
            color: "bg-gray-100 dark:bg-zinc-800",
            textColor: "text-black dark:text-white",
            buttonColor: "bg-black dark:bg-white text-white dark:text-black",
            popular: false
        },
        {
            name: "Premium",
            price: "$15",
            period: "/month",
            description: "Enhanced features for regular care",
            features: [
                "Unlimited AI Skin Scans",
                "Detailed Ingredient Analysis",
                "Monthly Progress Report",
                "Priority Specialist Review (1/mo)",
                "Ad-free Experience"
            ],
            notIncluded: [
                "24/7 Dermatologist Chat"
            ],
            icon: Zap,
            color: "bg-[#E1784F]",
            textColor: "text-white",
            buttonColor: "bg-white text-[#E1784F]",
            popular: true
        },
        {
            name: "Ultimate",
            price: "$30",
            period: "/month",
            description: "Complete care and priority access",
            features: [
                "Everything in Premium",
                "Unlimited Specialist Reviews",
                "24/7 Dermatologist Chat",
                "Personalized Routine Builder",
                "Family Account (up to 3)"
            ],
            notIncluded: [],
            icon: Crown,
            color: "bg-black dark:bg-white",
            textColor: "text-white dark:text-black",
            buttonColor: "bg-[#E1784F] text-white",
            popular: false
        }
    ]

    return (
        <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white relative overflow-hidden">
            <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Header */}
            <header className="relative z-10 px-8 pt-12 pb-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                <button
                    onClick={() => router.back()}
                    className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center hover:bg-[#E1784F] hover:text-white transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black italic tracking-tighter uppercase">Subscription <span className="text-[#E1784F]">Plans</span></h1>
                <div className="w-12" /> {/* Spacer */}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative p-8 md:p-10 rounded-[3rem] ${plan.color} ${plan.textColor} shadow-2xl flex flex-col h-full`}
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
                                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest opacity-60">{plan.period}</span>
                                </div>
                                <p className="mt-4 text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="flex-1 space-y-4 mb-10">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check size={14} strokeWidth={3} className="shrink-0 mt-0.5 opacity-80" />
                                        <span className="text-xs font-bold leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 opacity-40">
                                        <X size={14} strokeWidth={3} className="shrink-0 mt-0.5" />
                                        <span className="text-xs font-bold leading-relaxed line-through">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all ${plan.buttonColor}`}>
                                Choose {plan.name}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    )
}
