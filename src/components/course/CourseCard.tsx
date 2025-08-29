"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, BookOpen, ShoppingCart, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/CartContext";
import { useAuthContext } from "@/context/AuthContext";
import { CartItemType, CourseLevel, CourseCategory } from "@/types/enum";
import AddToCart from "@/components/cart/AddToCartButton";

import type { CourseWithRelations } from "@/types/course";

// ===== helper =====
const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

interface CourseCardProps {
  course: CourseWithRelations;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();
  const { token, user } = useAuthContext();
  const { addItem } = useCartContext();

  const [loadingEnroll, setLoadingEnroll] = useState(false);

  const handleQuickEnroll = useCallback(async () => {
    if (!token || !user) {
      router.push(`/auth/login?returnUrl=/course/${course.slug}`);
      return;
    }

    try {
      setLoadingEnroll(true);
      await addItem({
        itemId: course.id,
        itemType: CartItemType.COURSE,
        quantity: 1,
        price: course.price,
      });
      router.push("/checkout");
    } catch (err) {
      console.error("Quick enroll error:", err);
    } finally {
      setLoadingEnroll(false);
    }
  }, [token, user, course, addItem, router]);

  return (
    <Card className="rounded-2xl border border-amber-200 bg-gradient-to-br from-orange-50 to-amber-100 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <Link href={`/course/${course.slug}`} className="block group">
          <CardTitle className="text-lg font-bold text-amber-800 group-hover:text-amber-600 transition-colors">
            {course.title}
          </CardTitle>
        </Link>
        {course.description && (
          <p className="text-sm text-amber-700/80 line-clamp-2 mt-1">{course.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3 text-sm text-amber-700">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{course.rating?.toFixed(1) ?? "0.0"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>{course.students ?? 0} students</span>
          </div>
          {course.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{course.duration}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>{CourseLevel[course.level]}</span>
          </div>
        </div>

        {/* badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-amber-200 text-amber-800 hover:bg-amber-300 text-xs">
            {CourseCategory[course.category]}
          </Badge>
          {course.certificate && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-600 text-xs">Certificate</Badge>
          )}
        </div>

        {/* price & buttons */}
        <div className="pt-4 border-t border-amber-200 space-y-2">
          <span className="text-2xl font-bold text-amber-800">{formatPrice(course.price)}</span>
          <AddToCart
            itemType={CartItemType.COURSE}
            itemId={course.id}
            price={course.price}
            itemName={course.title}
            disabled={loadingEnroll}
            className="w-full"
          />
          <Button
            onClick={handleQuickEnroll}
            disabled={loadingEnroll}
            variant="outline"
            className="w-full border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quick Enroll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
