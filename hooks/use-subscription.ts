"use client"

import { useAuth } from "@/providers/auth-provider"

/**
 * Subscription tier types
 */
export type SubscriptionTier = "free" | "premium" | "pro" | "enterprise"

/**
 * Hook to check user subscription status and tier
 * Provides clean, modular access to subscription-related checks
 */
export function useSubscription() {
    const { user } = useAuth() as any

    /**
     * Check if the user is on free tier
     * Matches "free tier", "free", or undefined/null plan names
     */
    const isFreeTier = (): boolean => {
        const planName = user?.plan?.name?.toLowerCase()?.trim()
        return !planName || planName === "free" || planName === "free tier"
    }

    /**
     * Check if user has premium or higher subscription
     */
    const isPremiumOrHigher = (): boolean => {
        return !isFreeTier()
    }

    /**
     * Get the current subscription tier
     */
    const getTier = (): SubscriptionTier => {
        const planName = user?.plan?.name?.toLowerCase()?.trim()
        if (!planName || planName === "free" || planName === "free tier") {
            return "free"
        }
        if (planName.includes("premium")) {
            return "premium"
        }
        if (planName.includes("pro")) {
            return "pro"
        }
        return "enterprise"
    }

    /**
     * Get the display name of the current plan
     */
    const getPlanDisplayName = (): string => {
        return user?.plan?.name || "Free Plan"
    }

    return {
        isFreeTier,
        isPremiumOrHigher,
        getTier,
        getPlanDisplayName,
        user
    }
}
