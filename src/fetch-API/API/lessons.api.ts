import { apiFetch } from "./api-fetch"; // Import the separated apiFetch utility
import { Lesson, CreateLessonDto, UpdateLessonDto } from "@/types/course";

export const lessonsApi = {
  getByModule: (moduleId: number, token?: string) =>
    apiFetch<Lesson[]>(`/api/v1/course-modules/${moduleId}/lessons`, { token }),
    
  getById: (id: number, token?: string) =>
    apiFetch<Lesson>(`/api/v1/lessons/${id}`, { token }),

  getBySlug: (slug: string, token?: string) =>
    apiFetch<Lesson>(`/api/v1/lessons/slug/${slug}`, { token }),
    
  create: (data: CreateLessonDto, token: string) =>
    apiFetch<Lesson>("/api/v1/lessons", {
      method: "POST",
      body: data,
      token,
    }),
    
  update: (id: number, data: UpdateLessonDto, token: string) =>
    apiFetch<Lesson>(`/api/v1/lessons/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),
    
  delete: (id: number, token: string) =>
    apiFetch<{ message: string }>(`/api/v1/lessons/${id}`, {
      method: "DELETE",
      token,
    }),
};
