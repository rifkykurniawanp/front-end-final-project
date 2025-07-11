import { Course } from "@/types/course";

export const coffeeCourseMeta: Omit<Course, "modules"> = {
  id: "coffee-expert",
  slug: "coffee-expert",
  title: "Coffee Expert: Bean to Barista",
  description: "Master coffee brewing, understand bean origins, and learn professional barista techniques.",
  instructor: "Marco Rodriguez",
  instructorBio:
    "Marco Rodriguez is a world-class barista, coffee roaster, and educator with over 12 years of experience. He has trained baristas internationally and is a certified Q Grader.",
  instructorAvatar: "/instructors/marco-rodriguez.jpg",
  rating: 4.9,
  students: 2156,
  duration: "8 hours",
  level: "Advanced",
  icon: "☕️",
  color: "bg-amber-600",
  category: "Coffee",
  price: 99,
  originalPrice: 139,
  tags: ["Coffee", "Brewing", "Roasting", "Barista"],
  whatYouWillLearn: [
    "Differentiate coffee bean types and origins",
    "Master various brewing methods including espresso and pour-over",
    "Understand roasting techniques and flavor profiles",
    "Create café-quality drinks and latte art",
    "Perform cupping and professional tasting"
  ],
  requirements: [
    "Interest in coffee and café culture",
    "Basic brewing tools at home",
    "No prior barista experience required"
  ],
  targetAudience: [
    "Aspiring baristas",
    "Coffee enthusiasts",
    "Café owners",
    "Anyone who wants to elevate their coffee skills"
  ],
  language: "English",
  lastUpdated: new Date("2024-03-10"),
  certificate: true,
};
