// lessons-api.ts
import { apiFetch } from "../core/api-fetch";
import { Lesson, CreateLessonDto, UpdateLessonDto } from "@/types/course";

export const lessonsApi = {
  // ===== ADMIN / INSTRUCTOR =====
  create: (moduleId: number, data: CreateLessonDto, token: string) =>
    apiFetch<Lesson>(`/api/modules/${moduleId}/lessons`, {
      method: "POST",
      body: data,
      token,
    }),

  getByModule: (moduleId: number, token: string) =>
    apiFetch<Lesson[]>(`/api/modules/${moduleId}/lessons`, { token }),

  getById: (id: number, token?: string) =>
    apiFetch<Lesson>(`/api/lessons/${id}`, { token }),

  getBySlug: (slug: string, token?: string) =>
    apiFetch<Lesson>(`/api/lessons/slug/${slug}`, { token }),

  update: (id: number, data: UpdateLessonDto, token: string) =>
    apiFetch<Lesson>(`/api/lessons/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  delete: (id: number, token: string) =>
    apiFetch<void>(`/api/lessons/${id}`, {
      method: "DELETE",
      token,
    }),

  // ===== USER PROGRESS =====
  getProgress: (lessonId: number, token: string) =>
    apiFetch<any>(`/api/lessons/${lessonId}/progress`, { token }),

  completeLesson: (lessonId: number, token: string) =>
    apiFetch<any>(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      token,
    }),

  getCourseProgress: (courseId: number, token: string) =>
    apiFetch<any>(`/api/courses/${courseId}/progress`, { token }),
};
