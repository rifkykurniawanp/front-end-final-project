"use client";

import { Course, Module, Lesson } from "@/types/course";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Play, FileText, HelpCircle, Check } from "lucide-react";
import { useState } from "react";

interface ModuleSidebarProps {
  course: Course;
  completedLessons?: Set<string>; 
  onLessonComplete?: (lessonId: string) => void;
}

export function ModuleSidebar({ course, completedLessons = new Set(), onLessonComplete }: ModuleSidebarProps) {
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleLessonClick = (lesson: Lesson) => {
    router.push(`/course/${course.slug}/${lesson.slug}`);
  };

  const handleLessonComplete = (lessonId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent lesson navigation
    onLessonComplete?.(lessonId);
  };

  const getModuleProgress = (module: Module) => {
    const completedCount = module.lessons.filter(lesson => 
      completedLessons.has(lesson.id)
    ).length;
    return {
      completed: completedCount,
      total: module.lessons.length,
      percentage: Math.round((completedCount / module.lessons.length) * 100)
    };
  };

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case "video":
        return <Play className="w-4 h-4 text-amber-600" />;
      case "reading":
        return <FileText className="w-4 h-4 text-amber-600" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Play className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:border-amber-200 transition-colors">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Course Content</h2>
        <p className="text-sm text-slate-600 mt-1">
          {course.modules.length} modules •{" "}
          {course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0
          )}{" "}
          lessons
        </p>
        {completedLessons.size > 0 && (
          <div className="mt-2 text-xs text-amber-600 font-medium">
            {completedLessons.size} of {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons completed
          </div>
        )}
      </div>

      <div className="p-2">
        <div className="space-y-2">
          {course.modules.map((module: Module) => {
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
                    <p className="text-xs text-slate-600 mt-1">
                      {module.lessons.length} lessons • {module.duration}
                    </p>
                    {progress.total > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-600 transition-all duration-300"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-200">
                    <ul className="py-2">
                      {module.lessons.map((lesson: Lesson) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        
                        return (
                          <li key={lesson.id}>
                            <div className="flex items-center gap-1 px-2">
                              <Button
                                variant="ghost"
                                className="flex-1 justify-start text-xs text-left p-2 h-auto hover:bg-amber-50 hover:text-amber-900 transition-colors"
                                onClick={() => handleLessonClick(lesson)}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <div className="flex-shrink-0">
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium truncate ${isCompleted ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                                      {lesson.title}
                                    </p>
                                    <p className="text-slate-500 text-xs">{lesson.duration}</p>
                                  </div>
                                </div>
                              </Button>
                              
                              {/* Completion Checkbox */}
                              <button
                                onClick={(e) => handleLessonComplete(lesson.id, e)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  isCompleted 
                                    ? 'bg-amber-600 border-amber-600' 
                                    : 'border-slate-300 hover:border-amber-400'
                                }`}
                              >
                                {isCompleted && <Check className="w-3 h-3 text-white" />}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}