"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode";
import { login, register, setAuthToken, getUser, updateUser, forgotPassword as forgotPasswordApi } from "../lib/api-client"
import { UserLoginDto, CreateUserDto } from "../lib/types"

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: string;
  phoneNo: string;
  onboardingCompleted?: boolean; // 🛡️ Root level check
  profile?: {
    avatarUrl?: string;
    onboardingCompleted?: boolean;
    hasCompletedOnboarding?: boolean;
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
  forgotPassword: (email: string) => Promise<void> // 🛡️ ADDED MISSING LINK
  updateUserProfile: (updates: Partial<any>) => Promise<User | null>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      console.error("Clinical Data Fetch Failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") return;
      setIsLoading(true); // 🛡️ Ensure guard is active

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
      const accessToken = data.resultData?.accessToken || data.accessToken || data.data?.accessToken;
      
      if (!accessToken) throw new Error("Authentication failed: No token");

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
      await signIn({ email: userData.email, password: userData.password });
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      // 🛡️ RE-ENFORCED: Actually call the backend we fixed
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
    if (!user?.id) return null;
    try {
      const response = await updateUser(user.id, updates);
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
   * Only returns a value once loading is complete to prevent the "Login Flicker"
   */
  const requiresOnboarding = useMemo(() => {
    if (isLoading || !user) return false;
    
    // Check root and profile levels
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