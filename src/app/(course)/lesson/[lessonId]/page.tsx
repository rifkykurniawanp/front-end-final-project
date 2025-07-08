"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { teaCourse } from "@/app/data/tea-course";
import { coffeeCourse } from "@/app/data/coffee-course";
import { herbalCourse } from "@/app/data/herb-course";
import { Lesson, Course } from "@/types/course";
import { VideoPlayer } from "../../components/VideoPlayer";
import { LessonTabs } from "../../components/LessonTabs";
import { CreateNoteAtTime } from "../../components/CreateNoteAtTime";
import { QuizRenderer } from "../../components/QuizRenderer";

export default function LessonPage() {
  const { lessonId } = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [notes, setNotes] = useState<{ time: number; text: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "quiz">("content");

  // Ambil lesson berdasarkan ID
  useEffect(() => {
    const allCourses: Course[] = [teaCourse, coffeeCourse, herbalCourse];
    for (const course of allCourses) {
      for (const module of course.modules) {
        const found = module.lessons.find((l) => l.id === lessonId);
        if (found) {
          setLesson(found);
          return;
        }
      }
    }
  }, [lessonId]);

  const handleNoteSave = (note: { time: number; text: string }) => {
    setNotes((prev) => [...prev, note]);
  };

  const handleTabChange = (tab: "content" | "notes" | "quiz") => {
    setActiveTab(tab);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading lesson...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">{lesson.title}</h1>

        {/* Video */}
        {lesson.type === "video" && (
          <VideoPlayer
            url={lesson.videoUrl || ""}
            onTimeUpdate={(time) => setCurrentTime(time)}
          />
        )}

        {/* Tab Navigasi */}
        <LessonTabs
          lesson={lesson}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Isi Tab */}
        <div className="mt-6">
          {activeTab === "content" && (
            <div className="text-slate-700 text-sm leading-relaxed">
              {lesson.type === "reading" || lesson.type === "practice" ? (
                <p>{lesson.content}</p>
              ) : lesson.type === "video" ? (
                <p className="italic text-slate-500">Watch the video above to follow the lesson.</p>
              ) : null}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-700 mb-2">Create Note</h2>
                <CreateNoteAtTime
                  currentTime={currentTime}
                  onSave={handleNoteSave}
                />
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
      </div>
    </div>
  );
}
