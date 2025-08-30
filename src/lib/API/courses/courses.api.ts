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
    const searchParams = new URLSearchParams();
   
    // Set default values
    searchParams.append('page', (params?.page || 1).toString());
    searchParams.append('limit', (params?.limit || 10).toString());
   
    // Add other params if they exist
    if (params?.level) searchParams.append('level', params.level);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.priceMin !== undefined) searchParams.append('priceMin', params.priceMin.toString());
    if (params?.priceMax !== undefined) searchParams.append('priceMax', params.priceMax.toString());
    if (params?.language) searchParams.append('language', params.language);
   
    const query = searchParams.toString();
    return apiFetch<CourseResponseDto[]>(`/courses?${query}`, { token });
  },

  // Get course by ID
  getById: (id: number, token?: string) =>
    apiFetch<CourseResponseDto>(`/courses/${id.toString()}`, { token }),

  // Get course by slug
  getBySlug: (slug: string, token?: string) =>
    apiFetch<CourseResponseDto>(`/courses/slug/${slug}`, { token }),

  // Get courses by instructor ID
  getByInstructorId: (instructorId: number, token?: string) =>
    apiFetch<CourseResponseDto[]>(`/courses/instructor/${instructorId.toString()}`, { token }),

  // Create new course
  create: (data: CreateCourseDto, token: string) =>
    apiFetch<CourseResponseDto>("/courses", {
      method: "POST",
      body: { ...data },
      token,
    }),

  // Update course
  update: (id: number, data: UpdateCourseDto, token: string) =>
    apiFetch<CourseResponseDto>(`/courses/${id.toString()}`, {
      method: "PATCH",
      body: { ...data },
      token,
    }),

  // Soft delete course
  delete: (id: number, token: string) =>
    apiFetch<void>(`/courses/${id.toString()}`, {
      method: "DELETE",
      token,
    }),

  // Force delete course (Admin only)
  forceDelete: (id: number, token: string) =>
    apiFetch<void>(`/courses/${id.toString()}/force`, {
      method: "DELETE",
      token,
    }),

  // Restore soft deleted course (Admin only)
  restore: (id: number, token: string) =>
    apiFetch<CourseResponseDto>(`/courses/${id.toString()}/restore`, {
      method: "PATCH",
      token,
    }),
};
