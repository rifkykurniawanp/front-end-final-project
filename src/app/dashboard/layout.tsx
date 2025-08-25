"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RoleName } from "@/types/enum";
import type { User } from "@/types/user";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const useAuth = () => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: Omit<User, "password"> = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return { user, loading, logout };
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-amber-600 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  // Tabs menu berdasarkan role
  const getMenu = (role: RoleName) => {
    switch (role) {
      case RoleName.ADMIN:
        return [
          { label: "Overview", href: "/dashboard/admin" },
          { label: "Users", href: "/dashboard/admin/users" },
          { label: "Products", href: "/dashboard/admin/products" },
          { label: "Courses", href: "/dashboard/admin/courses" },
        ];
      case RoleName.SUPPLIER:
        return [
          { label: "Overview", href: "/dashboard/supplier" },
          { label: "Products", href: "/dashboard/supplier/products" },
          { label: "Orders", href: "/dashboard/supplier/orders" },
        ];
      case RoleName.INSTRUCTOR:
        return [
          { label: "Overview", href: "/dashboard/instructor" },
          { label: "Courses", href: "/dashboard/instructor/courses" },
          { label: "Enrollments", href: "/dashboard/instructor/enrollments" },
        ];
      case RoleName.USER:
        return [
          { label: "Overview", href: "/dashboard/user" },
          { label: "Orders", href: "/dashboard/user/orders" },
          { label: "Enrollments", href: "/dashboard/user/enrollments" },
        ];
      default:
        return [];
    }
  };

  const menu = getMenu(user.role);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-white py-4 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {user.role.toLowerCase()} Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome back, {user.firstName || user.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs Nav */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-6">
        <Tabs value={pathname}>
          <TabsList className="grid grid-cols-3 md:grid-cols-4 w-full">
            {menu.map((item) => (
              <TabsTrigger
                key={item.href}
                value={item.href}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow">{children}</div>
      </main>
    </div>
  );
}
