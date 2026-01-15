import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 🛡️ SECURITY & HARDWARE PERMISSIONS: 
     Optimized for Clinical-Grade Hardware Handshake (Google Play Store Ready)
  */
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
            // Allows the app to process video streams and blob images from the scanner
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; media-src 'self' blob: mediastream:; connect-src 'self' https:;",
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

  /* 🛡️ SAFETY REDIRECTS */
  async redirects() {
    return [
      {
        source: '/scanner',
        destination: '/ai-scanner',
        permanent: true,
      },
      {
        source: '/scan',
        destination: '/ai-scanner',
        permanent: true,
      },
      {
        source: '/ingredients',
        destination: '/ai-checker',
        permanent: true,
      }
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
  
  // Suppress hydration warnings during AI processing
  reactStrictMode: true,
};

export default nextConfig;