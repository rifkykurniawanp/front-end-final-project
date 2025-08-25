import { useState, useEffect, useCallback } from "react";
import { lessonProgressApi } from "@/lib/API/courses";
import type { LessonProgressResponseDto } from "@/types/lesson-progress";

export function useLessonProgress(userId?: number, lessonId?: number, token?: string) {
  const [progress, setProgress] = useState<LessonProgressResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!userId || !lessonId || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const resp = await lessonProgressApi.getProgress(userId, lessonId, token);
      setProgress(resp);
    } catch (err) {
      console.warn("Failed to fetch lesson progress", err);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [userId, lessonId, token]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markComplete = useCallback(async () => {
    if (!userId || !lessonId || !token) return;
    try {
      const resp = await lessonProgressApi.markComplete(userId, lessonId, token);
      setProgress(resp);
    } catch (err) {
      console.error("Failed to mark lesson complete", err);
    }
  }, [userId, lessonId, token]);

  return { progress, loading, markComplete, refetch: fetchProgress };
}
