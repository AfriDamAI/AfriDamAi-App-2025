import axios from "axios";
import { environment } from "./environment";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types";

const apiClient = axios.create({
  // Ensure this points to http://localhost:3001 (The prefix 'api' is handled below)
  baseURL: environment.backendUrl || "http://localhost:3001",
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
    // 🛡️ Handles cases where the backend is down or the URL is wrong
    if (!error.response) {
      console.error("🚀 Network Error: Check if backend is running on 3001 and URL is correct.");
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

/** 🔑 Auth Endpoints - Fixed Paths **/
export const login = async (credentials: UserLoginDto): Promise<AuthResponse> => {
  // We use /api here because your backend main.ts has setGlobalPrefix('api')
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