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
  updateUserProfile as updateUserProfileApi, // 🚀 OGA FIX: Pointing to the unified profile node
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
      setUser(userData);
      return userData;
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
          
          // 🛡️ RE-ENFORCED: Automatic Session Expiry Check
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
    try {
      setIsLoading(true);
      const data = await login(credentials);
      
      // Handle various API return structures from Tobi's backend
      const accessToken = data.resultData?.accessToken || data.accessToken || data.data?.accessToken;
      
      if (!accessToken) throw new Error("Sync Failed: Invalid Token Payload");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);

      const decoded: any = jwtDecode(accessToken);
      const userId = decoded.sub || decoded.id || decoded.userId;
      
      await fetchUserData(userId);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const signUp = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      await register(userData);
      // Auto-login after successful registration
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
      /** * 🚀 OGA FIX: PATH ALIGNMENT
       * Tobi's new schema expects profile updates through the dedicated /profile/update node
       * which handles the aesthetic and identity fields simultaneously.
       */
      const response = await updateUserProfileApi(updates);
      const updatedUser = extractUserData(response);
      
      setUser(prev => {
        if (!prev) return updatedUser;
        return { ...prev, ...updatedUser };
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  const refreshUser = async () => {
    if (user?.id) await fetchUserData(user.id);
  }

  /**
   * 🛡️ THE NUCLEAR STABILIZER
   * Prevents premature redirection by verifying loading state
   */
  const requiresOnboarding = useMemo(() => {
    if (isLoading || !user) return false;
    
    const isDone = 
      user.onboardingCompleted === true || 
      user.profile?.onboardingCompleted === true || 
      user.profile?.hasCompletedOnboarding === true;

    return !isDone;
  }, [user, isLoading]);

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