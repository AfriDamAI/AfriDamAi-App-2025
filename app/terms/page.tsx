"use client"

import React from "react"
import { 
  ArrowLeft, 
  Stethoscope, 
  Sparkles, 
  ShoppingBag, 
  Award, 
  Scale, 
  UserCheck 
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TermsAndConditionsPage() {
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
              Terms & <span className="text-[#E1784F]">Conditions</span>
            </h1>
            <p className="text-white/50 text-xs md:text-sm font-bold uppercase tracking-[0.3em] pt-1">
              Last Updated: August 7, 2026
            </p>
          </div>
        </div>

        {/* --- TERMS & CONDITIONS CONTENT CARD --- */}
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
              Welcome to AfriDam AI Clinical Access. These Clinical & Platform Terms govern your access to and use of our AI skin scanning tools, marketplace, and clinical diagnostic platform. By accessing our services, you agree to comply with the terms set forth below.
            </p>

            {/* Section 1: Eligibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <UserCheck className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  1. Platform Eligibility
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                You must be at least 18 years old to create an independent account or execute purchases on the AfriDam AI platform. Minors under the age of 18 are permitted to use the AI scanner or book clinical consultations strictly under the direct supervision of a parent or legal guardian.
              </p>
            </div>

            {/* Section 2: Medical Disclaimer */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-[#E1784F]/15 via-black/40 to-[#4DB6AC]/10 rounded-2xl border border-[#E1784F]/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-3.5">
                <Stethoscope className="text-[#E1784F] shrink-0" size={26} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  2. Crucial Medical Disclaimer
                </h2>
              </div>
              <ul className="text-white/80 text-sm md:text-base leading-relaxed space-y-3 pl-2">
                <li>• <strong className="text-white font-bold">Informational & Educational Guidance Only:</strong> The AfriDam AI Skin Scanner, Ingredient Analyzer, and algorithmic recommendations are digital intelligence tools provided solely for cosmetic, informational, and educational guidance.</li>
                <li>• <strong className="text-white font-bold">Not a Formal Medical Diagnosis:</strong> AI scan outputs and risk flags do not constitute a formal medical diagnosis, definitive treatment plan, or digital prescription.</li>
                <li>• <strong className="text-white font-bold">Emergency Medical Care:</strong> AfriDam AI is not designed for acute or emergency medical conditions. If you are experiencing severe, painful, or rapidly worsening skin conditions, seek immediate in-person evaluation from a certified healthcare facility.</li>
              </ul>
            </div>

            {/* Section 3: AI Accuracy Disclaimer */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Sparkles className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  3. AI Algorithm Accuracy & Limits
                </h2>
              </div>
              <p className="text-white/70 text-sm md:text-base leading-relaxed pl-9">
                While our computer vision algorithms are continuously trained on over 40,000+ dark skin clinical images (Fitzpatrick Scale IV–VI), scanning precision remains subject to ambient lighting, camera sensor quality, and image focus. Diagnostic outputs are guidance metrics rather than guaranteed clinical outcomes.
              </p>
            </div>

            {/* Section 4: Marketplace & Purchase Terms */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <ShoppingBag className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  4. Marketplace & Purchase Terms
                </h2>
              </div>
              <ul className="text-white/70 text-sm md:text-base leading-relaxed pl-9 space-y-3">
                <li>• <strong className="text-white font-semibold">Technology Marketplace Role:</strong> AfriDam AI operates as a curated technology marketplace connecting users with verified skincare vendors and specialist medical consultations.</li>
                <li>• <strong className="text-white font-semibold">Vendor Responsibilities:</strong> Independent third-party vendors remain solely responsible for product formulation, quality assurance, inventory compliance, packaging, and delivery.</li>
                <li>• <strong className="text-white font-semibold">Dispute Resolution:</strong> AfriDam AI provides dispute resolution support for damaged products, incorrect items, or delivery failures reported within 48 hours of order receipt.</li>
              </ul>
            </div>

            {/* Section 5: Specialist & Vendor Standards */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Award className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  5. Specialist & Vendor Compliance
                </h2>
              </div>
              <ul className="text-white/70 text-sm md:text-base leading-relaxed pl-9 space-y-3">
                <li>• <strong className="text-white font-semibold">Specialist Qualifications:</strong> Board-certified dermatologists and clinicians operating on our platform must maintain active medical licensing and professional liability coverage in their practice jurisdiction.</li>
                <li>• <strong className="text-white font-semibold">Clean Skincare Certification:</strong> Vendors must certify that listed formulations are entirely free from prohibited chemical additives, hydroquinone, unapproved steroids, and hazardous heavy metals.</li>
              </ul>
            </div>

            {/* Section 6: Limitation of Liability & Governing Law */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <Scale className="text-[#E1784F] shrink-0" size={24} />
                <h2 className="text-[#E1784F] font-black uppercase text-base md:text-lg tracking-[0.18em]">
                  6. Limitation of Liability & Governing Law
                </h2>
              </div>
              <ul className="text-white/70 text-sm md:text-base leading-relaxed pl-9 space-y-3">
                <li>• <strong className="text-white font-semibold">Limitation of Liability:</strong> AfriDam AI Ltd, its directors, and medical advisors shall not be held liable for indirect, incidental, or consequential damages resulting from product misuse, severe allergic reactions to third-party formulations, or reliance on AI outputs without professional medical validation.</li>
                <li>• <strong className="text-white font-semibold">Governing Law & Jurisdiction:</strong> These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through structured mediation and binding arbitration in Lagos State, Nigeria.</li>
              </ul>
            </div>

            {/* Platform Agreement Box */}
            <div className="pt-6 border-t border-white/10">
              <div className="p-5 md:p-6 bg-[#4DB6AC]/10 rounded-2xl border border-[#4DB6AC]/25 shadow-lg">
                <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                  <span className="text-[#4DB6AC] font-black uppercase tracking-wider block sm:inline mr-2">Binding Agreement:</span> 
                  By continuing to use AfriDam AI, creating an account, or scheduling clinical consultations, you acknowledge that you have read, understood, and agreed to be legally bound by these Clinical & Platform Terms.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FOOTER LINK */}
        <div className="flex flex-col items-center gap-6 pb-12">
          <p className="text-center text-xs md:text-sm text-white/40 font-bold uppercase tracking-[0.25em]">
            Need to review our privacy terms? <Link href="/privacy-policy" className="text-white hover:text-[#4DB6AC] transition-all ml-2 border-b border-white/30 hover:border-[#4DB6AC]">Privacy Policy</Link>
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