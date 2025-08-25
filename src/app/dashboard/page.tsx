"use client";
import React, { useEffect, useState } from "react";
import LoginPage from "@/app/login/page";
import { RoleName } from "@/types/enum";
import type { User } from "@/types/user";

// ======= useAuth Hook (pindahkan ke /dashboard/hooks/useAuth.ts jika mau modular) =======
const useAuth = () => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser: Omit<User, "password"> = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, loading, logout };
};

// ======= DashboardPage Component =======
export default function DashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return <LoginPage />;

  // Tentukan redirect route sesuai role
  const getRedirectRoute = (role: RoleName) => {
    switch (role) {
      case RoleName.ADMIN:
        return "/dashboard/admin";
      case RoleName.USER:
        return "/dashboard/user";
      case RoleName.INSTRUCTOR:
        return "/dashboard/instructor";
      case RoleName.SUPPLIER:
        return "/dashboard/supplier";
      default:
        return null;
    }
  };

  const redirectRoute = getRedirectRoute(user.role);

  if (!redirectRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            Your role ({user.role}) is not recognized.
          </p>
          <button
            onClick={logout}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // 🚀 Next.js app router → pakai client navigation
  if (typeof window !== "undefined") {
    window.location.href = redirectRoute;
  }

  return null;
}
