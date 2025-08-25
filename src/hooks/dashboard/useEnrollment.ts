"use client";

import { useState, useEffect, useCallback } from "react";
import { courseEnrollmentsApi,lessonProgressApi,certificatesApi } from "@/lib/API/courses";
import { useAuth } from "../useAuth";
import { EnrollmentStatus,CourseEnrollment,
  EnrollCourseDto,
  UpdateEnrollmentDto,LessonProgressResponseDto,Certificate, IssueCertificateDto  } from "@/types";
import { GeneralApiError } from "@/types/api";

interface UseEnrollmentsOptions {
  autoFetch?: boolean;
  studentOnly?: boolean;
  instructorOnly?: boolean;
  courseId?: number;
  includeProgress?: boolean;
}

interface EnrollmentSummary {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  certificatesEarned: number;
  averageProgress: number;
  statusBreakdown: Record<EnrollmentStatus, number>;
}

interface UseEnrollmentsReturn {
  enrollments: CourseEnrollment[];
  loading: boolean;
  error: string | null;
  totalItems: number;

  // Actions
  refetch: () => Promise<void>;

  // Enrollment management
  enrollInCourse: (data: EnrollCourseDto) => Promise<CourseEnrollment | null>;
  updateEnrollment: (id: number, data: UpdateEnrollmentDto) => Promise<CourseEnrollment | null>;
  removeEnrollment: (id: number) => Promise<boolean>;
  checkEnrollment: (courseId: number, studentId: number) => Promise<CourseEnrollment | null>;

  // Progress tracking
  getLessonProgress: (userId: number, lessonId: number) => Promise<LessonProgressResponseDto | null>;
  markLessonComplete: (userId: number, lessonId: number) => Promise<boolean>;
  getAllProgressForUser: (userId: number) => Promise<LessonProgressResponseDto[]>;

  // Certificate management
  getCertificates: (userId?: number) => Promise<Certificate[]>;
  generateCertificate: (data: IssueCertificateDto) => Promise<Certificate | null>;
  downloadCertificate: (certificateId: number) => Promise<Blob | null>;
  verifyEligibility: (certificateId: number) => Promise<Certificate | null>;

  // Utility
  calculateCourseProgress: (courseId: number, userId: number) => Promise<number>;
  getEnrollmentSummary: () => EnrollmentSummary;
  isEligibleForCertificate: (enrollment: CourseEnrollment) => boolean;
}

