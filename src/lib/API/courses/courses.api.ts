import {
  CourseResponseDto,
  CreateCourseDto,
  UpdateCourseDto,
  CoursePaginationParams,
  CourseFilterParams,
} from "@/types/course";
import { apiFetch } from "../core/api-fetch";

export const coursesApi = {
  // Get all courses with pagination + optional filters
  getAll: (params?: CoursePaginationParams & CourseFilterParams, token?: string) => {
    let query = params ? `?page=${params.page || 1}&limit=${params.limit || 10}` : "?page=1&limit=10";

    if (params) {
      if (params.level) query += `&level=${params.level}`;
      if (params.category) query += `&category=${params.category}`;
      if (params.priceMin !== undefined) query += `&priceMin=${params.priceMin}`;
      if (params.priceMax !== undefined) query += `&priceMax=${params.priceMax}`;
      if (params.language) query += `&language=${params.language}`;
    }

    return apiFetch<CourseResponseDto[]>(`/courses${query}`, { token });
  },

  // Get course by ID
  getById: (id: number, token?: string) =>
    apiFetch<CourseResponseDto>(`/courses/${id}`, { token }),

  // Get course by slug
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
