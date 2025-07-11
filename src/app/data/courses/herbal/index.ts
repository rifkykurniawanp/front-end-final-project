import { Course } from "@/types/course";
import { herbalCourseMeta } from "./course";
import { herbalModules } from "./modules";
import { herbalLessonsMap } from "./lesson-map";

export const herbalCourse: Course = {
  ...herbalCourseMeta,
  modules: herbalModules.map((mod) => ({
    ...mod,
    lessons: herbalLessonsMap[mod.id] || [],
  })),
};
