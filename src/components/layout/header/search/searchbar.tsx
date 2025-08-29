"use client";
import { Search, X } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { SearchDropdown } from "./SearchDropDown";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = "" }) => {
  const { searchState, performSearch, setFilter, clearSearch, hideResults } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    performSearch(query, searchState.filter);
    onSearch?.(query);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchState.query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchState.query
      )}&filter=${searchState.filter}`;
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleResultClick = () => {
    hideResults();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        hideResults();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hideResults]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && searchState.showResults) {
        hideResults();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchState.showResults, hideResults]);

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B5645] group-hover:text-[#D4AF7F] transition-colors" />
          <input
            type="text"
            placeholder="Search courses, products..."
            className="w-full pl-10 pr-12 py-2 rounded-lg border border-[#4A3737] bg-[#F9F4EA] text-[#3E2F2F] placeholder-[#A08C7D] focus:ring-2 focus:ring-[#D4AF7F] focus:border-transparent outline-none transition-all duration-200 ease-in-out hover:border-[#D4AF7F]"
            value={searchState.query}
            onChange={handleSearchChange}
          />
          {searchState.query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-[#E5D7C5] transition"
            >
              <X className="h-4 w-4 text-[#6B5645] hover:text-[#3E2F2F]" />
            </button>
          )}
        </div>
      </form>

      <SearchDropdown
        searchState={searchState}
        onFilterChange={setFilter}
        onResultClick={handleResultClick}
      />
    </div>
  );
};
