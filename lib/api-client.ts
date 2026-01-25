import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "@/lib/types";

/**
 * 🛡️ AFRIDAM INFRASTRUCTURE SYNC
 * Version: 2026.1.25
 * baseURL: Synced with Render Backend (Global Prefix 'api')
 * aiURL: Synced with Google Cloud Run (FastAPI '/api/v1')
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://afridamai-backend.onrender.com/api";
const aiURL = "https://afridam-ai2-api-131829695574.us-central1.run.app/api/v1";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});

/** 🛡️ RULE 3: REQUEST GATEKEEPER **/
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

/** 🔐 SECURITY HANDSHAKE **/
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

/** 🛡️ RULE 3 & 4: RESPONSE INTERCEPTOR - 202 SYNC
 * Extracts data from NestJS 'resultData' wrapper while preserving standard structure.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Flexible unwrapping for both wrapped and direct JSON responses
    if (response.data && response.data.resultData) {
      return { ...response, data: response.data.resultData };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        const currentPath = window.location.pathname;
        if (currentPath !== "/" && currentPath !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/** 🔑 RULE 4: AUTH ENDPOINTS - SYNCED TO NESTJS CONTROLLER **/
export const login = async (credentials: UserLoginDto): Promise<AuthResponse> => {
  // Syncs with @Post('user/login')
  const response = await apiClient.post("/auth/user/login", credentials);
  return response.data;
};

export const register = async (userData: CreateUserDto) => {
  // 🌍 NATIONALITY SYNC: Remapping country field for clinical database
  const { country, ...rest } = userData as any;
  const payload = {
    ...rest,
    nationality: country || "Nigerian"
  };

  const response = await apiClient.post("/auth/user/register", payload);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

/** 👤 USER PROFILE HANDSHAKE **/
export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await apiClient.get(`/user/${id}`);
  return response.data;
};

export const updateUser = async (id: string, updates: any) => {
  const response = await apiClient.patch(`/user/${id}`, updates);
  return response.data;
};

/** 🔬 AI CONTEXT - SKIN SETTINGS **/
const defaultAiContext = {
  region: "West Africa",
  country: "Nigeria",
  known_skintone_type: "not_specified",
  skin_type_last_time_checked: null,
  known_skin_condition: "none",
  skin_condition_last_time_checked: null,
  gender: "female", 
  age: 25,
  known_body_lotion: "none",
  known_body_lotion_brand: "none",
  known_allergies: [], 
  known_last_skin_treatment: null,
  known_last_consultation_with_afridermatologists: null,
  user_activeness_on_app: "moderate" 
};

/** 🔬 RULE 3: AI SCAN MODULE **/
export async function uploadImage(file: File | string): Promise<any> {
  const formData = new FormData();
  
  if (typeof file === 'string') {
    try {
      const parts = file.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append("file", blob, "scan_capture.jpg");
    } catch (e) {
      console.error("Image Processing Error:", e);
    }
  } else {
    formData.append("file", file);
  }

  formData.append("more_info", JSON.stringify(defaultAiContext));
  
  const response = await axios.post(`${aiURL}/skin-diagnosis`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

export const analyzeIngredients = async (ingredients: string) => {
  const response = await axios.post(`${aiURL}/ingredients-analysis`, { 
    query: ingredients,
    more_info: defaultAiContext 
  });
  return response.data;
};

export const sendChatMessage = async (message: string) => {
  const response = await axios.post(`${aiURL}/chatbot`, { 
    query: message,
    more_info: defaultAiContext 
  });
  return response.data;
};

/** 💳 PAYMENTS SYNC **/
export const initializePayment = async (data: { 
  plan: string, 
  amount: number, 
  appointmentId?: string, 
  orderId?: string 
}) => {
  const response = await apiClient.post("/transaction/initiate", data);
  return response.data;
};

export const verifyPayment = async (transactionId: string) => {
  const response = await apiClient.post(`/transaction/${transactionId}/verify`);
  return response.data;
};

/** 🛍️ RULE 4: MARKETPLACE SYNC **/
export const getProducts = async () => {
  const response = await apiClient.get("/product");
  return response.data;
};

/** 🚀 RULE 5: CLINICAL DIARY HISTORY **/
export const getScanHistory = async () => {
  const response = await apiClient.get("/analyzer/history"); 
  return response.data;
};

export default apiClient;