import { Course } from "@/types/course";
import { coffeeCourseMeta } from "./course";
import { coffeeModules } from "./modules";
import { coffeeLessonsMap } from "./lesson-map";

export const coffeeCourse: Course = {
  ...coffeeCourseMeta,
  modules: coffeeModules.map((mod) => ({
    ...mod,
    lessons: coffeeLessonsMap[mod.id] || [],
  })),
};
