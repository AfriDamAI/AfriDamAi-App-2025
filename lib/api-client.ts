import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types";

/** 🛠️ OGA FIX: Universal URL Normalizer **/
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const cleanBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const apiClient = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    "Content-Type": "application/json",
  }
});

/** 🛡️ REQUEST INTERCEPTOR: The "Always-On" Auth Guard **/
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** 🔐 Manual Security Sync (Used during Login/Logout) **/
export const setAuthToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }
};

/** 🛡️ RESPONSE INTERCEPTOR: Clinical Data Extractor **/
apiClient.interceptors.response.use(
  (response) => {
    // 🚀 OGA FIX: Safely unwrap resultData without losing the response structure
    if (response.data && Object.prototype.hasOwnProperty.call(response.data, 'resultData')) {
        return { ...response, data: response.data.resultData };
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error("🚀 Critical Node Offline:", cleanBaseUrl);
    }
    
    // 🛡️ RE-ENFORCED: Standardize 401 Unauthorized handling for Play Store
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Only kick to home if we aren't already there (avoids infinite loops)
        if (window.location.pathname !== "/") {
            window.location.href = "/";
        }
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

export const updateUserProfile = async (updates: any) => {
  // 🚀 OGA FIX: Points to the unified profile update node
  const response = await apiClient.put("/profile/update", updates);
  return response.data;
};

/** 🔬 AI Analyzer - RE-ENFORCED FOR PRODUCTION **/
export async function uploadImage(file: File | string): Promise<any> {
  const formData = new FormData();
  
  if (typeof file === 'string') {
    // 🛡️ RE-ENFORCED: Handle Base64 from CameraUpload component
    const res = await fetch(file);
    const blob = await res.blob();
    formData.append("file", blob, "scan_capture.jpg");
  } else {
    formData.append("file", file);
  }
  
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