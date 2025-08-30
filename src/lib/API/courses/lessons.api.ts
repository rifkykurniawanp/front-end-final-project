import { apiFetch } from "../core/api-fetch";
import {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
} from "@/types/lesson";

export const lessonsApi = {
  // Create new lesson
  create: (data: CreateLessonDto, token: string) =>
    apiFetch<Lesson>(`/lessons`, { method: "POST", body: { ...data }, token }),

  // Get lessons by module ID
  getByModule: (moduleId: number, token?: string) =>
    apiFetch<Lesson[]>(`/lessons/module/${moduleId.toString()}`, { token }),

  // Get lesson by ID
  getById: (id: number, token?: string) =>
    apiFetch<Lesson>(`/lessons/${id.toString()}`, { token }),

  // Update lesson
  update: (id: number, data: UpdateLessonDto, token: string) =>
    apiFetch<Lesson>(`/lessons/${id.toString()}`, { method: "PATCH", body: { ...data }, token }),

  // Soft delete lesson
  delete: (id: number, token: string) =>
    apiFetch<void>(`/lessons/${id.toString()}`, { method: "DELETE", token }),

  // Restore lesson
  restore: (id: number, token: string) =>
    apiFetch<Lesson>(`/lessons/${id.toString()}/restore`, { method: "PATCH", token }),

  // Force delete lesson (admin only)
  forceDelete: (id: number, token: string) =>
    apiFetch<void>(`/lessons/${id.toString()}/force`, { method: "DELETE", token }),
};