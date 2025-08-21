import { apiFetch } from "../core/api-fetch";
import { CourseEnrollment } from "@/types/course";

export const courseEnrollmentsApi = {
  // Refactored: get enrollments for a specific student
  getByStudent: async (studentId: number, token: string): Promise<CourseEnrollment[]> => {
    try {
      // Fetch all enrollments from backend
      const allEnrollments = await apiFetch<CourseEnrollment[]>('/enrollments', { token });
      // Filter by studentId
      return allEnrollments.filter(e => e.studentId === studentId);
    } catch (error) {
      console.error("Error fetching student enrollments:", error);
      throw error;
    }
  },

  getByCourse: (courseId: number, token: string) =>
    apiFetch<CourseEnrollment[]>(`/courses/${courseId}/enrollments`, { token }),

  getById: (id: number, token: string) =>
    apiFetch<CourseEnrollment>(`/enrollments/${id}`, { token }),

  checkEnrollment: (courseId: number, studentId: number, token: string) =>
    apiFetch<CourseEnrollment | null>(`/courses/${courseId}/enrollments/${studentId}`, { token }),

  updateProgress: (id: number, progress: number, token: string) =>
    apiFetch<CourseEnrollment>(`/enrollments/${id}`, {
      method: "PUT",
      body: { progress },
      token,
    }),
};
