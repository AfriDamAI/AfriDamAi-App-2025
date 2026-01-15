"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Question {
    id: string
    text: string
}

const questions: Question[] = [
    { id: "sunscreen", text: "Do you use sunscreen daily?" },
    { id: "allergies", text: "Do you have any known skin allergies?" },
    { id: "hydration", text: "Do you drink at least 8 glasses of water daily?" },
    { id: "cleanser", text: "Do you use a gentle cleanser twice daily?" },
    { id: "moisturizer", text: "Do you apply moisturizer after cleansing?" },
]

export default function Questionnaire() {
    const [answers, setAnswers] = useState<Record<string, boolean | null>>({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [showThankYou, setShowThankYou] = useState(false)

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    const handleAnswer = (answer: boolean) => {
        const newAnswers = { ...answers, [currentQuestion.id]: answer }
        setAnswers(newAnswers)
        setIsAnimating(true)

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1)
            } else {
                // All questions answered, auto-submit
                handleSubmit()
            }
            setIsAnimating(false)
        }, 300) // Animation duration
    }

    const handleSubmit = () => {
        console.log("Questionnaire answers:", answers)
        // Here you could send to an API or store locally
        setShowThankYou(true)
    }

    useEffect(() => {
        let unsub
        if (showThankYou) {
            const timer = setTimeout(() => {
                setShowThankYou(false)
                setIsSubmitted(true)
            }, 10000) // 5 seconds
            return () => clearTimeout(timer)
        }
    }, [showThankYou])

    // const allAnswered = questions.every(q => q.id in answers)

    if (isSubmitted) {
        return null
    }

    if (showThankYou) {
        return (
            <Card className="mt-8 bg-green-100 border-green-300 text-black">
                <CardContent className="p-0! gap-1!">
                    <div className="flex justify-center items-center">
                        <div className="text-center">
                            <CardTitle className="">Thank You!</CardTitle>
                            <p className="text-sm text-green-600 mt-1">
                                Your responses have been recorded.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Help Us Improve Your Experience</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Answer a few questions to provide more personalized recommendations.
                </p>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground mt-2">
                    Question {currentIndex + 1} of {questions.length}
                </p>
            </CardHeader>
            <CardContent>
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{currentQuestion.text}</span>
                        <div className="flex gap-2">
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => handleAnswer(true)}
                                disabled={isAnimating}
                            >
                                Yes
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => handleAnswer(false)}
                                disabled={isAnimating}
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
