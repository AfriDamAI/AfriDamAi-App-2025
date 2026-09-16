/**
 * 🛡️ AFRIDAM MANIFESTO: MISSION & VISION
 * Version: 2026.2.11 (Uniform Team Image Card Radius & Alignment Fix)
 * Focus: High-Tier Glassmorphic Cards, 10-Zone Analysis, Executive Team, Polished Closing.
 */

"use client"

import React from "react"
import { ChevronLeft, Zap, Globe, ShieldCheck, ArrowRight, Sparkles, AlertTriangle, Users, Scan, Layers, Target, Stethoscope, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"
import Image from "next/image"

export default function MissionPage() {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
  };

  const teamMembers = [
    {
      name: "Ogirima Obey",
      role: "Founder & CEO",
      bio: "Registered Nurse and the visionary leader of AfriDam AI, merging medical care with skin technology.",
      image: "/pics/og.png",
      badgeColor: "#E1784F",
      imagePosition: "object-top"
    },
    {
      name: "Dr. Anand Urhekar",
      role: "Chief Medical Officer (CMO)",
      bio: "Dermatologist leading our clinical strategy and doctor network to keep our scanner medically safe.",
      image: "/pics/anadu.png",
      badgeColor: "#4DB6AC",
      imagePosition: "object-center"
    },
    {
      name: "Dr. Rasheedah Adesokan",
      role: "Founding Dermatologist",
      bio: "Consultant dermatologist guiding our clinical review and medical accuracy.",
      image: "/pics/Rasheedah.png",
      badgeColor: "#E1784F",
      imagePosition: "object-[center_30%] scale-110 sm:scale-100"
    },
    {
      name: "Dr. Dawitt Feleke Zewde",
      role: "Medical Advisory Board Member",
      bio: "Consultant supporting our medical review processes and global best practices.",
      image: "/pics/Dawiit.png",
      badgeColor: "#3B82F6",
      imagePosition: "object-[center_26%] scale-125"
    }
  ];

  return (
    <main className="min-h-[100svh] bg-[#FAF9F6] dark:bg-[#09090b] text-black dark:text-white transition-colors duration-700 selection:bg-[#E1784F]/30 relative overflow-x-hidden">
      
      {/* --- HIGH-TIER AMBIENT GLOWS --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#4DB6AC] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20 md:opacity-30 pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] bg-[#E1784F] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-15 md:opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.04] pointer-events-none mix-blend-overlay" />

      <div className="max-w-screen-xl mx-auto px-6 py-16 md:py-24 lg:py-32 space-y-24 md:space-y-36 relative z-10">
        
        {/* Navigation */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 text-[#E1784F] font-black text-[10px] tracking-[0.4em] uppercase transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-md"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span>Return</span>
        </motion.button>

        {/* 1. THE MANIFESTO HEADER & EXACT TEXT INTEGRATION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-12"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-[#4DB6AC] animate-pulse shadow-[0_0_10px_#4DB6AC]" />
             <span className="text-black dark:text-white text-[10px] font-black tracking-[0.4em] uppercase">The Manifesto</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black italic tracking-tighter leading-[0.9] text-black dark:text-white drop-shadow-sm">
            Bridging the <br /> <span className="bg-gradient-to-r from-[#E1784F] to-[#4DB6AC] bg-clip-text text-transparent drop-shadow-md">Global Care Gap.</span>
          </motion.h1>
          
          <motion.div variants={itemVariants} className="space-y-6 text-lg md:text-xl font-medium leading-relaxed max-w-4xl text-black/70 dark:text-white/80 tracking-tight">
            <p>
              For decades, medical dermatology and artificial intelligence shared a huge, hidden flaw: they were built almost entirely for lighter skin types.
            </p>
            <p className="opacity-90">
              Globally, less than <span className="text-[#E1784F] font-black">3% of public dermatological AI datasets</span> represent dark or melanin-rich skin (Fitzpatrick IV–VI). Because of this bias, standard AI models miss the mark on darker skin, leading to wrong answers, missed diagnoses, and delayed care.
            </p>
          </motion.div>
        </motion.div>

        {/* 2. THE ACCESS CRISIS & DANGERS */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6 text-lg font-medium text-black/70 dark:text-white/70 leading-relaxed">
              <p>
                At the same time, real doctors are extremely hard to reach. In Sub-Saharan Africa, there are only <span className="text-black dark:text-white font-black">0 to 3 dermatologists for every 1 million people</span>. Millions of people have to travel for hours, spend huge transport money, and wait in endless lines just to show a doctor a small spot on their face.
              </p>
              <p>
                Desperate for quick answers, up to <span className="text-[#4DB6AC] font-black">77% of people</span> turn to unregulated, open-market cosmetic creams containing harsh steroids and mercury—ruining their skin barrier further.
              </p>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-white/70 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/50 dark:border-white/10 shadow-sm">
               <AlertTriangle className="text-[#E1784F] shrink-0" size={28} />
               <p className="text-[10px] font-black tracking-[0.2em] leading-relaxed text-black/70 dark:text-white/70 uppercase">
                 We are replacing dangerous product trial-and-error with clinical matching.
               </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <div className="p-6 md:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2rem] text-center space-y-4 shadow-xl shadow-black/5 flex flex-col justify-between">
              <div className="w-12 h-12 mx-auto bg-[#E1784F]/10 rounded-xl flex items-center justify-center text-[#E1784F]">
                <Users size={22} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                <p className="text-4xl md:text-5xl font-black italic tracking-tighter">0 - 3</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Doctors per 1M People</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2rem] text-center space-y-4 shadow-xl shadow-black/5 mt-0 sm:mt-8 flex flex-col justify-between">
              <div className="w-12 h-12 mx-auto bg-[#4DB6AC]/10 rounded-xl flex items-center justify-center text-[#4DB6AC]">
                <Sparkles size={22} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                <p className="text-4xl md:text-5xl font-black italic tracking-tighter">77%</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Unregulated Creams</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THE 3 MAJOR PROBLEMS WE SOLVED */}
        <div className="space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-[#E1784F] text-[10px] font-black capitalize tracking-widest opacity-60">
              The Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-black dark:text-white">
              We Built AfriDam AI to Solve <span className="text-[#4DB6AC]">3 Major Problems:</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Tech Bias", text: "Building AI designed specifically for melanin-rich skin.", color: "#E1784F", icon: Zap },
              { title: "Access Gap", text: "Putting expert-level skin analysis right on a phone.", color: "#4DB6AC", icon: Globe },
              { title: "Unregulated Products", text: "Stopping dangerous product trial-and-error with clinical matching.", color: "#3B82F6", icon: ShieldCheck }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] space-y-6 shadow-sm hover:shadow-xl transition-all"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${pillar.color}1A`, color: pillar.color }}
                >
                  <pillar.icon size={26} strokeWidth={2.5} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black italic tracking-tight text-black dark:text-white">{pillar.title}</h3>
                  <p className="text-sm font-medium text-black/60 dark:text-white/60 leading-relaxed">{pillar.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PRECISION SCANNING SECTION */}
        <section className="p-8 md:p-14 lg:p-16 bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[3rem] shadow-xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E1784F]/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <span className="text-[#4DB6AC] text-[10px] font-black tracking-[0.4em] uppercase">Clinical Engineering</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tight text-black dark:text-white">
              From 40k+ Real Images to <span className="text-[#E1784F]">Accurate Precision</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <p className="text-lg md:text-xl font-medium text-black/70 dark:text-white/80 leading-relaxed">
              A basic single photo scan is never enough. Real skin has different needs on different parts of the face—your forehead might be oily, your eyes might have dark circles, and your cheeks might have post-acne marks.
            </p>
            <p className="text-lg md:text-xl font-medium text-black/70 dark:text-white/80 leading-relaxed">
              To capture true human skin diversity, our team mapped tens of thousands of real-world skin photos. We built a <span className="text-black dark:text-white font-black underline decoration-[#4DB6AC]">10-Zone Facial Analysis System</span>. By dividing the face into 10 distinct zones and tracking 24 specific conditions across 6 main groups, our engine calculates 190 precision biomarkers—delivering clinical clarity in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-white dark:bg-[#111] rounded-2xl border border-black/5 dark:border-white/10 text-center space-y-2 shadow-sm">
              <Layers className="mx-auto text-[#E1784F]" size={24} />
              <p className="text-2xl font-black italic tracking-tight">10 Zones</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Facial Mapping</p>
            </div>
            <div className="p-6 bg-white dark:bg-[#111] rounded-2xl border border-black/5 dark:border-white/10 text-center space-y-2 shadow-sm">
              <Scan className="mx-auto text-[#4DB6AC]" size={24} />
              <p className="text-2xl font-black italic tracking-tight">24 Conditions</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Multi-Condition Tracking</p>
            </div>
            <div className="p-6 bg-white dark:bg-[#111] rounded-2xl border border-black/5 dark:border-white/10 text-center space-y-2 shadow-sm">
              <Target className="mx-auto text-[#3B82F6]" size={24} />
              <p className="text-2xl font-black italic tracking-tight">190 Biomarkers</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Precision Metrics</p>
            </div>
          </div>
        </section>

        {/* MEET THE TEAM SECTION */}
        <section className="space-y-16 py-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4DB6AC]/10 text-[#4DB6AC] text-[10px] font-black tracking-[0.3em] uppercase">
              <Stethoscope size={14} /> Leadership & Advisory
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-black dark:text-white">
              Meet the <span className="text-[#E1784F]">Team.</span>
            </h2>
            <p className="text-lg md:text-xl font-medium text-black/60 dark:text-white/70 leading-relaxed">
              Our platform is grounded in medical care and global clinical standards. Our leadership and medical advisory team combine registered nursing experience, clinical oversight, and specialist dermatology to ensure every scan meets real health standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] p-6 space-y-6 shadow-xl shadow-black/5 flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div className="relative w-full h-56 rounded-[2rem] overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 isolate">
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      fill
                      className={`object-cover ${member.imagePosition} group-hover:scale-105 transition-transform duration-500`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 pointer-events-none" />
                    <span 
                      className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase text-white shadow-md z-10"
                      style={{ backgroundColor: member.badgeColor }}
                    >
                      Expert
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black italic tracking-tight text-black dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#E1784F]">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-medium text-black/60 dark:text-white/60 leading-relaxed pt-4 border-t border-black/5 dark:border-white/10">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRECISION CARE, ZERO BARRIERS SECTION */}
        <section className="p-10 md:p-16 lg:p-20 bg-gradient-to-br from-white/90 via-[#FAF9F6]/80 to-white/90 dark:from-[#111]/90 dark:via-[#0c0c0e]/90 dark:to-[#111]/90 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />
          
          <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E1784F]/10 text-[#E1784F] text-[10px] font-black tracking-[0.4em] uppercase shadow-sm">
              <CheckCircle2 size={14} /> Uncompromising Care
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tight text-black dark:text-white leading-[1]">
              Precision Care, <span className="bg-gradient-to-r from-[#E1784F] to-[#4DB6AC] bg-clip-text text-transparent">Zero Barriers</span>
            </h2>
            
            <p className="text-lg md:text-xl font-medium text-black/70 dark:text-white/80 leading-relaxed max-w-2xl mx-auto">
              Skin care should be fast, simple, and honest. Whether you want to scan your face in seconds for 10-zone insights, find safe products, or book a direct appointment with a real dermatologist without sign-up friction—AfriDam AI brings expert care straight to you.
            </p>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 max-w-xl mx-auto">
              <p className="text-base md:text-lg font-bold italic text-black dark:text-white tracking-tight">
                "We are restoring dignity in skin care for melanin-rich communities worldwide—one facial zone at a time."
              </p>
            </div>
          </div>
        </section>

        {/* 4. THE 3-MONTH IMPACT METRICS */}
        <div className="p-10 md:p-14 bg-black text-white rounded-[3rem] text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4DB6AC]/20 blur-[120px] rounded-full pointer-events-none" />
          <span className="text-[#4DB6AC] text-[10px] font-black tracking-[0.4em] uppercase">Rapid Traction</span>
          <h3 className="text-3xl md:text-5xl font-black italic tracking-tight">In Just 3 Months</h3>
          <p className="text-lg md:text-xl font-medium text-white/80 max-w-2xl mx-auto leading-relaxed">
            Over <span className="text-[#E1784F] font-black">14,000 people</span> have engaged our platform, running more than <span className="text-[#4DB6AC] font-black">40,000 live skin scans</span>. We aren't just making a skincare tool—we are replacing long travel days and bad products with instant, honest answers.
          </p>
        </div>

        {/* 5. THE FOUNDER'S VOW */}
        <section className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-10 sm:p-14 lg:p-20 bg-[#0a0a0a] text-white rounded-[3rem] md:rounded-[4rem] relative overflow-hidden shadow-2xl group"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#E1784F]/20 to-[#4DB6AC]/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex gap-6 items-center mb-16 relative z-10">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#E1784F] to-[#c7623a] flex items-center justify-center text-white font-black text-3xl italic shadow-xl shrink-0">
                OO
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter">Ogirima Obey</h3>
                <p className="text-white/50 text-[10px] font-black tracking-[0.4em] uppercase">Founder & CEO</p>
              </div>
            </div>
            
            <blockquote className="text-3xl md:text-4xl lg:text-[2.75rem] italic font-black leading-[1.1] tracking-tight relative z-10 text-white/95">
              "We are not just building AI — we are restoring dignity in care. Everyone deserves to be seen." <br />
              <span className="text-[#4DB6AC] text-xl md:text-2xl tracking-normal font-bold">Melanin-rich skin decoded.</span>
            </blockquote>
          </motion.div>

          <div className="space-y-10 lg:pl-10">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black italic capitalize tracking-tighter leading-[0.9] text-black dark:text-white">
              The <span className="text-[#4DB6AC]">Vision.</span>
            </h2>
            <p className="text-xl md:text-2xl font-medium text-black/60 dark:text-white/60 leading-relaxed">
              We are building the continent's most sophisticated clinical vision engine. By merging precision AI analysis with a vetted care marketplace, we empower you to take definitive control of your skin health—instantly, ethically, and securely.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-4 text-[#E1784F] font-black text-[12px] tracking-[0.4em] uppercase hover:opacity-80 transition-opacity mt-4"
            >
              Enter Clinic <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-300" />
            </button>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <div className="pt-24 pb-12 text-center space-y-8 relative z-10">
          <div className="space-y-3 max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tight text-black dark:text-white">
              AfriDam AI Beauty and Aesthetic Intelligence
            </h3>
            <p className="text-xs font-black tracking-[0.3em] uppercase text-[#E1784F]">
              Start Your Skin Analysis Now.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/register')}
            className="w-full md:w-auto px-14 py-7 bg-gradient-to-r from-[#E1784F] to-[#c7623a] text-white font-black text-[12px] tracking-[0.4em] uppercase rounded-full shadow-[0_20px_40px_rgba(225,120,79,0.3)] hover:shadow-[0_20px_60px_rgba(225,120,79,0.5)] transition-all duration-300"
          >
            Start Your Analysis
          </motion.button>
        </div>

      </div>
    </main>
  )
}