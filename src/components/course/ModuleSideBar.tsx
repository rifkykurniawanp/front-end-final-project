"use client";

import { CourseWithRelations, CourseModule, Lesson } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Play, FileText, HelpCircle, Check } from "lucide-react";
import { useState } from "react";
import { LessonType } from "@/types/enum";

interface ModuleSidebarProps {
  course: CourseWithRelations;
  completedLessons?: Set<number>;
  onLessonComplete?: (lessonId: number) => void;
}

export function ModuleSidebar({ 
  course, 
  completedLessons = new Set<number>(), 
  onLessonComplete 
}: ModuleSidebarProps) {
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const toggleModule = (moduleId: number) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(moduleId)) newSet.delete(moduleId);
    else newSet.add(moduleId);
    setExpandedModules(newSet);
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.slug) return;
    router.push(`/course/${course.slug}/${lesson.slug}`);
  };

  const handleLessonComplete = (lessonId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onLessonComplete?.(lessonId);
  };

  const getModuleProgress = (module: CourseModule) => {
    const lessons = module.lessons ?? [];
    const completedCount = lessons.filter(l => completedLessons.has(l.id)).length;
    return {
      completed: completedCount,
      total: lessons.length,
      percentage: lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0,
    };
  };

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO: return <Play className="w-4 h-4 text-amber-600" />;
      case LessonType.ARTICLE: return <FileText className="w-4 h-4 text-amber-600" />;
      case LessonType.QUIZ: return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case LessonType.ASSIGNMENT: return <HelpCircle className="w-4 h-4 text-amber-600" />; 
      default: return <Play className="w-4 h-4 text-amber-600" />;
    }
  };

  const totalLessons = course.modules?.reduce((sum: number, m: CourseModule) => sum + (m.lessons?.length ?? 0), 0) ?? 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Course Content</h2>
        <p className="text-sm text-slate-600 mt-1">
          {course.modules?.length ?? 0} modules • {totalLessons} lessons
        </p>
        {completedLessons.size > 0 && (
          <div className="mt-2 text-xs text-amber-600 font-medium">
            {completedLessons.size} of {totalLessons} lessons completed
          </div>
        )}
      </div>

      <div className="p-2 space-y-2">
        {course.modules?.map((module: CourseModule) => {
          const isExpanded = expandedModules.has(module.id);
          const progress = getModuleProgress(module);

          return (
            <div key={module.id} className="border border-slate-200 rounded-lg hover:border-amber-200 transition-colors">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-amber-50 transition-colors rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-800 text-sm">{module.title}</h3>
                    {progress.completed === progress.total && progress.total > 0 && (
                      <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{module.lessons?.length ?? 0} lessons</p>
                  {progress.total > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-600 transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{progress.completed}/{progress.total}</span>
                    </div>
                  )}
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-600" /> : <ChevronRight className="w-4 h-4 text-amber-600" />}
              </button>

              {isExpanded && (
                <ul className="py-2 border-t border-slate-200">
                  {module.lessons?.map((lesson: Lesson) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    return (
                      <li key={lesson.id} className="flex items-center gap-1 px-2">
                        <Button
                          variant="ghost"
                          className={`flex-1 justify-start text-xs text-left p-2 h-auto hover:bg-amber-50 hover:text-amber-900 transition-colors ${isCompleted ? 'line-through text-slate-600' : 'text-slate-800'}`}
                          onClick={() => handleLessonClick(lesson)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            {getLessonIcon(lesson.type)}
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{lesson.title}</p>
                              {lesson.duration && <p className="text-slate-500 text-xs">{lesson.duration}</p>}
                            </div>
                          </div>
                        </Button>

                        <button
                          onClick={(e) => handleLessonComplete(lesson.id, e)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-amber-600 border-amber-600' : 'border-slate-300 hover:border-amber-400'}`}
                        >
                          {isCompleted && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
