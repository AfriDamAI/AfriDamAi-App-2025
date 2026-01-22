/**
 * 🛡️ AFRIDAM AUTH PROVIDER (Rule 6 Synergy)
 * Version: 2026.1.9 (Zero-Flicker Bypass)
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
  // 🛡️ Added a local token state to bridge the gap during fetchUserData
  const [hasToken, setHasToken] = useState<boolean>(false)

  const extractUserData = (response: any) => response?.resultData?.user || response?.resultData || response?.data || response;

  const fetchUserData = async (userId: string) => {
    try {
      const response = await getUser(userId);
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
            setHasToken(true); // 🚀 Immediate bypass for the AuthGuard
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
      const data: AuthResponse = await login(credentials);
      const accessToken = data.resultData?.accessToken;
      
      if (!accessToken) throw new Error("Invalid Token Handshake");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);
      setHasToken(true);

      const decoded: any = jwtDecode(accessToken);
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

  /**
   * 🛡️ RULE 6 BYPASS: Onboarding is strictly scrapped.
   */
  const requiresOnboarding = false;

  const contextValue = useMemo(() => ({
    user,
    // 🚀 SYNERGY: If we have a token or a user, we are signed in.
    // This prevents the redirect loop while the user data is still being fetched.
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