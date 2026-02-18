"use client"

import { useRouter, usePathname } from "next/navigation"
import {
    Scan, MessageSquare, History,
    Settings, Home, ShoppingBag, FlaskConical,
    Sparkles
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getImageUrl } from "@/lib/api-client"

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { user } = useAuth() as any

    if (!user) return null

    const firstName = user?.firstName || user?.displayName?.split(' ')[0] || "User"
    const initials = user
        ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || user.firstName?.charAt(1) || ''}`.toUpperCase()
        : "A"

    const SidebarItem = ({ icon: Icon, label, path }: any) => {
        const isActive = pathname === path || (path !== '/dashboard' && pathname.startsWith(path))

        return (
            <button
                onClick={() => router.push(path)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all rounded-2xl group ${isActive
                        ? 'opacity-100 bg-[#E1784F]/5 text-[#E1784F]'
                        : 'opacity-40 hover:opacity-100'
                    }`}
            >
                <Icon size={20} className={`${isActive ? 'text-[#E1784F]' : 'group-hover:text-[#E1784F]'} transition-colors`} />
                <span className="uppercase tracking-widest text-[10px]">{label}</span>
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
                <SidebarItem icon={Sparkles} label="Premium plans" path="/plans" />
                <SidebarItem icon={MessageSquare} label="Specialists" path="/specialist" />
                <SidebarItem icon={ShoppingBag} label="Market Place" path="/marketplace" />
                <SidebarItem icon={History} label="Clinical Diary" path="/history" />
                <SidebarItem icon={Settings} label="Settings" path="/settings" />
            </nav>
            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E1784F] flex items-center justify-center text-white text-[11px] font-black italic shadow-lg overflow-hidden">
                        {user?.profile?.avatarUrl ? (
                            <img 
                                src={getImageUrl(user.profile.avatarUrl)!} 
                                alt={firstName} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tight truncate">{firstName}</span>
                </div>
                <button onClick={() => router.push('/profile')} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all">
                    Manage Profile
                </button>
            </div>
        </aside>
    )
}
