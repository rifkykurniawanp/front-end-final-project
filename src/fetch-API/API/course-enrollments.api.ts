import { apiFetch } from "./api-fetch";
import { CourseEnrollment } from "@/types/course";

export const courseEnrollmentsApi = {
  getByStudent: (studentId: number, token: string) =>
    apiFetch<CourseEnrollment[]>(`/api/v1/students/${studentId}/enrollments`, { token }),
  
  getByCourse: (courseId: number, token: string) =>
    apiFetch<CourseEnrollment[]>(`/api/v1/courses/${courseId}/enrollments`, { token }),
   
  getById: (id: number, token: string) =>
    apiFetch<CourseEnrollment>(`/api/v1/course-enrollments/${id}`, { token }),
    
  checkEnrollment: (courseId: number, studentId: number, token: string) =>
    apiFetch<CourseEnrollment | null>(`/api/v1/courses/${courseId}/enrollments/${studentId}`, { token }),
  
  updateProgress: (id: number, progress: number, token: string) =>
    apiFetch<CourseEnrollment>(`/api/v1/course-enrollments/${id}`, {
      method: "PATCH",
      body: { progress },
      token,
    }),
};
