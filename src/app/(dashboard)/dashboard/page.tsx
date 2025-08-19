// app/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/dashboard/user/admin-dashboard';
import { UserDashboard } from '@/components/dashboard/user/user-dashboard';
import { InstructorDashboard } from '@/components/dashboard/user/instructor-dashboard';
import { SupplierDashboard } from '@/components/dashboard/user/supplier-dashboard';
import LoginPage from '@/app/login/page';
import {User} from "@/types/user"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCurrentUserRole(userData.role);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUserRole(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setCurrentUserRole(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardComponent = (role: string) => {
    switch (role) {
      case "ADMIN":
        return AdminDashboard;
      case "USER":
        return UserDashboard;
      case "INSTRUCTOR":
        return InstructorDashboard;
      case "SUPPLIER":
        return SupplierDashboard;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentUserRole(null);
    setUser(null);
  };

  // Show loading spinner while checking auth
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

  if (!isAuthenticated || !currentUserRole) {
    return <LoginPage />;
  }

  const ActiveComponent = getDashboardComponent(currentUserRole);

  if (!ActiveComponent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            Your role ({currentUserRole}) is not recognized.
          </p>
          <button
            onClick={handleLogout}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        {/* Header with user info and logout */}
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {currentUserRole.charAt(0) + currentUserRole.slice(1).toLowerCase()} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || user?.email || 'User'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {/* Dashboard content */}
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}