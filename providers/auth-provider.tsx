"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode";

/** * 🛡️ OGA FIX: Switched to Absolute Aliases (@/) 
 * This prevents the Vercel "Module Not Found" error caused by relative path sensitivity.
 */
import { 
  login, 
  register, 
  setAuthToken, 
  getUser, 
  updateUser as updateUserProfileApi, 
  forgotPassword as forgotPasswordApi 
} from "@/lib/api-client" 

import { UserLoginDto, CreateUserDto } from "@/lib/types"

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: string;
  phoneNo: string;
  onboardingCompleted?: boolean;
  profile?: {
    avatarUrl?: string;
    onboardingCompleted?: boolean;
    hasCompletedOnboarding?: boolean;
    subscriptionPlan?: string;
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

  // 🛡️ RE-ENFORCED: Unified Data Normalizer for NestJS Responses
  const extractUserData = (response: any) => {
    return response?.resultData || response?.data || response;
  };

  const fetchUserData = async (userId: string) => {
    try {
      const response = await getUser(userId);
      const userData = extractUserData(response);
      
      if (userData) {
        setUser(userData);
        return userData;
      }
      return null;
    } catch (err) {
      console.error("Aesthetic Node Sync Failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < currentTime) {
            signOut();
          } else {
            setAuthToken(token);
            const userId = decoded.sub || decoded.id || decoded.userId;
            if (userId) {
              await fetchUserData(userId);
            }
          }
        } catch (err) {
          console.error("Auth Initialisation Error:", err);
          signOut();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (credentials: UserLoginDto) => {
    setIsLoading(true); // 🛡️ Keep loading TRUE during the entire handshake
    try {
      const data = await login(credentials);
      
      const accessToken = data.resultData?.accessToken || data.accessToken || data.data?.accessToken;
      
      if (!accessToken) throw new Error("Sync Failed: Invalid Token Payload");

      // 🔐 SECURING THE TOKEN IMMEDIATELY
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);

      const decoded: any = jwtDecode(accessToken);
      const userId = decoded.sub || decoded.id || decoded.userId;
      
      // 🚀 WAIT for user data before letting the Guard move
      await fetchUserData(userId);
    } catch (error: any) {
      localStorage.removeItem("token");
      setAuthToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const signUp = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      await register(userData);
      await signIn({ email: userData.email, password: userData.password });
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await forgotPasswordApi(email);
    } catch (error: any) {
      throw error;
    }
  }

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
    setIsLoading(false);
  }

  const updateUserProfile = async (updates: Partial<any>): Promise<User | null> => {
    try {
      const response = await updateUserProfileApi(updates);
      const updatedData = extractUserData(response);
      
      setUser(prev => {
        if (!prev) return updatedData;
        return { ...prev, ...updatedData };
      });
      return updatedData;
    } catch (error) {
      throw error;
    }
  }

  const refreshUser = async () => {
    if (user?.id) await fetchUserData(user.id);
  }

  /**
   * 🛡️ THE NUCLEAR STABILIZER (EMERGENCY BYPASS)
   * Forced to FALSE for launch. This prevents the dashboard from redirecting 
   * users back to onboarding in a fresh database environment.
   */
  const requiresOnboarding = useMemo(() => {
    return false; // 🚀 BYPASS ACTIVE: All users proceed directly to Dashboard
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isSignedIn: !!user,
    isLoading,
    requiresOnboarding,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    updateUserProfile,
    refreshUser
  }), [user, isLoading, requiresOnboarding]);

  return (
    <AuthContext.Provider value={contextValue}>
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