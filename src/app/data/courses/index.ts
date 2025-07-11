// /data/courses/index.ts
import { Course } from "@/types/course";

import { teaCourse } from "./tea";
import { coffeeCourse } from "./coffee";
import { herbalCourse } from "./herbal";

export const allCourses: Course[] = [teaCourse, coffeeCourse, herbalCourse];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return allCourses.find((course) => course.slug === slug);
};

export const getCourseById = (id: string): Course | undefined => {
  return allCourses.find((course) => course.id === id);
};
