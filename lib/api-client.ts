import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "@/lib/types";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const cleanBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const apiClient = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    "Content-Type": "application/json",
  }
});

/** 🛡️ REQUEST INTERCEPTOR **/
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

/** 🔐 SECURITY SYNC **/
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

/** 🛡️ RESPONSE INTERCEPTOR **/
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && Object.prototype.hasOwnProperty.call(response.data, 'resultData')) {
        return { ...response, data: response.data.resultData };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/") window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

/** 🔑 AUTH ENDPOINTS **/
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

/** 👤 USER DATA **/
export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// 🛡️ SYNCED: This is exported as updateUser to match the AuthProvider import
export const updateUser = async (id: string, updates: any) => {
  const response = await apiClient.put(`/users/${id}`, updates);
  return response.data;
};

/** 🔬 AI SERVICE MODULE - RECTIFIED FOR TOBI'S LATEST PUSH **/

// 🛡️ OGA FIX: Updated path from /analyzer to /ai as per Tobi's WhatsApp
export async function uploadImage(file: File | string): Promise<any> {
  const formData = new FormData();
  if (typeof file === 'string') {
    const res = await fetch(file);
    const blob = await res.blob();
    formData.append("file", blob, "scan_capture.jpg");
  } else {
    formData.append("file", file);
  }
  
  // 🚀 PATH UPDATED TO MATCH NEW AI MODULE (Revision 17 Truth)
  const response = await apiClient.post("/ai/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

// 👶 NEW: Tobi's Ingredient Analysis Node
export const analyzeIngredients = async (ingredients: string) => {
  const response = await apiClient.post("/ai/ingredient-check", { ingredients });
  return response.data;
};

// 💬 NEW: Tobi's Aesthetic Chatbot Node
export const sendChatMessage = async (message: string) => {
  const response = await apiClient.post("/ai/chat", { message });
  return response.data;
};

/** 💳 PAYMENTS **/
export const initializePayment = async (data: { plan: string, amount: number }) => {
  const response = await apiClient.post("/payments/initialize", data);
  return response.data;
};

export default apiClient;