"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import type { CourseWithRelations } from "@/types/course";
import { useRouter } from "next/navigation"; // Import useRouter

interface CourseCardProps {
  course: CourseWithRelations;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/course/${course.slug}`);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-200 rounded-2xl border border-amber-200 bg-gradient-to-br from-orange-50 to-amber-100"
      onClick={handleCardClick} // Attach the new handler
    >
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-lg font-bold text-amber-800">
          {course.title}
        </CardTitle>
        <p className="text-sm text-amber-700/80 line-clamp-2">
          {course.description}
        </p>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-medium">{course.rating.toFixed(1)}</span>
        </div>

        {/* Students */}
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Users className="w-4 h-4 text-amber-500" />
          <span>{course.students} students</span>
        </div>

        {/* Duration */}
        {course.duration && (
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{course.duration}</span>
          </div>
        )}

        {/* Level */}
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>{course.level}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-amber-200 text-amber-800 hover:bg-amber-300"
          >
            {course.category}
          </Badge>
          {course.certificate && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-600">
              Certificate
            </Badge>
          )}
        </div>

        {/* Instructor */}
        {course.instructor && (
          <p className="text-xs text-amber-700">
            by <span className="font-semibold">{course.instructor.firstName}</span>
          </p>
        )}

        {/* Price + Button */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-amber-800">${course.price}</span>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-md"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the card's onClick from triggering
              // Add specific logic for the enroll button here if needed
            }}
          >
            Enroll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}