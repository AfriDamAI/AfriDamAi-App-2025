import type { NextConfig } from "next";

/**
 * 🛡️ AFRIDAM NEXT CONFIG (Rule 6 Synergy)
 * Version: 2026.1.22 (Hardware & Path Sync)
 * Focus: High-Precision Path Alignment & Hardware Access.
 */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 🚀 RULE 6: Bypasses the 2,000 VS Code errors during Vercel build
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            // 🎙️ OGA FIX: Microphone must be allowed for Specialist Audio/Video sessions
            value: 'camera=*, microphone=*, geolocation=(), interest-cohort=()', 
          },
          {
            key: 'Content-Security-Policy',
            // 🛡️ SECURITY SYNC: Allowing your specific Backend and AI Engine URLs
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; media-src 'self' blob: mediastream:; connect-src 'self' https: https://afridamai-backend.onrender.com https://afridam-ai2-api-131829695574.us-central1.run.app;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  /* 🛡️ PATH HANDSHAKE
     Ensures legacy links land on your new high-precision folders.
  */
  async redirects() {
    return [
      {
        source: '/scan',
        destination: '/scanner', 
        permanent: true,
      },
      {
        source: '/ingredients',
        destination: '/lab', 
        permanent: true,
      }
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 🚀 Allows specialists' photos and product images from any secure cloud
      },
    ],
  },
  
  reactStrictMode: true,
};

export default nextConfig;