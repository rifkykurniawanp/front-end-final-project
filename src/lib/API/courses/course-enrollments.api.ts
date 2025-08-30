import { apiFetch } from "../core/api-fetch";
import type { 
  CourseEnrollment, 
  EnrollCourseDto, 
  UpdateEnrollmentDto 
} from "@/types/course-enrollment";

export const courseEnrollmentsApi = {
  // Create a new enrollment
  enroll: (data: EnrollCourseDto, token: string) =>
    apiFetch<CourseEnrollment>('/enrollments', {
      method: 'POST',
      body: { ...data },
      token,
    }),

  // Get all enrollments (ADMIN only)
  getAll: (token: string) =>
    apiFetch<CourseEnrollment[]>('/enrollments', { token }),

  // Get enrollment by ID
  getById: (id: number, token: string) =>
    apiFetch<CourseEnrollment>(`/enrollments/${id}`, { token }),

  // Get enrollments by student ID
  getByStudent: (studentId: number, token: string) =>
    apiFetch<CourseEnrollment[]>(`/enrollments?studentId=${studentId}`, { token }),

  // Get enrollments by course ID
  getByCourse: (courseId: number, token: string) =>
    apiFetch<CourseEnrollment[]>(`/courses/${courseId}/enrollments`, { token }),

  // Check enrollment for specific course and student
  checkEnrollment: (courseId: number, studentId: number, token: string) =>
    apiFetch<CourseEnrollment | null>(`/courses/${courseId}/enrollments/${studentId}`, { token }),

  // Update enrollment (progress, status, certificateAwarded)
  update: (id: number, data: UpdateEnrollmentDto, token: string) =>
    apiFetch<CourseEnrollment>(`/enrollments/${id}`, {
      method: 'PUT',
      body: { ...data },
      token,
    }),

  // Delete enrollment (ADMIN only)
  remove: (id: number, token: string) =>
    apiFetch<void>(`/enrollments/${id}`, {
      method: 'DELETE',
      token,
    }),
};

export default courseEnrollmentsApi;
