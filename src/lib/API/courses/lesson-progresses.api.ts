import { LessonProgressResponseDto } from "@/types/lesson-progress";
import { apiFetch } from "../core/api-fetch";

export const lessonProgressApi = {
  // Get all lesson progresses for a user
  getAllByUser: (userId: number, token: string) =>
    apiFetch<LessonProgressResponseDto[]>(`/lesson-progresses/${userId.toString()}`, { token }),

  // Get specific lesson progress by user and lesson
  getProgress: (userId: number, lessonId: number, token: string) =>
    apiFetch<LessonProgressResponseDto>(`/lesson-progresses/${userId.toString()}/${lessonId.toString()}`, { token }),

  // Mark lesson as completed
  markComplete: (userId: number, lessonId: number, token: string) =>
    apiFetch<LessonProgressResponseDto>(`/lesson-progresses/${userId.toString()}/${lessonId.toString()}/complete`, {
      method: "POST",
      token,
    }),
};