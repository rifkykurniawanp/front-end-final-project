import { Module } from "@/types/course";
import { teaLessonMap } from "./lesson-map";

export const teaModules: Module[] = [
  {
    id: "tea-basics",
    slug: "tea-basics",
    title: "Tea Fundamentals",
    description: "Learn the basics of tea types and processing methods",
    duration: "90 min",
    difficulty: "Easy",
    lessons: teaLessonMap["tea-basics"]
  },
  {
    id: "tea-varieties",
    slug: "tea-varieties",
    title: "Tea Varieties Around the World",
    description: "Explore different tea varieties from various regions",
    duration: "120 min",
    difficulty: "Medium",
    prerequisites: ["tea-basics"],
    lessons: teaLessonMap["tea-varieties"]
  },
  {
    id: "tea-brewing",
    slug: "tea-brewing",
    title: "Perfect Brewing Techniques",
    description: "Master the art of brewing different types of tea",
    duration: "150 min",
    difficulty: "Hard",
    prerequisites: ["tea-basics", "tea-varieties"],
    lessons: teaLessonMap["tea-brewing"]
  }
];
