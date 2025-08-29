"use client";
import React from "react";
import Link from "next/link";
import { CourseResponseDto } from "@/types/course";
import { ProductResponseDto } from "@/types/product";
import CourseCard from "@/components/course/CourseCard";
import { ProductCard } from "@/components/product/ProductCard";
import { SearchFilter } from "@/types/search";

interface SearchResultsProps {
  courses: CourseResponseDto[];
  products: ProductResponseDto[];
  filter: SearchFilter;
  query: string;
  onResultClick: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  courses,
  products,
  filter,
  query,
  onResultClick,
}) => {
  const hasResults = courses.length > 0 || products.length > 0;

  if (!hasResults) {
    return (
      <div className="p-4 text-center text-[#6B5645]">
        <p>No results found for "{query}"</p>
        <p className="text-sm mt-1 text-[#A08C7D]">
          Try different keywords or browse our categories
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {(filter === "all" || filter === "course") && courses.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-4">
            <h3 className="font-semibold text-[#3E2F2F]">
              Courses ({courses.length})
            </h3>
            {filter === "all" && courses.length === 5 && (
              <Link
                href={`/courses?search=${encodeURIComponent(query)}`}
                className="text-sm text-[#D4AF7F] hover:underline"
                onClick={onResultClick}
              >
                View all courses
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 px-4">
            {courses.map((course) => (
              <div key={course.id} onClick={onResultClick}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      )}

      {(filter === "all" || filter === "product") && products.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3 px-4">
            <h3 className="font-semibold text-[#3E2F2F]">
              Products ({products.length})
            </h3>
            {filter === "all" && products.length === 5 && (
              <Link
                href={`/products?search=${encodeURIComponent(query)}`}
                className="text-sm text-[#D4AF7F] hover:underline"
                onClick={onResultClick}
              >
                View all products
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4">
            {products.map((product) => (
              <div key={product.id} onClick={onResultClick}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
