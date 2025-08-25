import { useQuery } from "@tanstack/react-query";
import { courseModulesApi } from "@/lib/API/courses";
import type { CourseModule } from "@/types/course-module";

export const useCourseModules = (courseId?: number, token?: string) => {
  return useQuery<CourseModule[], Error>({
    queryKey: ["course-modules", courseId],
    queryFn: () => courseModulesApi.getByCourse(courseId!, token!),
    enabled: !!courseId && !!token,
  });
};
