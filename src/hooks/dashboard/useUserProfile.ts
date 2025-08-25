"use client";
import { useState, useEffect } from "react";
import { usersApi } from "@/lib/API/auth";
import { courseEnrollmentsApi } from "@/lib/API/courses";
import type { UserWithRelations, CourseEnrollment } from "@/types";

interface UseUserProfileResult {
  profile: UserWithRelations | null;
  loading: boolean;
  error: string | null;
}

export const useUserProfile = (userId?: number): UseUserProfileResult => {
  const [profile, setProfile] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Same getToken logic as admin system
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId === undefined) {
        setError("No userId provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = getToken();
        if (!token) {
          console.error("Available localStorage keys:", Object.keys(localStorage));
          setError("No authentication token found. Please login first.");
          setLoading(false);
          return;
        }

        console.log("Fetching profile for userId:", userId, "with token:", token.substring(0, 20) + "...");

        // ✅ Parallel fetch dengan error handling seperti admin system
        const [userRes, enrollmentsRes] = await Promise.allSettled([
          usersApi.getById(userId, token),
          courseEnrollmentsApi.getByStudent(userId, token),
        ]);

        // Process user data
        if (userRes.status === "fulfilled") {
          const user = userRes.value as UserWithRelations;
          
          // Process enrollments data
          if (enrollmentsRes.status === "fulfilled") {
            user.courseEnrollments = enrollmentsRes.value as CourseEnrollment[];
          } else {
            console.warn("Failed to fetch course enrollments:", enrollmentsRes.reason);
            user.courseEnrollments = []; // Default empty array
          }
          
          setProfile(user);
          console.log("Profile fetched successfully:", { 
            userId: user.id, 
            email: user.email,
            enrollments: user.courseEnrollments?.length || 0 
          });
        } else {
          throw userRes.reason;
        }

      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        
        // ✅ Better error handling dengan specific messages
        let errorMessage = "Failed to fetch user profile";
        
        if (err.status === 401 || err.message?.includes("401") || err.message?.includes("Unauthorized")) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (err.status === 403 || err.message?.includes("403") || err.message?.includes("Forbidden")) {
          errorMessage = "Access denied. You don't have permission to view this profile.";
        } else if (err.status === 404 || err.message?.includes("404") || err.message?.includes("not found")) {
          errorMessage = "User profile not found.";
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Add small delay like admin system to ensure localStorage is ready
    const timer = setTimeout(() => {
      fetchProfile();
    }, 100);

    return () => clearTimeout(timer);
  }, [userId]);

  return { profile, loading, error };
};