/**
 * 🛡️ AFRIDAM PERSONAL DETAILS PAGE (Rule 7 Sync)
 * Version: 2026.1.29
 * Focus: Comprehensive skin health & demographics management
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PersonalDetailsForm } from "@/components/personal-details-form";

export default function PersonalDetailsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-6 lg:p-20 relative overflow-x-hidden text-left">
      
      {/* 🏛️ CINEMATIC BACKGROUND */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-[radial-gradient(circle_at_80%_0%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        
        {/* HEADER */}
        <header className="space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-semibold">
            Personal Details
          </h1>

          <p className="text-sm opacity-70">
            Please provide accurate personal and skin health information.
          </p>
        </header>

        {/* FORM */}
        <section>
          <PersonalDetailsForm />
        </section>

      </div>
    </main>
  );
}
