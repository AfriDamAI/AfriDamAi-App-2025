"use client"

import { motion } from "framer-motion"
import { Stethoscope } from "lucide-react"
import Image from "next/image"

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
    bio: "Dermatologist leading our dermatology strategy and doctor network to keep our scanner medically safe.",
    image: "/pics/anadu.png",
    badgeColor: "#4DB6AC",
    imagePosition: "object-center"
  },
  {
    name: "Dr. Rasheedah Adesokan",
    role: "Founding Dermatologist",
    bio: "Consultant dermatologist guiding our specialist review and medical accuracy.",
    image: "/pics/Rasheedah.png",
    badgeColor: "#E1784F",
    imagePosition: "object-[center_20%] scale-110 sm:scale-100"
  },
  {
    name: "Dr. Dawitt Feleke Zewde",
    role: "Medical Advisory Board Member",
    bio: "Consultant supporting our medical review processes and global best practices.",
    image: "/pics/Dawiit.png",
    badgeColor: "#3B82F6",
    imagePosition: "object-[center_26%] scale-125"
  }
]

export default function TeamMemberSection() {
  return (
    <section className="relative isolate overflow-hidden py-24 md:py-40 px-6 transition-colors duration-500">
      <div className="relative z-10 max-w-screen-xl mx-auto space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 bg-[#E1784F]/5 dark:bg-white/5 px-4 py-2 rounded-full border border-[#E1784F]/10">
            <Stethoscope className="text-[#E1784F]" size={12} />
            <span className="text-[9px] font-black capitalize tracking-widest text-[#E1784F]">
              Our Team
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight text-black dark:text-white">
            Meet the <span className="text-[#4DB6AC]">Team</span>
          </h2>

          <p className="text-[15px] font-bold opacity-30 tracking-widest max-w-lg mx-auto leading-relaxed">
            Passionate experts dedicated to revolutionizing skin care for melanin-rich communities.
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
      </div>
    </section>
  )
}
