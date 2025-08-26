// hooks/courses/useLessons.ts
import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "@/lib/API/courses";
import type { LessonResponseDto } from "@/types/lesson";

export const lessonKeys = {
  all: ['lessons'] as const,
  module: (moduleId: number) => [...lessonKeys.all, 'module', moduleId] as const,
  detail: (lessonId: number) => [...lessonKeys.all, 'detail', lessonId] as const,
};

export const useLessonsByModule = (moduleId?: number, token?: string) => {
  return useQuery({
    queryKey: lessonKeys.module(moduleId!),
    queryFn: () => lessonsApi.getByModule(moduleId!, token!),
    enabled: !!moduleId && !!token,
    staleTime: 15 * 60 * 1000,
  });
};

export const useLesson = (lessonId?: number, token?: string) => {
  return useQuery({
    queryKey: lessonKeys.detail(lessonId!),
    queryFn: () => lessonsApi.getById(lessonId!, token!),
    enabled: !!lessonId && !!token,
    staleTime: 15 * 60 * 1000,
  });
};