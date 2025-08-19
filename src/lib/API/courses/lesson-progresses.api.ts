import { apiFetch } from "../core/api-fetch";
import { LessonProgress, UpdateLessonProgressDto } from "@/types/course";

export const lessonProgressApi = {

  getByUser: (userId: number, token: string) =>
    apiFetch<LessonProgress[]>(`/users/${userId}/lesson-progress`, { token }),
    
  getByLesson: (lessonId: number, userId: number, token: string) =>
    apiFetch<LessonProgress>(`/lessons/${lessonId}/progress/${userId}`, { token }),
    
  
  update: (lessonId: number, userId: number, data: UpdateLessonProgressDto, token: string) =>
    apiFetch<LessonProgress>(`/lessons/${lessonId}/progress/${userId}`, {
      method: "PATCH",
      body: data,
      token,
    }),
    

  markComplete: (lessonId: number, userId: number, token: string) =>
    apiFetch<LessonProgress>(`/lessons/${lessonId}/progress/${userId}/complete`, {
      method: "PATCH",
      token,
    }),
};
