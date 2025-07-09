"use client";

import React, { useState, useMemo, FC } from "react";
import { useRouter } from 'next/navigation';
import { FilterSidebar } from "@/app/(product)/components/FilterSideBar";
import { ProductGrid } from "@/app/(product)/components/ProductGrid";
import { allProducts } from "../../data/product";
import { useCart } from "@/hooks/useCart";
import { FilterState, Product } from "@/types/product";

const ProductPage: FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    category: [], subcategory: [], priceRange: [0, 500000], rating: 0, caffeine: [], origin: []
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: [], subcategory: [], priceRange: [0, 500000], rating: 0, caffeine: [], origin: []});
    setSearchTerm("");
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = filters.category.length === 0 || filters.category.includes(product.category);
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesSearch = searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [filters, searchTerm]);

  const { addToCart } = useCart(); 

  const handleBuyNow = (product: Product, quantity: number) => {

    console.log(`Membeli ${quantity} ${product.name}`);
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Produk Kami</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 sticky top-20 self-start">
          <FilterSidebar
            filters={filters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
          />
        </div>
        <div className="flex-1">
          <ProductGrid
            products={filteredProducts}
            addToCart={addToCart} 
            buyNow={handleBuyNow}  
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;