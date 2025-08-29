"use client";

import { useEffect, useState } from "react";
import { coursesApi } from "@/lib/API/courses";
import type { CourseWithRelations } from "@/types/course";
import { useCartContext } from "@/context/CartContext";
import { useAuthContext } from "@/context/AuthContext";
import { CourseGrid } from "@/components/course/CourseGrid";

export default function CoursesPage() {
  const { token } = useAuthContext();
  const { refreshCart } = useCartContext();

  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartFetched, setCartFetched] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await coursesApi.getAll();
        setCourses(data);
      } catch (err: any) {
        console.error("Failed to load courses:", err);
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    if (token && !cartFetched) {
      refreshCart().finally(() => setCartFetched(true));
    }
  }, [token, cartFetched, refreshCart]);

  if (loading) return <div className="p-6 text-center text-amber-700">Loading courses...</div>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">Available Courses</h1>
      {courses.length === 0 ? (
        <p className="text-center text-amber-600">No courses available.</p>
      ) : (
        <CourseGrid courses={courses} />
      )}
    </div>
  );
}
