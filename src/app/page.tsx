'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { coursesApi } from "@/lib/API/courses";
import { productsApi } from "@/lib/API/products";
import type { CourseWithRelations } from "@/types/course";
import type { ProductResponseDto } from "@/types/product";

const warmGradient = "from-[#6F4E37] via-[#D9B382] to-[#F5F5DC]";
const cardGradient = "from-[#FFF8E1] via-[#FFF3C4]/80 to-[#FFEAC4]";
const textPrimary = "text-[#4B3621]";
const textAccent = "text-[#D9B382]";
const bgWarm = "bg-[#FFF8E1]";

const Pattern = ({ id }: { id: string }) => (
  <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
    <defs>
      <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2" fill="#D9B382" />
        <circle cx="15" cy="15" r="2" fill="#FFD700" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default function HomePage() {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [products, setProducts] = useState<ProductResponseDto[]>([]);

  useEffect(() => {
    Promise.all([
      coursesApi.getAll({ page: 1, limit: 3 }),
      productsApi.getAll().then(p => p.slice(0, 3))
    ]).then(([c, p]) => {
      setCourses(c);
      setProducts(p);
    }).catch(console.error);
  }, []);

  const Section = ({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) => (
    <section
      id={id}
      className={`px-6 py-20 relative ${id === "products" ? bgWarm : "bg-gradient-to-b from-[#FFF8E1]/50 to-[#FFF3C4]/30"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-playfair font-semibold ${textPrimary}`}>
            {title}
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r ${textAccent} via-[#D9B382] ${textAccent} mx-auto mt-3 rounded-full`} />
        </div>
        {children}
      </div>
    </section>
  );

  const ItemCard = ({ item, type }: { item: CourseWithRelations | ProductResponseDto; type: "course" | "product" }) => (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${cardGradient} rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
      <Pattern id={`pattern-${type}-${item.id}`} />
      <CardContent className="relative p-6 flex flex-col h-full">
        <CardTitle className={`text-lg md:text-xl font-playfair font-semibold ${textPrimary} line-clamp-2`}>
          {"title" in item ? item.title : item.name}
        </CardTitle>
        <p className={`${textPrimary} mt-2 text-sm md:text-base font-light line-clamp-3`}>
          {item.description}
        </p>
        {"price" in item && <div className={`${textAccent} mt-auto text-sm md:text-base font-medium`}>Rp {item.price.toLocaleString()}</div>}
        <Link href={`/${type}/${item.slug}`} className={`block mt-4 text-sm md:text-base font-medium ${textPrimary} hover:${textAccent} transition-colors`}>
          Lihat {type === "course" ? "Kursus" : "Produk"}
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen font-montserrat ${bgWarm}`}>
      {/* Hero */}
      <section className={`relative flex flex-col-reverse lg:flex-row items-center px-6 lg:px-20 py-24 bg-gradient-to-br ${warmGradient} overflow-hidden`}>
        <div className="z-10 flex-1 text-center lg:text-left space-y-6 animate-fade-in-left">
          <h1 className="text-6xl lg:text-8xl font-playfair font-bold text-[#6F4E37]">
            RU<span className={textAccent}>IND</span>
          </h1>
          <h2 className="text-3xl lg:text-4xl font-light text-[#4B3621]">Edu-Commerce</h2>
          <p className={`text-xl md:text-2xl font-light ${textPrimary} leading-relaxed max-w-lg mx-auto lg:mx-0`}>
            Ruang belajar & berbelanja untuk pecinta <br/> <span className="text-[#D9B382]">Teh • Kopi • Herbal</span>
          </p>
          <Button className={`bg-[#4B3621] hover:bg-gradient-to-r ${warmGradient} ${textAccent} px-10 py-4 text-lg md:text-xl font-semibold rounded-full mt-6 transition-all transform hover:scale-105`}>
            <Link href="#courses">Mulai Eksplorasi</Link>
          </Button>
        </div>
        <div className="z-10 flex-1 mb-12 lg:mb-0 animate-fade-in-right">
          <img src="/hero.png" alt="Hero" className="w-full h-full object-cover rounded-xl shadow-lg" />
        </div>
      </section>

      {/* Courses */}
      <Section id="courses" title="Kategori Pembelajaran">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {courses.map(course => <ItemCard key={course.id} item={course} type="course" />)}
        </div>
        <Link href="/courses" className={`block text-center mt-8 ${textAccent} font-medium hover:text-[#E5C16F] transition-colors`}>
          Lihat Semua Kursus
        </Link>
      </Section>

      {/* Products */}
      <Section id="products" title="Koleksi Produk">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map(product => <ItemCard key={product.id} item={product} type="product" />)}
        </div>
        <Link href="/products" className={`block text-center mt-8 ${textAccent} font-medium hover:text-[#E5C16F] transition-colors`}>
          Lihat Semua Produk
        </Link>
      </Section>

      <style jsx>{`
        .animate-fade-in-left { opacity: 0; transform: translateX(-40px); animation: fadeInLeft 1s forwards; }
        .animate-fade-in-right { opacity: 0; transform: translateX(40px); animation: fadeInRight 1s forwards; }
        @keyframes fadeInLeft { to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInRight { to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
