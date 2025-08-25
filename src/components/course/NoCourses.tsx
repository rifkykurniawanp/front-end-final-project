"use client";

import { RocketIcon } from "lucide-react";

interface NoCoursesProps {
  category: string;
}

export const NoCourses = ({ category }: NoCoursesProps) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
    <RocketIcon className="h-12 w-12 text-gray-500 mb-4" />
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
      No courses found.
    </h2>
    <p className="mt-2 text-gray-600">
      {category === "all"
        ? "Stay tuned! We're preparing new content."
        : `No courses match the category "${category}". Try another category.`}
    </p>
  </div>
);
