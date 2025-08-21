// lessonProgress-api.ts
import { apiFetch } from "../core/api-fetch";

export const lessonProgressApi = {
  // Get course progress (JWT required)
  getByCourse: (courseId: number, token: string) =>
    apiFetch<any>(`/api/courses/${courseId}/progress`, { token }),

  // Get lesson progress (JWT required)
  getByLesson: (lessonId: number, token: string) =>
    apiFetch<any>(`/api/lessons/${lessonId}/progress`, { token }),

  // Mark lesson complete (JWT required)
  markComplete: (lessonId: number, token: string) =>
    apiFetch<any>(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      token,
    }),
};
