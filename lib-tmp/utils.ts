import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 🛡️ THE AFRIDAM "CN" UTILITY
 * Merges Tailwind classes and handles conditional logic without conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}