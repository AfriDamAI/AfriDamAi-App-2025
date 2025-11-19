"use client"

import { useState } from "react"
import { X, Calendar, MessageCircle, Heart, AlertCircle, User, Users } from 'lucide-react'
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { TreatmentRoutine } from "./treatment-routine"
import { AppointmentBooking } from "./appointment-booking"
import { HealthIndicator } from "./health-indicator"

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const { user, updateUserProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "routine" | "appointment">("overview")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<string[]>([])

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment])
      setComment("")
    }
  }

  if (!user) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-96 bg-background border-l border-border z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">My Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">{user.fullName.charAt(0).toUpperCase()}</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">ID: {user.id}</p>
          </div>

          {/* Health Indicators */}
          <HealthIndicator
            label="Skin Type"
            value={user.skinType.charAt(0).toUpperCase() + user.skinType.slice(1)}
            color="blue"
          />

          {/* User Information Cards */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground font-medium">Sex</p>
                <p className="text-sm font-semibold text-foreground capitalize">{user.sex}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground font-medium">Member Since</p>
                <p className="text-sm font-semibold text-foreground">{new Date(user.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Skin History */}
          {user.skinHistory.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Skin History
              </h4>
              <div className="space-y-2">
                {user.skinHistory.map((history, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground">{history.condition}</p>
                    <p className="text-xs text-muted-foreground">{history.date} • {history.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Known Allergies */}
          {user.knownAllergies.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Known Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.knownAllergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs rounded-full"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Previous Treatments */}
          {user.previousTreatments.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                Previous Treatments
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.previousTreatments.map((treatment, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full"
                  >
                    {treatment}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-t border-border pt-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-orange-600 text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("routine")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "routine"
                    ? "bg-orange-600 text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Routine
              </button>
              <button
                onClick={() => setActiveTab("appointment")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "appointment"
                    ? "bg-orange-600 text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Appointment
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Add Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add personal notes or observations..."
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Submit Comment
                  </Button>
                </div>

                {comments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Recent Comments</p>
                    {comments.map((c, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground">{c}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "routine" && <TreatmentRoutine />}

            {activeTab === "appointment" && <AppointmentBooking />}
          </div>
        </div>
      </div>
    </>
  )
}
