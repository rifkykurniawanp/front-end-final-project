import { Course } from "@/types/course";

export const herbalCourseMeta: Omit<Course, "modules"> = {
  id: "herbal-healing",
  slug: "herbal-healing",
  title: "Herbal Healing & Wellness",
  description:
    "Discover the therapeutic properties of herbs and create your own herbal remedies and teas.",
  instructor: "Dr. Elena Vasquez",
  instructorBio:
    "Dr. Elena is a certified clinical herbalist with over 10 years of experience in integrative medicine and botanical therapy.",
  instructorAvatar: "/instructors/elena-vasquez.jpg",
  rating: 4.7,
  students: 892,
  duration: "5 hours",
  level: "Beginner",
  icon: "🌿",
  color: "bg-purple-500",
  category: "Herbal",
  price: 79,
  originalPrice: 109,
  tags: ["Herbal", "Wellness", "Remedies", "Natural Medicine", "Healing"],
  whatYouWillLearn: [
    "Identify and safely use common medicinal herbs",
    "Understand herbal actions and body systems",
    "Create teas, tinctures, and topical salves",
    "Build your own home herbal apothecary",
  ],
  requirements: [
    "Basic interest in natural remedies",
    "Willingness to try herbal preparations at home",
    "No prior herbal experience needed",
  ],
  targetAudience: [
    "Beginners interested in herbal medicine",
    "Health-conscious individuals",
    "Wellness practitioners and coaches",
    "Anyone seeking natural healing alternatives",
  ],
  language: "English",
  lastUpdated: new Date("2024-01-01"),
  certificate: true,
};
