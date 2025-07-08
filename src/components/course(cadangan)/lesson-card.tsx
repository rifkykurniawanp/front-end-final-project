"use client";

import React from "react";
import { Course } from "@/types/course";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  course: Course;
}

export const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <Card className="transition hover:shadow-lg border rounded-2xl">
      <CardHeader className="flex flex-col gap-2">
        <div className="text-4xl">{course.icon}</div>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <p className="text-muted-foreground text-sm">{course.instructor}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm line-clamp-3">{course.description}</p>
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm font-semibold text-primary">
          {course.price > 0 ? `$${course.price}` : "Free"}{" "}
          {course.originalPrice && (
            <span className="line-through text-xs text-muted-foreground ml-2">
              ${course.originalPrice}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};
