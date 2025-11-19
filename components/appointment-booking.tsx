"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from 'lucide-react'

export function AppointmentBooking() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.date && formData.time && formData.reason) {
      setSubmitted(true)
      setTimeout(() => {
        setFormData({ date: "", time: "", reason: "" })
        setSubmitted(false)
      }, 3000)
    }
  }

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm">
          Appointment request submitted! Our dermatologist will confirm shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Preferred Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Preferred Time
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a time</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Reason for Appointment
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Describe your concern or reason for the appointment..."
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            required
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Request Appointment
        </Button>
      </form>

      <div className="p-3 bg-muted rounded-lg">
        <p className="text-xs font-medium text-foreground mb-2">Info</p>
        <p className="text-xs text-muted-foreground">
          A licensed dermatologist will review your request and confirm the appointment via email within 24 hours.
        </p>
      </div>
    </div>
  )
}
