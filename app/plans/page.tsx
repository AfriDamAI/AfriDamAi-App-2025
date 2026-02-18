"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PricingList } from "@/components/pricing-list"

export default function PlansPage() {
    const router = useRouter()

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

                {/* Pricing List Component */}
                <PricingList />
            </div>
        </main>
    )
}
