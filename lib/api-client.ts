import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "@/lib/types";

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

/** 🛡️ TOBI & NATHAN'S UNIFIED CONTEXT **/
const defaultAiContext = {
  skinType: "not_specified",
  duration: "recent",
  symptoms: ["routine_check"],
  history: "none"
};

/** 🔬 AI SERVICE MODULE - FULL SYNC **/
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

  // 🛡️ NATHAN SYNC: Stringified for Python json.loads()
  formData.append("more_info", JSON.stringify(defaultAiContext));
  
  const response = await apiClient.post("/v1/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

export const analyzeIngredients = async (ingredients: string) => {
  // 🛡️ NATHAN SYNC: Context must be a stringified JSON
  const response = await apiClient.post("/v1/ingredients-analysis", { 
    ingredients,
    context: JSON.stringify(defaultAiContext) 
  });
  return response.data;
};

export const sendChatMessage = async (message: string) => {
  // 🛡️ NATHAN SYNC: Context must be a stringified JSON
  const response = await apiClient.post("/v1/chatbot", { 
    message,
    context: JSON.stringify(defaultAiContext) 
  });
  return response.data;
};

/** 💳 PAYMENTS **/
export const initializePayment = async (data: { plan: string, amount: number }) => {
  const response = await apiClient.post("/transactions/initiate", data);
  return response.data;
};

export default apiClient;