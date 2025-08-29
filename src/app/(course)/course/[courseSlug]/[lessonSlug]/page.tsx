"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { LessonTabs } from "@/components/course/LessonTabs";
import { CreateNoteAtTime } from "@/components/course/CreateNoteAtTime";
import { QuizRenderer } from "@/components/course/QuizRenderer";
import { ModuleSidebar } from "@/components/course/ModuleSideBar";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";
import { useCourseLesson } from "@/hooks/course";
import { useMarkLessonComplete } from "@/hooks/course";
import { LessonType } from "@/types/enum";
import { lessonProgressApi } from "@/lib/API/courses";
import { LessonProgressResponseDto } from "@/types/lesson-progress";

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const router = useRouter();
  const { token, user } = useAuth();

  const { data, isLoading, error } = useCourseLesson(courseSlug, lessonSlug, user?.id, token || "");
  const markCompleteMutation = useMarkLessonComplete();

  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "quiz">("content");
  const [lessonProgresses, setLessonProgresses] = useState<LessonProgressResponseDto[]>([]);

  const notesStorageKey = `lesson-${lessonSlug}-notes`;

  // Load saved notes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(notesStorageKey);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, [notesStorageKey]);

  // Fetch lesson progresses for this course
  useEffect(() => {
    if (!user?.id || !token || !data?.course?.modules) return;

    const fetchProgress = async () => {
      try {
        const modules = data.course.modules ?? [];
        const lessons = modules.flatMap(mod => mod.lessons ?? []);
        const progresses = await Promise.all(
          lessons.map(lesson =>
            lessonProgressApi.getProgress(user.id, lesson.id, token).catch(() => null)
          )
        );

        setLessonProgresses(progresses.filter(Boolean) as LessonProgressResponseDto[]);
      } catch (err) {
        console.error("Failed to fetch lesson progresses:", err);
      }
    };

    fetchProgress();
  }, [user?.id, token, data?.course?.modules]);

  const handleSaveNote = (note: { time: number; text: string }) => {
    const updated = [...notes, note];
    setNotes(updated);
    try {
      localStorage.setItem(notesStorageKey, JSON.stringify(updated));
    } catch {}
  };

  const handleCompleteAndContinue = async () => {
    if (!data?.lesson || !user?.id || !token) return;

    try {
      // Mark lesson as complete in backend
      const updatedProgress = await lessonProgressApi.markComplete(user.id, data.lesson.id, token);

      // Update local progress state
      setLessonProgresses(prev => {
        const filtered = prev.filter(p => p.lessonId !== updatedProgress.lessonId);
        return [...filtered, updatedProgress];
      });

      // Move to next lesson if available
      if (data.navigation.nextLesson?.slug) {
        router.push(`/course/${courseSlug}/${data.navigation.nextLesson.slug}`);
      } else {
        router.push(`/course/${courseSlug}`);
      }
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }
  };

  if (isLoading) return <div>Loading lesson...</div>;

  // --- Unauthorized / Not enrolled handling ---
  if (error?.message?.includes("Unauthorized")) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">You are not enrolled in this course</h2>
        <Button onClick={() => router.push(`/course/${courseSlug}`)}>Go to Course Page</Button>
      </div>
    );
  }

  if (!data) return <div>Lesson not found</div>;

  const { lesson, course, progress, navigation } = data;
  const isCompleted = progress?.completed;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ModuleSidebar
              course={course}
              completedLessons={new Set(lessonProgresses.filter(p => p.completed).map(p => p.lessonId))}
              onLessonComplete={() =>
                markCompleteMutation.mutate({ userId: user!.id, lessonId: lesson.id, token: token! })
              }
            />
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            {isCompleted && <span className="text-green-600 text-sm font-medium">✓ Completed</span>}
          </div>

          {lesson.type === LessonType.VIDEO && (
            <VideoPlayer videoUrl={lesson.videoUrl || ""} onTimeUpdate={setCurrentTime} />
          )}

          <LessonTabs lesson={lesson} activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "content" && <div>{lesson.content || "No content provided"}</div>}

          {activeTab === "notes" && (
            <div>
              <CreateNoteAtTime currentTime={currentTime} onSave={handleSaveNote} />
              <ul>
                {notes.map((n, i) => (
                  <li key={i}>
                    [{n.time.toFixed(1)}s] - {n.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "quiz" && lesson.quizQuestions && <QuizRenderer questions={lesson.quizQuestions} />}

          <div className="flex justify-between mt-6">
            {navigation.previousLesson && (
              <Button onClick={() => router.push(`/course/${courseSlug}/${navigation.previousLesson!.slug}`)}>
                ← {navigation.previousLesson.title}
              </Button>
            )}
            <Button
              onClick={handleCompleteAndContinue}
              className={navigation.nextLesson ? "bg-amber-600" : "bg-green-600"}
            >
              {navigation.nextLesson ? "✅ Complete & Continue" : "🎉 Complete Course"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
