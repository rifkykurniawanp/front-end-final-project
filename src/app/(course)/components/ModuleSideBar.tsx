"use client";

import { Course, Module, Lesson } from "@/types/course";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Play, FileText, HelpCircle } from "lucide-react";
import { useState } from "react";

interface ModuleSidebarProps {
  course: Course;
}

export function ModuleSidebar({ course }: ModuleSidebarProps) {
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

  const handleLessonClick = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'reading':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">Course Content</h2>
        <p className="text-sm text-slate-600 mt-1">
          {course.modules.length} modules • {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
        </p>
      </div>

      <div className="p-2">
        <div className="space-y-2">
          {course.modules.map((module: Module) => {
            const isExpanded = expandedModules.has(module.id);
            
            return (
              <div key={module.id} className="border border-slate-200 rounded-lg">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 text-sm">{module.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {module.lessons.length} lessons • {module.duration}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-200">
                    <ul className="py-2">
                      {module.lessons.map((lesson: Lesson) => (
                        <li key={lesson.id}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-xs text-left p-2 h-auto"
                            onClick={() => handleLessonClick(lesson.id)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className="text-slate-500 flex-shrink-0">
                                {getLessonIcon(lesson.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-slate-800 font-medium truncate">{lesson.title}</p>
                                <p className="text-slate-500 text-xs">{lesson.duration}</p>
                              </div>
                            </div>
                          </Button>
                        </li>
                      ))}
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