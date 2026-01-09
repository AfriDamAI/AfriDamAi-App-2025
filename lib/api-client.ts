// Path: lib/api-client.ts

import axios from "axios";
import { environment } from "./environment";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types";

const apiClient = axios.create({
  // Fallback to 3001 if environment variable fails
  baseURL: environment.backendUrl || "http://localhost:3001",
});

/** 🔐 Security Sync: Injects the JWT token into every header **/
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

/** 🛡️ Response Interceptor: Handles 'resultData', 404 Password bugs, and Session Expiry **/
apiClient.interceptors.response.use(
  (response) => {
    // Unwraps 'resultData' for the frontend to simplify component usage
    return response.data?.resultData ? { ...response, data: response.data.resultData } : response;
  },
  (error) => {
    const responseData = error.response?.data;
    
    // 🛡️ CRITICAL FIX: Handle the backend's specific "Invalid password" response
    if (responseData?.message?.message === "Invalid password" || responseData?.message === "Invalid password") {
      const customError = new Error("Invalid password");
      (customError as any).response = error.response;
      return Promise.reject(customError);
    }

    // Handle session expiry
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined" && !window.location.pathname.includes('/auth')) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

/** 🔑 Auth Endpoints **/
export const login = async (credentials: UserLoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/user/login", credentials);
  return response.data;
};

export const register = async (userData: CreateUserDto) => {
  const response = await apiClient.post("/api/auth/user/register", userData);
  return response.data;
};

/** 👤 Profile & User Data **/
export const getProfile = async () => {
  const response = await apiClient.get("/api/profile");
  return response.data;
};

// Technical Team Request: Dedicated Avatar Upload
export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/api/profile/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, updates: Partial<any>) => {
  const response = await apiClient.put(`/api/users/${id}`, updates);
  return response.data;
};

/** 🔬 AI Analyzer & Chat Bot (AI Team Request) **/
export const sendChatMessage = async (message: string) => {
  const response = await apiClient.post("/api/analyzer/chat", { message });
  return response.data;
};

export async function uploadImage(file: File): Promise<{ imageId: string; fileName: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/api/analyzer", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function analyzeSkinImage(imageId: string): Promise<any> {
  const response = await apiClient.post("/api/analyzer/scan", { imageId });
  return response.data;
}

/** 🌿 Ingredient Analyzer **/
export async function analyzeIngredients(ingredients: string): Promise<any> {
  const response = await apiClient.post("/api/analyzer/ingredients", { ingredients });
  return response.data;
}

export default apiClient;