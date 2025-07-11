import { Module } from "@/types/course";

export const coffeeModules: Omit<Module, "lessons">[] = [
  {
    id: "coffee-origins",
    slug: "coffee-origins",
    title: "Coffee Origins & Processing",
    description: "Understand coffee bean varieties and how they're processed from plant to green bean.",
    duration: "140 min",
    difficulty: "Easy",
  },
  {
    id: "coffee-roasting",
    slug: "coffee-roasting",
    title: "Roasting Fundamentals",
    description: "Learn how roasting transforms green beans into flavorful brews.",
    duration: "180 min",
    difficulty: "Medium",
    prerequisites: ["coffee-origins"],
  }
];
