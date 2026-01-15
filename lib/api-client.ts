import axios from "axios";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types";

/** * 🛠️ OGA FIX: Direct access to process.env
 * We bypass the environment object here to ensure Next.js injects 
 * the Vercel variable directly into the client-side bundle.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
    // Standardizing response data access
    return response.data?.resultData ? { ...response, data: response.data.resultData } : response;
  },
  (error) => {
    if (!error.response) {
      console.error("🚀 Network Error: Check if backend is running at:", process.env.NEXT_PUBLIC_API_URL);
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
  const response = await apiClient.post("/api/analyzer", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export default apiClient;