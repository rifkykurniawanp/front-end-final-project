import { Module } from "@/types/course";

export const herbalModules: Omit<Module, "lessons">[] = [
  {
    id: "herbal-basics",
    slug: "herbal-basics",
    title: "Introduction to Herbalism",
    description: "Foundation knowledge of medicinal herbs.",
    duration: "100 min",
    difficulty: "Easy",
  },
  {
    id: "herbal-properties",
    slug: "herbal-properties",
    title: "Therapeutic Properties",
    description: "Understanding how herbs work in the body.",
    duration: "120 min",
    difficulty: "Medium",
    prerequisites: ["herbal-basics"],
  },
  {
    id: "herbal-preparations",
    slug: "herbal-preparations",
    title: "Herbal Preparations & Recipes",
    description: "Learn to make teas, tinctures, and remedies.",
    duration: "180 min",
    difficulty: "Hard",
    prerequisites: ["herbal-basics", "herbal-properties"],
  },
];
