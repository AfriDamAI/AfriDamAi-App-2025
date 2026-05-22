"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Scan, Zap, User as UserIcon, ShoppingBag, MessageSquare } from "lucide-react"
import { useState } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { SubscriptionModal } from "@/components/subscription-modal"

export function MobileNav() {
    const router = useRouter()
    const pathname = usePathname()
    const { isFreeTier } = useSubscription()
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

    const isActive = (path: string) => {
        return pathname === path || (path !== '/dashboard' && pathname.startsWith(path))
    }

    const NavItem = ({ icon: Icon, label, path, onClick }: { icon: any, label: string, path?: string, onClick?: () => void }) => {
        const active = path ? isActive(path) : false
        return (
            <button
                onClick={onClick || (() => path && router.push(path))}
                className={`h-11 w-11 flex items-center justify-center rounded-2xl transition-all ${active ? 'text-[#E1784F] scale-105 bg-[#E1784F]/10' : 'opacity-35 hover:opacity-70'}`}
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
            router.push('/specialist')
        }
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 min-h-16 bg-white/85 dark:bg-black/85 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 flex justify-around items-center px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden z-[9999] pointer-events-auto">
                <NavItem icon={Home} label="Dashboard" path="/dashboard" />
                <NavItem icon={Scan} label="AI Scanner" path="/ai-scanner" />
                <NavItem icon={MessageSquare} label="Specialists" path="/specialist" onClick={handleSpecialistClick} />
                <NavItem icon={ShoppingBag} label="Marketplace" path="/marketplace" />
                <NavItem icon={Zap} label="History" path="/history" />
                <NavItem icon={UserIcon} label="Profile" path="/profile" />
            </div>

            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
            />
        </>
    )
}
