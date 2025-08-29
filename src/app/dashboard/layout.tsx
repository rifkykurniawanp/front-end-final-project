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
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
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
    <div className="min-h-screen flex flex-col bg-[#F9F7F4]">

      {/* Dashboard Nav */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold capitalize text-[#4B3621]">
            {user.role.toLowerCase()} Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user.firstName || user.email}
          </p>

          <Tabs value={pathname} className="mt-4">
            <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
              {menu.map((item) => (
                <TabsTrigger
                  key={item.href}
                  value={item.href}
                  onClick={() => router.push(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? "bg-[#6F4E37] text-white shadow"
                      : "bg-[#F5F5DC] text-[#4B3621] hover:bg-[#E5D3B3]"
                  }`}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="bg-white p-6 rounded-xl shadow-md">{children}</div>
      </main>
    </div>
  );
}
