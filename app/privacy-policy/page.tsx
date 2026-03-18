/**
 * 🛡️ AFRIDAM CLINICAL ACCESS: PRIVACY POLICY
 * Last Updated: 19 January, 2026
 */

"use client"

import React from "react"
import { ArrowLeft, Shield, Lock, Database, UserCheck, Mail, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-[100svh] bg-[#050505] flex flex-col justify-center items-center p-6 md:p-12 selection:bg-[#4DB6AC]/30 relative overflow-hidden">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#4DB6AC]/5 blur-[120px] md:blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#E1784F]/5 blur-[80px] md:blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-6 md:space-y-10 relative z-10"
      >
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-4 md:space-y-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-2xl md:rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(255,255,255,0.1)] mx-auto mb-4 relative group cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="font-black text-2xl md:text-3xl italic tracking-tighter">A</span>
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/20 scale-110 opacity-50 group-hover:opacity-100 transition-all duration-500" />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-[0.8] text-center">
              Privacy <span className="text-[#4DB6AC]">Policy</span>
            </h1>
            <p className="text-white/40 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] pt-1">
              Last Updated: 19 January, 2026
            </p>
          </div>
        </div>

        {/* --- PRIVACY POLICY CONTENT --- */}
        <div className="relative">
            <button 
                type="button"
                onClick={() => router.back()}
                className="absolute -top-6 -right-2 md:-top-8 md:-right-8 p-3 md:p-4 text-white/20 hover:text-[#4DB6AC] hover:scale-110 transition-all z-[100]"
            >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 md:space-y-8 bg-white/[0.02] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10"
            >
                <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    AfriDam AI Beauty and Aesthetics Check is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI scanning services.
                </p>

                {/* Section 1 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Database className="text-[#4DB6AC] shrink-0" size={18} />
                        <h2 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em]">1. Information We Collect</h2>
                    </div>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed pl-7">
                        To provide our AI analysis, we collect the following types of information:
                    </p>
                    <ul className="text-white/40 text-xs md:text-sm leading-relaxed pl-7 space-y-2">
                        <li>• <span className="text-white/60">User Content:</span> Photos, images, and skin-related data that you voluntarily upload for analysis.</li>
                        <li>• <span className="text-white/60">Account Information:</span> Name, email address, and other details provided during sign-up.</li>
                        <li>• <span className="text-white/60">Usage Data:</span> Information on how you interact with the app, including scan frequency and feature usage.</li>
                    </ul>
                </div>

                {/* Section 2 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Shield className="text-[#4DB6AC] shrink-0" size={18} />
                        <h2 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em]">2. How We Use Your Data (AI Training)</h2>
                    </div>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed pl-7">
                        We use your data to provide and improve the Service. By using this Service, you explicitly consent to the following:
                    </p>
                    <ul className="text-white/40 text-xs md:text-sm leading-relaxed pl-7 space-y-2">
                        <li>• <span className="text-white/60">Service Provision:</span> To generate aesthetic scores and skin analysis results.</li>
                        <li>• <span className="text-white/60">AI Fine-Tuning & Machine Learning:</span> We use the images and data you upload to train, fine-tune, and improve the accuracy of our artificial intelligence models. This helps the AI learn to better recognize skin attributes and aesthetic features over time.</li>
                    </ul>
                </div>

                {/* Section 3 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Lock className="text-[#4DB6AC] shrink-0" size={18} />
                        <h2 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em]">3. Data Security and Encryption</h2>
                    </div>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed pl-7">
                        We prioritize the security of your personal information.
                    </p>
                    <ul className="text-white/40 text-xs md:text-sm leading-relaxed pl-7 space-y-2">
                        <li>• <span className="text-white/60">Encryption:</span> All data transmitted between your device and our servers is protected using high-standard SSL/TLS encryption. Your stored data is also encrypted at rest to prevent unauthorized access.</li>
                        <li>• <span className="text-white/60">No Data Leaks:</span> We implement strict access controls and security protocols designed to prevent data leaks. Access to raw user data is restricted to authorized personnel and systems strictly for the purpose of maintaining and improving the Service.</li>
                    </ul>
                </div>

                {/* Section 4 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <UserCheck className="text-[#4DB6AC] shrink-0" size={18} />
                        <h2 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em]">4. Data Sharing and Disclosure</h2>
                    </div>
                    <ul className="text-white/40 text-xs md:text-sm leading-relaxed pl-7 space-y-2">
                        <li>• <span className="text-white/60">No Third-Party Sale:</span> We do not sell, trade, or rent your personal identification information or uploaded photos to third parties for marketing purposes.</li>
                        <li>• <span className="text-white/60">Legal Requirements:</span> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                    </ul>
                </div>

                {/* Section 5 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <AlertIcon className="text-[#4DB6AC] shrink-0" size={18} />
                        <h2 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em]">5. Your Data Rights</h2>
                    </div>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed pl-7">
                        Depending on your location, you may have the right to:
                    </p>
                    <ul className="text-white/40 text-xs md:text-sm leading-relaxed pl-7 space-y-2">
                        <li>• <span className="text-white/60">Access:</span> Request a copy of the personal data we hold about you.</li>
                        <li>• <span className="text-white/60">Deletion:</span> Request that we delete your personal data and uploaded images from our servers. (Note: Data already used to train the AI model may be irreversibly anonymized and aggregated).</li>
                        <li>• <span className="text-white/60">Withdraw Consent:</span> You may withdraw your consent for future data processing by contacting us or closing your account.</li>
                    </ul>
                </div>

                {/* Section 6 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-[#4DB6AC] shrink-0" size={18} />
                        <h2 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em]">6. Children's Privacy</h2>
                    </div>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed pl-7">
                        Our Service is not intended for anyone under the age of 13. We do not knowingly collect personally identifiable information from children.
                    </p>
                </div>

                {/* Section 7 */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Mail className="text-[#4DB6AC] shrink-0" size={18} />
                        <h2 className="text-white font-black uppercase text-xs md:text-sm tracking-[0.2em]">7. Contact Us</h2>
                    </div>
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed pl-7">
                        If you have questions about this Privacy Policy or our data handling practices, please contact us at: <span className="text-[#4DB6AC]">support@afridam.ai</span>
                    </p>
                </div>

                {/* User Consent */}
                <div className="pt-6 border-t border-white/10">
                    <div className="p-4 bg-[#4DB6AC]/10 rounded-xl border border-[#4DB6AC]/20">
                        <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium">
                            <span className="text-[#4DB6AC] font-black uppercase tracking-wider">User Consent:</span> By creating an account, you acknowledge that you understand how your data will be used for AI training purposes and agree to the security measures described in this policy.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="flex flex-col items-center gap-6 pb-12">
            <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
              Already have an account? <Link href="/login" className="text-white hover:text-[#4DB6AC] transition-all ml-2 border-b border-white/20">Login</Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}

// Custom Alert Icon component
function AlertIcon({ className, size }: { className?: string; size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
