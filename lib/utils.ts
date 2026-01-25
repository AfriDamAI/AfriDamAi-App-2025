import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 🛡️ AFRIDAM STYLING CORE: CN UTILITY (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: Conflict-free Tailwind Merging & Mobile-First Logic.
 */

export function cn(...inputs: ClassValue[]) {
  /**
   * 🚀 THE STYLE HANDSHAKE
   * Combines classes (clsx) and resolves Tailwind conflicts (twMerge).
   */
  return twMerge(clsx(inputs))
}