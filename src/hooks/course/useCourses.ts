// hooks/courses/useCourses.ts
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/API/courses";
import type { CourseResponseDto, CoursePaginationParams } from "@/types/course";

// Keys factory untuk consistent cache management
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params: CoursePaginationParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
  slug: (slug: string) => [...courseKeys.details(), 'slug', slug] as const,
  instructor: (instructorId: number) => [...courseKeys.all, 'instructor', instructorId] as const,
};

// Unified course fetching dengan proper caching
export const useCourses = (params: CoursePaginationParams = {}) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => coursesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useCourse = (id?: number, token?: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id!),
    queryFn: () => coursesApi.getById(id!, token),
    enabled: !!id && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCourseBySlug = (slug?: string, token?: string) => {
  return useQuery({
    queryKey: courseKeys.slug(slug!),
    queryFn: () => coursesApi.getBySlug(slug!, token),
    enabled: !!slug && !!token,
    staleTime: 10 * 60 * 1000,
  });
};

export const useInstructorCourses = (instructorId?: number, token?: string) => {
  return useQuery({
    queryKey: courseKeys.instructor(instructorId!),
    queryFn: () => coursesApi.getByInstructorId(instructorId!, token),
    enabled: !!instructorId && !!token,
    staleTime: 5 * 60 * 1000,
  });
};