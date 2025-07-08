"use client";

import { Course } from "@/types/course";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Users, Play } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handleViewCourse = () => {
    router.push(`/${course.id}`);
  };

  const handleStartCourse = () => {
    // Navigate to first lesson
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      router.push(`/lesson/${firstLesson.id}`);
    }
  };

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Course Header */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-2">{course.title}</h3>
          <div className="flex items-center gap-2 text-white/90">
            <Users className="w-4 h-4" />
            <span className="text-sm">{course.instructor}</span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{course.description}</p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {course.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{course.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={handleStartCourse}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Course
          </Button>
          <Button 
            onClick={handleViewCourse}
            variant="outline"
            className="px-4"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}