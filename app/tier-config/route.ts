/**
 * 🛡️ AFRIDAM TIER CONFIGURATION (Rule 7 Precision Sync)
 * This module handles subscription tier definitions and feature access control.
 * It is used across the dashboard, scanner, and history modules to gate premium features.
 */

export type SubscriptionTier = 'free' | 'premium' | 'pro' | 'enterprise';

export interface FeatureAccess {
  downloads: boolean;
  sharing: boolean;
  skinDiary: boolean;
  screenshots: boolean;
  unlimitedScans: boolean;
  priorityReview: boolean;
  uploadFromDevice: boolean;
  detailedAnalysis: boolean;
}

export const TIER_CONFIG: Record<SubscriptionTier, FeatureAccess> = {
  free: {
    downloads: false,
    sharing: false,
    skinDiary: false,
    screenshots: false,
    unlimitedScans: false,
    priorityReview: false,
    uploadFromDevice: true,
    detailedAnalysis: true,
  },
  premium: {
    downloads: true,
    sharing: true,
    skinDiary: true,
    screenshots: true,
    unlimitedScans: true,
    priorityReview: true,
    uploadFromDevice: true,
    detailedAnalysis: true,
  },
  pro: {
    downloads: true,
    sharing: true,
    skinDiary: true,
    screenshots: true,
    unlimitedScans: true,
    priorityReview: true,
    uploadFromDevice: true,
    detailedAnalysis: true,
  },
  enterprise: {
    downloads: true,
    sharing: true,
    skinDiary: true,
    screenshots: true,
    unlimitedScans: true,
    priorityReview: true,
    uploadFromDevice: true,
    detailedAnalysis: true,
  },
};

/**
 * Checks if a given subscription tier has access to a specific feature.
 * @param tier The user's current subscription tier.
 * @param feature The feature key to check access for.
 * @returns boolean indicating access.
 */
export function hasFeatureAccess(tier: SubscriptionTier, feature: keyof FeatureAccess): boolean {
  // Safe fallback to 'free' if tier is invalid
  const activeTier = TIER_CONFIG[tier] ? tier : 'free';
  return TIER_CONFIG[activeTier][feature] || false;
}

// Fallback GET handler to prevent Next.js from complaining if this is hit as an API route
export async function GET() {
  return new Response(JSON.stringify({ 
    status: "active",
    message: "Afridermatology Tier Configuration Node",
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
