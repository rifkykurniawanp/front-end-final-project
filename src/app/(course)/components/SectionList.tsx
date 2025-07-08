"use client";

import { Course, Module, Lesson } from "@/types/course";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, FileText, HelpCircle, Clock } from "lucide-react";

interface SectionListProps {
  course: Course;
}

export function SectionList({ course }: SectionListProps) {
  const router = useRouter();

  const handleLessonClick = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case 'video':
        return <Play className="w-5 h-5 text-blue-600" />;
      case 'reading':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'quiz':
        return <HelpCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <Play className="w-5 h-5 text-blue-600" />;
    }
  };

  const getLessonTypeLabel = (lessonType: string) => {
    switch (lessonType) {
      case 'video':
        return 'Video';
      case 'reading':
        return 'Reading';
      case 'quiz':
        return 'Quiz';
      default:
        return 'Lesson';
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-800">Course Curriculum</h2>
        <p className="text-slate-600 mt-1">
          {course.modules.length} modules with {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {course.modules.map((module: Module, moduleIndex) => (
          <div key={module.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{module.duration}</span>
                  </div>
                  <span>{module.lessons.length} lessons</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {module.lessons.map((lesson: Lesson, lessonIndex) => (
                <div 
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getLessonIcon(lesson.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {lessonIndex + 1}. {lesson.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                        <span className="bg-slate-200 px-2 py-1 rounded text-xs">
                          {getLessonTypeLabel(lesson.type)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleLessonClick(lesson.id)}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}