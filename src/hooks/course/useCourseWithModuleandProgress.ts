"use client";

import { useState, useEffect } from "react";
import { coursesApi, courseModulesApi, lessonsApi, lessonProgressApi } from "@/lib/API/courses";
import { useAuth } from "../useAuth";
import type { CourseWithRelations, CourseModule, Lesson } from "@/types";

interface LessonWithProgress extends Lesson {
  completed: boolean;
}

interface ModuleWithLessons extends CourseModule {
  lessons: LessonWithProgress[];
}

interface UseCourseWithProgressReturn {
  course: CourseWithRelations | null;
  modules: ModuleWithLessons[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseCourseWithProgressOptions {
  courseId?: number;
  slug?: string;
}

export const useCourseWithModulesAndProgress = ({ courseId, slug }: UseCourseWithProgressOptions): UseCourseWithProgressReturn => {
  const { token, user } = useAuth();
  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if ((!courseId && !slug) || !token) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Fetch course
      const fetchedCourse = courseId
        ? await coursesApi.getById(courseId, token)
        : await coursesApi.getBySlug(slug!, token);

      setCourse(fetchedCourse);

      // 2️⃣ Fetch modules
      const fetchedModules = await courseModulesApi.getByCourse(fetchedCourse.id, token);

      // 3️⃣ Fetch lessons + progress
      const modulesWithLessons: ModuleWithLessons[] = await Promise.all(
        fetchedModules.map(async (mod) => {
          const lessons = await lessonsApi.getByModule(mod.id, token);

          const lessonsWithProgress: LessonWithProgress[] = await Promise.all(
            lessons.map(async (lesson) => {
              let completed = false;
              if (user?.id) {
                const progress = await lessonProgressApi.getProgress(user.id, lesson.id, token);
                completed = progress?.completed ?? false;
              }
              return { ...lesson, completed };
            })
          );

          return { ...mod, lessons: lessonsWithProgress };
        })
      );

      setModules(modulesWithLessons);

    } catch (err: any) {
      console.error("Failed to fetch course/modules/lessons:", err);
      setError(err.message || "Failed to fetch course data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId, slug, token, user?.id]);

  return { course, modules, loading, error, refetch: fetchData };
};
