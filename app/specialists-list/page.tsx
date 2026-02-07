"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, MessageSquare, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getAllSpecialists, initiateChat } from "@/lib/api-client"

interface Specialist {
  id: string
  firstName: string
  lastName: string
  email: string
  specialization?: string
  bio?: string
}

export default function SpecialistsListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [creatingChat, setCreatingChat] = useState<string | null>(null)

  useEffect(() => {
    fetchSpecialists()
  }, [])

  const fetchSpecialists = async () => {
    try {
      const data = await getAllSpecialists()
      setSpecialists(data)
    } catch (err) {
      console.error("Error fetching specialists:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSpecialist = (specialistId: string) => {
    router.push(`/specialists-list/${specialistId}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#4DB6AC] hover:gap-3 transition-all mb-6"
          >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm uppercase tracking-wider">Back</span>
          </button>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8]">
            Select <br />
            <span className="text-[#4DB6AC]">Specialist</span>
          </h1>
          <p className="text-sm opacity-50 mt-4 font-bold uppercase tracking-wide">
            Choose a specialist to start a conversation
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#4DB6AC]" />
          </div>
        ) : specialists.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No specialists available at the moment</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((specialist) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 hover:border-[#4DB6AC] transition-all"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {specialist.firstName[0]}{specialist.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {specialist.firstName} {specialist.lastName}
                    </h3>
                    {specialist.specialization && (
                      <p className="text-xs text-[#4DB6AC] font-semibold uppercase tracking-wider mt-1">
                        {specialist.specialization}
                      </p>
                    )}
                  </div>
                  {specialist.bio && (
                    <p className="text-sm opacity-60 line-clamp-2">{specialist.bio}</p>
                  )}
                  <button
                    onClick={() => handleSelectSpecialist(specialist.id)}
                    className="w-full bg-[#4DB6AC] text-white py-3 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-[#4DB6AC]/90 flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare size={16} />
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
