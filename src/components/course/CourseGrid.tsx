"use client";

import CourseCard from "@/components/course/CourseCard";
import type { CourseWithRelations } from "@/types/course";

interface CourseGridProps {
  courses: CourseWithRelations[];
}

export const CourseGrid = ({ courses }: CourseGridProps) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {courses.map(course => <CourseCard key={course.id} course={course} />)}
  </div>
);
