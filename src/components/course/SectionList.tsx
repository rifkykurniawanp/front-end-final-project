"use client";

import { CourseWithRelations, CourseModule, Lesson } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, FileText, HelpCircle, Clock, ClipboardList } from "lucide-react";

interface SectionListProps {
  course?: CourseWithRelations;
}

// ==================== LessonItem ====================
interface LessonItemProps {
  lesson: Lesson;
  index: number;
  onStart: (lesson: Lesson) => void;
}

function LessonItem({ lesson, index, onStart }: LessonItemProps) {
  const getLessonIcon = (type: string) => {
    const baseClass = "w-5 h-5";
    switch (type) {
      case "VIDEO": return <Play className={`${baseClass} text-amber-700`} />;
      case "ARTICLE": return <FileText className={`${baseClass} text-green-700`} />;
      case "QUIZ": return <HelpCircle className={`${baseClass} text-purple-700`} />;
      case "ASSIGNMENT": return <ClipboardList className={`${baseClass} text-orange-700`} />;
      default: return <Play className={`${baseClass} text-amber-700`} />;
    }
  };

  const getLessonLabel = (type: string) => {
    switch (type) {
      case "VIDEO": return "Video";
      case "ARTICLE": return "Article";
      case "QUIZ": return "Quiz";
      case "ASSIGNMENT": return "Assignment";
      default: return "Lesson";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-beige rounded-lg hover:bg-beige-dark transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">{getLessonIcon(lesson.type)}</div>
        <div>
          <h4 className="font-medium text-dark-brown">
            {index + 1}. {lesson.title}
          </h4>
          <div className="flex items-center gap-3 text-sm text-taupe mt-1">
            <span className="bg-cream px-2 py-1 rounded text-xs">{getLessonLabel(lesson.type)}</span>
            {lesson.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-taupe" />
                <span>{lesson.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button
        onClick={() => onStart(lesson)}
        variant="outline"
        size="sm"
        className="flex-shrink-0 bg-amber-600 text-white hover:bg-amber-700"
      >
        Start
      </Button>
    </div>
  );
}

// ==================== ModuleItem ====================
interface ModuleItemProps {
  module: CourseModule;
  index: number;
  onStartLesson: (lesson: Lesson) => void;
}

function ModuleItem({ module, index, onStartLesson }: ModuleItemProps) {
  return (
    <div className="p-6 bg-beige rounded-lg border border-beige-dark mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-brown">
            Module {index + 1}: {module.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-taupe mt-1">
            <span>{module.lessons?.length || 0} lessons</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {module.lessons?.map((lesson, lessonIndex) => (
          <LessonItem key={lesson.id} lesson={lesson} index={lessonIndex} onStart={onStartLesson} />
        ))}
      </div>
    </div>
  );
}

// ==================== SectionList ====================
export function SectionList({ course }: SectionListProps) {
  const router = useRouter();

  const handleLessonClick = (lesson: Lesson) => {
    if (!course?.slug || !lesson?.slug) return;
    router.push(`/course/${course.slug}/${lesson.slug}`);
  };

  if (!course) {
    return (
      <section className="bg-beige rounded-lg shadow-sm border border-beige-dark p-6">
        <p className="text-taupe">Loading course curriculum...</p>
      </section>
    );
  }

  const totalLessons = course.modules?.reduce((total: number, module: CourseModule) => total + (module.lessons?.length || 0), 0) || 0;

  return (
    <section className="bg-beige rounded-lg shadow-sm border border-beige-dark">
      <div className="p-6 border-b border-beige-dark">
        <h2 className="text-2xl font-semibold text-dark-brown">Course Curriculum</h2>
        <p className="text-taupe mt-1">
          {course.modules?.length || 0} modules with {totalLessons} lessons
        </p>
      </div>

      <div className="divide-y divide-beige-dark">
        {course.modules?.map((module, moduleIndex) => (
          <ModuleItem key={module.id} module={module} index={moduleIndex} onStartLesson={handleLessonClick} />
        ))}
      </div>
    </section>
  );
}

// ==================== Tailwind Colors ====================
// Add these to your tailwind.config.js under extend.colors
// beige: "#e2d6c3"
// beige-dark: "#d5c6ac"
// dark-brown: "#3E2F2F"
// taupe: "#7a6b5a"
// cream: "#dfd1bb"
// amber-600: "#b8935a"
// amber-700: "#a67c52"
