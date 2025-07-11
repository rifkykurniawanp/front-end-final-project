"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, BookOpen, Clock, Play } from "lucide-react";
import { teaCourse } from "@/app/data/courses/tea";
import { coffeeCourse } from "@/app/data/courses/coffee";
import { herbalCourse } from "@/app/data/courses/herbal";
import { ProgressBar } from "@/components/course/ProgressBar";
import { CertificateBadge } from "@/components/course/CertificateBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock enrolled courses data
const enrolledCourses = [
  {
    ...teaCourse,
    progress: 75,
    lastAccessed: "2 days ago",
    completedLessons: 12,
    totalLessons: 16,
    isCompleted: false,
  },
  {
    ...coffeeCourse,
    progress: 100,
    lastAccessed: "1 week ago",
    completedLessons: 14,
    totalLessons: 14,
    isCompleted: true,
  },
  {
    ...herbalCourse,
    progress: 30,
    lastAccessed: "3 days ago",
    completedLessons: 4,
    totalLessons: 13,
    isCompleted: false,
  },
];

export default function MyCourseComponent() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");

  const filteredCourses = enrolledCourses.filter((course) => {
    if (filter === "in-progress") return !course.isCompleted;
    if (filter === "completed") return course.isCompleted;
    return true;
  });

  const handleContinueCourse = (courseId: string) => {
    router.push(`/${courseId}`);
  };

  const handleViewCertificate = (courseId: string) => {
    router.push(`/certificate/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-amber-600">
                {enrolledCourses.filter((c) => c.isCompleted).length}
              </p>
            </div>
            <Award className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold text-amber-600">
                {enrolledCourses.reduce((total, course) => {
                  const hours = parseInt(course.duration.split(" ")[0]) || 0;
                  return total + hours;
                }, 0)}
                h
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {["all", "in-progress", "completed"].map((key) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key as typeof filter)}
            className={filter === key ? "bg-amber-600 text-white" : "border-amber-600 text-amber-600 hover:bg-amber-50"}
          >
            {key === "all"
              ? "All Courses"
              : key === "in-progress"
              ? "In Progress"
              : "Completed"}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">By {course.instructor}</p>
                    <div className="flex flex-wrap gap-2">
                      {course.tags?.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {course.isCompleted && (
                    <CertificateBadge courseId={course.id} onViewCertificate={handleViewCertificate} />
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>
                      {course.completedLessons}/{course.totalLessons} lessons ({course.progress}%)
                    </span>
                  </div>
                  <ProgressBar progress={course.progress} />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
              <div className="flex flex-col justify-center gap-3 lg:w-48">
                <Button
                  onClick={() => handleContinueCourse(course.id)}
                  className="w-full"
                  variant={course.isCompleted ? "outline" : "default"}
                >
                  {course.isCompleted ? (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" /> Review Course
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" /> Continue Learning
                    </>
                  )}
                </Button>
                {course.isCompleted && (
                  <Button
                    onClick={() => handleViewCertificate(course.id)}
                    variant="outline"
                    className="w-full"
                  >
                    <Award className="w-4 h-4 mr-2" /> View Certificate
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === "completed"
                ? "You haven't completed any courses yet."
                : filter === "in-progress"
                ? "You don't have any courses in progress."
                : "You haven't enrolled in any courses yet."}
            </p>
            <Button onClick={() => router.push("/")} className="bg-amber-600 text-white">
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
