"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode";
import {
  login,
  register,
  setAuthToken,
  getUserMe as getProfile,
  updateUser,
  forgotPassword as forgotPasswordApi,
  createUserProfile,
  updateUserProfile as updateUserProfileApi,
  skipOnboarding as skipOnboardingApi
} from "@/lib/api-client"
import { UserLoginDto, CreateUserDto, User, CreateUserProfileDto, UpdateUserProfileDto, UserProfile } from "@/lib/types"

/**
 * 🛡️ AFRIDAM AUTH PROVIDER (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: High-Speed Mobile Transitions & Background Data Fetching.
 */

// 🛡️ User type is now imported from lib/types.ts

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
  createProfile: (profileData: CreateUserProfileDto) => Promise<UserProfile | null>
  updateProfile: (profileData: UpdateUserProfileDto) => Promise<UserProfile | null>
  skipOnboarding: () => Promise<void>
  refreshUser: () => Promise<void>
  mutate: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tokenLoaded, setTokenLoaded] = useState(false)

  const extractUserData = (data: any) => data?.user || data;

  const fetchUserData = async () => {
    try {
      const response = await getProfile();
      const userData = extractUserData(response);
      if (userData) {
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.log("Profile update pending...");
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
            // Background fetch for mobile speed
            fetchUserData();
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
      // 🚀 THE FIX: Catching token from various backend response styles
      const accessToken = data?.accessToken || data?.access_token || data?.token;

      if (!accessToken) throw new Error("Connection failed: Please check your details.");

      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);

      // 🛡️ IMMEDIATE ACCESS: Set state before background fetching profile
      setTokenLoaded(true);

      const userData = extractUserData(data);
      if (userData) setUser(userData);

      // We don't 'await' this so the user enters the dashboard instantly
      fetchUserData();

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
      await fetchUserData();
    }
  }

  const updateUserProfile = async (updates: Partial<any>) => {
    if (!user?.id) return null;
    try {
      const { id, email, ...cleanUpdates } = updates;
      // If profile is in updates, we might need to handle it differently if the backend expects /profile
      // but if the user record update works, we keep it for compatibility.
      const response = await updateUser(user.id, cleanUpdates);
      const updatedData = extractUserData(response);
      setUser(prev => prev ? { ...prev, ...updatedData } : updatedData);
      return updatedData;
    } catch (error: any) {
      throw error;
    }
  }

  const createProfile = async (profileData: CreateUserProfileDto) => {
    try {
      const response = await createUserProfile(profileData);
      await refreshUser(); // Refresh user to get the updated profile and onboardingCompleted status
      return response;
    } catch (error: any) {
      console.error("Create Profile Failed:", error);
      throw error;
    }
  }

  const updateProfile = async (profileData: UpdateUserProfileDto) => {
    try {
      const response = await updateUserProfileApi(profileData);
      await refreshUser();
      return response;
    } catch (error: any) {
      console.error("Update Profile Failed:", error);
      throw error;
    }
  }

  const skipOnboarding = async () => {
    try {
      await skipOnboardingApi();
      await refreshUser();
    } catch (error: any) {
      console.error("Skip Onboarding Failed:", error);
      throw error;
    }
  }

  const contextValue = useMemo(() => ({
    user,
    isSignedIn: tokenLoaded,
    isLoading,
    requiresOnboarding: false, // 🚀 Bypass set to false for clean user flow
    signIn,
    signUp,
    signOut,
    forgotPassword: forgotPasswordApi,
    updateUserProfile,
    createProfile,
    updateProfile,
    skipOnboarding,
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
  if (!context) throw new Error("useAuth error");
  return context;
};