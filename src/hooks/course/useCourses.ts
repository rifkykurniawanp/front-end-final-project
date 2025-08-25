import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/API/courses';
import type { CourseResponseDto, CoursePaginationParams } from '@/types/course';

export const useCourses = (params: CoursePaginationParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery<CourseResponseDto[], Error>({
    queryKey: ['courses', page, limit],
    queryFn: () => coursesApi.getAll({ page, limit }),
  });
};
