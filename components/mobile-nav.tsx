"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Scan, Zap, User as UserIcon, ShoppingBag, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { SubscriptionModal } from "@/components/subscription-modal"

export function MobileNav() {
    const router = useRouter()
    const pathname = usePathname()
    const { isFreeTier } = useSubscription()
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
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

    const NavItem = ({ icon: Icon, path, onClick }: { icon: any, path?: string, onClick?: () => void }) => {
        const active = path ? isActive(path) : false
        return (
            <button
                onClick={onClick || (() => path && navigate(path))}
                className={`p-4 transition-all ${active ? 'text-[#E1784F] scale-110' : 'opacity-20 hover:opacity-50'}`}
            >
                <Icon size={26} />
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

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 flex justify-around items-center px-10 lg:hidden z-[9999] pb-6 pointer-events-auto">
                <NavItem icon={Home} path="/dashboard" />
                <NavItem icon={Scan} path="/ai-scanner" />
                <NavItem icon={MessageSquare} path="/specialist" onClick={handleSpecialistClick} />
                <NavItem icon={ShoppingBag} path="/marketplace" />
                {/* <NavItem icon={Zap} path="/history" /> */}
                {/* <NavItem icon={UserIcon} path="/profile" /> */}
            </div>

            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
            />
        </>
    )
}
