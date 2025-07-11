// /data/tea-course/course.ts
import { Course } from "@/types/course";

export const teaCourseMeta: Omit<Course, "modules"> = {
  id: "tea-mastery",
  slug: "tea-mastery",
  title: "Tea Mastery: From Leaf to Cup",
  description:
    "Comprehensive guide to understanding tea varieties, brewing techniques, and tea culture from around the world.",
  instructor: "Sarah Chen",
  instructorBio:
    "Sarah is a certified tea sommelier with over 15 years of experience in tea cultivation and education. She has traveled extensively throughout Asia studying traditional tea practices.",
  instructorAvatar: "/instructors/sarah-chen.jpg",
  rating: 4.8,
  students: 1247,
  duration: "6 hours",
  level: "Intermediate",
  icon: "🍃",
  color: "bg-green-500",
  category: "Tea",
  price: 89,
  originalPrice: 129,
  tags: ["Tea", "Brewing", "Culture", "History", "Tasting"],
  whatYouWillLearn: [
    "Understand different tea types and their characteristics",
    "Master proper brewing techniques for various teas",
    "Learn about tea culture and traditions worldwide",
    "Develop tea tasting and evaluation skills",
    "Identify high-quality teas and avoid common mistakes"
  ],
  requirements: [
    "Basic interest in tea and beverages",
    "Access to different types of tea for practice",
    "Basic kitchen equipment (kettle, teapot, cups)",
    "No prior tea knowledge required"
  ],
  targetAudience: [
    "Tea enthusiasts wanting to deepen their knowledge",
    "Beginners interested in learning about tea",
    "Hospitality professionals",
    "Anyone interested in Asian culture and traditions"
  ],
  language: "English",
  lastUpdated: new Date("2024-01-01"),
  certificate: true
};
