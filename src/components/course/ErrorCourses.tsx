"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";

interface ErrorCoursesProps {
  message: string;
  onRetry: () => void;
}

export const ErrorCourses = ({ message, onRetry }: ErrorCoursesProps) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
    <AlertTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{message}</h2>
    <p className="mt-2 text-gray-600">
      You can try to reload the page.
    </p>
    <Button onClick={onRetry} className="mt-6 bg-amber-600 hover:bg-amber-700 text-white">
      Retry
    </Button>
  </div>
);
