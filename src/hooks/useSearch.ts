import { useState, useCallback, useRef } from 'react';
import { SearchState, SearchFilter } from '@/types/search';
import { coursesApi } from '@/lib/API/courses';
import { productsApi } from '@/lib/API/products';
import type { CourseResponseDto } from '@/types/course';
import type { ProductResponseDto } from '@/types/product';

export const useSearch = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filter: 'all',
    isSearching: false,
    showResults: false,
    results: {
      courses: [],
      products: []
    },
    error: null
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter courses berdasarkan query
  const filterCoursesByQuery = (courses: CourseResponseDto[], query: string) => {
    const searchTerm = query.toLowerCase();
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description?.toLowerCase().includes(searchTerm) ||
      course.instructor?.firstName.toLowerCase().includes(searchTerm)
    );
  };

  // Fungsi utama search
  const performSearch = useCallback(async (query: string, filter: SearchFilter) => {
    if (!query.trim()) {
      setSearchState(prev => ({
        ...prev,
        query,
        showResults: false,
        results: { courses: [], products: [] },
        error: null
      }));
      return;
    }

    setSearchState(prev => ({
      ...prev,
      query,
      filter,
      isSearching: true,
      error: null
    }));

    try {
      let courses: CourseResponseDto[] = [];
      let products: ProductResponseDto[] = [];

      // Cari courses
      if (filter === 'all' || filter === 'course') {
        // FIX: Pass numbers but they'll be converted to strings in coursesApi
        const allCourses = await coursesApi.getAll({
          page: 1,        // This will be converted to "1" in the API
          limit: 50       // This will be converted to "50" in the API
        });
        courses = filterCoursesByQuery(allCourses, query).slice(0, 5);
      }

      // Cari products
      if (filter === 'all' || filter === 'product') {
        const searchedProducts = await productsApi.search(query, {
          limit: 5        // This will be converted to "5" in the API
        });
        products = searchedProducts.slice(0, 5);
      }

      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        showResults: true,
        results: { courses, products }
      }));
    } catch (error) {
      console.error('Search error:', error);
      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        showResults: false,
        error: 'Failed to search. Please try again.'
      }));
    }
  }, []);

  // Debounce search
  const debouncedSearch = useCallback((query: string, filter: SearchFilter) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(query, filter);
    }, 300);
  }, [performSearch]);

  // Ubah filter
  const setFilter = useCallback((filter: SearchFilter) => {
    setSearchState(prev => ({
      ...prev,
      filter
    }));

    if (searchState.query.trim()) {
      debouncedSearch(searchState.query, filter);
    }
  }, [searchState.query, debouncedSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setSearchState({
      query: '',
      filter: 'all',
      isSearching: false,
      showResults: false,
      results: { courses: [], products: [] },
      error: null
    });
  }, []);

  // Sembunyikan hasil search
  const hideResults = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      showResults: false
    }));
  }, []);

  return {
    searchState,
    performSearch: debouncedSearch,
    setFilter,
    clearSearch,
    hideResults
  };
};