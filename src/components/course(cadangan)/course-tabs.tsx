// components/course/course-tabs.tsx
"use client";

import { useState } from "react";
import { Course, Module } from "@/types/course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Star, ChevronRight } from "lucide-react";

interface CourseTabsProps {
  courses: Course[];
  selectedCourse: Course;
  setSelectedCourse: (course: Course) => void;
}

export function CourseTabs({
  courses,
  selectedCourse,
  setSelectedCourse,
}: CourseTabsProps) {
  const [selectedModule, setSelectedModule] = useState(
    selectedCourse.modules[0].id
  );

  const calculateProgress = (course: Course) => {
    const total = course.modules.flatMap((m) => m.lessons).length;
    const completed = course.modules.flatMap((m) => m.lessons.filter((l) => l.completed)).length;
    return Math.round((completed / total) * 100);
  };

  const getModuleProgress = (module: Module) => {
    const completed = module.lessons.filter((l) => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return "🎥";
      case "reading": return "📖";
      case "quiz": return "❓";
      case "practice": return "🔬";
      default: return "📋";
    }
  };

  return (
    <>
      {/* Course Selection */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <Card
            key={course.id}
            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
              selectedCourse.id === course.id
                ? "border-blue-500 shadow-lg"
                : "border-slate-200"
            }`}
            onClick={() => {
              setSelectedCourse(course);
              setSelectedModule(course.modules[0].id);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${course.color} text-white`}>
                  {course.icon}
                </div>
                <Badge variant="secondary">{course.level}</Badge>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="text-sm">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{calculateProgress(course)}%</span>
                </div>
                <Progress value={calculateProgress(course)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Module Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedCourse.modules.map((module) => (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                    selectedModule === module.id
                      ? "bg-blue-50 border-blue-200 border"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedModule(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{module.title}</h4>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                      {module.duration}
                    </span>
                    <span className="text-xs text-blue-600">
                      {getModuleProgress(module)}%
                    </span>
                  </div>
                  <Progress
                    value={getModuleProgress(module)}
                    className="h-1 mt-1"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
<div className="lg:col-span-3 space-y-6">
  {/* Card Module Content */}
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">
            {selectedCourse.modules.find((m) => m.id === selectedModule)?.title}
          </CardTitle>
          <CardDescription>
            {selectedCourse.modules.find((m) => m.id === selectedModule)?.description}
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600">Instructor</div>
          <div className="font-medium">{selectedCourse.instructor}</div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {selectedCourse.modules
          .find((m) => m.id === selectedModule)
          ?.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                lesson.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getLessonIcon(lesson.type)}</div>
                  <div>
                    <h4 className="font-medium">{lesson.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration}</span>
                      <Badge variant="outline" className="text-xs">
                        {lesson.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {lesson.content || "No description available for this session."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {lesson.completed && (
                    <Badge variant="default" className="bg-green-500">
                      Completed
                    </Badge>
                  )}
                  <Button
                    variant={lesson.completed ? "outline" : "default"}
                    size="sm"
                  >
                    {lesson.completed ? "Review" : "Start"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </CardContent>
  </Card>

  {/* Instructor Section */}
  <Card>
    <CardHeader>
      <CardTitle>About the Instructor</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-slate-700 whitespace-pre-line">
        {selectedCourse.instructorBio || "No bio available for this instructor."}
      </p>
    </CardContent>
  </Card>
</div>

      </div>
    </>
  );
}
