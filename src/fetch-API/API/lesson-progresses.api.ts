import { apiFetch } from "./api-fetch";
import { LessonProgress, UpdateLessonProgressDto } from "@/types/course";

export const lessonProgressApi = {

  getByUser: (userId: number, token: string) =>
    apiFetch<LessonProgress[]>(`/api/v1/users/${userId}/lesson-progress`, { token }),
    
  getByLesson: (lessonId: number, userId: number, token: string) =>
    apiFetch<LessonProgress>(`/api/v1/lessons/${lessonId}/progress/${userId}`, { token }),
    
  
  update: (lessonId: number, userId: number, data: UpdateLessonProgressDto, token: string) =>
    apiFetch<LessonProgress>(`/api/v1/lessons/${lessonId}/progress/${userId}`, {
      method: "PATCH",
      body: data,
      token,
    }),
    

  markComplete: (lessonId: number, userId: number, token: string) =>
    apiFetch<LessonProgress>(`/api/v1/lessons/${lessonId}/progress/${userId}/complete`, {
      method: "PATCH",
      token,
    }),
};
