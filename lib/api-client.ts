import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "@/lib/types";

/** * 🛡️ OGA FIX: Simple & Direct Pathing
 * Ensure NEXT_PUBLIC_API_URL on Vercel is: https://afridamai-backend.onrender.com/api
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL,
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
    if (response.data && response.data.resultData) {
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
  const response = await apiClient.post("/auth/forgot-password", { email });
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

export const updateUser = async (id: string, updates: any) => {
  const response = await apiClient.put(`/users/${id}`, updates);
  return response.data;
};

/** 🛡️ TOBI'S UNIFIED CONTEXT 
 * This is the 'UserContextDto' the AI team needs for all endpoints.
 **/
const defaultAiContext = {
  skinType: "not_specified",
  duration: "recent",
  symptoms: ["routine_check"],
  history: "none"
};

/** 🔬 AI SERVICE MODULE **/
export async function uploadImage(file: File | string): Promise<any> {
  const formData = new FormData();
  
  if (typeof file === 'string') {
    const res = await fetch(file);
    const blob = await res.blob();
    formData.append("file", blob, "scan_capture.jpg");
  } else {
    formData.append("file", file);
  }

  // AI Team requirement: more_info must be a string for multipart/form-data
  formData.append("more_info", JSON.stringify(defaultAiContext));
  
  const response = await apiClient.post("/v1/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

export const analyzeIngredients = async (ingredients: string) => {
  // AI Team requirement: IngredientsAnalysisRequestDto
  const response = await apiClient.post("/v1/ingredients-analysis", { 
    ingredients,
    context: defaultAiContext 
  });
  return response.data;
};

export const sendChatMessage = async (message: string) => {
  // AI Team requirement: ChatbotRequestDto
  const response = await apiClient.post("/v1/chatbot", { 
    message,
    context: defaultAiContext 
  });
  return response.data;
};

/** 💳 PAYMENTS **/
export const initializePayment = async (data: { plan: string, amount: number }) => {
  const response = await apiClient.post("/transactions/initiate", data);
  return response.data;
};

export default apiClient;