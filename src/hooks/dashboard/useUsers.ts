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

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId === undefined) {
        setError("No userId provided");
        setLoading(false);
        return;
      }

      try {
        // ✅ Fix 1: Ambil token dari auth data yang benar
        const authData = localStorage.getItem("auth");
        if (!authData) {
          setError("No authentication data found. Please login.");
          setLoading(false);
          return;
        }

        let token: string;
        try {
          const parsed = JSON.parse(authData);
          token = parsed.accessToken;
        } catch (parseError) {
          console.error("Error parsing auth data:", parseError);
          setError("Invalid authentication data. Please login again.");
          setLoading(false);
          return;
        }

        if (!token) {
          setError("No valid token found. Please login again.");
          setLoading(false);
          return;
        }

        // ✅ Fix 2: Call API dengan format yang benar
        // Backend endpoint: GET /users/:id dengan Bearer token
        const user = await usersApi.getById(userId, token) as UserWithRelations;
        
        // ✅ Fix 3: Fetch course enrollments (jika diperlukan untuk dashboard)
        let enrollments: CourseEnrollment[] = [];
        try {
          enrollments = await courseEnrollmentsApi.getByStudent(userId, token) as CourseEnrollment[];
        } catch (enrollmentError) {
          // Course enrollments tidak critical, jadi tidak perlu stop execution
          console.warn("Failed to fetch course enrollments:", enrollmentError);
        }
        
        // ✅ Fix 4: Combine data
        user.courseEnrollments = enrollments;
        
        setProfile(user);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        
        // ✅ Fix 5: Better error handling dengan specific messages
        let errorMessage = "Failed to fetch user profile";
        
        if (err.status === 401 || err.message?.includes("401")) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (err.status === 403 || err.message?.includes("403")) {
          errorMessage = "Access denied. You don't have permission to view this profile.";
        } else if (err.status === 404 || err.message?.includes("404")) {
          errorMessage = "User profile not found.";
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
};