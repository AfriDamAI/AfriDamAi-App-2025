"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Image from "next/image"

// Import team member images from public/pics folder
import ogImage from "@/public/pics/og.png"
import anaduImage from "@/public/pics/anadu.png"
import tobImage from "@/public/pics/tob.png"
import anuImage from "@/public/pics/anu.png"
import natImage from "@/public/pics/nat.png"
import matImage from "@/public/pics/mott.jpeg"

// Team members data array with local images
const teamMembers = [
  {
    id: 1,
    name: "Ogirima Obey",
    title: "Founder & CEO",
    description: "Registered Nurse & Venture Builder. Bridges clinical gaps with tech systems.",
    image: ogImage,
  },
  {
    id: 2,
    name: "Dr. Anadu",
    title: "CMO",
    description: "Chief Medical Officer. Provides the clinical oversight for the AI diagnostics.",
    image: anaduImage,
  },
  {
    id: 3,
    name: "Tobi",
    title: "Technical Lead",
    description: "Leads the Node.js/NestJS architecture and API integration.",
    image: tobImage,
  },
  {
    id: 4,
    name: "Tochi",
    title: "AI Coordinator",
    description: "Manages the African datasets and model training for the scanner.",
    image: anuImage,
  },
  
  {
    id: 5,
    name: "Nathan Isong",
    title: "Head of AI",
    description: "Lead the model architecture",
    image: natImage,
  },
  {
    id: 6,
    name: "Mistura",
    title: "Workflow Coordinator",
    description: "Ensures the seamless handoff between AI detection and specialist consultation.",
    image: matImage,
  },
]

export default function TeamMemberSection() {
  return (
    <section className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5 border-y border-black/5 dark:border-white/5">
      <div className="max-w-screen-xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 bg-[#E1784F]/5 dark:bg-white/5 px-4 py-2 rounded-full border border-[#E1784F]/10">
            <Sparkles className="text-[#E1784F]" size={12} />
            <span className="text-[9px] font-black capitalize tracking-widest text-[#E1784F]">
              Our Team
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight text-black dark:text-white">
            Meet The <span className="text-[#4DB6AC]">Minds</span>
          </h2>
          <p className="text-[11px] font-bold opacity-30 tracking-widest max-w-lg mx-auto leading-relaxed">
            Passionate experts dedicated to revolutionizing skin care for melanin-rich communities.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 p-6 md:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-[#E1784F]/30 h-full flex flex-col items-center text-center">
                
                {/* Rounded Image */}
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mb-6 border-4 border-gray-100 dark:border-white/10 group-hover:border-[#E1784F]/30 transition-all duration-500">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 144px, 176px"
                    />
                  </motion.div>
                </div>

                {/* Title Badge */}
                <div className="inline-flex items-center px-4 py-1.5 bg-[#E1784F]/10 dark:bg-[#E1784F]/20 rounded-full mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]">
                    {member.title}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg md:text-xl font-black italic tracking-tight text-black dark:text-white mb-3">
                  {member.name}
                </h3>

                {/* Description */}
                <p className="text-[10px] md:text-[11px] font-bold opacity-30 leading-relaxed tracking-tight">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
