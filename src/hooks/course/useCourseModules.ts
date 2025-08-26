// hooks/courses/useCourseModules.ts
import { useQuery } from "@tanstack/react-query";
import { courseModulesApi } from "@/lib/API/courses";
import type { CourseModule } from "@/types/course-module";

export const moduleKeys = {
  all: ['modules'] as const,
  course: (courseId: number) => [...moduleKeys.all, 'course', courseId] as const,
  detail: (moduleId: number) => [...moduleKeys.all, 'detail', moduleId] as const,
};

export const useCourseModules = (courseId?: number, token?: string) => {
  return useQuery({
    queryKey: moduleKeys.course(courseId!),
    queryFn: () => courseModulesApi.getByCourse(courseId!, token),
    enabled: !!courseId && !!token,
    staleTime: 10 * 60 * 1000,
  });
};