import type { NextConfig } from "next";

/**
 * 🛡️ AFRIDAM NEXT CONFIG (Rule 6 Synergy)
 * Version: 2026.1.11 (404 Path Recovery)
 * Focus: High-Precision Hardware Handshake & Redirect Alignment.
 */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=(), geolocation=(), interest-cohort=()', 
          },
          {
            key: 'Content-Security-Policy',
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

  /* 🛡️ RULE 6 REDIRECT CLEANUP
     Ensures that legacy paths don't conflict with our new /auth/ pages.
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
        destination: '/analyzer',
        permanent: true,
      }
      // 🚀 NOTE: We are NOT redirecting /auth/ here. 
      // This allows the file system to handle the /auth/login route directly.
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  reactStrictMode: true,
};

export default nextConfig;