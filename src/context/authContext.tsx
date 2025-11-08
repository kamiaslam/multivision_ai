import React, { createContext, useState, useContext, useEffect } from "react";
import api, { authAPI } from "@/services/api";
import {
  isRefreshTokenExpired,
  getErrorMessage,
  safeLogError,
} from "@/utils/authUtils";
import { User, LoginResponse } from "@/types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<LoginResponse>;
  signup: (
    email: string,
    username: string,
    password: string,
    full_name?: string
  ) => Promise<LoginResponse>;
  simSignup: (email: string, password: string, name?: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Helper function to remove cookie
const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state with null values to prevent hydration mismatch
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedRefreshToken && storedUser) {
        try {
          // Set cookie for middleware access immediately
          setCookie("authToken", storedToken);

          // Update state
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // Clear invalid data
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
      setIsInitialized(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await authAPI.login(username, password);

      // Handle new response format with success wrapper
      const responseData = res.success ? res.data : res;

      const { access_token, refresh_token, user: userData } = responseData;

      // Store tokens and user data
      setToken(access_token);
      setRefreshToken(refresh_token);
      setUser(userData);

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Store in cookies for middleware access
      setCookie("authToken", access_token);

      return res;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      throw new Error(errorMessage);
    }
  };

  const signup = async (
    email: string,
    username: string,
    password: string,
    full_name?: string
  ) => {
    try {
      const res = await authAPI.signup(email, username, password, full_name);

      // Handle new response format with success wrapper
      const responseData = res.success ? res.data : res;

      const { access_token, refresh_token, user: userData } = responseData;

      // Store tokens and user data
      setToken(access_token);
      setRefreshToken(refresh_token);
      setUser(userData);

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Store in cookies for middleware access
      setCookie("authToken", access_token);

      return res;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      throw new Error(errorMessage);
    }
  };

  const simSignup = async (
    email: string,
    password: string,
    full_name?: string
  ) => {
    try {
      const res = await authAPI.simsignup(email, password, full_name);
      return res;
    } catch (err: any) {
      return;
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const currentRefreshToken =
        refreshToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null);

      if (!currentRefreshToken) {
        console.log("❌ No refresh token available for refresh");
        return false;
      }

      const res = await authAPI.refreshToken(currentRefreshToken);

      // Handle new response format with success wrapper
      const responseData = res.success ? res.data : res;

      const { access_token, refresh_token } = responseData;

      // Update tokens
      setToken(access_token);
      setRefreshToken(refresh_token);

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
      }

      // Update cookie for middleware access
      setCookie("authToken", access_token);

      console.log("✅ Token refresh successful");
      return true;
    } catch (err: any) {
      // Safe logging without exposing sensitive data
      safeLogError(err, "Token Refresh Failed in Auth Context");

      // Check if it's due to expired refresh token
      const refreshTokenExpired = isRefreshTokenExpired(err);

      // Clear invalid tokens
      setToken(null);
      setRefreshToken(null);
      setUser(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
      }

      // Clear cookies
      removeCookie("authToken");

      // If refresh token is expired, redirect to login
      if (refreshTokenExpired) {
        console.log("🔄 Refresh token expired, redirecting to login");
        // The API interceptor will handle the redirect and toast message
      }

      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const currentRefreshToken =
        refreshToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null);

      console.log("🔐 Starting logout process...");
      console.log("📝 Refresh token exists:", !!currentRefreshToken);

      if (currentRefreshToken) {
        console.log("📡 Calling logout API endpoint...");
        // Call logout endpoint to revoke refresh token
        const response = await authAPI.logout(currentRefreshToken);
        console.log("✅ Logout API response:", response);
      } else {
        console.log("⚠️ No refresh token found, skipping API call");
      }
    } catch (err: any) {
      // Safe logging without exposing sensitive data
      safeLogError(err, "Logout API Call Failed");
      // Continue with local logout even if API call fails
    } finally {
      console.log("🧹 Clearing local state and storage...");
      // Clear local state and storage
      setToken(null);
      setRefreshToken(null);
      setUser(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
      }

      // Clear cookies
      removeCookie("authToken");

      console.log("✅ Logout completed");

      // Redirect to home page after logout
      if (typeof window !== "undefined") {
        console.log("🏠 Redirecting to home page...");
        window.location.href = "/";
      }
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const res = await authAPI.requestPasswordReset(email);
      return res;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const res = await authAPI.resetPassword(token, newPassword);
      return res;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        signup,
        simSignup,
        logout,
        refreshAccessToken,
        requestPasswordReset,
        resetPassword,
        isAuthenticated: !!token,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
