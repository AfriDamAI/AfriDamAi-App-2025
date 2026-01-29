"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function TransactionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()

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
                <h1 className="text-xl font-black italic tracking-tighter uppercase">Confirm <span className="text-[#E1784F]">Payment</span></h1>
                <div className="w-12" /> {/* Spacer */}
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-10 pb-32">
                {children}
            </div>
        </main>
    )
}
