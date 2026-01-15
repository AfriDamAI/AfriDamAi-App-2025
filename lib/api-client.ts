import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types";

/** * 🛠️ OGA FIX: Robust Base URL Handling
 * We trim any trailing slashes from the environment variable 
 * to ensure we don't end up with "//" or "/api/api" in our requests.
 */
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const cleanBaseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const apiClient = axios.create({
  baseURL: cleanBaseUrl,
});

/** 🔐 Security Sync **/
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

/** 🛡️ Response Interceptor **/
apiClient.interceptors.response.use(
  (response) => {
    return response.data?.resultData ? { ...response, data: response.data.resultData } : response;
  },
  (error) => {
    if (!error.response) {
      console.error("🚀 Network Error: Check if backend is running at:", cleanBaseUrl);
    }
    const responseData = error.response?.data;
    if (responseData?.message === "Invalid password") {
      const customError = new Error("Invalid password");
      (customError as any).response = error.response;
      return Promise.reject(customError);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
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

/** 🛠️ FIXED: Missing export for Profile Page **/
export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/api/profile/avatar", formData, {
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

/** 🔬 AI Analyzer **/
export async function uploadImage(file: File): Promise<{ imageId: string; fileName: string }> {
  const formData = new FormData();
  formData.append("file", file);
  
  /**
   * 🚀 OGA FIX: Changed route from /api/analyzer to /api/analyzer/upload
   * This ensures the request hits the backend route that triggers the scanAndSave AI logic.
   */
  const response = await apiClient.post("/api/analyzer/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

export default apiClient;