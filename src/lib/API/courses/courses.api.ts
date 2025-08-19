// course-api.ts
import { Course, CreateCourseDto, UpdateCourseDto, CourseWithRelations } from "@/types/course";
import { apiFetch } from "../core/api-fetch";

export const coursesApi = {

  getAll: (token?: string) =>
    apiFetch<Course[]>("/courses", { token }),

  getById: (id: number, token?: string) =>
    apiFetch<CourseWithRelations>(`/courses/${id}`, { token }),

  getBySlug: (slug: string, token?: string) =>
    apiFetch<CourseWithRelations>(`/courses/slug/${slug}`, { token }),

 
  create: (data: CreateCourseDto, token: string) =>
    apiFetch<Course>("/courses", {
      method: "POST",
      body: data,
      token,
    }),

  update: (id: number, data: UpdateCourseDto, token: string) =>
    apiFetch<Course>(`/courses/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  delete: (id: number, token: string) =>
    apiFetch<{ message: string }>(`/courses/${id}`, {
      method: "DELETE",
      token,
    }),

  getByInstructor: (instructorId: number, token?: string) =>
    apiFetch<Course[]>(`/courses/instructor/${instructorId}`, { token }),

  search: (query: string, token?: string) =>
    apiFetch<Course[]>(`/courses/search?q=${encodeURIComponent(query)}`, {
      token,
    }),
};
