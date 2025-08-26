"use client";

import { useState } from "react";
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

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const router = useRouter();
  const { token, user } = useAuth();

  const { data, isLoading, error } = useCourseLesson(courseSlug, lessonSlug, user?.id, token || "");
  const markCompleteMutation = useMarkLessonComplete();

  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "quiz">("content");

  const notesStorageKey = `lesson-${lessonSlug}-notes`;

  const handleSaveNote = (note: { time: number; text: string }) => {
    const updated = [...notes, note];
    setNotes(updated);
    try {
      localStorage.setItem(notesStorageKey, JSON.stringify(updated));
    } catch {}
  };

  const handleCompleteAndContinue = async () => {
    if (!data?.lesson || !user?.id || !token) return;
    await markCompleteMutation.mutateAsync({ userId: user.id, lessonId: data.lesson.id, token });

    if (data.navigation.nextLesson?.slug) {
      router.push(`/course/${courseSlug}/${data.navigation.nextLesson.slug}`);
    } else {
      router.push(`/course/${courseSlug}`);
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
              completedLessons={new Set()} // bisa mapping dari progress API
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
