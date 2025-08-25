"use client";

import { Lesson } from "@/types";
import { Play, StickyNote, HelpCircle } from "lucide-react";

interface LessonTabsProps {
  activeTab: "content" | "notes" | "quiz";
  onTabChange: (tab: "content" | "notes" | "quiz") => void;
  lesson: Lesson;
}

export function LessonTabs({ activeTab, onTabChange, lesson }: LessonTabsProps) {
 const tabs = [
  {
    id: "content" as const,
    label: "Content",
    icon: <Play className="w-4 h-4" />,
    available: true
  },
  {
    id: "notes" as const,
    label: "Notes",
    icon: <StickyNote className="w-4 h-4" />,
    available: true
  },
  {
    id: "quiz" as const,
    label: "Quiz",
    icon: <HelpCircle className="w-4 h-4" />,
    available: Array.isArray(lesson.quizQuestions) && lesson.quizQuestions.length > 0
  }
];


  return (
    <div className="border-b border-slate-200">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            disabled={!tab.available}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 bg-blue-50/50"
                : tab.available
                ? "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                : "border-transparent text-slate-400 cursor-not-allowed"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}