"use client";
import { useState, useMemo } from 'react';
import { FilterState } from '../types/product';
import { allProducts } from '../app/data/products/index';

export const useProducts = (initialFilters?: Partial<FilterState>) => {
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    subcategory: [],
    priceRange: [0, 500000],
    rating: 0,
    caffeine: [],
    origin: [],
    ...initialFilters
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = filters.category.length === 0 || 
                             filters.category.includes(product.category);

      // Subcategory filter
      const matchesSubcategory = filters.subcategory.length === 0 || 
                                 filters.subcategory.includes(product.subcategory);

      // Price range filter
      const matchesPrice = product.price >= filters.priceRange[0] && 
                          product.price <= filters.priceRange[1];

      // Rating filter
      const matchesRating = product.rating >= filters.rating;

      // Caffeine filter
      const matchesCaffeine = filters.caffeine.length === 0 || 
                             (product.caffeine && filters.caffeine.includes(product.caffeine));

      // Origin filter
      const matchesOrigin = filters.origin.length === 0 || 
                           (product.origin && filters.origin.includes(product.origin));

      return matchesSearch && matchesCategory && matchesSubcategory && 
             matchesPrice && matchesRating && matchesCaffeine && matchesOrigin;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, filters, sortBy]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      subcategory: [],
      priceRange: [0, 500000],
      rating: 0,
      caffeine: [],
      origin: []
    });
    setSearchTerm('');
    setSortBy('name');
  };

  const getFilteredStats = () => {
    const stats = {
      totalProducts: filteredProducts.length,
      averagePrice: filteredProducts.length > 0 
        ? filteredProducts.reduce((sum, product) => sum + product.price, 0) / filteredProducts.length
        : 0,
      averageRating: filteredProducts.length > 0
        ? filteredProducts.reduce((sum, product) => sum + product.rating, 0) / filteredProducts.length
        : 0,
      categories: {} as Record<string, number>,
      subcategories: {} as Record<string, number>
    };

    filteredProducts.forEach(product => {
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
      stats.subcategories[product.subcategory] = (stats.subcategories[product.subcategory] || 0) + 1;
    });

    return stats;
  };

  return {
    products: filteredProducts,
    filters,
    searchTerm,
    sortBy,
    setSearchTerm,
    setSortBy,
    updateFilter,
    resetFilters,
    stats: getFilteredStats()
  };
};