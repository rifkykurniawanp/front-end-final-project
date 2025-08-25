// lessons-api.ts
import { 
  Lesson, 
  CreateLessonDto, 
  UpdateLessonDto, 
  LessonResponseDto 
} from "@/types/lesson";
import { apiFetch } from "../core/api-fetch";

export const lessonsApi = {
  // Create a new lesson
  create: (data: CreateLessonDto, moduleId: number, token: string) =>
    apiFetch<LessonResponseDto>("/lessons", {
      method: "POST",
      body: { ...data, moduleId },
      token,
    }),

  // Get all lessons of a module
  getByModule: (moduleId: number, token: string) =>
    apiFetch<LessonResponseDto[]>(`/lessons/module/${moduleId}`, { token }),

  // Get lesson by ID
  getById: (id: number, token: string) =>
    apiFetch<LessonResponseDto>(`/lessons/${id}`, { token }),

  // Update lesson by ID
  update: (id: number, data: UpdateLessonDto, token: string) =>
    apiFetch<LessonResponseDto>(`/lessons/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  // Soft delete lesson
  delete: (id: number, token: string) =>
    apiFetch<void>(`/lessons/${id}`, {
      method: "DELETE",
      token,
    }),

  // Force delete lesson (Admin only)
  forceDelete: (id: number, token: string) =>
    apiFetch<void>(`/lessons/${id}/force`, {
      method: "DELETE",
      token,
    }),

  // Restore soft deleted lesson
  restore: (id: number, token: string) =>
    apiFetch<LessonResponseDto>(`/lessons/${id}/restore`, {
      method: "PATCH",
      token,
    }),
};