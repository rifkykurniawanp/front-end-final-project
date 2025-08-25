import { useState, useEffect, useCallback } from "react";
import { lessonsApi } from "@/lib/API/courses";
import type { LessonResponseDto } from "@/types/lesson";

interface UseLessonProps {
  lessonId?: number;
  token?: string;
}

export const useLesson = ({ lessonId, token }: UseLessonProps) => {
  const [lesson, setLesson] = useState<LessonResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = useCallback(async () => {
    if (!lessonId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await lessonsApi.getById(lessonId, token);
      setLesson(res);
    } catch (err: any) {
      setError(err.message || "Failed to fetch lesson");
    } finally {
      setLoading(false);
    }
  }, [lessonId, token]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  return { lesson, loading, error, refetch: fetchLesson };
};
