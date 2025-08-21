"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Lesson,
  CourseWithRelations,
  LessonProgress,
} from "@/types/course";
import { LessonType } from "@/types/enum";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { LessonTabs } from "@/components/course/LessonTabs";
import { CreateNoteAtTime } from "@/components/course/CreateNoteAtTime";
import { QuizRenderer } from "@/components/course/QuizRenderer";
import { ModuleSidebar } from "@/components/course/ModuleSideBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

import { lessonsApi } from "@/lib/API/courses";
import { lessonProgressApi } from "@/lib/API/courses";
import { coursesApi } from "@/lib/API/courses";

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams<{
    courseSlug: string;
    lessonSlug: string;
  }>();
  const router = useRouter();
  const { user, token } = useAuth();

  // ---------- State ----------
  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "quiz">("content");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [isLastInModule, setIsLastInModule] = useState<boolean>(false);
  const [isLastInCourse, setIsLastInCourse] = useState<boolean>(false);

  // PROGRESS: selalu Set<number>
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  // ---------- Helpers ----------
  const completedStorageKey = useMemo(
    () => `course-${courseSlug}-completed`,
    [courseSlug]
  );
  const notesStorageKey = useMemo(
    () => `lesson-${lessonSlug}-notes`,
    [lessonSlug]
  );

  const loadCompletedFromLocal = (): Set<number> => {
    try {
      const saved = localStorage.getItem(completedStorageKey);
      if (!saved) return new Set<number>();
      const arr: unknown = JSON.parse(saved);
      if (Array.isArray(arr)) {
        // normalize ke number
        return new Set(arr.map((v) => Number(v)).filter((v) => Number.isFinite(v)));
      }
      return new Set<number>();
    } catch {
      return new Set<number>();
    }
  };

  const saveCompletedToLocal = (setVal: Set<number>) => {
    localStorage.setItem(completedStorageKey, JSON.stringify([...setVal]));
  };

  // ---------- Helper to find course by slug ----------
  const findCourseBySlug = async (slug: string, token?: string): Promise<CourseWithRelations | null> => {
    try {
      // Since coursesApi doesn't have getBySlug, we'll get all courses and find by slug
      const allCourses = await coursesApi.getAll({ page: 1, limit: 100 }, token);
      
      // Find course by slug
      const foundCourse = allCourses.find((course: any) => course.slug === slug);
      
      if (foundCourse) {
        // Get full course details with relations
        return await coursesApi.getById(foundCourse.id, token);
      }
      
      return null;
    } catch (error) {
      console.error("Error finding course by slug:", error);
      return null;
    }
  };

  // ---------- Fetch Course + Lesson + Progress ----------
  useEffect(() => {
    if (!courseSlug || !lessonSlug) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) Course by slug - using workaround since getBySlug doesn't exist
        const courseResp = await findCourseBySlug(courseSlug, token || undefined);
        if (!courseResp) {
          setError("Course not found");
          router.push("/");
          return;
        }
        setCourse(courseResp);

        // 2) Lesson by slug
        const lessonResp = await lessonsApi.getBySlug(lessonSlug, token || undefined);
        if (!lessonResp) {
          setError("Lesson not found");
          router.push(`/course/${courseSlug}`);
          return;
        }
        setLesson(lessonResp);

        // 3) Navigation calculation
        const allLessons: Lesson[] =
          courseResp.modules?.flatMap((m) => m.lessons || []) || [];

        const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
        setPrevLesson(currentIndex > 0 ? allLessons[currentIndex - 1] : null);
        setNextLesson(
          currentIndex >= 0 && currentIndex < allLessons.length - 1
            ? allLessons[currentIndex + 1]
            : null
        );
        setIsLastInCourse(currentIndex === allLessons.length - 1);

        if (courseResp.modules) {
          for (const mod of courseResp.modules) {
            const idx = mod.lessons?.findIndex((l) => l.slug === lessonSlug) ?? -1;
            if (idx !== -1) {
              setIsLastInModule(idx === ((mod.lessons?.length ?? 0) - 1));
              break;
            }
          }
        }

        // 4) Progress: Use course progress endpoint instead of user progress
        if (user && token) {
          try {
            const progressData = await lessonsApi.getCourseProgress(courseResp.id, token);
            
            // Extract completed lesson IDs from progress data
            let doneIds = new Set<number>();
            if (Array.isArray(progressData)) {
              doneIds = new Set<number>(
                progressData
                  .filter((p: any) => p.completed)
                  .map((p: any) => p.lessonId || p.id)
                  .filter((id: any) => Number.isFinite(Number(id)))
              );
            }
            
            setCompletedLessons(doneIds);
            // keep localStorage in sync (optional)
            saveCompletedToLocal(doneIds);
          } catch (e) {
            console.warn("Failed to fetch progress, fallback to localStorage", e);
            const localSet = loadCompletedFromLocal();
            setCompletedLessons(localSet);
          }
        } else {
          const localSet = loadCompletedFromLocal();
          setCompletedLessons(localSet);
        }

        // 5) Load notes
        try {
          const savedNotes = localStorage.getItem(notesStorageKey);
          if (savedNotes) setNotes(JSON.parse(savedNotes));
        } catch {
          // ignore
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, lessonSlug, token, user?.id]);

  // ---------- Progress Handlers ----------
  const applyCompleteLocally = (lessonId: number) => {
    setCompletedLessons((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.add(lessonId);
      try {
        saveCompletedToLocal(next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const markLessonComplete = async (lessonId?: number) => {
    const id = lessonId ?? lesson?.id;
    if (!id) return;

    // Optimistic local update
    applyCompleteLocally(id);

    // If authenticated, sync to backend using the lessons API
    if (user && token) {
      try {
        // Use the backend's lesson completion endpoint
        await lessonsApi.completeLesson(id, token);
      } catch (err) {
        console.error("Failed to sync progress to server", err);
      }
    }
  };

  const handleCompleteAndContinue = async () => {
    await markLessonComplete();
    if (nextLesson?.slug) {
      router.push(`/course/${courseSlug}/${nextLesson.slug}`);
    } else {
      router.push(`/course/${courseSlug}`);
    }
  };

  // Sidebar checkbox callback
  const handleSidebarComplete = async (lessonId: number) => {
    await markLessonComplete(lessonId);
  };

  // ---------- Notes ----------
  const handleSaveNote = (note: { time: number; text: string }) => {
    const updated = [...notes, note];
    setNotes(updated);
    try {
      localStorage.setItem(notesStorageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // ---------- UI States ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Lesson not found.</p>
      </div>
    );
  }

  const isCompleted = completedLessons.has(lesson.id);

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ModuleSidebar
              course={course}
              completedLessons={completedLessons}
              onLessonComplete={handleSidebarComplete}
            />
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            {isCompleted && (
              <span className="text-green-600 text-sm font-medium">✓ Completed</span>
            )}
          </div>

          {lesson.type === LessonType.VIDEO && (
            <VideoPlayer
              videoUrl={lesson.videoUrl || ""}
              onTimeUpdate={setCurrentTime}
            />
          )}

          <LessonTabs
            lesson={lesson}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-6">
            {activeTab === "content" && (
              <div className="text-gray-700 text-sm leading-relaxed">
                {lesson.content ? (
                  <p>{lesson.content}</p>
                ) : (
                  <p className="italic text-gray-500">No content provided.</p>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Create Note
                  </h2>
                  <CreateNoteAtTime
                    currentTime={currentTime}
                    onSave={handleSaveNote}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">
                    Your Notes
                  </h3>
                  <ul className="space-y-2">
                    {notes.length === 0 ? (
                      <li className="text-gray-500 text-sm">No notes yet.</li>
                    ) : (
                      notes.map((note, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          <span className="text-amber-600 font-medium">
                            [{note.time.toFixed(1)}s]
                          </span>{" "}
                          - {note.text}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "quiz" &&
              lesson.quizQuestions &&
              Object.keys(lesson.quizQuestions).length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Quiz</h2>
                  <QuizRenderer questions={lesson.quizQuestions} />
                </div>
              )}
          </div>

          <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
            <div>
              {prevLesson?.slug && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/course/${courseSlug}/${prevLesson.slug}`)
                  }
                >
                  ← {prevLesson.title}
                </Button>
              )}
            </div>
            <div>
              {isLastInCourse ? (
                <Button
                  onClick={async () => {
                    await markLessonComplete();
                    router.push(`/course/${courseSlug}`);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  🎉 Complete Course
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteAndContinue}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  ✅ Complete & Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}