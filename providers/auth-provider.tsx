"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode";
import { login, register, setAuthToken, getUser, updateUser } from "../lib/api-client"
import { UserLoginDto, CreateUserDto } from "../lib/types"

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: string;
  phoneNo: string;
  profile?: {
    avatarUrl?: string; // Added for the technical team's profile feature
    bio?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null
  isSignedIn: boolean
  isLoading: boolean
  signIn: (credentials: UserLoginDto) => Promise<void>
  signUp: (userData: CreateUserDto) => Promise<void>
  signOut: () => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void> // Added to sync profile pic after upload
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Helper to extract clean user data from various NestJS response formats
  const extractUserData = (response: any) => {
    return response?.resultData || response?.data || response;
  };

  const fetchUserData = async (userId: string) => {
    try {
      const response = await getUser(userId);
      setUser(extractUserData(response));
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      signOut();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        try {
          const decoded: any = jwtDecode(token);
          const userId = decoded.sub || decoded.id;
          if (userId) {
            await fetchUserData(userId);
          }
        } catch (err) {
          console.error("Auth initialization failed:", err);
          signOut();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (credentials: UserLoginDto) => {
    try {
      const data = await login(credentials);
      const accessToken = data.resultData?.accessToken || data.accessToken || data.data?.accessToken;
      
      if (!accessToken) throw new Error("No access token received from server");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);

      const decoded: any = jwtDecode(accessToken);
      const userId = decoded.sub || decoded.id;
      
      await fetchUserData(userId);
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  const signUp = async (userData: CreateUserDto) => {
    try {
      await register(userData);
      await signIn({ email: userData.email, password: userData.password });
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (user?.id) {
      try {
        const response = await updateUser(user.id, updates);
        setUser(extractUserData(response));
      } catch (error) {
        console.error("Profile update failed:", error);
        throw error;
      }
    }
  }

  // New function for the UI to call after a successful image upload
  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserData(user.id);
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isSignedIn: !!user, 
      isLoading, 
      signIn, 
      signUp, 
      signOut, 
      updateUserProfile,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}