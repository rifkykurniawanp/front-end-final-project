// hooks/courses/mutations/useCourseMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/API/courses';
import { courseKeys } from '../useCourses';
import type { CreateCourseDto, UpdateCourseDto } from '@/types/course';

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }: { data: CreateCourseDto; token: string }) =>
      coursesApi.create(data, token),
    onSuccess: () => {
      // Invalidate courses lists
      queryClient.invalidateQueries({
        queryKey: courseKeys.lists(),
      });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, token }: { id: number; data: UpdateCourseDto; token: string }) =>
      coursesApi.update(id, data, token),
    onSuccess: (updatedCourse) => {
      // Update course in cache
      queryClient.setQueryData(courseKeys.detail(updatedCourse.id), updatedCourse);
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: courseKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.instructor(updatedCourse.instructor.id),
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string }) =>
      coursesApi.delete(id, token),
    onSuccess: (_, { id }) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: courseKeys.detail(id),
      });
      
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: courseKeys.lists(),
      });
    },
  });
};