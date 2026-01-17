// Path: lib/environment.ts

/**
 * 🛡️ OGA FIX: Robust Production URL Handling
 * This logic ensures that even if we forget the '/api' or the trailing slash,
 * the app stays connected to the correct Cloud Run instance.
 */

const getBackendUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    // Ensure the URL ends with /api for Nathan and other users
    if (url.includes('run.app') && !url.endsWith('/api')) {
        return `${url.replace(/\/$/, "")}/api`;
    }
    
    return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const environment = {
    backendUrl: getBackendUrl(),
    production: process.env.NODE_ENV === "production",
    isServer: typeof window === "undefined",
};

export default environment;