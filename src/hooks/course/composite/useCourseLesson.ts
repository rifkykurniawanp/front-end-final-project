import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { coursesApi, lessonsApi, lessonProgressApi } from "@/lib/API/courses";
import type {
  CourseResponseDto,
  LessonResponseDto,
  LessonProgressResponseDto
} from "@/types";

interface CourseLessonData {
  course: CourseResponseDto;
  lesson: LessonResponseDto;
  progress: LessonProgressResponseDto | null;
  navigation: {
    previousLesson: { slug: string; title: string } | null;
    nextLesson: { slug: string; title: string } | null;
    currentModule?: { id: number; title: string };
    moduleProgress?: { currentLessonIndex: number; totalLessons: number };
  };
}

export const useCourseLesson = (
  courseSlug?: string,
  lessonSlug?: string,
  userId?: number,
  token?: string
) => {
  const router = useRouter();

  return useQuery<CourseLessonData, any>({
    queryKey: ["course-lesson", { courseSlug, lessonSlug, userId }],
    queryFn: async () => {
      if (!courseSlug || !lessonSlug || !token) {
        throw new Error("Missing required parameters");
      }

      const course = await coursesApi.getBySlug(courseSlug, token);

      if (!course.modules?.length) throw new Error("Course has no modules");

      // Flatten lessons
      const allLessons: Array<any> = [];
      let currentModule;
      let currentModuleProgress;

      const sortedModules = [...course.modules].sort(
        (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
      );

      sortedModules.forEach((module: any) => {
        const sortedLessons = [...(module.lessons || [])].sort(
          (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
        );

        sortedLessons.forEach((lesson: any) => {
          allLessons.push({
            id: lesson.id,
            slug: lesson.slug || null,
            title: lesson.title,
            moduleId: module.id,
            moduleTitle: module.title,
            orderNumber: lesson.orderNumber || 0,
            moduleOrderNumber: module.orderNumber || 0,
          });

          if (lesson.slug === lessonSlug) {
            currentModule = { id: module.id, title: module.title };
            const navigableLessons = sortedLessons.filter(l => l.slug);
            const index = navigableLessons.findIndex(l => l.slug === lessonSlug);
            if (index !== -1) {
              currentModuleProgress = {
                currentLessonIndex: index + 1,
                totalLessons: navigableLessons.length,
              };
            }
          }
        });
      });

      const navigableLessons = allLessons.filter(l => l.slug);
      const lessonIndex = navigableLessons.findIndex(l => l.slug === lessonSlug);
      if (lessonIndex === -1) throw new Error("Lesson not found or not accessible");

      const foundLesson = navigableLessons[lessonIndex];

      const [lesson, progress] = await Promise.all([
        lessonsApi.getById(foundLesson.id, token),
        userId
          ? lessonProgressApi.getProgress(userId, foundLesson.id, token).catch(() => null)
          : Promise.resolve(null),
      ]);

      const navigation = {
        previousLesson: lessonIndex > 0 ? navigableLessons[lessonIndex - 1] : null,
        nextLesson: lessonIndex < navigableLessons.length - 1 ? navigableLessons[lessonIndex + 1] : null,
        currentModule,
        moduleProgress: currentModuleProgress,
      };

      return { course, lesson, progress, navigation };
    },
    enabled: !!token && !!courseSlug && !!lessonSlug,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.status === 401) {
        router.push("/login");
        return false;
      }
      if (error?.status === 403) {
        router.push(`/course/${courseSlug}`);
        return false;
      }
      return failureCount < 3;
    },
  });
};
