import { apiFetch } from "../core/api-fetch"; // Import the separated apiFetch utility
import { Lesson, CreateLessonDto, UpdateLessonDto } from "@/types/course";

export const lessonsApi = {
  getByModule: (moduleId: number, token?: string) =>
    apiFetch<Lesson[]>(`/course-modules/${moduleId}/lessons`, { token }),
    
  getById: (id: number, token?: string) =>
    apiFetch<Lesson>(`/lessons/${id}`, { token }),

  getBySlug: (slug: string, token?: string) =>
    apiFetch<Lesson>(`/lessons/slug/${slug}`, { token }),
    
  create: (data: CreateLessonDto, token: string) =>
    apiFetch<Lesson>("/lessons", {
      method: "POST",
      body: data,
      token,
    }),
    
  update: (id: number, data: UpdateLessonDto, token: string) =>
    apiFetch<Lesson>(`/lessons/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
    
  delete: (id: number, token: string) =>
    apiFetch<{ message: string }>(`/lessons/${id}`, {
      method: "DELETE",
      token,
    }),
};
