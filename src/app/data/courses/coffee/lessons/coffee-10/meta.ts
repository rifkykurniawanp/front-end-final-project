import { Lesson } from "@/types/course";
import { Quiz } from "./quiz";

export const coffee10: Lesson = {
  id: "coffee-10",
  slug: "roasting-profile-quiz",
  title: "Roasting Profile Quiz",
  description: "Test your knowledge of roasting concepts and terminology.",
  duration: "40 min",
  completed: false,
  type: "quiz",
  quiz: Quiz,
  bookmarked: false
};