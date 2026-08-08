"use client"

import React from "react"
import { 
  ArrowLeft, 
  Lock, 
  Database, 
  UserCheck, 
  Mail, 
  Cpu, 
  Trash2, 
  FileCheck 
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-[100svh] bg-[#050505] flex flex-col justify-center items-center p-6 md:p-12 selection:bg-[#E1784F]/30 relative overflow-hidden font-sans">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#E1784F]/10 blur-[120px] md:blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#4DB6AC]/10 blur-[80px] md:blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl space-y-8 md:space-y-12 relative z-10 my-8"
      >
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-4 md:space-y-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(225,120,79,0.2)] mx-auto mb-4 relative group cursor-pointer overflow-hidden"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.png"
              alt="AfridamAI Logo"
              width={210}
              height={210}
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
            />
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/20 scale-110 opacity-50 group-hover:opacity-100 transition-all duration-500" />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none text-center">
              Privacy <span className="text-[#E1784F]">Policy</span>
            </h1>
            <p className="text-white/50 text-xs md:text-sm font-bold uppercase tracking-[0.3em] pt-1">
              Last Updated: August 7, 2026
            </p>
          </div>
        </div>

        {/* --- PRIVACY POLICY CONTENT CARD --- */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => router.back()}
            className="absolute -top-8 -right-2 md:-top-10 md:-right-8 p-3 md:p-4 text-white/30 hover:text-[#E1784F] hover:scale-110 transition-all z-[100]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-10 bg-white/[0.025] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-2xl shadow-2xl"
          >
            <p className="text-white/80 text-base md:text-lg leading-relaxed md:leading-loose border-b border-white/10 pb-8 font-normal">
              AfriDam AI Clinical Access is committed to protecting your privacy. This Privacy Policy details how we collect, process, secure, and manage your personal, biometric, and clinical data when you use our AI scanning, marketplace, and clinical consultation services.
            </p>

            {/* Section 1: Data Collected */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Database className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  1. Information We Collect
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                To deliver our specialized AI diagnostics and clinical workflow, we collect the following types of information:
              </p>
              <ul className="text-white/70 text-sm md:text-base leading-relaxed pl-9 space-y-3">
                <li>• <strong className="text-white font-semibold">Personal & Account Details:</strong> Name, email address, phone number, age, gender, and account credentials.</li>
                <li>• <strong className="text-white font-semibold">Biometric & Image Data:</strong> Facial and skin photos uploaded directly or captured via camera for real-time AI scan evaluation.</li>
                <li>• <strong className="text-white font-semibold">Clinical & Scan Data:</strong> Self-reported skin history, diagnostic outputs, skin barrier metrics, and product preferences.</li>
                <li>• <strong className="text-white font-semibold">Transaction & Payment Data:</strong> Order histories and shipping addresses. Payment processing is handled securely via Paystack PCI-DSS infrastructure; raw card details are never stored on our servers.</li>
                <li>• <strong className="text-white font-semibold">Technical & Usage Data:</strong> IP address, device identifiers, browser type, and site interaction cookies.</li>
              </ul>
            </div>

            {/* Section 2: How Data Is Used & AI Training */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Cpu className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  2. How We Use Data & AI Model Training
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                Your data directly powers and enhances the precision of our clinical platform:
              </p>
              <ul className="text-white/70 text-sm md:text-base leading-relaxed pl-9 space-y-3">
                <li>• <strong className="text-white font-semibold">Primary AI Diagnostics:</strong> Computer vision models process skin scans to evaluate skin parameters, recommend product matches, or flag conditions for specialist review.</li>
                <li>• <strong className="text-white font-semibold">Dark Skin Model Optimization:</strong> Anonymized and de-identified skin images are used to continuously train and optimize our AI algorithms specifically for dark skin biomarkers (Fitzpatrick Scale IV–VI).</li>
                <li>• <strong className="text-white font-semibold">Clinical Consultations:</strong> Scan outputs and image histories are shared with licensed Tele-Doctors only when you explicitly schedule a virtual consultation.</li>
                <li>• <strong className="text-white font-semibold">Fulfillment & Operations:</strong> To process Marketplace product orders, send order updates, and resolve support requests.</li>
              </ul>
            </div>

            {/* Section 3: Third-Party Sharing */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <UserCheck className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  3. Third-Party Sharing & Strict Non-Sale
                </h2>
              </div>
              <ul className="text-white/70 text-sm md:text-base leading-relaxed pl-9 space-y-3">
                <li>• <strong className="text-white font-bold  decoration-[#E1784F]">Strict Non-Sale Policy:</strong> We never sell, rent, or trade your personal data, facial images, or medical scan records to third-party advertisers or data brokers.</li>
                <li>• <strong className="text-white font-semibold">Medical Specialists:</strong> Shared exclusively with board-certified dermatologists and licensed clinicians on our platform when you book a consultation.</li>
                <li>• <strong className="text-white font-semibold">Partner Vendors:</strong> Necessary order details (name, shipping address, purchased items) are shared with verified skincare vendors solely to dispatch orders.</li>
                <li>• <strong className="text-white font-semibold">Infrastructure & Payments:</strong> Shared securely with PCI-DSS compliant payment gateways (Paystack) and encrypted cloud hosting providers.</li>
              </ul>
            </div>

            {/* Section 4: Data Retention & User Rights */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Trash2 className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  4. Data Retention & User Rights
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                You maintain complete control over your personal information and biometric records:
              </p>
              <ul className="text-white/70 text-sm md:text-base leading-relaxed pl-9 space-y-3">
                <li>• <strong className="text-white font-semibold">Account Retention:</strong> Account data and scan logs are retained for as long as your account remains active. Images used for model training are permanently anonymized.</li>
                <li>• <strong className="text-white font-semibold">Deletion Rights:</strong> You have the right to access, export, or request permanent deletion of your account, facial images, and scan records at any time.</li>
                <li>• <strong className="text-white font-semibold">How to Request Deletion:</strong> Submit a request in your account settings or email <span className="text-[#E1784F] font-bold">hello@afridamai.com</span>. All personal data will be purged within 30 days of confirmation.</li>
              </ul>
            </div>

            {/* Section 5: Regulatory Compliance */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <FileCheck className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  5. Regulatory Compliance
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                AfriDam AI is fully compliant with the Nigeria Data Protection Regulation (NDPR) and the Nigeria Data Protection Act (NDPA), alongside international privacy standards for high-security health and biometric data processing.
              </p>
            </div>

            {/* Section 6: Security & Encryption */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Lock className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  6. Data Security & Encryption
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                All data transmitted between your device and our servers is safeguarded using high-standard SSL/TLS encryption. Stored records are encrypted at rest with strict access limits restricted to authorized clinical systems.
              </p>
            </div>

            {/* Section 7: Contact Us */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Mail className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  7. Contact Our Data Protection Team
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                For questions regarding this policy or to exercise your privacy rights, contact us at: <span className="text-[#4DB6AC] font-bold">hello@afridamai.com</span>.
              </p>
            </div>

            {/* User Consent Box */}
            <div className="pt-6 border-t border-white/10">
              <div className="p-5 md:p-6 bg-[#E1784F]/10 rounded-2xl border border-[#E1784F]/25 shadow-lg">
                <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                  <span className="text-[#E1784F] font-black uppercase tracking-wider block sm:inline mr-2">User Consent:</span> 
                  By utilizing the AfriDam AI platform, creating an account, or uploading scan photos, you explicitly acknowledge and agree to the data handling, anonymized AI training, and security practices described herein.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

          {/* FOOTER LINK */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <p className="text-center text-xs md:text-sm text-white/40 font-bold uppercase tracking-[0.25em]">
            Need to review our terms and conditions? <Link href="/terms" className="text-white hover:text-[#4DB6AC] transition-all ml-2 border-b border-white/30 hover:border-[#4DB6AC]">Terms & Conditions</Link>
          </p>
        </div>

        {/* FOOTER LINK */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <p className="text-center text-xs md:text-sm text-white/40 font-bold uppercase tracking-[0.25em]">
            Already have an account? <Link href="/login" className="text-white hover:text-[#E1784F] transition-all ml-2 border-b border-white/30 hover:border-[#E1784F]">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}