// /hooks/dashboard/useAdminData.ts (refactored version)
import { useState, useEffect } from "react";
import { usersApi } from "@/lib/API/auth";
import { coursesApi, courseEnrollmentsApi } from "@/lib/API/courses";
import { productsApi, productOrdersApi } from "@/lib/API/products";
import type { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import type { CourseResponseDto } from "@/types/course";
import type { ProductResponseDto } from "@/types/product";
import type { ProductOrderResponseDto } from "@/types/order";
import type { CourseEnrollment } from "@/types/course-enrollment";
import { GeneralApiError } from "@/types/api";

export interface AdminData {
  users: Omit<User, "password">[];
  deletedUsers: Omit<User, "password">[];
  courses: CourseResponseDto[];
  products: ProductResponseDto[];
  orders: ProductOrderResponseDto[];
  enrollments: CourseEnrollment[];
}

export const useAdminData = () => {
  const [data, setData] = useState<AdminData>({
    users: [],
    deletedUsers: [],
    courses: [],
    products: [],
    orders: [],
    enrollments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  // ✅ Use the exact same token getter as useAuth hook
  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    
    // Try multiple possible localStorage keys (same as useAuth)
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

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        // Enhanced debugging for token issues
        console.error("Token debugging info:", {
          localStorageKeys: typeof window !== "undefined" ? Object.keys(localStorage) : [],
          authData: typeof window !== "undefined" ? localStorage.getItem('auth') : null,
          accessTokenData: typeof window !== "undefined" ? localStorage.getItem('accessToken') : null,
        });
        throw new Error("No authentication token found. Please login first.");
      }

      console.log("Fetching admin data with token:", token.substring(0, 20) + "...");

      const [usersRes, deletedUsersRes, coursesRes, productsRes, ordersRes, enrollmentsRes] =
        await Promise.allSettled([
          usersApi.getAll(1, 100, token),
          usersApi.getDeleted(1, 100, token),
          coursesApi.getAll({}, token),
          productsApi.getAll({}),
          productOrdersApi.getAll(token),
          courseEnrollmentsApi.getAll(token),
        ]);

      setData({
        users: usersRes.status === "fulfilled"
          ? usersRes.value.map(({ password, ...rest }) => rest)
          : [],
        deletedUsers: deletedUsersRes.status === "fulfilled"
          ? deletedUsersRes.value.map(({ password, ...rest }) => rest)
          : [],
        courses: coursesRes.status === "fulfilled" ? coursesRes.value : [],
        products: productsRes.status === "fulfilled" ? productsRes.value : [],
        orders: ordersRes.status === "fulfilled" ? ordersRes.value : [],
        enrollments: enrollmentsRes.status === "fulfilled" ? enrollmentsRes.value : [],
      });

      // Log errors for debugging
      [
        { key: "users", res: usersRes },
        { key: "deletedUsers", res: deletedUsersRes },
        { key: "courses", res: coursesRes },
        { key: "products", res: productsRes },
        { key: "orders", res: ordersRes },
        { key: "enrollments", res: enrollmentsRes },
      ]
        .filter(({ res }) => res.status === "rejected")
        .forEach(({ key, res }) =>
          console.warn(`Failed to fetch ${key}:`, (res as PromiseRejectedResult).reason)
        );

    } catch (err: any) {
      console.error("Admin data fetch error:", err);
      setError(err instanceof GeneralApiError ? err.message : err.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserDto) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      
      await usersApi.create(userData, token);
      await fetchData(); // Refresh data
      return { success: true };
    } catch (err: any) {
      console.error("Create user error:", err);
      const message = err instanceof GeneralApiError ? err.message : err.message || "Failed to create user";
      return { success: false, error: message };
    }
  };
  
  const updateUser = async (id: number, userData: UpdateUserDto) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      
      await usersApi.update(id, userData, token);
      await fetchData(); // Refresh data
      return { success: true };
    } catch (err: any) {
      console.error("Update user error:", err);
      const message = err instanceof GeneralApiError ? err.message : err.message || "Failed to update user";
      return { success: false, error: message };
    }
  };
  
  const deleteUser = async (id: number) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      
      await usersApi.remove(id, token); // Soft delete
      await fetchData(); // Refresh data
      return { success: true };
    } catch (err: any) {
      console.error("Delete user error:", err);
      const message = err instanceof GeneralApiError ? err.message : err.message || "Failed to delete user";
      return { success: false, error: message };
    }
  };

  const restoreUser = async (id: number) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      
      await usersApi.restore(id, token);
      await fetchData(); // Refresh data
      return { success: true };
    } catch (err: any) {
      console.error("Restore user error:", err);
      const message = err instanceof GeneralApiError ? err.message : err.message || "Failed to restore user";
      return { success: false, error: message };
    }
  };

  const forceDeleteUser = async (id: number) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      
      await usersApi.forceDelete(id, token);
      await fetchData(); // Refresh data
      return { success: true };
    } catch (err: any) {
      console.error("Force delete user error:", err);
      const message = err instanceof GeneralApiError ? err.message : err.message || "Failed to permanently delete user";
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    showDeleted,
    setShowDeleted,
    refetch: fetchData,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    forceDeleteUser
  };
};