"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { AxiosError } from "axios";
import { AuthApi, VerifyTwoFaRequest } from "@/services/authApi";
import { getAuthUser, setAuthUser } from "@/services/storage/authStorage";
import { useToast } from "./ToastContext";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: string | undefined;
}

interface AuthContextType {
  user: User | null;
  loginAgent: (
    userData: Record<string, unknown>,
    setOtpSent: (v: boolean) => void
  ) => Promise<void>;
  loginSU: (
    userData: Record<string, unknown>,
    setOtpSent: (v: boolean) => void
  ) => Promise<void>;
  verifyOtp: (otpData: VerifyTwoFaRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user from localStorage only on client
  useEffect(() => {
    try {
      const storedUser = getAuthUser<User>();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Failed to load user from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to send OTP requests
  const sendOtp = async (
    endpoint: string,
    userData: Record<string, unknown>,
    setOtpSent: (v: boolean) => void
  ) => {
    try {
      await AuthApi.sendOtp({ audience: endpoint, payload: userData });
      showToast(`OTP sent successfully to ${endpoint}`, "success");
      setOtpSent(true);
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      showToast(err.response?.data?.message || "Failed to send OTP", "error");
      console.error("Send OTP Error:", err.message);
      throw err;
    }
  };

  const loginAgent = (
    userData: Record<string, unknown>,
    setOtpSent: (v: boolean) => void
  ) =>
    sendOtp("agent", userData, setOtpSent);

  const loginSU = (
    userData: Record<string, unknown>,
    setOtpSent: (v: boolean) => void
  ) =>
    sendOtp("super-admin", userData, setOtpSent);

  const verifyOtp = async (otpData: VerifyTwoFaRequest) => {
    try {
      const response = await AuthApi.verifyTwoFa(otpData);
      if (response.user) {
        setAuthUser(response.user);
        setUser(response.user as User);
      }
      showToast("Login successful", "success");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      showToast(err.response?.data?.message || "OTP verification failed", "error");
      setUser(null);
      console.error("OTP Verification Error:", err.message);
      throw error;
    }
  };

  const logout = () => {
    AuthApi.logout()
      .catch((error) => {
        console.error("Logout error:", error);
      })
      .finally(() => {
        setUser(null);
        showToast("Logged out successfully", "success");
      });
  };

  const value: AuthContextType = {
    user,
    loginAgent,
    loginSU,
    verifyOtp,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
