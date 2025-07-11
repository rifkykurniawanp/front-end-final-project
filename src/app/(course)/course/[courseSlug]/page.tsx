"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { allCourses } from "@/app/data/courses";
import { ModuleSidebar } from "@/components/course/ModuleSideBar";
import { SectionList } from "@/components/course/SectionList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Clock, Users } from "lucide-react";

import type { Course } from "@/types/course";

export default function CourseDetailPage() {
  const router = useRouter();
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!courseSlug) return;

    const foundCourse = allCourses.find((c) => c.slug === courseSlug);
    if (foundCourse) {
      setCourse(foundCourse);

      const savedCompleted = localStorage.getItem(`course-${courseSlug}-completed`);
      if (savedCompleted) {
        setCompletedLessons(new Set(JSON.parse(savedCompleted)));
      }
    } else {
      router.push("/");
    }
  }, [courseSlug, router]);

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      newSet.has(lessonId) ? newSet.delete(lessonId) : newSet.add(lessonId);
      if (courseSlug) {
        localStorage.setItem(`course-${courseSlug}-completed`, JSON.stringify([...newSet]));
      }
      return newSet;
    });
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  const handleStartCourse = () => {
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      router.push(`/course/${course.slug}/${firstLesson.slug}`);
    }
  };

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6 text-amber-100">{course.description}</p>
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2"><Users className="w-5 h-5" />By {course.instructor}</div>
              <div className="flex items-center gap-2"><Clock className="w-5 h-5" />{course.duration}</div>
              <div className="flex items-center gap-2"><BookOpen className="w-5 h-5" />{course.modules.length} Modules</div>
            </div>
            <Button onClick={handleStartCourse} className="bg-white text-amber-600 hover:bg-amber-100 text-lg px-6 py-3">
              <Play className="w-5 h-5 mr-2" />Start Course
            </Button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 p-6 border border-white/20 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-4">Course Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Lessons</span><span className="font-semibold">{totalLessons}</span></div>
                <div className="flex justify-between"><span>Duration</span><span className="font-semibold">{course.duration}</span></div>
                <div className="flex justify-between"><span>Level</span><span className="font-semibold">{course.level}</span></div>
                <div className="flex justify-between"><span>Progress</span><span className="font-semibold">{progress}%</span></div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-amber-100 mb-2">
                  <span>Completed</span><span>{completedLessons.size}/{totalLessons}</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full">
                  <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Body */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ModuleSidebar course={course} completedLessons={completedLessons} onLessonComplete={handleLessonComplete} />
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Instructor Section */}
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">About the Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{course.instructor}</h3>
                <p className="mt-1 text-slate-600">{course.instructorBio}</p>
              </div>
            </div>
          </section>

          {/* What You'll Learn */}
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">What You Will Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.whatYouWillLearn.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-amber-600" />
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Requirements & Audience */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2">
                {course.requirements.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-2 h-2 mt-2 bg-amber-600 rounded-full" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
              <ul className="space-y-2">
                {course.targetAudience.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-2 h-2 mt-2 bg-amber-600 rounded-full" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Tags */}
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <SectionList course={course} />
        </div>
      </div>
    </div>
  );
}
