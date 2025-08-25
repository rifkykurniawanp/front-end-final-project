import { useState, useEffect } from "react";
import { coursesApi } from "@/lib/API/courses";
import { CourseResponseDto } from "@/types/course";

export const useInstructorCourses = (instructorId: number, token?: string) => {
  const [courses, setCourses] = useState<CourseResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await coursesApi.getByInstructorId(instructorId, token);
      setCourses(res);
    } catch (err: any) {
      setError(err.message || "Failed to fetch instructor courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [instructorId]);

  return { courses, loading, error, refetch: fetchCourses };
};
