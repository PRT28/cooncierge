"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { useToast } from "./ToastContext";

// API base URL from environment
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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
    userData: Record<string, object>,
    setOtpSent: (v: boolean) => void
  ) => Promise<void>;
  loginSU: (
    userData: Record<string, object>,
    setOtpSent: (v: boolean) => void
  ) => Promise<void>;
  verifyOtp: (otpData: Record<string, object>) => Promise<void>;
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

const headers = {
  "Content-Type": "application/json",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user from localStorage only on client
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
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
    userData: Record<string, object>,
    setOtpSent: (v: boolean) => void
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/send-otp/${endpoint}`,
        userData,
        { headers }
      );

      if (response.data.success) {
        showToast(`OTP sent successfully to ${endpoint}`, "success");
        setOtpSent(true);
      } else {
        showToast("Failed to send OTP", "error");
      }
    } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>;
        showToast(
            err.response?.data?.message || "Failed to send OTP",
            "error"
        );
        console.error("Send OTP Error:", err.message);
        throw err;
    }
  };

  const loginAgent = (userData: Record<string, object>, setOtpSent: (v: boolean) => void) =>
    sendOtp("agent", userData, setOtpSent);

  const loginSU = (userData: Record<string, object>, setOtpSent: (v: boolean) => void) =>
    sendOtp("super-admin", userData, setOtpSent);

  const verifyOtp = async (otpData: Record<string, object>) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-otp`,
        otpData,
        { headers }
      );

      if (response.data.success) {
        showToast("Login successful", "success");
        setUser(response.data.user);

        // Persist in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      } else {
        showToast("OTP verification failed", "error");
      }
    } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>;
        showToast(
            err.response?.data?.message || "OTP verification failed",
            "error"
        );
        setUser(null);
        console.error("OTP Verification Error:", err.message);
        throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      showToast("Logged out successfully", "success");
    } catch (err) {
      console.error("Logout error:", err);
    }
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
