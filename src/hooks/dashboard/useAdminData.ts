// /hooks/useAdminData.ts (fixed version)
import { useState, useEffect } from "react";
import { usersApi } from "@/lib/API/auth";
import { coursesApi, courseEnrollmentsApi } from "@/lib/API/courses";
import { productsApi, productOrdersApi } from "@/lib/API/products";
import type { User } from "@/types/user";
import type { CourseResponseDto } from "@/types/course";
import type { ProductResponseDto } from "@/types/product";
import type { ProductOrderResponseDto } from "@/types/order";
import type { CourseEnrollment } from "@/types/course-enrollment";

export interface AdminData {
  users: Omit<User, "password">[];
  courses: CourseResponseDto[];
  products: ProductResponseDto[];
  orders: ProductOrderResponseDto[];
  enrollments: CourseEnrollment[];
}

export const useAdminData = () => {
  const [data, setData] = useState<AdminData>({
    users: [],
    courses: [],
    products: [],
    orders: [],
    enrollments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    
    // Try multiple possible localStorage keys
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
        // More descriptive error message
        console.error("Available localStorage keys:", Object.keys(localStorage));
        throw new Error("No authentication token found. Please login first.");
      }

      console.log("Using token:", token.substring(0, 20) + "..."); // Log partial token for debugging

      const [usersRes, coursesRes, productsRes, ordersRes, enrollmentsRes] =
        await Promise.allSettled([
          usersApi.getAll(1, 100, token),
          coursesApi.getAll({}, token),
          productsApi.getAll({}),
          productOrdersApi.getAll(token),
          courseEnrollmentsApi.getAll(token),
        ]);

      setData({
        users:
          usersRes.status === "fulfilled"
            ? usersRes.value.map(({ password, ...rest }) => rest)
            : [],
        courses: coursesRes.status === "fulfilled" ? coursesRes.value : [],
        products: productsRes.status === "fulfilled" ? productsRes.value : [],
        orders: ordersRes.status === "fulfilled" ? ordersRes.value : [],
        enrollments:
          enrollmentsRes.status === "fulfilled" ? enrollmentsRes.value : [],
      });

      // Log errors with more details
      [
        { key: "users", res: usersRes },
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
      setError(err.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure localStorage is ready
    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error, refetch: fetchData };
};