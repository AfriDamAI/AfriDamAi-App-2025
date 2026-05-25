"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Scan, ShoppingBag, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { useAuth } from "@/providers/auth-provider"
import { SubscriptionModal } from "@/components/subscription-modal"
import { MobileAccountSheet } from "@/components/mobile-account-sheet"

export function MobileNav() {
    const router = useRouter()
    const pathname = usePathname()
    const { isFreeTier } = useSubscription()
    const { user } = useAuth()
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
    const [showAccountSheet, setShowAccountSheet] = useState(false)
    const [navigatingTo, setNavigatingTo] = useState<string | null>(null)

    useEffect(() => {
        if (navigatingTo && pathname === navigatingTo) {
            setNavigatingTo(null)
        }
    }, [pathname, navigatingTo])

    const isActive = (path: string) => {
        const currentPath = navigatingTo || pathname
        return currentPath === path || (path !== '/dashboard' && currentPath.startsWith(path))
    }

    const navigate = (path: string) => {
        setNavigatingTo(path)
        setShowSubscriptionModal(false)
        router.push(path)
    }

    const NavItem = ({ icon: Icon, label, path, onClick }: { icon: any, label: string, path?: string, onClick?: () => void }) => {
        const active = path ? isActive(path) : false
        return (
            <button
                onClick={onClick || (() => path && navigate(path))}
                className={`h-11 min-h-11 w-11 min-w-11 flex items-center justify-center rounded-2xl transition-all ${active ? 'text-[#E1784F] scale-105 bg-[#E1784F]/10' : 'opacity-35 hover:opacity-70'}`}
                aria-label={label}
                title={label}
            >
                <Icon size={21} />
            </button>
        )
    }

    const handleSpecialistClick = () => {
        if (isFreeTier()) {
            setShowSubscriptionModal(true)
        } else {
            navigate('/specialist')
        }
    }

    const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 min-h-16 bg-white/85 dark:bg-black/85 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 flex justify-around items-center px-1 min-[420px]:px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden z-[9999] pointer-events-auto">
                <NavItem icon={Home} label="Dashboard" path="/dashboard" />
                <NavItem icon={MessageSquare} label="Specialists" path="/specialist" onClick={handleSpecialistClick} />

                {/* 🎯 Center anchor — the AI Scanner is the primary action */}
                <button
                    onClick={() => navigate('/ai-scanner')}
                    aria-label="AI Scanner"
                    title="AI Scanner"
                    className={`flex items-center justify-center w-12 min-w-12 h-12 min-h-12 rounded-2xl transition-all active:scale-95 ${isActive('/ai-scanner') ? 'bg-[#E1784F] text-white shadow-md shadow-[#E1784F]/30' : 'bg-[#E1784F]/10 text-[#E1784F] hover:bg-[#E1784F]/20'}`}
                >
                    <Scan size={24} />
                </button>

                <NavItem icon={ShoppingBag} label="Marketplace" path="/marketplace" />
                <button
                    onClick={() => setShowAccountSheet(true)}
                    aria-label="Account menu"
                    title="Account menu"
                    className={`h-11 min-h-11 w-11 min-w-11 flex items-center justify-center rounded-2xl transition-all ${showAccountSheet ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-xl text-[11px] font-black italic text-white shadow-lg transition-colors ${showAccountSheet ? 'bg-[#E1784F]' : 'bg-[#E1784F]/80'}`}>
                        {initials}
                    </span>
                </button>
            </div>

            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
            />

            <MobileAccountSheet
                isOpen={showAccountSheet}
                onClose={() => setShowAccountSheet(false)}
            />
        </>
    )
}
