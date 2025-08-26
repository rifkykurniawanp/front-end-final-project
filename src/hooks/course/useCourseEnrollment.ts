// hooks/courses/useCourseEnrollments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseEnrollmentsApi } from "@/lib/API/courses";
import type { CourseEnrollment, EnrollCourseDto, UpdateEnrollmentDto } from "@/types/course-enrollment";

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  student: (studentId: number) => [...enrollmentKeys.all, 'student', studentId] as const,
  course: (courseId: number) => [...enrollmentKeys.all, 'course', courseId] as const,
  check: (courseId: number, studentId: number) => [...enrollmentKeys.all, 'check', courseId, studentId] as const,
  detail: (enrollmentId: number) => [...enrollmentKeys.all, 'detail', enrollmentId] as const,
};

export const useStudentEnrollments = (studentId?: number, token?: string) => {
  return useQuery({
    queryKey: enrollmentKeys.student(studentId!),
    queryFn: () => courseEnrollmentsApi.getByStudent(studentId!, token!),
    enabled: !!studentId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseEnrollments = (courseId?: number, token?: string) => {
  return useQuery({
    queryKey: enrollmentKeys.course(courseId!),
    queryFn: () => courseEnrollmentsApi.getByCourse(courseId!, token!),
    enabled: !!courseId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCheckEnrollment = (courseId?: number, studentId?: number, token?: string) => {
  return useQuery({
    queryKey: enrollmentKeys.check(courseId!, studentId!),
    queryFn: () => courseEnrollmentsApi.checkEnrollment(courseId!, studentId!, token!),
    enabled: !!courseId && !!studentId && !!token,
    staleTime: 2 * 60 * 1000,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }: { data: EnrollCourseDto; token: string }) =>
      courseEnrollmentsApi.enroll(data, token),
    
    onSuccess: (enrollment) => {
      // Update enrollments cache
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.student(enrollment.studentId),
      });
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.course(enrollment.courseId),
      });
      
      // Update enrollment check cache
      queryClient.setQueryData(
        enrollmentKeys.check(enrollment.courseId, enrollment.studentId),
        enrollment
      );
    },
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, token }: { id: number; data: UpdateEnrollmentDto; token: string }) =>
      courseEnrollmentsApi.update(id, data, token),
    
    onSuccess: (enrollment) => {
      // Update specific enrollment
      queryClient.setQueryData(
        enrollmentKeys.detail(enrollment.id),
        enrollment
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.student(enrollment.studentId),
      });
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.course(enrollment.courseId),
      });
    },
  });
};