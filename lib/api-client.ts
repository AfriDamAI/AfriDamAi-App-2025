import axios from "axios";
import { environment } from "./environment";
import { UserLoginDto, CreateUserDto, AuthResponse } from "./types"; // Assuming types are defined in ./types

const apiClient = axios.create({
  baseURL: environment.backendUrl,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const login = async (credentials: UserLoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post("/api/auth/user/login", credentials);
  return response.data;
};

export const register = async (userData: CreateUserDto) => {
  const response = await apiClient.post("/api/auth/user/register", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get("/api/profile");
  return response.data;
};

export const updateProfile = async (updates: Partial<any>) => {
  const response = await apiClient.patch("/api/profile", updates);
  return response.data;
};

// Existing functions
export async function uploadImage(file: File): Promise<{ imageId: string; fileName: string }> {
    const formData = new FormData()
    formData.append("file", file)
  
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
  
    if (!response.ok) {
      throw new Error("Upload failed")
    }
  
    return response.json()
  }
  
  export async function analyzeSkinImage(imageId: string, imageData?: string): Promise<any> {
    const response = await fetch("/api/analyze-skin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId, imageData }),
    })
  
    if (!response.ok) {
      throw new Error("Analysis failed")
    }
  
    return response.json()
  }
  
  export async function analyzeIngredients(ingredients: string): Promise<any> {
    const response = await fetch("/api/analyze-ingredients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    })
  
    if (!response.ok) {
      throw new Error("Analysis failed")
    }
  
    return response.json()
  }
  
