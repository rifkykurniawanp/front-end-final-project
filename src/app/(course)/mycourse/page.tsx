"use client";

import { useState } from "react";
import { Course } from "@/types/course";
import { teaCourse } from "@/app/data/tea-course";
import { coffeeCourse } from "@/app/data/coffee-course";
import { herbalCourse } from "@/app/data/herb-course";
import { ProgressBar } from "@/app/(course)/components/ProgressBar";
import { CertificateBadge } from "@/app/(course)/components/CertificateBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Play, BookOpen, Clock, Award } from "lucide-react";

// Mock enrolled courses data
const enrolledCourses = [
  { 
    ...teaCourse, 
    progress: 75, 
    lastAccessed: "2 days ago",
    completedLessons: 12,
    totalLessons: 16,
    isCompleted: false
  },
  { 
    ...coffeeCourse, 
    progress: 100, 
    lastAccessed: "1 week ago",
    completedLessons: 14,
    totalLessons: 14,
    isCompleted: true
  },
  { 
    ...herbalCourse, 
    progress: 30, 
    lastAccessed: "3 days ago",
    completedLessons: 4,
    totalLessons: 13,
    isCompleted: false
  }
];

export default function MyCoursePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");

  const filteredCourses = enrolledCourses.filter(course => {
    if (filter === "in-progress") return !course.isCompleted;
    if (filter === "completed") return course.isCompleted;
    return true;
  });

  const handleContinueCourse = (courseId: string) => {
    router.push(`/${courseId}`);
  };

  const handleViewCertificate = (courseId: string) => {
    // Navigate to certificate page
    router.push(`/certificate/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Courses</h1>
          <p className="text-slate-600">
            Track your learning progress and continue where you left off
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-800">
                  {enrolledCourses.filter(c => c.isCompleted).length}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Hours</p>
                <p className="text-2xl font-bold text-slate-800">
                  {enrolledCourses.reduce((total, course) => {
                    const hours = parseInt(course.duration.split(' ')[0]) || 0;
                    return total + hours;
                  }, 0)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Courses" },
              { key: "in-progress", label: "In Progress" },
              { key: "completed", label: "Completed" }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as typeof filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-3">
                        By {course.instructor}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {course.isCompleted && (
                      <CertificateBadge 
                        courseId={course.id} 
                        onViewCertificate={handleViewCertificate}
                      />
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="text-sm font-medium text-slate-800">
                        {course.completedLessons}/{course.totalLessons} lessons ({course.progress}%)
                      </span>
                    </div>
                    <ProgressBar progress={course.progress} />
                  </div>

                  {/* Course Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <span>Last accessed: {course.lastAccessed}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center gap-3 lg:w-48">
                  <Button
                    onClick={() => handleContinueCourse(course.id)}
                    className="w-full"
                    variant={course.isCompleted ? "outline" : "default"}
                  >
                    {course.isCompleted ? (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Review Course
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </>
                    )}
                  </Button>

                  {course.isCompleted && (
                    <Button
                      onClick={() => handleViewCertificate(course.id)}
                      variant="outline"
                      className="w-full"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      View Certificate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              No courses found
            </h3>
            <p className="text-slate-600 mb-4">
              {filter === "completed" 
                ? "You haven't completed any courses yet." 
                : filter === "in-progress"
                ? "You don't have any courses in progress."
                : "You haven't enrolled in any courses yet."
              }
            </p>
            <Button onClick={() => router.push("/")}>
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}