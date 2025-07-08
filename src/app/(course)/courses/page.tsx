"use client";

import { useState } from "react";
import { Course } from "@/types/course";
import { teaCourse } from "@/app/data/tea-course";
import { coffeeCourse } from "@/app/data/coffee-course";
import { herbalCourse } from "@/app/data/herb-course";
import { CourseCard } from "@/app/(course)/components/CourseCard";

const allCourses: Course[] = [teaCourse, coffeeCourse, herbalCourse];

export default function AllCoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredCourses = selectedCategory === "all" 
    ? allCourses 
    : allCourses.filter(course => 
        course.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            All Courses
          </h1>
          <p className="text-slate-600">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(2)}
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