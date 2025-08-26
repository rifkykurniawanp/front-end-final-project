// hooks/courses/useLessonProgress.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonProgressApi } from "@/lib/API/courses";
import type { LessonProgressResponseDto } from "@/types/lesson-progress";

export const progressKeys = {
  all: ['progress'] as const,
  user: (userId: number) => [...progressKeys.all, 'user', userId] as const,
  lesson: (userId: number, lessonId: number) => [...progressKeys.user(userId), 'lesson', lessonId] as const,
  course: (userId: number, courseId: number) => [...progressKeys.user(userId), 'course', courseId] as const,
  batch: (userId: number, lessonIds: number[]) => [...progressKeys.user(userId), 'batch', lessonIds.sort().join(',')] as const,
};

// Individual lesson progress
export const useLessonProgress = (userId?: number, lessonId?: number, token?: string) => {
  return useQuery({
    queryKey: progressKeys.lesson(userId!, lessonId!),
    queryFn: async () => {
      try {
        return await lessonProgressApi.getProgress(userId!, lessonId!, token!);
      } catch (error: any) {
        // Handle 404 gracefully - no progress record exists yet
        if (error?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!userId && !!lessonId && !!token,
    staleTime: 1 * 60 * 1000, // Progress data changes frequently
    retry: (failureCount, error: any) => {
      // Don't retry if progress doesn't exist (404) or auth errors
      if (error?.status === 404 || error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2; // Reduce retries for performance
    },
  });
};

// Batch progress fetching for better performance
export const useBatchLessonProgress = (userId?: number, lessonIds?: number[], token?: string) => {
  return useQuery({
    queryKey: progressKeys.batch(userId!, lessonIds || []),
    queryFn: async (): Promise<Record<number, LessonProgressResponseDto | null>> => {
      if (!lessonIds || lessonIds.length === 0) return {};
      
      // Batch API call if your backend supports it
      // Otherwise, use Promise.allSettled for better error handling
      const results = await Promise.allSettled(
        lessonIds.map(async (lessonId) => {
          try {
            const progress = await lessonProgressApi.getProgress(userId!, lessonId, token!);
            return { lessonId, progress };
          } catch (error: any) {
            if (error?.status === 404) {
              return { lessonId, progress: null };
            }
            throw error;
          }
        })
      );
      
      const progressMap: Record<number, LessonProgressResponseDto | null> = {};
      
      results.forEach((result, index) => {
        const lessonId = lessonIds[index];
        if (result.status === 'fulfilled') {
          progressMap[lessonId] = result.value.progress;
        } else {
          console.warn(`Failed to fetch progress for lesson ${lessonId}:`, result.reason);
          progressMap[lessonId] = null;
        }
      });
      
      return progressMap;
    },
    enabled: !!userId && !!lessonIds && lessonIds.length > 0 && !!token,
    staleTime: 1 * 60 * 1000,
  });
};

// Enhanced mutation with optimistic updates and better cache management
export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, lessonId, token }: { userId: number; lessonId: number; token: string }) => {
      // Create progress record based on Prisma schema structure
      const result = await lessonProgressApi.markComplete(userId, lessonId, token);
      return result;
    },
   
    // Optimistic update for better UX
    onMutate: async (variables) => {
      const { userId, lessonId } = variables;
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: progressKeys.lesson(userId, lessonId) 
      });
      
      // Snapshot previous value
      const previousProgress = queryClient.getQueryData(
        progressKeys.lesson(userId, lessonId)
      );
      
      // Optimistically update
      queryClient.setQueryData(
        progressKeys.lesson(userId, lessonId),
        {
          lessonId,
          userId,
          completed: true,
          updatedAt: new Date().toISOString(),
        }
      );
      
      return { previousProgress };
    },
    
    onError: (error, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousProgress !== undefined) {
        queryClient.setQueryData(
          progressKeys.lesson(variables.userId, variables.lessonId),
          context.previousProgress
        );
      }
    },
    
    onSuccess: (data, variables) => {
      const { userId, lessonId } = variables;
      
      // Update specific lesson progress with real data
      queryClient.setQueryData(
        progressKeys.lesson(userId, lessonId),
        data
      );
     
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: progressKeys.user(userId),
      });
      
      // Update batch queries that might contain this lesson
      queryClient.invalidateQueries({
        queryKey: [...progressKeys.user(userId), 'batch'],
      });
     
      // Invalidate course enrollment progress
      queryClient.invalidateQueries({
        queryKey: ['enrollments', 'student', userId],
      });
      
      // Invalidate course with progress queries
      queryClient.invalidateQueries({
        queryKey: ['course-with-progress'],
      });
    },
    
    onSettled: () => {
      // Always refetch after some time to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: progressKeys.all,
        });
      }, 5000);
    },
  });
};

// Helper hook for checking if user can mark lesson as complete
export const useCanCompleteLesson = (userId?: number, lessonId?: number, token?: string) => {
  return useQuery({
    queryKey: ['can-complete-lesson', userId, lessonId],
    queryFn: async () => {
      // This would check prerequisites, enrollment status, etc.
      // Implementation depends on your business logic
      return true; // Placeholder
    },
    enabled: !!userId && !!lessonId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};