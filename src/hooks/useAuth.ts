"use client";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/API/auth/auth.api";
import { AuthResponse, LoginDto, RegisterDto } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // ✅ Admin-style token getter - flexible and robust
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    
    // Try multiple possible localStorage keys (same as admin)
    const possibleKeys = ['auth', 'token', 'authToken', 'accessToken'];
    
    for (const key of possibleKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          // If it's a JSON object, try to parse it
          if (stored.startsWith('{')) {
            const parsed = JSON.parse(stored);
            // Try different property names for the token
            return parsed.accessToken || parsed.token || parsed.authToken || null;
          } else {
            // If it's a plain string, assume it's the token
            return stored;
          }
        } catch {
          // If parsing fails, try using it as a plain string
          return stored;
        }
      }
    }
    
    return null;
  };

  // ✅ Admin-style user getter
  const getUser = (): AuthResponse["user"] | null => {
    if (typeof window === "undefined") return null;
    
    // Primary source: 'auth' key with full auth response
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData) as AuthResponse;
        if (parsed.user) {
          return parsed.user;
        }
      } catch (error) {
        console.warn("Error parsing auth data:", error);
      }
    }
    
    // Fallback: try other possible user storage keys
    const userKeys = ['user', 'currentUser', 'userData'];
    for (const key of userKeys) {
      const userData = localStorage.getItem(key);
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (parsed.id && parsed.email) {
            return parsed;
          }
        } catch {
          continue;
        }
      }
    }
    
    return null;
  };

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Initialize auth state from localStorage
    try {
      const storedToken = getToken();
      const storedUser = getUser();
      
      console.log("Auth initialization:", { 
        hasToken: !!storedToken, 
        hasUser: !!storedUser,
        userEmail: storedUser?.email 
      });
      
      setToken(storedToken);
      setUser(storedUser);
    } catch (error) {
      console.error("Error initializing auth:", error);
      // Clear corrupted data
      localStorage.removeItem("auth");
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = async (data: LoginDto) => {
    try {
      const res = await authApi.login(data);
      setUser(res.user);
      setToken(res.accessToken);
      
      // Store in multiple formats for compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem("auth", JSON.stringify(res));
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      
      console.log("Login successful:", { 
        userEmail: res.user.email, 
        userId: res.user.id 
      });
      
      return res;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const res = await authApi.register(data);
      setUser(res.user);
      setToken(res.accessToken);
      
      // Store in multiple formats for compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem("auth", JSON.stringify(res));
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      
      console.log("Registration successful:", { 
        userEmail: res.user.email, 
        userId: res.user.id 
      });
      
      return res;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    if (typeof window !== 'undefined') {
      // Clear all possible auth storage keys
      const keysToRemove = ['auth', 'token', 'authToken', 'accessToken', 'user', 'currentUser', 'userData'];
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    
    console.log("Logout completed");
  };

  // ✅ Add debugging info for development
  const getDebugInfo = () => {
    if (typeof window === "undefined") return null;
    
    return {
      isClient,
      isInitialized,
      hasUser: !!user,
      hasToken: !!token,
      userEmail: user?.email,
      userId: user?.id,
      localStorageKeys: Object.keys(localStorage),
      authData: localStorage.getItem('auth'),
    };
  };

  return { 
    user, 
    token, 
    isInitialized,
    isClient,
    login, 
    register, 
    logout,
    getDebugInfo // ✅ For debugging purposes
  };
}