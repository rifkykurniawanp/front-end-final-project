"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/lib/API/courses";
import { courseKeys } from "./course/useCourses";
import type { CreateCourseDto, UpdateCourseDto } from "@/types/course";

export function useCourseCRUD(token: string) {
  const queryClient = useQueryClient();

  const createCourse = useMutation({
    mutationFn: (data: CreateCourseDto) => coursesApi.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });

  const updateCourse = useMutation({
    mutationFn: (input: { id: number; data: UpdateCourseDto }) =>
      coursesApi.update(input.id, input.data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: (id: number) => coursesApi.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });

  const restoreCourse = useMutation({
    mutationFn: (id: number) => coursesApi.restore(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });

  const forceDeleteCourse = useMutation({
    mutationFn: (id: number) => coursesApi.forceDelete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });

  return {
    createCourse,
    updateCourse,
    deleteCourse,
    restoreCourse,
    forceDeleteCourse,
  };
}
