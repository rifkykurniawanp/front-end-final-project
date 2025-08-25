"use client";

import { useEffect, useState, useCallback } from "react";
import { lessonsApi } from "@/lib/API/courses";
import type { LessonResponseDto } from "@/types/lesson";

interface UseLessonsProps {
  moduleId?: number;
  token?: string | null;
}

export function useLessons({ moduleId, token }: UseLessonsProps) {
  const [lessons, setLessons] = useState<LessonResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    if (!moduleId || !token) return;
    setLoading(true);
    setError(null);

    try {
      const resp = await lessonsApi.getByModule(moduleId, token);
      setLessons(resp);
    } catch (err: any) {
      console.error("Failed to fetch lessons:", err);
      setError(err.message || "Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  }, [moduleId, token]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return { lessons, loading, error, refetch: fetchLessons };
}
