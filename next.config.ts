import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 🛡️ SAFETY REDIRECTS: 
     This ensures that even if a hidden line of code tries to send a user 
     to the old folders, they will automatically be redirected to the 
     working AI Scanner route, preventing 404s.
  */
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

  // Optional: If you use external images (like from a backend or Unsplash)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;