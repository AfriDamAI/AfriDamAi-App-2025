"use client"

import { useState } from "react"
import TabSection from "@/components/profile-tab-section"

const PROFILE_DATA = {
    name: "Ijakinhy",
    email: "ijakinhy@gmail.com",
    userId: "user_02do9r1dr",
    skinType: "Combination",
    gender: "Female",
    memberSince: "20/11/2025",
    skinHistory: [
        { condition: "Acne", date: "2024-11-01", status: "Treated" },
        { condition: "Hyperpigmentation", date: "2024-10-15", status: "Improving" },
    ],
    allergies: ["Fragrance", "Parabens"],
    treatments: ["Retinol", "Chemical Peels", "Laser Therapy"],
}

const TABS = ["Overview", "Routine", "Appointment"]

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("Overview")
    const [comment, setComment] = useState("")

    const handleAddComment = () => {
        if (comment.trim()) {
            console.log("Comment added:", comment)
            setComment("")
        }
    }

    const statusColors: Record<string, string> = {
        Treated: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        Improving: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Header Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-2xl" />

                    <div className="relative bg-card border border-border rounded-2xl p-8 md:p-10">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl font-bold text-primary-foreground">{PROFILE_DATA.name.charAt(0).toUpperCase()}</span>
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{PROFILE_DATA.name}</h1>
                                <p className="text-muted-foreground mb-1">{PROFILE_DATA.email}</p>
                                <p className="text-sm text-muted-foreground">ID: {PROFILE_DATA.userId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Left Column - Profile Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                            <div className="border-b border-border pb-4">
                                <h2 className="text-lg font-semibold text-foreground">Profile Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-muted-foreground text-sm font-medium">Skin Type</span>
                                    <span className="font-semibold text-foreground text-right">{PROFILE_DATA.skinType}</span>
                                </div>

                                <div className="h-px bg-border" />

                                <div className="flex justify-between items-start">
                                    <span className="text-muted-foreground text-sm font-medium">Gender</span>
                                    <span className="font-semibold text-foreground">{PROFILE_DATA.gender}</span>
                                </div>

                                <div className="h-px bg-border" />

                                <div className="flex justify-between items-start">
                                    <span className="text-muted-foreground text-sm font-medium">Member Since</span>
                                    <span className="font-semibold text-foreground">{PROFILE_DATA.memberSince}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-6">
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">⚠️ Known Allergies</h2>
                            </div>

                            <div className="space-y-2">
                                {PROFILE_DATA.allergies.map((allergy, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                        <span className="font-medium text-foreground">{allergy}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Health & Treatment */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-foreground">Skin History</h2>
                                <p className="text-sm text-muted-foreground">Recent skin conditions and treatments</p>
                            </div>

                            <div className="space-y-3">
                                {PROFILE_DATA.skinHistory.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border border-border hover:bg-muted/60 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{item.condition}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-foreground">Previous Treatments</h2>
                                <p className="text-sm text-muted-foreground">Procedures and treatments you have tried</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {PROFILE_DATA.treatments.map((treatment, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
                                    >
                                        <p className="font-semibold text-foreground text-center">{treatment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tab Section */}
                        <TabSection
                            tabs={TABS}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            comment={comment}
                            onCommentChange={setComment}
                            onSubmitComment={handleAddComment}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
