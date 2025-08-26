"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/CartContext";
import { CartItemType, CourseLevel, CourseCategory } from "@/types/enum";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

import type { CourseWithRelations } from "@/types/course";
import { lessonsApi, courseModulesApi, lessonProgressApi } from "@/lib/API/courses";

interface CourseCardProps {
  course: CourseWithRelations;
}

// kita pakai `any` untuk sementara agar TS tidak error, tapi bisa diganti nanti dengan type API
type LessonWithProgress = any;
type ModuleWithLessons = any;

const getAuthToken = (): string | null => {
  try {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;
    return JSON.parse(auth).accessToken ?? null;
  } catch {
    return null;
  }
};

const getUserId = (): number | null => {
  try {
    const auth = localStorage.getItem("auth");
    if (!auth) return null;
    return JSON.parse(auth).user?.id ?? null;
  } catch {
    return null;
  }
};

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();
  const { addItem } = useCartContext(); // hilangkan cart & fetchCart sementara

  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);

  const userId = getUserId();
  const token = getAuthToken();

  useEffect(() => {
    if (!userId || !token) {
      setLoadingModules(false);
      return;
    }

    const fetchModulesWithLessons = async () => {
      try {
        setLoadingModules(true);

        const courseModules = await courseModulesApi.getByCourse(course.id, token);

        const modulesWithLessons = await Promise.all(
          courseModules.map(async (mod: any) => {
            const lessons = await lessonsApi.getByModule(mod.id, token);

            const lessonsWithProgress = await Promise.all(
              lessons.map(async (lesson: any) => {
                const progress = await lessonProgressApi.getProgress(userId, lesson.id, token);
                return {
                  ...lesson,
                  completed: progress?.completed ?? false,
                };
              })
            );

            return {
              ...mod,
              lessons: lessonsWithProgress,
            };
          })
        );

        setModules(modulesWithLessons);
      } catch (err) {
        console.error("Failed to fetch modules/lessons/progress:", err);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModulesWithLessons();
  }, [course.id, token, userId]);

  const handleEnroll = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoadingEnroll(true);
      await addItem({ itemId: course.id, itemType: CartItemType.COURSE, quantity: 1 });
      router.push("/checkout"); // pindah langsung ke checkout, karena cart tidak ada di context
    } catch (err) {
      console.error("Enroll error:", err);
    } finally {
      setLoadingEnroll(false);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-200 rounded-2xl border border-amber-200 bg-gradient-to-br from-orange-50 to-amber-100">
      <CardHeader>
        <Link href={`/course/${course.slug}`} className="block">
          <CardTitle className="text-lg font-bold text-amber-800 hover:underline">
            {course.title}
          </CardTitle>
        </Link>
        {course.description && (
          <p className="text-sm text-amber-700/80 line-clamp-2">{course.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-medium">{course.rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Users className="w-4 h-4 text-amber-500" />
          <span>{course.students} students</span>
        </div>

        {course.duration && (
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{course.duration}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-amber-700">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>{CourseLevel[course.level]}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-amber-200 text-amber-800 hover:bg-amber-300">
            {CourseCategory[course.category]}
          </Badge>
          {course.certificate && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-600">Certificate</Badge>
          )}
        </div>

        {course.instructor && (
          <p className="text-xs text-amber-700">
            by <span className="font-semibold">{course.instructor.firstName}</span>
          </p>
        )}

        {/* Modules & Lessons */}
        {loadingModules ? (
          <p className="text-sm text-amber-600">Loading modules and lessons...</p>
        ) : (
          <div className="space-y-2 mt-2">
            {modules.map((mod: any) => (
              <div key={mod.id} className="border p-2 rounded-md bg-amber-50">
                <p className="font-semibold text-amber-800">{mod.title}</p>
                <ul className="pl-4 list-disc text-amber-700">
                  {mod.lessons?.map((lesson: any) => (
                    <li key={lesson.id}>
                      {lesson.title} {lesson.completed ? "✅" : "❌"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-4 gap-2">
          <span className="font-bold text-amber-800">${course.price}</span>
          <div className="flex gap-2">
            <AddToCartButton itemId={course.id} itemType={CartItemType.COURSE} />
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              onClick={handleEnroll}
              disabled={loadingEnroll}
            >
              {loadingEnroll ? "Processing..." : "Enroll"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
