import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types";

/** * 🛠️ OGA FIX: Universal URL Normalizer
 * This logic ensures that if the environment variable has '/api', we don't add it again.
 * If it doesn't have it, we ensure the baseURL is clean.
 */
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// Remove trailing slash if present
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
    // Standardizing the response so the app always sees the 'resultData'
    return response.data?.resultData ? { ...response, data: response.data.resultData } : response;
  },
  (error) => {
    if (!error.response) {
      console.error("🚀 Network Error: Check if backend is active at:", cleanBaseUrl);
    }
    
    // Handle Token Expiry
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/"; // Send them home to log in again
      }
    }
    return Promise.reject(error);
  }
);

/** * 🔑 Auth Endpoints 
 * 🛡️ OGA FIX: Removed the extra "/api" prefix because 'baseURL' usually contains it in production
 **/
export const login = async (credentials: UserLoginDto): Promise<AuthResponse> => {
  // We use relative paths. Axios will attach these to cleanBaseUrl.
  const response = await apiClient.post("/auth/user/login", credentials);
  return response.data;
};

export const register = async (userData: CreateUserDto) => {
  const response = await apiClient.post("/auth/user/register", userData);
  return response.data;
};

/** 👤 Profile & User Data **/
export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data;
};

export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

/** 🔬 AI Analyzer **/
export async function uploadImage(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  
  /**
   * 🚀 OGA FIX: Endpoint match with AnalyzerController
   * backend route is @Post('upload') under @Controller('analyzer')
   */
  const response = await apiClient.post("/analyzer/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

export default apiClient;