"use client"

import type React from "react"

import { useState } from "react"
import { Clock, AlertCircle } from "lucide-react"

interface TabSectionProps {
    tabs: string[]
    activeTab: string
    onTabChange: (tab: string) => void
    comment: string
    onCommentChange: (comment: string) => void
    onSubmitComment: () => void
}

export default function TabSection({
    tabs,
    activeTab,
    onTabChange,
    comment,
    onCommentChange,
    onSubmitComment,
}: TabSectionProps) {
    const [appointmentForm, setAppointmentForm] = useState({
        date: "",
        time: "",
        reason: "",
    })

    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

    const morningRoutine = [
        {
            step: 1,
            name: "Gentle Cleanser",
            duration: "2 min",
            description: "Remove overnight oils and impurities",
        },
        {
            step: 2,
            name: "Vitamin C Serum",
            duration: "1 min",
            description: "Antioxidant protection and brightening",
        },
        {
            step: 3,
            name: "Moisturizer",
            duration: "2 min",
            description: "Hydrate and protect skin barrier",
        },
        {
            step: 4,
            name: "SPF 50 Sunscreen",
            duration: "2 min",
            description: "Essential UV protection",
        },
    ]

    const eveningRoutine = [
        {
            step: 1,
            name: "Makeup Remover",
            duration: "3 min",
            description: "Gently remove makeup and sunscreen",
        },
        {
            step: 2,
            name: "Gentle Cleanser",
            duration: "2 min",
            description: "Deep cleanse pores",
        },
        {
            step: 3,
            name: "Retinol Treatment",
            duration: "1 min",
            description: "Anti-aging and cell renewal (3x weekly)",
        },
        {
            step: 4,
            name: "Night Moisturizer",
            duration: "2 min",
            description: "Rich hydration and repair overnight",
        },
    ]

    const recommendedProducts = [
        { name: "Cleanser", benefit: "Gentle, pH-balanced" },
        { name: "Toner", benefit: "Balancing hydration" },
        { name: "Serum", benefit: "Targeted treatment" },
        { name: "Moisturizer", benefit: "Barrier protection" },
        { name: "Sunscreen", benefit: "UV defense" },
        { name: "Retinol", benefit: "Anti-aging" },
    ]

    const handleAppointmentChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setAppointmentForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleRequestAppointment = () => {
        console.log("Appointment requested:", appointmentForm)
        setAppointmentForm({ date: "", time: "", reason: "" })
    }

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 px-6 py-4 font-medium transition-colors text-center whitespace-nowrap ${activeTab === tab
                            ? "bg-primary/10 text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === "Overview" && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Your Skin Overview</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Track your skin health journey and monitor improvements over time. All your treatment history and current
                            conditions are logged here for your skincare professionals to reference.
                        </p>
                    </div>
                )}

                {activeTab === "Routine" && (
                    <div className="space-y-8">
                        {/* Morning Routine */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-4 text-lg">Morning Routine</h3>
                            <div className="space-y-3">
                                {morningRoutine.map((item) => (
                                    <div
                                        key={item.step}
                                        className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                                            <Clock className="w-4 h-4" />
                                            {item.duration}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Evening Routine */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-4 text-lg">Evening Routine</h3>
                            <div className="space-y-3">
                                {eveningRoutine.map((item) => (
                                    <div
                                        key={item.step}
                                        className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                                            <Clock className="w-4 h-4" />
                                            {item.duration}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommended Products */}
                        <div>
                            <h3 className="font-semibold text-foreground mb-4 text-lg">Recommended Products</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {recommendedProducts.map((product) => (
                                    <div key={product.name} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                        <p className="font-medium text-foreground text-sm">{product.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{product.benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Appointment" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-foreground mb-4 text-lg">Request an Appointment</h3>
                            <form className="space-y-5">
                                {/* Preferred Date */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Preferred Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={appointmentForm.date}
                                        onChange={handleAppointmentChange}
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                {/* Preferred Time */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Preferred Time</label>
                                    <select
                                        name="time"
                                        value={appointmentForm.time}
                                        onChange={handleAppointmentChange}
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">Select a time</option>
                                        {timeSlots.map((slot) => (
                                            <option key={slot} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reason for Appointment */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Reason for Appointment</label>
                                    <textarea
                                        name="reason"
                                        value={appointmentForm.reason}
                                        onChange={handleAppointmentChange}
                                        placeholder="Describe the reason for your appointment..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="button"
                                    onClick={handleRequestAppointment}
                                    className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Request Appointment
                                </button>
                            </form>

                            {/* Info Message */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">
                                    A licensed dermatologist will review your request and confirm the appointment via email within 24
                                    hours.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Comment Section */}
            <div className="border-t border-border p-6 bg-muted/30">
                <h3 className="font-semibold text-foreground mb-4">Add Personal Notes</h3>
                <div className="space-y-3">
                    <textarea
                        value={comment}
                        onChange={(e) => onCommentChange(e.target.value)}
                        placeholder="Add personal notes or observations..."
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        rows={3}
                    />
                    <button
                        onClick={onSubmitComment}
                        className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Submit Comment
                    </button>
                </div>
            </div>
        </div>
    )
}
