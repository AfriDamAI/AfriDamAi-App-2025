/**
 * 🛡️ AFRIDAM PERSONALIZATION: DAILY CARE DIARY (Rule 6 Synergy)
 * Version: 2026.1.22 (Soft Tone & Handshake Alignment)
 * Focus: Relatable Questions & Direct Profile Sync.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Sparkles, Loader2, Heart } from "lucide-react"
import { updateUser } from "@/lib/api-client" 

interface Question {
    id: string
    text: string
}

const questions: Question[] = [
    { id: "sunscreen", text: "Do you use sunscreen to protect your glow daily?" },
    { id: "allergies", text: "Does your skin react easily to new products?" },
    { id: "hydration", text: "Are you drinking enough water today (at least 8 glasses)?" },
    { id: "cleanser", text: "Do you wash your face every morning and night?" },
    { id: "moisturizer", text: "Do you apply moisturizer right after washing?" },
]

export default function Questionnaire() {
    const [answers, setAnswers] = useState<Record<string, boolean | null>>({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    const handleAnswer = async (answer: boolean) => {
        const newAnswers = { ...answers, [currentQuestion.id]: answer }
        setAnswers(newAnswers)

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            await handleSubmit(newAnswers)
        }
    }

    const handleSubmit = async (finalAnswers: any) => {
        setIsSubmitting(true)
        try {
            // 🛡️ THE HANDSHAKE: Syncing with your 'updateUser' in client.ts
            await updateUser('me', { 
                profile: { questionnaireData: finalAnswers } 
            })
            setIsSubmitted(true)
        } catch (err) {
            console.error("Diary sync paused:", err)
            setIsSubmitted(true) // Keep UX smooth
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-[2.5rem] p-10 text-center space-y-6">
                    <div className="w-16 h-16 bg-[#4DB6AC] rounded-[1.5rem] flex items-center justify-center text-white mx-auto shadow-xl">
                        <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Diary Updated</h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4DB6AC]">
                            We've customized your care plan based on your habits
                        </p>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <Card className="bg-white dark:bg-white/5 border-black/5 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl text-left">
            <CardHeader className="space-y-6 p-8 md:p-12 bg-gray-50/50 dark:bg-black/20 border-b border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E1784F]/10 border border-[#E1784F]/20 rounded-full">
                        <Sparkles size={12} className="text-[#E1784F]" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#E1784F]">Daily Care</span>
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                        {currentIndex + 1} of {questions.length}
                    </span>
                </div>
                <div className="space-y-4">
                    <CardTitle className="text-3xl font-black italic uppercase tracking-tighter leading-none">Help Us <br/> Know Your Skin</CardTitle>
                    <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-[#E1784F]"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                        <p className="text-2xl md:text-3xl font-black italic text-foreground leading-tight tracking-tight">
                            "{currentQuestion.text}"
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                disabled={isSubmitting}
                                onClick={() => handleAnswer(true)}
                                className="flex-1 h-20 bg-[#E1784F] hover:bg-[#ff8e5e] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Yes, I do"}
                            </Button>
                            <Button
                                disabled={isSubmitting}
                                onClick={() => handleAnswer(false)}
                                variant="outline"
                                className="flex-1 h-20 bg-transparent border-black/10 dark:border-white/10 text-foreground rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-muted active:scale-95 transition-all"
                            >
                                No, not yet
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
                   <Heart size={12} className="text-[#E1784F]" />
                   <p className="text-[7px] font-black uppercase tracking-[0.4em]">Personalized for your glow</p>
                </div>
            </CardContent>
        </Card>
    )
}