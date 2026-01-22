/**
 * 🛡️ AFRIDAM AUTH PROVIDER (Rule 6 Synergy)
 * Version: 2026.1.11 (Post-Interceptor Unwrap Sync)
 * Focus: High-speed clinical bypass with accurate data extraction.
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
import { UserLoginDto, CreateUserDto, AuthResponse } from "@/lib/types"

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string; 
  sex?: string;       
  createdAt?: string; 
  phoneNo?: string;   
  profile?: {
    primaryConcern?: string;
    nationality?: string;
    skinType?: string;
    allergies?: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasToken, setHasToken] = useState<boolean>(false)

  /**
   * 🛡️ SYNCED HELPER: Interceptor now handles resultData unwrapping.
   * This helper ensures we safely grab the user object from the clean response.
   */
  const extractUserData = (data: any) => {
    // If data is already the user object or has a nested user key
    return data?.user || data;
  };

  const fetchUserData = async (userId: string) => {
    try {
      const response = await getUser(userId);
      // getUser() now returns the unwrapped resultData directly
      const userData = extractUserData(response);
      if (userData) {
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.error("Profile Fetch Failed:", err);
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
            setHasToken(true); 
            setAuthToken(token);
            await fetchUserData(decoded.sub || decoded.id || decoded.userId);
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
      /**
       * 🚀 RULE 6 FIX: The api-client interceptor has already unwrapped 'resultData'.
       * 'data' here IS now the resultData object (containing accessToken, user, etc.)
       */
      const data: any = await login(credentials);
      const accessToken = data?.accessToken;
      
      if (!accessToken) throw new Error("Invalid Token Handshake");

      // Set persistence immediately
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setHasToken(true);

      const decoded: any = jwtDecode(accessToken);
      
      // Update local user state immediately with available data from login
      const userData = extractUserData(data);
      setUser(userData);

      // Background refresh to get full clinical profile
      await fetchUserData(decoded.sub || decoded.id || decoded.userId);
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
    setHasToken(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setAuthToken(null);
    setIsLoading(false);
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
      console.error("Critical Handshake Error:", error.response?.data || error.message);
      throw error;
    }
  }

  const refreshUser = async () => {
    if (user?.id) await fetchUserData(user.id);
  }

  const requiresOnboarding = false;

  const contextValue = useMemo(() => ({
    user,
    // 🚀 THE BYPASS: True if token exists OR user is set.
    isSignedIn: hasToken || !!user,
    isLoading,
    requiresOnboarding,
    signIn,
    signUp,
    signOut,
    forgotPassword: forgotPasswordApi,
    updateUserProfile,
    refreshUser
  }), [user, isLoading, hasToken]);

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