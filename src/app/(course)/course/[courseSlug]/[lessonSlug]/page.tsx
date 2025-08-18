"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lesson, CourseWithRelations, LessonProgress } from "@/types/course";
import { VideoPlayer } from "../../../../../components/course/VideoPlayer";
import { LessonTabs } from "../../../../../components/course/LessonTabs";
import { CreateNoteAtTime } from "../../../../../components/course/CreateNoteAtTime";
import { QuizRenderer } from "../../../../../components/course/QuizRenderer";
import { ModuleSidebar } from "@/components/course/ModuleSideBar";
import { Button } from "@/components/ui/button";

// Import API functions
import { lessonsApi } from "@/fetch-API/API/lessons.api";
import { lessonProgressApi } from "@/fetch-API/API/lesson-progresses.api";
import { coursesApi } from "@/fetch-API/API/courses.api";
import { useAuth } from "@/hooks/useAuth";
import { LessonType } from "@/types/enum";

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const router = useRouter();
  const { user, token } = useAuth();

  // State management
  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "quiz">("content");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigation state
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [isLastInModule, setIsLastInModule] = useState(false);
  const [isLastInCourse, setIsLastInCourse] = useState(false);

  // Progress tracking
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Fetch course and lesson data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course by slug
        const courseResponse = await coursesApi.getBySlug(courseSlug, token || undefined);
        if (!courseResponse) {
          router.push("/");
          return;
        }

        setCourse(courseResponse);

        // Fetch lesson by slug
        const lessonResponse = await lessonsApi.getBySlug(lessonSlug, token || undefined);
        if (!lessonResponse) {
          router.push(`/course/${courseSlug}`);
          return;
        }

        setLesson(lessonResponse);

        // Get all lessons from all modules to determine navigation
        const allLessons = courseResponse.modules?.flatMap((m) => m.lessons || []) || [];
        const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
        
        // Set navigation lessons
        setPrevLesson(currentIndex > 0 ? allLessons[currentIndex - 1] : null);
        setNextLesson(currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null);
        setIsLastInCourse(currentIndex === allLessons.length - 1);

        // Determine if this is the last lesson in current module
        if (courseResponse.modules) {
          for (const module of courseResponse.modules) {
            const moduleIndex = module.lessons?.findIndex((l) => l.slug === lessonSlug) || -1;
            if (moduleIndex !== -1) {
              setIsLastInModule(moduleIndex === (module.lessons?.length || 0) - 1);
              break;
            }
          }
        }

        // Fetch user progress if authenticated
        if (user && token) {
          try {
            const progressResponse = await lessonProgressApi.getByUser(user.id, token || "");
            const completedIds = progressResponse
              .filter(p => p.completed)
              .map(p => p.lessonId.toString());
            setCompletedLessons(new Set(completedIds));
          } catch (progressError) {
            console.warn("Failed to fetch progress:", progressError);
            // Fallback to localStorage for offline progress
            const saved = localStorage.getItem(`course-${courseSlug}-completed`);
            if (saved) setCompletedLessons(new Set(JSON.parse(saved)));
          }
        } else {
          // Fallback to localStorage for non-authenticated users
          const saved = localStorage.getItem(`course-${courseSlug}-completed`);
          if (saved) setCompletedLessons(new Set(JSON.parse(saved)));
        }

        // Load saved notes from localStorage
        const savedNotes = localStorage.getItem(`lesson-${lessonSlug}-notes`);
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }

      } catch (err) {
        console.error("Error fetching lesson data:", err);
        setError("Failed to load lesson. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug && lessonSlug) {
      fetchData();
    }
  }, [courseSlug, lessonSlug, router, user, token]);

  // Mark lesson as complete
  const markLessonComplete = async () => {
    if (!lesson || !user || !token) {
      // Fallback to localStorage for non-authenticated users
      if (lesson) {
        setCompletedLessons((prev) => {
          const updated = new Set(prev);
          updated.add(lesson.id.toString());
          localStorage.setItem(`course-${courseSlug}-completed`, JSON.stringify([...updated]));
          return updated;
        });
      }
      return;
    }

    try {
      // Update progress via API
      await lessonProgressApi.update(lesson.id, user.id, { completed: true }, token || "");
      
      // Update local state
      setCompletedLessons((prev) => {
        const updated = new Set(prev);
        updated.add(lesson.id.toString());
        return updated;
      });
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
      // Fallback to localStorage
      setCompletedLessons((prev) => {
        const updated = new Set(prev);
        updated.add(lesson.id.toString());
        localStorage.setItem(`course-${courseSlug}-completed`, JSON.stringify([...updated]));
        return updated;
      });
    }
  };

  const handleCompleteAndContinue = async () => {
    await markLessonComplete();
    if (nextLesson) {
      router.push(`/course/${courseSlug}/${nextLesson.slug}`);
    } else {
      router.push(`/course/${courseSlug}`);
    }
  };

  // Save notes to localStorage whenever notes change
  const handleSaveNote = (note: { time: number; text: string }) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem(`lesson-${lessonSlug}-notes`, JSON.stringify(updatedNotes));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  // Error state
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

  // Main render - keeping the exact same layout and styling
  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ModuleSidebar course={course} completedLessons={completedLessons} />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            {completedLessons.has(lesson.id.toString()) && (
              <span className="text-green-600 text-sm font-medium">✓ Completed</span>
            )}
          </div>

          {lesson.type === LessonType.VIDEO && (
            <VideoPlayer 
              videoUrl={lesson.videoUrl || ""} 
              onTimeUpdate={setCurrentTime} 
            />
          )}

          <LessonTabs lesson={lesson} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === "content" && (
              <div className="text-gray-700 text-sm leading-relaxed">
                {lesson.content ? <p>{lesson.content}</p> : <p className="italic text-gray-500">No content provided.</p>}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Create Note</h2>
                  <CreateNoteAtTime currentTime={currentTime} onSave={handleSaveNote} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Your Notes</h3>
                  <ul className="space-y-2">
                    {notes.length === 0 ? (
                      <li className="text-gray-500 text-sm">No notes yet.</li>
                    ) : (
                      notes.map((note, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          <span className="text-amber-600 font-medium">[{note.time.toFixed(1)}s]</span> - {note.text}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "quiz" && lesson.quizQuestions && Object.keys(lesson.quizQuestions).length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Quiz</h2>
                <QuizRenderer questions={lesson.quizQuestions} />
              </div>
            )}
          </div>

          <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
            <div>
              {prevLesson && (
                <Button variant="outline" onClick={() => router.push(`/course/${courseSlug}/${prevLesson.slug}`)}>
                  ← {prevLesson.title}
                </Button>
              )}
            </div>
            <div>
              {isLastInCourse ? (
                <Button onClick={async () => {
                  await markLessonComplete();
                  router.push(`/course/${courseSlug}`);
                }} className="bg-green-600 hover:bg-green-700">
                  🎉 Complete Course
                </Button>
              ) : (
                <Button onClick={handleCompleteAndContinue} className="bg-amber-600 hover:bg-amber-700">
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