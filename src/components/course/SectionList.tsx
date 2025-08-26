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
    switch (type) {
      case "VIDEO": return <Play className="w-5 h-5 text-blue-600" />;
      case "ARTICLE": return <FileText className="w-5 h-5 text-green-600" />;
      case "QUIZ": return <HelpCircle className="w-5 h-5 text-purple-600" />;
      case "ASSIGNMENT": return <ClipboardList className="w-5 h-5 text-orange-600" />;
      default: return <Play className="w-5 h-5 text-blue-600" />;
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
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">{getLessonIcon(lesson.type)}</div>
        <div>
          <h4 className="font-medium text-slate-800">
            {index + 1}. {lesson.title}
          </h4>
          <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
            <span className="bg-slate-200 px-2 py-1 rounded text-xs">{getLessonLabel(lesson.type)}</span>
            {lesson.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{lesson.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button onClick={() => onStart(lesson)} variant="outline" size="sm" className="flex-shrink-0">
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Module {index + 1}: {module.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
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
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <p className="text-slate-600">Loading course curriculum...</p>
      </section>
    );
  }

  const totalLessons = course.modules?.reduce((total: number, module: CourseModule) => total + (module.lessons?.length || 0), 0) || 0;

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-800">Course Curriculum</h2>
        <p className="text-slate-600 mt-1">
          {course.modules?.length || 0} modules with {totalLessons} lessons
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {course.modules?.map((module, moduleIndex) => (
          <ModuleItem key={module.id} module={module} index={moduleIndex} onStartLesson={handleLessonClick} />
        ))}
      </div>
    </section>
  );
}
