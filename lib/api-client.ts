import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types";

/** * 🛠️ OGA FIX: Universal URL Normalizer **/
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const cleanBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const apiClient = axios.create({
  baseURL: cleanBaseUrl,
});

/** 🔐 Security Sync **/
export const setAuthToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }
};

/** 🛡️ Response Interceptor **/
apiClient.interceptors.response.use(
  (response) => {
    return response.data?.resultData ? { ...response, data: response.data.resultData } : response;
  },
  (error) => {
    if (!error.response) {
      console.error("🚀 Network Error: Check if backend is active at:", cleanBaseUrl);
    }
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Only redirect if not already on landing
        if (window.location.pathname !== "/") window.location.href = "/"; 
      }
    }
    return Promise.reject(error);
  }
);

/** 🔑 Auth Endpoints **/
export const login = async (credentials: UserLoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/user/login", credentials);
  return response.data;
};

export const register = async (userData: CreateUserDto) => {
  const response = await apiClient.post("/auth/user/register", userData);
  return response.data;
};

/** 🛡️ RE-ENFORCED: Missing Forgot Password (FIXES DEPLOY ERROR) **/
export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/user/forgot-password", { email });
  return response.data;
};

/** 👤 Profile & User Data **/
export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, updates: Partial<any>) => {
  const response = await apiClient.put(`/users/${id}`, updates);
  return response.data;
};

/** 🔬 AI Analyzer - RE-ENFORCED FOR PRODUCTION **/
export async function uploadImage(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  
  // 🚀 OGA FIX: Using the newer clinical endpoint for AI processing
  const response = await apiClient.post("/analyzer/process-request", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

/** 💳 Payments **/
export const initializePayment = async (data: { plan: string, amount: number }) => {
  const response = await apiClient.post("/payments/initialize", data);
  return response.data;
};

export default apiClient;