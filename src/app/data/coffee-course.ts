import { Course } from "@/types/course";
import { Coffee } from "lucide-react";

export const coffeeCourse: Course = {
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
  // icon: <Coffee className="w-6 h-6" />,
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

  modules: [
    {
      id: "coffee-origins",
      slug: "coffee-origins",
      title: "Coffee Origins & Processing",
      description: "Understand coffee bean varieties and how they're processed from plant to green bean.",
      duration: "140 min",
      difficulty: "Easy",
      lessons: [
        {
          id: "coffee-1",
          slug: "coffee-plant-biology",
          title: "Coffee Plant Biology",
          description: "Explore the anatomy and botany of coffee plants and how they impact flavor.",
          duration: "25 min",
          completed: true,
          type: "video",
          videoUrl: "https://example.com/coffee-plant-biology",
          content: "Coffee comes from the Coffea plant, primarily Arabica and Robusta species...",
          bookmarked: false,
          notes: "",
          completedAt: new Date("2024-05-02")
        },
        {
          id: "coffee-2",
          slug: "arabica-vs-robusta",
          title: "Arabica vs Robusta",
          description: "Learn the differences in flavor, caffeine, and cultivation between Arabica and Robusta beans.",
          duration: "20 min",
          completed: false,
          type: "reading",
          content: "Arabica has smoother, sweeter taste; Robusta is stronger with more caffeine...",
          bookmarked: false
        },
        {
          id: "coffee-3",
          slug: "coffee-growing-regions",
          title: "Coffee Growing Regions",
          description: "Explore key coffee-producing regions and how terroir influences flavor.",
          duration: "35 min",
          completed: false,
          type: "video",
          videoUrl: "https://example.com/coffee-regions",
          content: "Ethiopia, Colombia, Brazil, and others offer distinct notes based on climate and soil...",
          bookmarked: false
        },
        {
          id: "coffee-4",
          slug: "processing-methods",
          title: "Processing Methods",
          description: "Understand wet, dry, and honey processes and their impact on bean quality.",
          duration: "30 min",
          completed: false,
          type: "video",
          videoUrl: "https://example.com/coffee-processing",
          content: "Processing affects body, acidity, and cleanliness of the cup...",
          bookmarked: false
        },
        {
          id: "coffee-5",
          slug: "cupping-and-tasting",
          title: "Cupping and Tasting",
          description: "Learn the standardized cupping protocol to evaluate coffee quality.",
          duration: "30 min",
          completed: false,
          type: "practice",
          content: "Use SCA cupping form to assess aroma, flavor, acidity, body, and balance...",
          bookmarked: false
        }
      ]
    },
    {
      id: "coffee-roasting",
      slug: "coffee-roasting",
      title: "Roasting Fundamentals",
      description: "Learn how roasting transforms green beans into flavorful brews.",
      duration: "180 min",
      difficulty: "Medium",
      prerequisites: ["coffee-origins"],
      lessons: [
        {
          id: "coffee-6",
          slug: "roasting-basics",
          title: "Roasting Basics",
          description: "Get introduced to the roasting process and essential chemistry.",
          duration: "30 min",
          completed: false,
          type: "video",
          videoUrl: "https://example.com/roasting-basics",
          content: "The Maillard reaction, caramelization, and first crack are critical events...",
          bookmarked: false
        },
        {
          id: "coffee-7",
          slug: "roast-levels-explained",
          title: "Roast Levels Explained",
          description: "Understand the spectrum from light to dark roasts and their flavor implications.",
          duration: "25 min",
          completed: false,
          type: "reading",
          content: "Light roasts preserve origin character, dark roasts emphasize body...",
          bookmarked: false
        },
        {
          id: "coffee-8",
          slug: "home-roasting-techniques",
          title: "Home Roasting Techniques",
          description: "Try roasting at home using simple equipment.",
          duration: "40 min",
          completed: false,
          type: "practice",
          content: "Air popcorn poppers and home drum roasters can be used to experiment...",
          bookmarked: false
        },
        {
          id: "coffee-9",
          slug: "professional-roasting",
          title: "Professional Roasting",
          description: "Explore roasting on commercial machines with profiling.",
          duration: "45 min",
          completed: false,
          type: "video",
          videoUrl: "https://example.com/professional-roasting",
          content: "Roast curves and software tools like Cropster allow precise control...",
          bookmarked: false
        },
        {
          id: "coffee-10",
          slug: "roasting-profile-quiz",
          title: "Roasting Profile Quiz",
          description: "Test your knowledge of roasting concepts and terminology.",
          duration: "40 min",
          completed: false,
          type: "quiz",
          quiz: [
            {
              id: "q1",
              question: "What chemical process contributes to flavor development during roasting?",
              options: ["Evaporation", "Fermentation", "Maillard Reaction", "Oxidation"],
              correctAnswer: 2,
              explanation: "The Maillard reaction creates complex flavor compounds in roasted coffee."
            },
            {
              id: "q2",
              question: "What is 'first crack' in roasting?",
              options: ["A type of roast defect", "Initial audible popping", "Cooling phase", "Rest period"],
              correctAnswer: 1,
              explanation: "First crack signals the beginning of light roast development."
            }
          ],
          bookmarked: false
        }
      ]
    }
  ]
};
