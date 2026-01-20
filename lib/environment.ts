/**
 * 🛡️ OGA FIX: Robust Production URL Handling
 * Updated for the Render Migration.
 * This logic ensures we always have a clean URL without trailing slashes,
 * and maintains the '/api' suffix required for the AfriDam Backend.
 */

const getBackendUrl = () => {
    // 1. Get the URL from environment variables
    // UPDATED: Changed fallback to the live Render backend for stability.
    let url = process.env.NEXT_PUBLIC_API_URL || "https://afridamai-backend.onrender.com/api";
    
    // 2. Remove any trailing slash first to avoid //api
    url = url.replace(/\/$/, "");

    // 3. Ensure it ends with /api (Works for Render, Google, or Localhost)
    if (!url.endsWith('/api')) {
        return `${url}/api`;
    }
    
    return url;
};

export const environment = {
    backendUrl: getBackendUrl(),
    production: process.env.NODE_ENV === "production",
    isServer: typeof window === "undefined",
};

export default environment;