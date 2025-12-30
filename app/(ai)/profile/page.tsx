"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { EditProfileForm } from "@/components/edit-profile-form";

const TABS = ["Overview", "Routine", "Appointment", "Edit Profile"]

export default function ProfilePage() {
    const { user, isSignedIn } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("Overview")

    useEffect(() => {
        if (!isSignedIn) {
            router.push("/(auth)/login")
        }
    }, [isSignedIn, router])

        if (!user) {

            return <div>Loading...</div>

        }

    

    const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.email || "User");

    const stats = [
        { label: "Skin Health", value: "85%", icon: "✨", color: "text-emerald-500" },
        { label: "Routine Streak", value: "12 Days", icon: "🔥", color: "text-orange-500" },
        { label: "Consultations", value: "3", icon: "📅", color: "text-blue-500" },
        { label: "Points", value: "450", icon: "💎", color: "text-purple-500" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header / Cover Area */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 pb-20">
                <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-primary to-accent p-1.5 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="w-full h-full rounded-[1.2rem] bg-card flex items-center justify-center overflow-hidden">
                                        <span className="text-4xl md:text-5xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                                            {(displayName).charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-card rounded-full flex items-center justify-center text-white" title="Active Account">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left pt-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">{displayName}</h1>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                                        Premium Member
                                    </span>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        {user.email}
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-border md:block hidden" />
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.33 0 4 1 4 4v2H7v-2c0-3 2.67-4 4-4z"></path></svg>
                                        ID: {user.id.substring(0, 8)}...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-muted/30 hover:bg-muted/50 transition-colors p-4 rounded-2xl border border-border group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                                        <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="px-6 md:px-10 border-t border-border bg-muted/20">
                        <nav className="flex overflow-x-auto no-scrollbar gap-2 py-4">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                        activeTab === tab
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                    {activeTab === 'Edit Profile' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <EditProfileForm />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Detailed Info Cards */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                        Core Profile
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="group">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Skin Type</p>
                                            <p className="text-lg font-bold text-foreground">{user.profile?.skinType || "Not set"}</p>
                                        </div>
                                        <div className="w-full h-px bg-border" />
                                        <div className="group">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Biological Sex</p>
                                            <p className="text-lg font-bold text-foreground capitalize">{user.sex || "Not set"}</p>
                                        </div>
                                        <div className="w-full h-px bg-border" />
                                        <div className="group">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Member Status</p>
                                            <p className="text-lg font-bold text-foreground">{user.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}` : "New Member"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        </div>
                                        Known Allergies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.profile?.knownSkinAllergies && user.profile.knownSkinAllergies.length > 0 ? (
                                            user.profile.knownSkinAllergies.map((allergy, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-xl border border-rose-100 dark:border-rose-900/50">
                                                    {allergy}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">No health alerts reported</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-8">
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.428 1.428a2 2 0 001.022.547l2.387.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-.547-1.022l-1.428-1.428z"></path></svg>
                                        </div>
                                        Clinical History & Treatments
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {user.profile?.previousTreatments && user.profile.previousTreatments.length > 0 ? (
                                            user.profile.previousTreatments.map((treatment, idx) => (
                                                <div key={idx} className="p-6 bg-muted/30 hover:bg-muted/50 transition-colors border border-border rounded-2xl">
                                                    <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-600 mb-4">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                    <p className="font-bold text-foreground text-lg mb-1">{treatment}</p>
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed Treatment</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="sm:col-span-2 text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl">
                                                <p className="text-muted-foreground font-medium">No treatment records found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Personalized Recommendations Card */}
                                <div className="bg-gradient-to-br from-primary via-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M11 15h2v2h-2v-2m0-8h2v6h-2V7m1-5C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-2xl font-black mb-2 italic">Ready for your next scan?</h4>
                                        <p className="text-white/80 font-medium mb-6 max-w-md">Our AI is ready to analyze your skin progress. Regular scans help us tune your routine for faster results.</p>
                                        <button className="px-8 py-3 bg-white text-primary font-black rounded-xl hover:bg-orange-50 transition-colors shadow-lg shadow-black/10 uppercase tracking-widest text-sm">
                                            Start AI Analysis
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

    
