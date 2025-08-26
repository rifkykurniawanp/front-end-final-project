// hooks/course/composite/useCourseWithProgress.ts
import { useQuery } from "@tanstack/react-query";
import { coursesApi, courseModulesApi, lessonsApi, lessonProgressApi } from "@/lib/API/courses/";
import { useAuth } from "../../useAuth";
import type { CourseResponseDto, CourseModule, LessonResponseDto, Lesson } from "@/types";
import { LessonType } from "@/types";

// ================= TYPES =================
export interface LessonWithProgress extends LessonResponseDto {
  completed: boolean;
  slug: string | null;
  videoUrl?: string;
  content?: string;
  quizQuestions?: any;
  passingScore?: number;
}

export interface ModuleWithLessons {
  id: number;
  courseId: number;
  title: string;
  orderNumber: number;
  deletedAt?: Date | null;
  lessons: LessonWithProgress[];
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}

export interface CourseWithProgressData {
  course: CourseResponseDto;
  modules: ModuleWithLessons[];
  overallProgress: {
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    estimatedTimeRemaining?: string;
    modulesSummary: {
      totalModules: number;
      completedModules: number;
      inProgressModules: number;
    };
  };
}

// ================= HELPER =================
const toLessonWithProgress = (
  lesson: LessonResponseDto,
  completed: boolean,
  extra?: Partial<Lesson>
): LessonWithProgress => {
  return {
    ...lesson,
    completed,
    slug: extra?.slug || null,
    videoUrl: extra?.videoUrl,
    content: extra?.content,
    quizQuestions: extra?.quizQuestions,
    passingScore: extra?.passingScore,
  };
};

const calculateEstimatedTime = (lessons: LessonWithProgress[]): string => {
  let totalMinutes = 0;

  for (const lesson of lessons.filter(l => !l.completed)) {
    if (lesson.duration) {
      const match = lesson.duration.match(/(\d+)/);
      if (match) {
        const minutes = parseInt(match[0]);
        totalMinutes += lesson.duration.includes("hour") ? minutes * 60 : minutes;
      }
    } else {
      switch (lesson.type) {
        case LessonType.VIDEO: totalMinutes += 15; break;
        case LessonType.ARTICLE: totalMinutes += 8; break;
        case LessonType.QUIZ: totalMinutes += 5; break;
        case LessonType.ASSIGNMENT: totalMinutes += 30; break;
        default: totalMinutes += 10;
      }
    }
  }

  if (totalMinutes < 60) return `${totalMinutes} minutes`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours < 24) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

// ================= HOOK =================
export const useCourseWithProgress = (courseId?: number, slug?: string) => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: ["course-with-progress", { courseId, slug, userId: user?.id }],
    queryFn: async (): Promise<CourseWithProgressData> => {
      if (!token) throw new Error("Authentication required");

      // Ambil course
      const course = courseId
        ? await coursesApi.getById(courseId, token)
        : await coursesApi.getBySlug(slug!, token);

      // Ambil module
      const modules: CourseModule[] = await courseModulesApi.getByCourse(course.id, token);
      const sortedModules = [...modules].sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

      // Ambil lesson per module
      const modulesWithLessons = await Promise.all(
        sortedModules.map(async (module) => {
          const lessons: LessonResponseDto[] = await lessonsApi.getByModule(module.id, token);
          const sortedLessons = [...lessons].sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
          return { module, lessons: sortedLessons };
        })
      );

      // Ambil progress user
      let progressData: Record<number, boolean> = {};
      if (user?.id) {
        const allLessons = modulesWithLessons.flatMap(({ lessons }) => lessons);
        const batchSize = 10;
        const progressPromises: Promise<{ lessonId: number; completed: boolean }>[] = [];

        for (let i = 0; i < allLessons.length; i += batchSize) {
          const batch = allLessons.slice(i, i + batchSize);
          const batchPromises = batch.map((lesson) =>
            lessonProgressApi
              .getProgress(user.id, lesson.id, token)
              .then((p) => ({ lessonId: lesson.id, completed: p?.completed || false }))
              .catch(() => ({ lessonId: lesson.id, completed: false }))
          );
          progressPromises.push(...batchPromises);
        }

        const progressResults = await Promise.all(progressPromises);
        progressData = progressResults.reduce((acc, { lessonId, completed }) => {
          acc[lessonId] = completed;
          return acc;
        }, {} as Record<number, boolean>);
      }

      // Mapping module + lessons
      const processedModules: ModuleWithLessons[] = modulesWithLessons.map(({ module, lessons }) => {
        const lessonsWithProgress: LessonWithProgress[] = lessons.map((lesson) =>
          toLessonWithProgress(lesson, progressData[lesson.id] || false, lesson as Partial<Lesson>)
        );

        const totalCount = lessonsWithProgress.length;
        const completedCount = lessonsWithProgress.filter(l => l.completed).length;
        const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          id: module.id,
          courseId: module.courseId,
          title: module.title,
          orderNumber: module.orderNumber ?? 0,
          deletedAt: module.deletedAt ?? null,
          lessons: lessonsWithProgress,
          totalCount,
          completedCount,
          progressPercentage
        };
      });

      const allLessons = processedModules.flatMap(m => m.lessons);
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter(l => l.completed).length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const modulesSummary = {
        totalModules: processedModules.length,
        completedModules: processedModules.filter(m => m.progressPercentage === 100).length,
        inProgressModules: processedModules.filter(m => m.progressPercentage > 0 && m.progressPercentage < 100).length,
      };

      const estimatedTimeRemaining = completedLessons < totalLessons ? calculateEstimatedTime(allLessons) : undefined;

      return {
        course,
        modules: processedModules,
        overallProgress: {
          totalLessons,
          completedLessons,
          progressPercentage,
          estimatedTimeRemaining,
          modulesSummary
        }
      };
    },
    enabled: !!token && (!!courseId || !!slug),
    staleTime: 2 * 60 * 1000,
  });
};
