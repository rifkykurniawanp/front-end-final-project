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
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!slug) return;

    const foundCourse = allCourses.find(c => c.slug === slug);
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      router.push("/"); // redirect jika course tidak ditemukan
    }
  }, [slug, router]);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  const handleStartCourse = () => {
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      router.push(`/lesson/${firstLesson.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>
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
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Course
              </Button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Course Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Lessons</span>
                    <span className="font-semibold">
                      {course.modules.reduce(
                        (total, module) => total + module.lessons.length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level</span>
                    <span className="font-semibold">{course.level}</span>
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
            <ModuleSidebar course={course} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Instructor */}
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">About the Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{course.instructor}</h3>
                  <p className="text-slate-600 mt-1">{course.instructorBio}</p>
                </div>
              </div>
            </section>

            {/* Learning Objectives */}
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">What You will Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-600">{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {course.requirements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Target Audience</h3>
                <ul className="space-y-2">
                  {course.targetAudience.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Tags */}
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Course Modules & Lessons */}
            <SectionList course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