export function useEnrollments(options: UseEnrollmentsOptions = {}): UseEnrollmentsReturn {
  const { token, user } = useAuth();
  const {
    autoFetch = true,
    studentOnly = false,
    instructorOnly = false,
    courseId,
    includeProgress = false,
  } = options;

  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const fetchEnrollments = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      let response: CourseEnrollment[] = [];

      if (courseId) {
        response = await courseEnrollmentsApi.getByCourse(courseId, token);
      } else if (studentOnly && user?.id) {
        response = await courseEnrollmentsApi.getByStudent(user.id, token);
      } else if (instructorOnly && user?.id) {
        const all = await courseEnrollmentsApi.getAll(token);
        response = all.filter(e => e.course?.instructorId === user.id);
      } else {
        response = await courseEnrollmentsApi.getAll(token);
      }

      if (Array.isArray(response)) {
        setEnrollments(response);
        setTotalItems(response.length);
      } else {
        setEnrollments([]);
        setTotalItems(0);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to fetch enrollments";
      setError(errorMessage);
      setEnrollments([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [token, user, courseId, studentOnly, instructorOnly]);

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    if (autoFetch) {
      fetchEnrollments();
    }
  }, [autoFetch, fetchEnrollments]);

  // ---------------- Enrollment CRUD ----------------
  const enrollInCourse = async (data: EnrollCourseDto): Promise<CourseEnrollment | null> => {
    if (!token) {
      setError("Authentication required");
      return null;
    }
    try {
      const res = await courseEnrollmentsApi.enroll(data, token);
      await fetchEnrollments();
      return res;
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to enroll in course";
      setError(errorMessage);
      return null;
    }
  };

  const updateEnrollment = async (id: number, data: UpdateEnrollmentDto): Promise<CourseEnrollment | null> => {
    if (!token) {
      setError("Authentication required");
      return null;
    }
    try {
      const res = await courseEnrollmentsApi.update(id, data, token);
      await fetchEnrollments();
      return res;
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to update enrollment";
      setError(errorMessage);
      return null;
    }
  };

  const removeEnrollment = async (id: number): Promise<boolean> => {
    if (!token) {
      setError("Authentication required");
      return false;
    }
    try {
      await courseEnrollmentsApi.remove(id, token);
      await fetchEnrollments();
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to remove enrollment";
      setError(errorMessage);
      return false;
    }
  };

  const checkEnrollment = async (courseId: number, studentId: number): Promise<CourseEnrollment | null> => {
    if (!token) return null;
    try {
      return await courseEnrollmentsApi.checkEnrollment(courseId, studentId, token);
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to check enrollment";
      setError(errorMessage);
      return null;
    }
  };

  // ---------------- Progress Tracking ----------------
  const getLessonProgress = async (userId: number, lessonId: number): Promise<LessonProgressResponseDto | null> => {
    if (!token) return null;
    try {
      return await lessonProgressApi.getProgress(userId, lessonId, token);
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to get lesson progress";
      setError(errorMessage);
      return null;
    }
  };

  const markLessonComplete = async (userId: number, lessonId: number): Promise<boolean> => {
    if (!token) {
      setError("Authentication required");
      return false;
    }
    try {
      await lessonProgressApi.markComplete(userId, lessonId, token);
      if (includeProgress) await fetchEnrollments();
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to mark lesson complete";
      setError(errorMessage);
      return false;
    }
  };

  const getAllProgressForUser = async (userId: number): Promise<LessonProgressResponseDto[]> => {
    if (!token) return [];
    try {
      const res = await lessonProgressApi.getAllByUser(userId, token);
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to get user progress";
      setError(errorMessage);
      return [];
    }
  };

  // ---------------- Certificate Management ----------------
  const getCertificates = async (userId?: number): Promise<Certificate[]> => {
    try {
      const res = userId ? await certificatesApi.getByUser(userId) : await certificatesApi.getAll();
      return Array.isArray(res) ? res : [];
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to get certificates";
      setError(errorMessage);
      return [];
    }
  };

  const generateCertificate = async (data: IssueCertificateDto): Promise<Certificate | null> => {
    try {
      return await certificatesApi.generate(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to generate certificate";
      setError(errorMessage);
      return null;
    }
  };

  const downloadCertificate = async (certificateId: number): Promise<Blob | null> => {
    try {
      return await certificatesApi.download(certificateId);
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to download certificate";
      setError(errorMessage);
      return null;
    }
  };

  const verifyEligibility = async (certificateId: number): Promise<Certificate | null> => {
    try {
      return await certificatesApi.verifyEligibility(certificateId);
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to verify certificate eligibility";
      setError(errorMessage);
      return null;
    }
  };

  // ---------------- Utility Functions ----------------
  const calculateCourseProgress = async (courseId: number, userId: number): Promise<number> => {
    try {
      // Get all progress for the user
      const allProgress = await getAllProgressForUser(userId);
      
      // Filter progress for the specific course
      // This assumes your lesson progress includes course information
      // You might need to adjust this based on your actual data structure
      const courseProgress = allProgress.filter(progress => {
        // You'll need to implement this filter based on your data structure
        // This is a placeholder implementation
        return true; // Replace with actual filtering logic
      });

      if (courseProgress.length === 0) return 0;

      const completedLessons = courseProgress.filter(p => p.completed).length;
      return Math.round((completedLessons / courseProgress.length) * 100);
    } catch (err: unknown) {
      const errorMessage = err instanceof GeneralApiError ? err.message : "Failed to calculate course progress";
      setError(errorMessage);
      return 0;
    }
  };

  const getEnrollmentSummary = (): EnrollmentSummary => {
    const statusBreakdown: Record<EnrollmentStatus, number> = {
      [EnrollmentStatus.PENDING]: 0,
      [EnrollmentStatus.ACTIVE]: 0,
      [EnrollmentStatus.COMPLETED]: 0,
      [EnrollmentStatus.CANCELLED]: 0,
    };

    enrollments.forEach(enrollment => {
      if (enrollment.status && enrollment.status in statusBreakdown) {
        statusBreakdown[enrollment.status]++;
      }
    });

    const totalEnrollments = enrollments.length;
    const activeEnrollments = statusBreakdown[EnrollmentStatus.ACTIVE] || 0;
    const completedEnrollments = statusBreakdown[EnrollmentStatus.COMPLETED] || 0;
    
    // Calculate certificates earned based on certificateAwarded field
    const certificatesEarned = enrollments.filter(e => e.certificateAwarded).length;
    
    // Calculate average progress (this is a simplified calculation)
    const averageProgress = totalEnrollments > 0 
      ? Math.round((completedEnrollments / totalEnrollments) * 100) 
      : 0;

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      certificatesEarned,
      averageProgress,
      statusBreakdown,
    };
  };

  const isEligibleForCertificate = (enrollment: CourseEnrollment): boolean => {
    // Check if enrollment is completed
    if (enrollment.status !== EnrollmentStatus.COMPLETED) {
      return false;
    }

    // Add any other eligibility criteria here
    // For example: minimum progress percentage, passing grade, etc.
    return true;
  };

  const refetch = async (): Promise<void> => {
    await fetchEnrollments();
  };

  // Return all the hook's functionality
  return {
    enrollments,
    loading,
    error,
    totalItems,
    refetch,
    enrollInCourse,
    updateEnrollment,
    removeEnrollment,
    checkEnrollment,
    getLessonProgress,
    markLessonComplete,
    getAllProgressForUser,
    getCertificates,
    generateCertificate,
    downloadCertificate,
    verifyEligibility,
    calculateCourseProgress,
    getEnrollmentSummary,
    isEligibleForCertificate,
  };
}