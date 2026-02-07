"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Scan, Zap, User as UserIcon, ShoppingBag, FlaskConical } from "lucide-react"

export function MobileNav() {
    const router = useRouter()
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/')
    }

    const NavItem = ({ icon: Icon, path }: { icon: any, path: string }) => {
        const active = isActive(path)
        return (
            <button
                onClick={() => router.push(path)}
                className={`p-4 transition-all ${active ? 'text-[#E1784F] scale-110' : 'opacity-20 hover:opacity-50'}`}
            >
                <Icon size={26} />
            </button>
        )
    }

    return (
        //nothing to see here
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 flex justify-around items-center px-10 lg:hidden z-[9999] pb-6 pointer-events-auto">
            <NavItem icon={Home} path="/dashboard" />
            <NavItem icon={Scan} path="/ai-scanner" />
            <NavItem icon={FlaskConical} path="/ingredient-analyzer" />
            <NavItem icon={ShoppingBag} path="/marketplace" />
            <NavItem icon={Zap} path="/history" />
            <NavItem icon={UserIcon} path="/profile" />
        </div>
    )
}
