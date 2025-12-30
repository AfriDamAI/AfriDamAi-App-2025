"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode";
import { login, register, getProfile, setAuthToken, updateProfile as apiUpdateProfile, getUser, updateUser } from "../lib/api-client"
import { UserLoginDto, CreateUserDto } from "../lib/types"

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: string;
  phoneNo: string;
  profile: {
    id: string;
    userId: string;
    ageRange: number;
    skinType: string;
    knownSkinAllergies: string[];
    previousTreatments: string[];
    createdAt: string;
    updatedAt: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null
  isSignedIn: boolean
  signIn: (credentials: UserLoginDto) => Promise<void>
  signUp: (userData: CreateUserDto) => Promise<void>
  signOut: () => void
  updateUserProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.sub || decoded.id;
        if (userId) {
          getUser(userId).then((response: any) => {
            const userData = response.resultData || response;
            setUser(userData);
          }).catch((err: any) => {
            console.error("User fetch error:", err);
            signOut();
          });
        }
      } catch (err) {
        console.error("Token decode error:", err);
        signOut();
      }
    }
  }, []);

  const signIn = async (credentials: UserLoginDto) => {
    try {
      const data = await login(credentials);
      const { accessToken } = data;
      localStorage.setItem("token", accessToken);
      setAuthToken(accessToken);

      const decoded: any = jwtDecode(accessToken);
      const userId = decoded.sub || decoded.id;
      const response = await getUser(userId);
      setUser(response.resultData || response);
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  const signUp = async (userData: CreateUserDto) => {
    try {
      await register(userData);
      // Automatically sign in the user directly after registration
      await signIn({ email: userData.email, password: userData.password });
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("token");
    setAuthToken(null);
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (user && user.id) {
      const response = await updateUser(user.id, updates);
      setUser(response.resultData || response);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signUp, signOut, updateUserProfile }}>
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
