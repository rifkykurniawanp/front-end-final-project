"use client";
import React from "react";
import { SearchFilter } from "@/types/search";

interface SearchFilterProps {
  activeFilter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
}

export const SearchFilterTabs: React.FC<SearchFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters: { value: SearchFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "course", label: "Courses" },
    { value: "product", label: "Products" },
  ];

  return (
    <div className="flex border-b border-[#E5D7C5] mb-4">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            activeFilter === filter.value
              ? "text-[#3E2F2F] border-b-2 border-[#D4AF7F] font-semibold"
              : "text-[#6B5645] hover:text-[#D4AF7F]"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
