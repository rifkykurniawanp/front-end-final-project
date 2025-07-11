import { Lesson } from "@/types/course";
import * as lessons from "./lessons";

export const teaLessonMap: Record<string, Lesson[]> = {
  "tea-basics": [
    lessons.tea1,
    lessons.tea2,
    lessons.tea3,
    lessons.tea4,
  ],
  "tea-varieties": [
    lessons.tea5,
    lessons.tea6,
    lessons.tea7,
    lessons.tea8,
  ],
  "tea-brewing": [
    lessons.tea9,
    lessons.tea10,
    lessons.tea11,
    lessons.tea12,
    lessons.tea13
  ]
};