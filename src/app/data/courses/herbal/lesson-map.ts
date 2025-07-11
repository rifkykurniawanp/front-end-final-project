import { Lesson } from "@/types/course";
import {
  herbal1, herbal2, herbal3, herbal4,
  herbal5, herbal6, herbal7, herbal8,
  herbal9, herbal10, herbal11, herbal12,
  herbal13, herbal14
} from "./lessons";

export const herbalLessonsMap: { [moduleId: string]: Lesson[] } = {
  "herbal-basics": [herbal1, herbal2, herbal3, herbal4],
  "herbal-properties": [herbal5, herbal6, herbal7, herbal8],
  "herbal-preparations": [herbal9, herbal10, herbal11, herbal12, herbal13, herbal14],
};
