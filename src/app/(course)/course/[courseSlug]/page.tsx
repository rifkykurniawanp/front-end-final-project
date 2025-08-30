"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleSidebar } from "@/components/course/ModuleSideBar";
import { SectionList } from "@/components/course/SectionList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Clock, Users } from "lucide-react";
import { coursesApi } from "@/lib/API/courses";
import type { CourseWithRelations } from "@/types";

export default function CourseDetailPage() {
  const router = useRouter();
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  // Fetch course
  useEffect(() => {
    if (!courseSlug) return;

    const fetchCourseBySlug = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allCourses = await coursesApi.getAll();
        const foundCourse = allCourses.find((c) => c.slug === courseSlug);

        if (!foundCourse) throw new Error("Course not found");

        const courseDetails = await coursesApi.getById(foundCourse.id);
        setCourse(courseDetails);

        // Load progress
        const savedCompleted = localStorage.getItem(`course-${courseSlug}-completed`);
        if (savedCompleted) {
          setCompletedLessons(new Set(JSON.parse(savedCompleted)));
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Course not found");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseBySlug();
  }, [courseSlug, router]);

  // Handlers
  const handleLessonComplete = (lessonId: number) => {
    setCompletedLessons((prev) => {
      const newSet = new Set(prev);
      newSet.has(lessonId) ? newSet.delete(lessonId) : newSet.add(lessonId);
      if (courseSlug) {
        localStorage.setItem(`course-${courseSlug}-completed`, JSON.stringify([...newSet]));
      }
      return newSet;
    });
  };

  const handleStartCourse = () => {
    const firstModule = course?.modules?.[0];
    const firstLessonProgress = firstModule?.lessons?.[0];
    // Find the actual lesson object by id if needed
    const firstLesson = firstModule?.lessons && Array.isArray(firstModule.lessons)
      ? (firstModule.lessons[0] as any)
      : undefined;
    // If you have a lessons array with lesson objects, use their slug
    if (firstLesson && 'slug' in firstLesson && firstLesson.slug && course?.slug) {
      router.push(`/course/${course.slug}/${firstLesson.slug}`);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Loading course...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Course Not Found</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            The course you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  // Stats
  const totalLessons =
    course.modules?.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0) ?? 0;
  const progress =
    totalLessons > 0
      ? Math.round((completedLessons.size / totalLessons) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--footer-accent)] to-[var(--accent)] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
          {/* Left Hero */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg mb-6 opacity-90">{course.description ?? ""}</p>
            <div className="flex flex-wrap gap-4 mb-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" /> By {course.instructor?.firstName ?? "Unknown"}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> {course.duration ?? "-"}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> {course.modules?.length ?? 0} Modules
              </div>
            </div>
            <Button
              onClick={handleStartCourse}
              className="bg-white text-[var(--accent)] hover:bg-amber-100 text-lg px-6 py-3"
            >
              <Play className="w-5 h-5 mr-2" /> Start Course
            </Button>
          </div>

          {/* Right Hero / Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 p-6 border border-white/20 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-4">Course Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Lessons</span><span className="font-semibold">{totalLessons}</span></div>
                <div className="flex justify-between"><span>Duration</span><span className="font-semibold">{course.duration ?? "-"}</span></div>
                <div className="flex justify-between"><span>Level</span><span className="font-semibold">{course.level}</span></div>
                <div className="flex justify-between"><span>Progress</span><span className="font-semibold">{progress}%</span></div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-amber-100 mb-2">
                  <span>Completed</span><span>{completedLessons.size}/{totalLessons}</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Body */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ModuleSidebar
            course={course}
            completedLessons={completedLessons}
            onLessonComplete={handleLessonComplete}
          />
        </div>

        {/* Main */}
        <div className="lg:col-span-3 space-y-8">
          {/* Instructor */}
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">About the Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-bold text-xl">
                {course.instructor?.firstName?.charAt(0) ?? "?"}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{course.instructor?.firstName ?? "Unknown"}</h3>
                <p className="mt-1 text-slate-600">{course.instructor?.lastName ?? ""}</p>
              </div>
            </div>
          </section>

          {/* What You’ll Learn */}
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">What You Will Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray((course as any).whatYouWillLearn) &&
                (course as any).whatYouWillLearn.map((item: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-[var(--accent)]" />
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
                {Array.isArray((course as any).requirements) &&
                  (course as any).requirements.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-2 h-2 mt-2 bg-[var(--accent)] rounded-full" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
              </ul>
            </section>

            <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
              <ul className="space-y-2">
                {Array.isArray((course as any).targetAudience) &&
                  (course as any).targetAudience.map((item: string, i: number) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-2 h-2 mt-2 bg-[var(--accent)] rounded-full" />
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
              {Array.isArray((course as any).tags) &&
                (course as any).tags.map((tag: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20 hover:bg-[var(--accent)]/20"
                  >
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
