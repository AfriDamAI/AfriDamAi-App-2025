/**
 * 🛡️ OGA FIX: Robust Production URL Handling
 * Updated for the Render Migration.
 * This logic ensures we always have a clean URL without trailing slashes,
 * and maintains the '/api' suffix required for the AfriDam Backend.
 */

const getBackendUrl = () => {
    // 1. Get the URL from environment variables
    let url = process.env.NEXT_PUBLIC_API_URL || "/api/proxy";
    
    // 2. Remove any trailing slash first to avoid //api
    url = url.replace(/\/$/, "");

    // If the URL is the proxy, return it as is. The /api will be added by the rewrite.
    if (url === "/api/proxy") {
        return url;
    }

    // Ensure it ends with /api for direct backend calls
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