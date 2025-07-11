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
    router.push(`/course/${course.slug}`);
  };

  const handleStartCourse = () => {
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      router.push(`/course/${course.slug}/${firstLesson.slug}`);
    }
  };

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-amber-200">
      {/* Course Header */}
      <div className="h-48 bg-gradient-to-br from-amber-500 to-amber-600 relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-2 drop-shadow-sm">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 text-white/95">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{course.instructor}</span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {course.tags.slice(0, 3).map((tag, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className="text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            >
              {tag}
            </Badge>
          ))}
          {course.tags.length > 3 && (
            <Badge 
              variant="outline" 
              className="text-xs border-amber-200 text-amber-600 hover:bg-amber-50"
            >
              +{course.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleStartCourse}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Course
          </Button>
          <Button 
            onClick={handleViewCourse} 
            variant="outline" 
            className="px-4 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}