"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCourses = () => (
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
