"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, MessageSquare, Loader2, Mail, Phone, Award, Calendar } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getSpecialistById, initiateChat } from "@/lib/api-client"

interface Specialist {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNo?: string
  sex?: string
  status?: string
  documents?: any[]
  createdAt?: string
  updatedAt?: string
}

export default function SpecialistDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [specialist, setSpecialist] = useState<Specialist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [creatingChat, setCreatingChat] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchSpecialist(params.id as string)
    }
  }, [params.id])

  const fetchSpecialist = async (id: string) => {
    try {
      const data = await getSpecialistById(id)
      setSpecialist(data)
    } catch (err) {
      console.error("Error fetching specialist:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartChat = async () => {
    if (!user?.id || !specialist?.id) return
    
    setCreatingChat(true)
    try {
      await initiateChat(user.id, specialist.id)
      router.push("/specialist")
    } catch (err) {
      console.error("Error creating chat:", err)
    } finally {
      setCreatingChat(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#4DB6AC]" />
      </div>
    )
  }

  if (!specialist) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <p className="text-gray-500">Specialist not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#4DB6AC] hover:gap-3 transition-all mb-10"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm uppercase tracking-wider">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4DB6AC] to-[#E1784F] flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              {specialist.firstName[0]}{specialist.lastName[0]}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-5xl font-black italic uppercase leading-tight">
                  {specialist.firstName} {specialist.lastName}
                </h1>
                {specialist.status && (
                  <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    specialist.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {specialist.status}
                  </span>
                )}
              </div>
              <button
                onClick={handleStartChat}
                disabled={creatingChat}
                className="bg-[#4DB6AC] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-[#4DB6AC]/90 disabled:opacity-50 flex items-center gap-3 mx-auto md:mx-0 transition-all shadow-lg"
              >
                {creatingChat ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <MessageSquare size={20} />
                    Start Consultation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-[#4DB6AC]" size={20} />
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-50 font-bold">Email</p>
                  <p className="font-semibold">{specialist.email}</p>
                </div>
              </div>
            </div>

            {specialist.phoneNo && (
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-[#4DB6AC]" size={20} />
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-50 font-bold">Phone</p>
                    <p className="font-semibold">{specialist.phoneNo}</p>
                  </div>
                </div>
              </div>
            )}

            {specialist.sex && (
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="text-[#4DB6AC]" size={20} />
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-50 font-bold">Gender</p>
                    <p className="font-semibold">{specialist.sex}</p>
                  </div>
                </div>
              </div>
            )}

            {specialist.createdAt && (
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#4DB6AC]" size={20} />
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-50 font-bold">Member Since</p>
                    <p className="font-semibold">{new Date(specialist.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Documents Section */}
          {specialist.documents && specialist.documents.length > 0 && (
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold uppercase tracking-wider mb-4">Credentials</h3>
              <div className="space-y-2">
                {specialist.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Award size={16} className="text-[#4DB6AC]" />
                    <span>{doc.type || 'Document'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
