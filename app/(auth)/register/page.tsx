"use client"

import { useAuth } from "@/providers/auth-provider"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [sex, setSex] = useState("male")
  const [phoneNo, setPhoneNo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signUp({ firstName, lastName, email, sex, phoneNo, password })
      router.push("/(ai)/profile")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to sign up. Please try again.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-10 bg-slate-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4 text-sm bg-red-50 p-3 rounded">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="sex">
            Sex
          </label>
          <select
            id="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="phoneNo">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNo"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+1234567890"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
