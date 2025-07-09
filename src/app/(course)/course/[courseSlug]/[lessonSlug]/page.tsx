"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { teaCourse } from "@/app/data/tea-course";
import { coffeeCourse } from "@/app/data/coffee-course";
import { herbalCourse } from "@/app/data/herb-course";
import { Lesson, Course } from "@/types/course";
import { VideoPlayer } from "../../../components/VideoPlayer";
import { LessonTabs } from "../../../components/LessonTabs";
import { CreateNoteAtTime } from "../../../components/CreateNoteAtTime";
import { QuizRenderer } from "../../../components/QuizRenderer";
import { ModuleSidebar } from "@/app/(course)/components/ModuleSideBar";
import { Button } from "@/components/ui/button";

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "quiz">("content");

  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [isLastInModule, setIsLastInModule] = useState(false);
  const [isLastInCourse, setIsLastInCourse] = useState(false);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const allCourses = [teaCourse, coffeeCourse, herbalCourse];
    const foundCourse = allCourses.find((c) => c.slug === courseSlug);
    if (!foundCourse) return router.push("/");

    const allLessons = foundCourse.modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
    const currentLesson = allLessons[currentIndex];

    if (!currentLesson) return router.push(`/course/${courseSlug}`);

    setCourse(foundCourse);
    setLesson(currentLesson);
    setPrevLesson(currentIndex > 0 ? allLessons[currentIndex - 1] : null);
    setNextLesson(currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null);
    setIsLastInCourse(currentIndex === allLessons.length - 1);

    for (const mod of foundCourse.modules) {
      const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
      if (idx !== -1) {
        setIsLastInModule(idx === mod.lessons.length - 1);
        break;
      }
    }

    // Load completed
    const saved = localStorage.getItem(`course-${courseSlug}-completed`);
    if (saved) setCompletedLessons(new Set(JSON.parse(saved)));
  }, [courseSlug, lessonSlug, router]);

  const markLessonComplete = () => {
    if (!lesson) return;
    setCompletedLessons((prev) => {
      const updated = new Set(prev);
      updated.add(lesson.id);
      localStorage.setItem(`course-${courseSlug}-completed`, JSON.stringify([...updated]));
      return updated;
    });
  };

  const handleCompleteAndContinue = () => {
    markLessonComplete();
    if (nextLesson) {
      router.push(`/course/${courseSlug}/${nextLesson.slug}`);
    } else {
      router.push(`/course/${courseSlug}`);
    }
  };

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading lesson...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ModuleSidebar course={course} completedLessons={completedLessons} />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">{lesson.title}</h1>
            {completedLessons.has(lesson.id) && (
              <span className="text-green-600 text-sm font-medium">✓ Completed</span>
            )}
          </div>

          {lesson.type === "video" && (
            <VideoPlayer url={lesson.videoUrl || ""} onTimeUpdate={setCurrentTime} />
          )}

          <LessonTabs lesson={lesson} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="mt-6">
            {activeTab === "content" && (
              <div className="text-slate-700 text-sm leading-relaxed">
                {lesson.content ? <p>{lesson.content}</p> : <p className="italic text-slate-500">No content provided.</p>}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-700 mb-2">Create Note</h2>
                  <CreateNoteAtTime currentTime={currentTime} onSave={(note) => setNotes([...notes, note])} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">Your Notes</h3>
                  <ul className="space-y-2">
                    {notes.length === 0 ? (
                      <li className="text-slate-500 text-sm">No notes yet.</li>
                    ) : (
                      notes.map((note, idx) => (
                        <li key={idx} className="text-sm text-slate-700">
                          <span className="text-blue-600 font-medium">[{note.time.toFixed(1)}s]</span> - {note.text}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "quiz" && lesson.quiz && lesson.quiz.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Quiz</h2>
                <QuizRenderer questions={lesson.quiz} />
              </div>
            )}
          </div>

          <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
            <div>
              {prevLesson && (
                <Button variant="outline" onClick={() => router.push(`/course/${courseSlug}/${prevLesson.slug}`)}>
                  ← {prevLesson.title}
                </Button>
              )}
            </div>
            <div>
              {isLastInCourse ? (
                <Button onClick={() => {
                  markLessonComplete();
                  router.push(`/course/${courseSlug}`);
                }} className="bg-green-600 hover:bg-green-700">
                  🎉 Complete Course
                </Button>
              ) : (
                <Button onClick={handleCompleteAndContinue} className="bg-blue-600 hover:bg-blue-700">
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
