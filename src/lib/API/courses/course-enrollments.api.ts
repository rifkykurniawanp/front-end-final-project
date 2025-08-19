import { apiFetch } from "../core/api-fetch";
import { CourseEnrollment } from "@/types/course";

export const courseEnrollmentsApi = {
  getByStudent: (studentId: number, token: string) =>
    apiFetch<CourseEnrollment[]>(`/students/${studentId}/enrollments`, { token }),
  
  getByCourse: (courseId: number, token: string) =>
    apiFetch<CourseEnrollment[]>(`/courses/${courseId}/enrollments`, { token }),
   
  getById: (id: number, token: string) =>
    apiFetch<CourseEnrollment>(`/course-enrollments/${id}`, { token }),
    
  checkEnrollment: (courseId: number, studentId: number, token: string) =>
    apiFetch<CourseEnrollment | null>(`/courses/${courseId}/enrollments/${studentId}`, { token }),
  
  updateProgress: (id: number, progress: number, token: string) =>
    apiFetch<CourseEnrollment>(`/course-enrollments/${id}`, {
      method: "PATCH",
      body: { progress },
      token,
    }),
};
