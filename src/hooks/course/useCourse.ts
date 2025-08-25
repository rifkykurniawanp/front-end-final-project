"use client";

import { useState, useEffect, useCallback } from "react";
import { coursesApi } from "@/lib/API/courses";
import type { CourseResponseDto } from "@/types/course";

interface UseCourseProps {
  courseId?: number;
  slug?: string;
  token?: string;
}

export const useCourse = ({ courseId, slug, token }: UseCourseProps) => {
  const [course, setCourse] = useState<CourseResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!token || (!courseId && !slug)) return;
    setLoading(true);
    setError(null);
    try {
      const res = courseId
        ? await coursesApi.getById(courseId, token)
        : await coursesApi.getBySlug(slug as string, token); // paksa string
      setCourse(res);
    } catch (err: any) {
      setError(err.message || "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  }, [courseId, slug, token]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
};
