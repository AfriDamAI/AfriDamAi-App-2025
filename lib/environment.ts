// Path: lib/environment.ts

export const environment = {
    // We use 3001 because that is where your team's NestJS is running
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
    production: process.env.NODE_ENV === "production",
};