// courses-api.ts
import { 
  Course, 
  CreateCourseDto, 
  UpdateCourseDto, 
  CourseWithRelations, 
  CourseResponseDto,
  CoursePaginationParams 
} from "@/types";
import { apiFetch } from "../core/api-fetch";

export const coursesApi = {
  // Get all courses with pagination
  getAll: (params?: CoursePaginationParams, token?: string) =>
    apiFetch<CourseResponseDto[]>(`/courses${params ? `?page=${params.page || 1}&limit=${params.limit || 10}` : ''}`, { token }),
   
  // Get course by ID
  getById: (id: number, token?: string) =>
    apiFetch<CourseResponseDto>(`/courses/${id}`, { token }),
 
  // Get course by slug (matches backend endpoint)
  getBySlug: (slug: string, token?: string) =>
    apiFetch<CourseResponseDto>(`/courses/slug/${slug}`, { token }),

  // Get courses by instructor ID
  getByInstructorId: (instructorId: number, token?: string) =>
    apiFetch<CourseResponseDto[]>(`/courses/instructor/${instructorId}`, { token }),
 
  // Create new course
  create: (data: CreateCourseDto, token: string) =>
    apiFetch<CourseResponseDto>("/courses", {
      method: "POST",
      body: data,
      token,
    }),
   
  // Update course
  update: (id: number, data: UpdateCourseDto, token: string) =>
    apiFetch<CourseResponseDto>(`/courses/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
   
  // Soft delete course
  delete: (id: number, token: string) =>
    apiFetch<void>(`/courses/${id}`, {
      method: "DELETE",
      token,
    }),

  // Force delete course (Admin only)
  forceDelete: (id: number, token: string) =>
    apiFetch<void>(`/courses/${id}/force`, {
      method: "DELETE",
      token,
    }),

  // Restore soft deleted course (Admin only)
  restore: (id: number, token: string) =>
    apiFetch<CourseResponseDto>(`/courses/${id}/restore`, {
      method: "PATCH",
      token,
    }),
};