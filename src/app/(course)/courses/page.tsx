"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/course/CourseCard";
import { coursesApi } from "@/lib/API/courses";
import type { CourseWithRelations } from "@/types/course";
import { allCourses } from "@/app/data/courses";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RocketIcon, AlertTriangleIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Dummy data for categories. In a real app, this would come from an API.
const categories = [
  { value: "all", label: "All" },
  { value: "coffee", label: "Coffee" },
  { value: "tea", label: "Tea" },
  { value: "herbalism", label: "Herbalism" },
  { value: "brewing", label: "Brewing" },
];

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("all");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await coursesApi.getAll();
        setCourses(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load courses:", err);
        setError("We couldn't load the courses right now. Please try again.");
        setCourses(allCourses);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (value === "all") {
      setFilteredCourses(courses);
    } else {
      const newFilteredCourses = courses.filter((course) =>
        course.category.toLowerCase() === value.toLowerCase()
      );
      setFilteredCourses(newFilteredCourses);
    }
  }, [value, courses]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    location.reload();
  };

  const renderCourses = () => {
    if (loading) {
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="w-full h-[200px] rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error && courses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <AlertTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {error}
          </h2>
          <p className="mt-2 text-gray-600">
            We've switched to local data as a temporary measure. You can try to reload the page.
          </p>
          <Button
            onClick={handleRetry}
            className="mt-6 bg-amber-600 hover:bg-amber-700 text-white"
          >
            Retry
          </Button>
        </div>
      );
    }

    if (filteredCourses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <RocketIcon className="h-12 w-12 text-gray-500 mb-4" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            No courses found.
          </h2>
          <p className="mt-2 text-gray-600">
            {value === "all" ? "Stay tuned! We're preparing new content." : `No courses match the category "${categories.find(c => c.value === value)?.label}". Try another category.`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-800">
            Explore Our Courses
          </h1>
          <p className="text-amber-700/80 mt-2 text-lg">
            Learn coffee, tea, and herbal knowledge from experts.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 bg-amber-500 rounded-md">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between shadow-md text-amber-800 border-amber-600"
              >
                {categories.find((category) => category.value === value)?.label || "Select category..."}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-amber-500 text-amber-800">
              <Command>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.value}
                      value={category.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "all" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === category.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {renderCourses()}
    </div>
  );
}