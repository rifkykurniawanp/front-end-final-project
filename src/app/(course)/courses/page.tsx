"use client";
import { useState } from "react";
import { CourseCard } from "@/components/course/CourseCard";
import { Coffee, Leaf, CupSoda, Sparkles } from "lucide-react";
import { allCourses } from "@/app/data/courses";
import { ReactElement } from "react";

const categoryIcons: { [key: string]: ReactElement } = {
  all: <Sparkles className="w-4 h-4" />, // icon default
  tea: <Leaf className="w-4 h-4" />,
  coffee: <Coffee className="w-4 h-4" />,
  herbal: <CupSoda className="w-4 h-4" />,
};

export default function AllCoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const filteredCourses = selectedCategory === "all"
    ? allCourses
    : allCourses.filter(course =>
        course.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Courses
          </h1>
          <p className="text-gray-600">
            Explore our collection of beverage courses and master the art of brewing
          </p>
        </header>

        {/* Filter Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "tea", "coffee", "herbal"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                  selectedCategory === category
                    ? "bg-amber-600 text-white hover:bg-amber-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {categoryIcons[category]}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}