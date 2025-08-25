import { useQuery } from "@tanstack/react-query";
import { courseEnrollmentsApi } from "@/lib/API/courses";
import type { CourseEnrollment } from "@/types/course-enrollment";

/**
 * Cek apakah user sudah enroll di course tertentu
 * @param courseId ID course
 * @param studentId ID user/student
 * @param token Bearer token
 */
export const useCheckEnrollment = (
  courseId?: number,
  studentId?: number,
  token?: string
) => {
  return useQuery<CourseEnrollment | null, Error>({
    queryKey: ["enrollment-check", courseId, studentId],
    queryFn: async () => {
      if (!courseId || !studentId || !token) return null;
      const enrollment = await courseEnrollmentsApi.checkEnrollment(
        courseId,
        studentId,
        token
      );
      return enrollment;
    },
    enabled: !!courseId && !!studentId && !!token,
    staleTime: 1000 * 60, // 1 menit
  });
};
