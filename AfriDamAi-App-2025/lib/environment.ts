export const environment = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
    production: process.env.NODE_ENV === "production",
  };
