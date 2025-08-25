import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseEnrollmentsApi } from "@/lib/API/courses";
import type { CourseEnrollment, EnrollCourseDto, UpdateEnrollmentDto } from "@/types/course-enrollment";

// Ambil semua enrollment user
export const useStudentEnrollments = (studentId: number, token: string) => {
  return useQuery<CourseEnrollment[], Error>({
    queryKey: ["enrollments", "student", studentId],
    queryFn: () => courseEnrollmentsApi.getByStudent(studentId, token),
    enabled: !!studentId && !!token,
  });
};

// Ambil enrollment course
export const useCourseEnrollments = (courseId: number, token: string) => {
  return useQuery<CourseEnrollment[], Error>({
    queryKey: ["enrollments", "course", courseId],
    queryFn: () => courseEnrollmentsApi.getByCourse(courseId, token),
    enabled: !!courseId && !!token,
  });
};

// Cek apakah user sudah enroll
export const useCheckEnrollment = (courseId: number, studentId: number, token: string) => {
  return useQuery<CourseEnrollment | null, Error>({
    queryKey: ["enrollment-check", courseId, studentId],
    queryFn: () => courseEnrollmentsApi.checkEnrollment(courseId, studentId, token),
    enabled: !!courseId && !!studentId && !!token,
  });
};

// Enroll ke course
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: EnrollCourseDto; token: string }) =>
      courseEnrollmentsApi.enroll(data, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "student", data.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "course", data.courseId],
      });
    },
  });
};

// Update enrollment (progress, status, dsb.)
export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: number; data: UpdateEnrollmentDto; token: string }) =>
      courseEnrollmentsApi.update(id, data, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "student", data.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["enrollments", "course", data.courseId],
      });
    },
  });
};
