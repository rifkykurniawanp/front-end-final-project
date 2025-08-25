"use client";

import { useParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useCourse } from "@/hooks/course/useCourse";
import { useCourseModules } from "@/hooks/course/useCourseModules";
import { useLesson } from "@/hooks/course/useLesson";
import { useLessonProgress } from "@/hooks/course/useLessonProgress";
import { useCheckEnrollment } from "@/hooks/course/useCheckEnrollment";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LessonPage() {
  const params = useParams();
  const { user, token } = useAuthContext();

  // ======= SAFELY EXTRACT PARAMS =======
  const courseSlug = Array.isArray(params.courseSlug)
    ? params.courseSlug[0]
    : params.courseSlug;
  const lessonSlug = Array.isArray(params.lessonSlug)
    ? params.lessonSlug[0]
    : params.lessonSlug;

  const safeToken = token ?? undefined;
  const userId = user?.id;

  // ======= FETCH COURSE =======
  const { course, loading: courseLoading } = useCourse({
    slug: courseSlug ?? undefined,
    token: safeToken,
  });

  // ======= FETCH MODULES =======
  const { data: modules, isLoading: modulesLoading } = useCourseModules(
    course?.id ?? 0,
    safeToken
  );

  // ======= FETCH ENROLLMENT =======
  const { data: enrollment, isLoading: enrollmentLoading } = useCheckEnrollment(
    course?.id ?? 0,
    userId ?? 0,
    safeToken
  );

  // ======= FIND CURRENT LESSON =======
  const currentModule = modules?.find((m) =>
    m.lessons?.some((l) => l.slug === lessonSlug)
  );
  const currentLessonId = currentModule?.lessons?.find(
    (l) => l.slug === lessonSlug
  )?.id;

  const { lesson: currentLesson, loading: lessonLoading } = useLesson({
    lessonId: currentLessonId,
    token: safeToken,
  });

  // ======= FETCH LESSON PROGRESS =======
  const { completedLessons, markLessonComplete, loading: progressLoading } =
    useLessonProgress(course?.id, currentLessonId, safeToken, userId);

  // ======= LOADING STATE =======
  if (
    courseLoading ||
    modulesLoading ||
    lessonLoading ||
    progressLoading ||
    enrollmentLoading
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  // ======= NOT ENROLLED =======
  if (!enrollment) {
    return (
      <p className="text-center mt-10">
        ⚠️ Anda belum mendaftar di course ini.
      </p>
    );
  }

  // ======= MAIN RENDER =======
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{course?.title}</h1>
      <p className="text-gray-600">{course?.description}</p>

      {/* CURRENT LESSON */}
      {currentLesson && (
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">{currentLesson.title}</h2>
          <p className="text-gray-600">{currentLesson.description}</p>

          {completedLessons.has(currentLesson.id) ? (
            <span className="text-green-600 text-sm">Selesai ✅</span>
          ) : (
            <Button
              size="sm"
              onClick={() => markLessonComplete(currentLesson.id)}
            >
              Tandai Selesai
            </Button>
          )}
        </div>
      )}

      {/* LIST ALL MODULES & LESSONS */}
      <div className="space-y-4">
        {modules?.map((m) => (
          <div key={m.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold">{m.title}</h2>
            <ul className="ml-4 list-disc">
              {m.lessons?.map((l) => (
                <li
                  key={l.id}
                  className={`flex justify-between items-center py-1 ${
                    l.slug === lessonSlug ? "font-bold text-blue-600" : ""
                  }`}
                >
                  <span>{l.title}</span>
                  {completedLessons.has(l.id) && (
                    <span className="text-green-600 text-sm">Selesai ✅</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
