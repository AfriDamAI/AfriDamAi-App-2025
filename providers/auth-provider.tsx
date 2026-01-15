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
    onboardingCompleted?: boolean;
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
          
          // Check if token is expired
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
      
      // Ensure loading only stops AFTER we know the user state
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
        setUser(extractUserData(response));
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

  // 🛡️ THE SPEED FIX: Memoize the context value
  // This prevents the entire App Tree from re-rendering unless the user or loading state actually changes.
  const contextValue = useMemo(() => ({
    user,
    isSignedIn: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    refreshUser
  }), [user, isLoading]);

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