import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonProgressApi } from "@/lib/API/courses";
import type { LessonProgressResponseDto } from "@/types/lesson-progress";

// Hook untuk dapatkan progress 1 lesson
export const useLessonProgress = (userId: number, lessonId: number, token: string) => {
  return useQuery<LessonProgressResponseDto, Error>({
    queryKey: ["lesson-progress", userId, lessonId],
    queryFn: () => lessonProgressApi.getProgress(userId, lessonId, token),
    enabled: !!userId && !!lessonId && !!token, // hanya jalan kalau ada datanya
  });
};

// Hook untuk dapatkan semua progress user
export const useAllLessonProgress = (userId: number, token: string) => {
  return useQuery<LessonProgressResponseDto[], Error>({
    queryKey: ["lesson-progress", userId],
    queryFn: () => lessonProgressApi.getAllByUser(userId, token),
    enabled: !!userId && !!token,
  });
};

// Hook untuk mark complete
export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, lessonId, token }: { userId: number; lessonId: number; token: string }) =>
      lessonProgressApi.markComplete(userId, lessonId, token),
    onSuccess: (_, variables) => {
      // invalidate cache biar refetch otomatis
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", variables.userId, variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lesson-progress", variables.userId],
      });
    },
  });
};
