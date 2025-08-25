"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { coursesApi, lessonsApi,lessonProgressApi } from "@/lib/API/courses";

import { CourseResponseDto, Lesson, LessonWithRelations } from "@/types";
import { LessonProgressResponseDto } from "@/types/lesson-progress";

interface UseCourseLessonProps {
  courseSlug: string;
  lessonSlug: string;
  token: string;
  userId: number;
}

export function useCourseLesson({
  courseSlug,
  lessonSlug,
  token,
  userId,
}: UseCourseLessonProps) {
  const router = useRouter();

  // ================= STATE =================
  const [course, setCourse] = useState<CourseResponseDto | null>(null);
  const [lesson, setLesson] = useState<LessonWithRelations | null>(null);
  const [progress, setProgress] = useState<LessonProgressResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH ALL DATA =================
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Get course by slug
      const courseResp = await coursesApi.getBySlug(courseSlug, token);
      setCourse(courseResp);

      // 2. Cari lesson berdasarkan slug
      const allLessons: Lesson[] =
        courseResp.modules?.flatMap((m: any) => m.lessons || []) || [];

      const foundLesson = allLessons.find((l) => l.slug === lessonSlug);

      if (!foundLesson) {
        setError("Lesson not found");
        router.push(`/course/${courseSlug}`);
        return;
      }

      // 3. Fetch detail lesson by ID
      const lessonResp = await lessonsApi.getById(foundLesson.id, token);

      setLesson({ ...foundLesson, ...lessonResp });

      // 4. Fetch lesson progress
      const progressResp = await lessonProgressApi.getProgress(
        userId,
        foundLesson.id,
        token
      );
      setProgress(progressResp);
    } catch (err) {
      console.error("Failed to fetch course lesson:", err);
      setError("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  }, [courseSlug, lessonSlug, token, userId, router]);

  useEffect(() => {
    if (courseSlug && lessonSlug && token) {
      fetchAll();
    }
  }, [fetchAll, courseSlug, lessonSlug, token]);

  // ================= MARK LESSON COMPLETE =================
  const markLessonComplete = useCallback(async () => {
    if (!lesson) return;

    try {
      const resp = await lessonProgressApi.markComplete(
        userId,
        lesson.id,
        token
      );
      setProgress(resp);
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }
  }, [lesson, userId, token]);

  // ================= RETURN HOOK =================
  return {
    course,
    lesson,
    progress,
    loading,
    error,
    markLessonComplete,
    refetch: fetchAll,
  };
}
