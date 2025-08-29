"use client";

import CourseCard from "./CourseCard";
import type { CourseWithRelations } from "@/types/course";

interface CourseGridProps {
  courses: CourseWithRelations[];
}

export const CourseGrid = ({ courses }: CourseGridProps) => (
  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {courses.map(course => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
);
