import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "@/lib/types";

/**
 * 🛡️ AFRIDAM INFRASTRUCTURE SYNC
 * Version: 2026.01.26
 * Fix: Forced token sanitation to prevent double-quote JSON errors.
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://afridamai-backend.onrender.com/api";
const aiURL = "https://afridam-ai2-api-131829695574.us-central1.run.app/api/v1";

// 🧼 HELPER: Ensures the token is a clean string (No double quotes)
const sanitizeToken = (token: string | null): string | null => {
  if (!token) return null;
  // Remove any leading/trailing double quotes that cause NestJS 400 errors
  return token.replace(/^"|"$/g, '');
};

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
      const rawToken = localStorage.getItem("token");
      const token = sanitizeToken(rawToken);
      
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
    const cleanToken = sanitizeToken(token);
    
    if (cleanToken) {
      localStorage.setItem("token", cleanToken);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${cleanToken}`;
    } else {
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }
};

/** 🛡️ RULE 3 & 4: RESPONSE INTERCEPTOR **/
apiClient.interceptors.response.use(
  (response) => {
    // NestJS 'resultData' unwrap logic
    if (response.data && response.data.resultData) {
      return { ...response, data: response.data.resultData };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
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
  const { country, ...rest } = userData as any;
  const payload = { ...rest, nationality: country || "Nigerian" };
  const response = await apiClient.post("/auth/user/register", payload);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

/** 👤 USER PROFILE HANDSHAKE **/
export const getProfile = async () => {
  const response = await apiClient.get("/users/me");
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

/** 🔬 AI SCAN MODULE **/
// export async function uploadImage(file: File | string): Promise<any> {
//   const formData = new FormData();
//   if (typeof file === 'string') {
//     try {
//       const parts = file.split(',');
//       const byteString = atob(parts[1]);
//       const mimeString = parts[0].split(':')[1].split(';')[0];
//       const ab = new ArrayBuffer(byteString.length);
//       const ia = new Uint8Array(ab);
//       for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
//       const blob = new Blob([ab], { type: mimeString });
//       formData.append("file", blob, "scan_capture.jpg");
//     } catch (e) { console.error("Image Processing Error:", e); }
//   } else {
//     formData.append("file", file);
//   }
//   // Default AI context
//   formData.append("more_info", JSON.stringify({
//     region: "West Africa",
//     country: "Nigeria",
//     known_skintone_type: "not_specified",
//     gender: "female", 
//     age: 25,
//     known_allergies: [], 
//     user_activeness_on_app: "moderate" 
//   }));
  
//   const response = await axios.post(`${aiURL}/skin-diagnosis`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// }

export const analyzeIngredients = async (ingredients: string) => {
  const response = await axios.post(`${aiURL}/ingredients-analysis`, { query: ingredients });
  return response.data;
};

export const sendChatMessage = async (message: string) => {
  const response = await axios.post(`${aiURL}/chatbot`, { query: message });
  return response.data;
};

/** 💳 PAYMENTS & MARKETPLACE **/
export const initializePayment = async (data: any) => {
  const response = await apiClient.post("/transaction/initiate", data);
  return response.data;
};

export const verifyPayment = async (transactionId: string) => {
  const response = await apiClient.post(`/transaction/${transactionId}/verify`);
  return response.data;
};

export const getProducts = async () => {
  const response = await apiClient.get("/product");
  return response.data;
};

export const getScanHistory = async (userId: string) => {
  const response = await apiClient.get(`/v1/result/${userId}`); 
  return response.data;
};

export const getSingleScanResult = async (resultId: string) => {
  const response = await apiClient.get(`/v1/result/${resultId}`);
  return response.data;
};

/** 🔬 AI SKIN DIAGNOSIS WITH USER CONTEXT **/
export const analyzeSkinWithUserData = async (imgSource: string, userContext: any) => {
  const formData = new FormData();
  
  // Convert base64 to blob
  const parts = imgSource.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: mimeString });
  
  formData.append("file", blob, "scan_capture.jpg");
  // Create a default user context for AI analysis based on successful Postman request
  const defaultUserContext = {
    region: userContext.region || "West Africa",
    country: userContext.country || "Nigeria",
    known_skintone_type: "string", // Placeholder from successful Postman
    skin_type_last_time_checked: "9999-01-01T10:38:38.511Z", // Placeholder from successful Postman
    known_skin_condition: userContext.known_skin_condition || "none",
    skin_condition_last_time_checked: "9999-01-01T19:25:48.468Z", // Placeholder from successful Postman
    gender: "female", // Placeholder from successful Postman
    age: userContext.age || 0,
    known_body_lotion: "string", // Placeholder from successful Postman
    known_body_lotion_brand: "string", // Placeholder from successful Postman
    known_allergies: userContext.known_allergies || [],
    known_last_skin_treatment: "9999-01-01T21:11:39.461Z", // Placeholder from successful Postman
    known_last_consultation_with_afridermatologists: "9999-01-01T12:14:05.225Z", // Placeholder from successful Postman
    user_activeness_on_app: userContext.user_activeness_on_app || "very_high",
  };
  formData.append("more_info", JSON.stringify(defaultUserContext));
  
  const response = await apiClient.post("/v1/skin-diagnosis", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export default apiClient;
