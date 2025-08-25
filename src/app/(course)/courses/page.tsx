"use client";

import { useEffect, useState } from "react";
import { coursesApi } from "@/lib/API/courses";
import type { CourseWithRelations } from "@/types/course";
import CourseCard from "@/components/course/CourseCard";
import { useAuth } from "@/hooks/useAuth"; // ✅ pakai auth hook, bukan useSession
import { useCartContext } from "@/context/CartContext";

export default function CoursesPage() {
  const { user, token } = useAuth(); // ambil user & token dari localStorage
  const { cart, fetchCart } = useCartContext();
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await coursesApi.getAll(); // bebas token, public endpoint
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    if (token) {
      fetchCart(); // refresh cart tiap kali login
    }
  }, [token, fetchCart]);

  if (loading) {
    return <div className="p-6 text-center text-amber-700">Loading courses...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">Available Courses</h1>

      {courses.length === 0 ? (
        <p className="text-center text-amber-600">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
