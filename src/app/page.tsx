"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { allCourses } from "@/app/data/all-course";
import { allProducts } from "@/app/data/product";

export default function HomePage() {
  const courses = allCourses.slice(0, 3);
  const product = allProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32 text-center bg-white">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-6xl lg:text-8xl font-light text-stone-800">
              RU<span className="text-amber-600">IND</span>
            </h1>
            <h2 className="text-3xl lg:text-4xl font-light text-stone-600 mt-2">
              Edu-Commerce
            </h2>
          </div>
          <p className="text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
            Ruang belajar dan berbelanja untuk pencinta
            <br />
            <span className="text-amber-600">Teh • Kopi • Herbal</span>
          </p>
          <Button size="lg" className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-6 text-lg font-light rounded-full">
            <Link href="#courses" className="flex items-center gap-3">
              Mulai Eksplorasi
            </Link>
          </Button>
        </div>
      </section>

      {/* Course Section */}
      <section id="courses" className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-stone-800">Kategori Pembelajaran</h2>
            <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="bg-stone-50 hover:bg-white transition">
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-light text-stone-800">{course.title}</CardTitle>
                  <p className="text-stone-600 mt-2 text-sm font-light">{course.description}</p>
                  <Link href={`/course/${course.slug}`} className="block mt-4 text-amber-600 text-sm font-medium">
                    Lihat Kursus
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Link href="/courses" className="block text-center mt-8 text-amber-600 font-medium">
          Lihat Semua Kursus
        </Link>
      </section>

      {/* Product Section */}
      <section id="products" className="px-6 py-20 bg-stone-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-stone-800">Koleksi Produk</h2>
            <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.map((product) => (
              <Card key={product.id} className="bg-white hover:bg-stone-50 transition">
                <CardContent className="p-6">
                  <CardTitle className="text-lg font-light text-stone-800">{product.name}</CardTitle>
                  <p className="text-stone-600 mt-2 text-sm font-light">{product.description}</p>
                  <div className="text-amber-600 mt-2 text-sm font-light">Rp {product.price.toLocaleString()}</div>
                  <Link href={`/product/${product.slug}`} className="block mt-4 text-amber-600 text-sm font-medium">
                    Lihat Produk
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Link href="/products" className="block text-center mt-8 text-amber-600 font-medium">
          Lihat Semua Produk
        </Link>
      </section>
    </div>
  );
}
