"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
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
    avatarUrl?: string;
    bio?: string;
    onboardingCompleted?: boolean; // 👈 This is our Shield
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null
  isSignedIn: boolean
  isLoading: boolean
  requiresOnboarding: boolean // 👈 NEW: Explicitly check for fresh users
  signIn: (credentials: UserLoginDto) => Promise<void>
  signUp: (userData: CreateUserDto) => Promise<void>
  signOut: () => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
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
      console.error("Failed to fetch user data:", err);
      signOut();
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
            const userId = decoded.sub || decoded.id;
            if (userId) {
              await fetchUserData(userId);
            }
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
      setIsLoading(true);
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
    } finally {
      // 🛡️ OGA FIX: We don't stop loading until the USER state is fully set with profile info
      setIsLoading(false);
    }
  }

  const signUp = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      await register(userData);
      await signIn({ email: userData.email, password: userData.password });
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
    setIsLoading(false);
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (user?.id) {
      try {
        const response = await updateUser(user.id, updates);
        const updatedUser = extractUserData(response);
        setUser(updatedUser);
      } catch (error) {
        console.error("Profile update failed:", error);
        throw error;
      }
    }
  }

  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserData(user.id);
    }
  }

  // 🛡️ THE GATEKEEPER logic
  const requiresOnboarding = useMemo(() => {
    if (!user) return false;
    // If onboardingCompleted is not explicitly TRUE, they REQUIRE onboarding.
    return user.profile?.onboardingCompleted !== true;
  }, [user]);

  const contextValue = useMemo(() => ({
    user,
    isSignedIn: !!user,
    isLoading,
    requiresOnboarding, // 👈 Exposed to the whole app
    signIn,
    signUp,
    signOut,
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