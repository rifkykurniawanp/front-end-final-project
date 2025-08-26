"use client";
import { Search, X } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { SearchDropdown } from './SearchDropDown';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
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
      // Redirect to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchState.query)}&filter=${searchState.filter}`;
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleResultClick = () => {
    hideResults();
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        hideResults();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideResults]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchState.showResults) {
        hideResults();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchState.showResults, hideResults]);

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-orange-950 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search courses, products..."
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-950 focus:border-transparent outline-none transition-all duration-200 ease-in-out hover:border-orange-950 hover:shadow-sm"
            value={searchState.query}
            onChange={handleSearchChange}
          />
          {searchState.query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
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
