import { useQuery } from "@tanstack/react-query";
import { courseEnrollmentsApi } from "@/lib/API/courses";
import type { CourseEnrollment } from "@/types/course-enrollment";

export const useCheckEnrollment = (courseId?: number, studentId?: number, token?: string) => {
  return useQuery<CourseEnrollment | null, Error>({
    queryKey: ["enrollment-check", courseId, studentId],
    queryFn: () => courseEnrollmentsApi.checkEnrollment(courseId!, studentId!, token!),
    enabled: !!courseId && !!studentId && !!token,
  });
};
