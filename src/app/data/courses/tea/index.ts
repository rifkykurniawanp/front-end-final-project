// /data/tea-course/index.ts
import { Course } from "@/types/course";
import { teaCourseMeta } from "./course";
import { teaModules } from "./modules";

export const teaCourse: Course = {
  ...teaCourseMeta,
  modules: teaModules
};
