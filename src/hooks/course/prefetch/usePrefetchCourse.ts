// hooks/courses/prefetch/usePrefetchCourse.ts
import { useQueryClient } from '@tanstack/react-query';
import { courseKeys } from '../useCourses';
import { moduleKeys } from '../useCourseModules';
import { coursesApi, courseModulesApi } from '@/lib/API/courses';

export const usePrefetchCourse = () => {
  const queryClient = useQueryClient();

  const prefetchCourse = async (courseId: number, token?: string) => {
    if (!token) return;

    // Prefetch course data
    await queryClient.prefetchQuery({
      queryKey: courseKeys.detail(courseId),
      queryFn: () => coursesApi.getById(courseId, token),
      staleTime: 10 * 60 * 1000,
    });

    // Prefetch modules
    await queryClient.prefetchQuery({
      queryKey: moduleKeys.course(courseId),
      queryFn: () => courseModulesApi.getByCourse(courseId, token),
      staleTime: 10 * 60 * 1000,
    });
  };

  const prefetchCourseBySlug = async (slug: string, token?: string) => {
    if (!token) return;

    await queryClient.prefetchQuery({
      queryKey: courseKeys.slug(slug),
      queryFn: () => coursesApi.getBySlug(slug, token),
      staleTime: 10 * 60 * 1000,
    });
  };

  return {
    prefetchCourse,
    prefetchCourseBySlug,
  };
};