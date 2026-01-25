import { Metadata } from 'next'

/**
 * 🛡️ AFRIDAM NEURAL DIAGNOSTICS: LAYOUT (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Specialist Branding & Zero-Flicker SEO.
 */

export const metadata: Metadata = {
  title: 'Skin Report | AfriDam AI',
  description: 'Your personal melanin-rich skin check and care plan.',
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /**
   * 🚀 HANDSHAKE:
   * We return the children directly to avoid adding extra 
   * spacing that could break the mobile-first report design.
   */
  return <>{children}</>
}