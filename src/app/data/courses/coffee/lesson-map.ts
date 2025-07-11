import { Lesson } from "@/types/course";
import {
  coffee1, coffee2, coffee3, coffee4, coffee5,
  coffee6, coffee7, coffee8, coffee9, coffee10
} from "./lessons";

export const coffeeLessonsMap: { [moduleId: string]: Lesson[] } = {
  "coffee-origins": [coffee1, coffee2, coffee3, coffee4, coffee5],
  "coffee-roasting": [coffee6, coffee7, coffee8, coffee9, coffee10]
};
