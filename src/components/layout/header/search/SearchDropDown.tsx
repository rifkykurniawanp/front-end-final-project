"use client";
import React from 'react';
import { SearchState } from '@/types/search';
import { SearchFilterTabs } from './SearchFilter';
import { SearchResults } from './SearchResult';
import { Loader2 } from 'lucide-react';

interface SearchDropdownProps {
  searchState: SearchState;
  onFilterChange: (filter: any) => void;
  onResultClick: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  searchState,
  onFilterChange,
  onResultClick
}) => {
  if (!searchState.showResults && !searchState.isSearching) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-w-4xl">
      <SearchFilterTabs 
        activeFilter={searchState.filter}
        onFilterChange={onFilterChange}
      />
      
      {searchState.isSearching ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-orange-950" />
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      ) : searchState.error ? (
        <div className="p-4 text-center text-red-600">
          <p>{searchState.error}</p>
        </div>
      ) : (
        <SearchResults 
          courses={searchState.results.courses}
          products={searchState.results.products}
          filter={searchState.filter}
          query={searchState.query}
          onResultClick={onResultClick}
        />
      )}
    </div>
  );
};