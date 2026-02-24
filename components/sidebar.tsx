"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
    Scan, MessageSquare, History,
    Settings, Home, ShoppingBag, FlaskConical
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useSubscription } from "@/hooks/use-subscription"
import { SubscriptionModal } from "@/components/subscription-modal"

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { user } = useAuth() as any
    const { isFreeTier } = useSubscription()
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

    if (!user) return null

    const firstName = user?.firstName || user?.displayName?.split(' ')[0] || "User"
    const initials = user
        ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || user.firstName?.charAt(1) || ''}`.toUpperCase()
        : "A"

    const handleSpecialistClick = () => {
        if (isFreeTier()) {
            setShowSubscriptionModal(true)
        } else {
            router.push('/specialist')
        }
    }

    const SidebarItem = ({ icon: Icon, label, path, onClick }: any) => {
        const isActive = pathname === path || (path !== '/dashboard' && pathname.startsWith(path))

        return (
            <button
                onClick={onClick || (() => router.push(path))}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all rounded-2xl group ${isActive
                        ? 'opacity-100 bg-[#E1784F]/5 text-[#E1784F]'
                        : 'opacity-40 hover:opacity-100'
                    }`}
            >
                <Icon size={20} className={`${isActive ? 'text-[#E1784F]' : 'group-hover:text-[#E1784F]'} transition-colors`} />
                <span className="capitalize tracking-widest text-xs">{label}</span>
            </button>
        )
    }

    return (
        <aside className="hidden lg:flex flex-col w-72 border-r border-gray-100 dark:border-white/10 h-screen sticky top-0 p-8 space-y-10 z-[110] bg-white dark:bg-[#050505] shrink-0">
            <div className="px-4 text-left">
                <h1 className="text-xl font-black italic tracking-tighter uppercase">AFRIDAM <span className="text-[#E1784F]">AI</span></h1>
            </div>
            <nav className="flex-1 space-y-1">
                <SidebarItem icon={Home} label="Home Hub" path="/dashboard" />
                <SidebarItem icon={Scan} label="AI Scanner" path="/ai-scanner" />
                <SidebarItem icon={MessageSquare} label="Specialists" path="/specialist" onClick={handleSpecialistClick} />
                <SidebarItem icon={ShoppingBag} label="Market Place" path="/marketplace" />
                <SidebarItem icon={History} label="Clinical Diary" path="/history" />
                <SidebarItem icon={Settings} label="Settings" path="/settings" />
            </nav>
            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E1784F] flex items-center justify-center text-white text-[11px] font-black italic shadow-lg">
                        {initials}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tight truncate">{firstName}</span>
                </div>
                <div className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] text-center">
                    {user?.plan?.name || 'Free Plan'}
                </div>
            </div>

            {/* Subscription Modal for Free Tier Users */}
            <SubscriptionModal 
                isOpen={showSubscriptionModal} 
                onClose={() => setShowSubscriptionModal(false)} 
            />
        </aside>
    )
}
