"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { coursesApi } from "@/lib/API/courses";
import { productsApi } from "@/lib/API/products";
import type { CourseWithRelations } from "@/types/course";
import type { ProductResponseDto } from "@/types/product";

export default function HomePage() {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [products, setProducts] = useState<ProductResponseDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCourses = await coursesApi.getAll({ page: 1, limit: 3 });
        setCourses(fetchedCourses);

        const fetchedProducts = await productsApi.getAll();
        setProducts(fetchedProducts.slice(0, 3));
      } catch (err) {
        console.error("Error fetching courses/products:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen font-montserrat bg-[#F5F5DC]">
      {/* Hero Section */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center px-6 lg:px-20 py-24 bg-gradient-to-br from-[#6F4E37] via-[#D9B382] to-[#F5F5DC] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="3" fill="#FFD700" />
                <circle cx="30" cy="30" r="3" fill="#D9B382" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        <div className="z-10 flex-1 text-center lg:text-left space-y-6 animate-fade-in-left">
          <h1 className="text-6xl lg:text-8xl font-playfair font-bold text-[#6F4E37]">
            RU<span className="text-[#FFD700]">IND</span>
          </h1>
          <h2 className="text-3xl lg:text-4xl font-light text-[#4B3621]">Edu-Commerce</h2>
          <p className="text-xl font-light text-[#6F4E37] leading-relaxed max-w-lg mx-auto lg:mx-0">
            Ruang belajar dan berbelanja untuk pencinta <br />
            <span className="text-[#D9B382]">Teh • Kopi • Herbal</span>
          </p>
          <Button className="bg-[#4B3621] hover:bg-gradient-to-r hover:from-[#5D3B2B] hover:via-[#D9B382] hover:to-[#FFD700] text-[#FFD700] px-8 py-4 text-lg font-medium rounded-full mt-4 transition-all transform hover:scale-105">
            <Link href="#courses">Mulai Eksplorasi</Link>
          </Button>
        </div>

        <div className="z-10 flex-1 mb-12 lg:mb-0 animate-fade-in-right">
          <div className="w-full h-80 lg:h-96 bg-[#D9B382] rounded-3xl shadow-lg flex items-center justify-center text-2xl text-[#6F4E37] font-playfair">
            Hero Image
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-semibold text-[#6F4E37]">Kategori Pembelajaran</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#FFD700] via-[#D9B382] to-[#FFD700] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="relative overflow-hidden bg-gradient-to-br from-[#FFF8E1] via-[#FFF3C4] to-[#FFEAC4] rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <pattern id={`pattern-course-${course.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="5" cy="5" r="2" fill="#D9B382" />
                        <circle cx="15" cy="15" r="2" fill="#FFD700" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pattern-course-${course.id})`} />
                  </svg>
                </div>
                <CardContent className="relative p-6">
                  <CardTitle className="text-xl font-playfair font-semibold text-[#6F4E37]">{course.title}</CardTitle>
                  <p className="text-[#6F4E37] mt-2 text-sm font-light">{course.description}</p>
                  <Link href={`/course/${course.slug}`} className="block mt-4 text-[#6F4E37] font-medium hover:text-[#FFD700]">
                    Lihat Kursus
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link href="/courses" className="block text-center mt-8 text-[#FFD700] font-medium hover:text-[#E5C16F]">
            Lihat Semua Kursus
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="px-6 py-20 bg-[#F5F5DC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-semibold text-[#6F4E37]">Koleksi Produk</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#FFD700] via-[#D9B382] to-[#FFD700] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="relative overflow-hidden bg-gradient-to-br from-[#FFF8E1] via-[#FFF3C4] to-[#FFEAC4] rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <pattern id={`pattern-product-${product.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="5" cy="5" r="2" fill="#D9B382" />
                        <circle cx="15" cy="15" r="2" fill="#FFD700" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pattern-product-${product.id})`} />
                  </svg>
                </div>
                <CardContent className="relative p-6">
                  <CardTitle className="text-lg font-playfair font-semibold text-[#6F4E37]">{product.name}</CardTitle>
                  <p className="text-[#6F4E37] mt-2 text-sm font-light">{product.description}</p>
                  <div className="text-[#FFD700] mt-2 text-sm font-medium">Rp {product.price.toLocaleString()}</div>
                  <Link href={`/product/${product.slug}`} className="block mt-4 text-[#6F4E37] font-medium hover:text-[#FFD700]">
                    Lihat Produk
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link href="/products" className="block text-center mt-8 text-[#FFD700] font-medium hover:text-[#E5C16F]">
            Lihat Semua Produk
          </Link>
        </div>
      </section>

      {/* Tailwind Animations */}
      <style jsx>{`
        .animate-fade-in-left {
          opacity: 0;
          transform: translateX(-40px);
          animation: fadeInLeft 1s forwards;
        }
        .animate-fade-in-right {
          opacity: 0;
          transform: translateX(40px);
          animation: fadeInRight 1s forwards;
        }
        @keyframes fadeInLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
