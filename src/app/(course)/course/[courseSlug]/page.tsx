"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@/types/course";
import { teaCourse } from "@/app/data/tea-course";
import { coffeeCourse } from "@/app/data/coffee-course";
import { herbalCourse } from "@/app/data/herb-course";
import { ModuleSidebar } from "@/app/(course)/components/ModuleSideBar";
import { SectionList } from "@/app/(course)/components/SectionList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Clock, Users } from "lucide-react";

// Gabungkan semua course
const allCourses: Course[] = [teaCourse, coffeeCourse, herbalCourse];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();

  // Pastikan slug dalam bentuk string
  const { courseSlug } = useParams<{ courseSlug: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!courseSlug) return;

    const foundCourse = allCourses.find((c) => c.slug === courseSlug);
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Load completed lessons from localStorage (or your preferred storage)
      const savedCompletedLessons = localStorage.getItem(`course-${courseSlug}-completed`);
      if (savedCompletedLessons) {
        setCompletedLessons(new Set(JSON.parse(savedCompletedLessons)));
      }
    } else {
      router.push("/"); // jika tidak ditemukan
    }
  }, [courseSlug, router]);

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      
      // Save to localStorage
      if (courseSlug) {
        localStorage.setItem(`course-${courseSlug}-completed`, JSON.stringify(Array.from(newSet)));
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
      console.log('Navigating to:', `/course/${course.slug}/${firstLesson.slug}`);
      console.log('Course slug:', course.slug);
      console.log('First lesson slug:', firstLesson.slug);
      
      // Add error handling for navigation
      try {
        router.push(`/course/${course.slug}/${firstLesson.slug}`);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      console.error('No first lesson found');
      console.log('Course modules:', course.modules);
    }
  };

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4 drop-shadow-sm">{course.title}</h1>
              <p className="text-xl text-amber-100 mb-6 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>By {course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.modules.length} Modules</span>
                </div>
              </div>

              <Button
                onClick={handleStartCourse}
                className="bg-white text-amber-600 hover:bg-amber-50 text-lg px-8 py-3 shadow-sm font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Course
              </Button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="font-semibold text-lg mb-4">Course Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Lessons</span>
                    <span className="font-semibold">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level</span>
                    <span className="font-semibold">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress</span>
                    <span className="font-semibold">{completionPercentage}%</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-amber-100">Completed</span>
                    <span className="text-sm text-amber-100">{completedLessons.size}/{totalLessons}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ModuleSidebar 
              course={course} 
              completedLessons={completedLessons}
              onLessonComplete={handleLessonComplete}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Instructor */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">About the Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{course.instructor}</h3>
                  <p className="text-slate-600 mt-1 leading-relaxed">{course.instructorBio}</p>
                </div>
              </div>
            </section>

            {/* Learning Objectives */}
            <section className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">What You will Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-600 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {course.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Target Audience</h3>
                <ul className="space-y-2">
                  {course.targetAudience.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors"
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
    </div>
  );
}