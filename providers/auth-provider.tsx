/**
 * 🛡️ AFRIDAM AUTH PROVIDER (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Eliminating Login Loops & Full TypeScript Compliance.
 */

"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode";
import { 
  login, 
  register, 
  setAuthToken, 
  getUser, 
  updateUser, 
  forgotPassword as forgotPasswordApi 
} from "@/lib/api-client" 
import { UserLoginDto, CreateUserDto } from "@/lib/types"

// --- 🏛️ TYPES & INTERFACES ---
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  onboardingCompleted: boolean;
  phoneNo?: string;   
  profile?: {
    skinType?: string;
    melaninTone?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null
  isSignedIn: boolean
  isLoading: boolean
  requiresOnboarding: boolean 
  signIn: (credentials: UserLoginDto) => Promise<void>
  signUp: (userData: CreateUserDto) => Promise<void>
  signOut: () => void
  forgotPassword: (email: string) => Promise<void>
  updateUserProfile: (updates: Partial<any>) => Promise<User | null>
  refreshUser: () => Promise<void> 
  mutate: () => Promise<void>     
}

// 🚀 THE FIX: Declaring the context properly
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tokenLoaded, setTokenLoaded] = useState(false)

  const extractUserData = (data: any) => data?.user || data;

  const fetchUserData = async (userId: string) => {
    try {
      const response = await getUser(userId);
      const userData = extractUserData(response);
      if (userData) {
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.error("Profile sync paused");
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          if (decoded.exp && decoded.exp < Date.now() / 1000) {
            signOut();
          } else {
            setAuthToken(token);
            setTokenLoaded(true); 
            await fetchUserData(decoded.sub || decoded.id);
          }
        } catch (err) {
          signOut();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const signIn = async (credentials: UserLoginDto) => {
    setIsLoading(true);
    try {
      const data: any = await login(credentials);
      const accessToken = data?.access_token;
      
      if (!accessToken) throw new Error("Connection failed: No token received");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      
      const userData = extractUserData(data);
      setUser(userData);
      setTokenLoaded(true); // 🚀 Triggers Guard to allow access

      const decoded: any = jwtDecode(accessToken);
      await fetchUserData(decoded.sub || decoded.id);
    } catch (error) {
      signOut();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const signUp = async (userData: CreateUserDto) => {
    setIsLoading(true);
    try {
      await register(userData);
      await signIn({ email: userData.email, password: userData.password });
    } finally {
      setIsLoading(false);
    }
  }

  const signOut = () => {
    setUser(null);
    setTokenLoaded(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setAuthToken(null);
    setIsLoading(false);
  }

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      await fetchUserData(decoded.sub || decoded.id);
    }
  }

  const updateUserProfile = async (updates: Partial<any>) => {
    if (!user?.id) return null;
    try {
      const { id, email, ...cleanUpdates } = updates;
      const response = await updateUser(user.id, cleanUpdates);
      const updatedData = extractUserData(response);
      setUser(prev => prev ? { ...prev, ...updatedData } : updatedData);
      return updatedData;
    } catch (error: any) {
      throw error;
    }
  }

  const contextValue = useMemo(() => ({
    user,
    isSignedIn: tokenLoaded,
    isLoading,
    requiresOnboarding: false, // 🚀 Loop-bypass locked
    signIn,
    signUp,
    signOut,
    forgotPassword: forgotPasswordApi,
    updateUserProfile,
    refreshUser,
    mutate: refreshUser 
  }), [user, isLoading, tokenLoaded]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};