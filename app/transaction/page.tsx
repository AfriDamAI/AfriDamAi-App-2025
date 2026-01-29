"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { Lock, Loader2, Shield } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'

interface User {
    id: string;
    name: string;
    email: string;
}

function TransactionPage() {
    const searchParams = useSearchParams()
    const subscriptionId = searchParams.get('subscriptionId')
    const price = searchParams.get('price')
    const subscriptionName = searchParams.get('name') || 'Selected Plan';

    const [user, setUser] = useState<User | null>(null)
    const [amount, setAmount] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error("User not authenticated. Please log in.")
            }
            const decodedToken: any = jwtDecode(token)
            setUser({
                id: decodedToken.sub, // Assuming 'sub' is the userId claim in the token
                name: decodedToken.name || 'User',   // Assuming 'name' is also in the token
                email: decodedToken.email || 'user@example.com'  // Assuming 'email' is also in the token
            })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }

        if (price) {
            setAmount(price)
        }
    }, [price])

    const handlePayment = async () => {
        if (!subscriptionId || !user?.id || !amount) {
            setError("Missing transaction details.")
            return
        }
        setIsProcessing(true)
        setError(null)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/transactions/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    subscriptionId: subscriptionId,
                    userId: user.id,
                    amount: parseFloat(amount),
                    gateway: "PAYSTACK",
                    paymentMethod: "CARD"
                })
            })

            const result = await response.json()

            if (!response.ok || !result.status) {
                throw new Error(result.message || 'Failed to initiate transaction.')
            }

            if (result.data && result.data.authorization_url) {
                window.open(result.data.authorization_url, '_blank')
            } else {
                throw new Error('No authorization URL received.')
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#E1784F]" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60">Loading your details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Order <span className="text-[#E1784F]">Summary</span></h3>
                <div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold opacity-60">Plan:</span>
                        <span className="text-sm font-bold">{subscriptionName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold opacity-60">Billed:</span>
                        <span className="text-sm font-bold">Today</span>
                    </div>
                    <div className="border-t border-white/10 my-4"></div>
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold">Total Amount:</span>
                        <span className="font-black text-2xl text-[#E1784F]">${amount}</span>
                    </div>
                </div>

                <div className="mt-6 bg-white dark:bg-zinc-800/50 rounded-2xl p-6">
                     <h4 className="text-lg font-bold mb-2">Account Details</h4>
                     <p className="text-sm text-gray-400">Paying as {user?.name} ({user?.email})</p>
                </div>

                 <div className="flex items-center gap-2 mt-6 text-xs text-gray-500">
                    <Shield size={14} />
                    <span>Secure payment powered by Paystack.</span>
                </div>
            </motion.div>

            {/* Payment Section */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Payment <span className="text-[#E1784F]">Gateway</span></h3>

                <div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-8 text-center">
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    
                    <p className="text-sm font-bold mb-6">Click the button below to proceed to payment.</p>
                    <motion.button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-xl shadow-sm text-md font-bold text-white bg-[#E1784F] hover:bg-[#d16a3f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E1784F] disabled:opacity-50 transition-all"
                    >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Lock size={18} />}
                        {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

export default function TransactionPageWrapper() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <TransactionPage />
        </Suspense>
    )
}
