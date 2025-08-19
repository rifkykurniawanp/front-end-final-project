"use client";

import React, { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { FilterSidebar } from "@/components/product/FilterSideBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useCart } from "@/hooks/useCart";
import { FilterState, Product } from "@/types/product";
import { productsApi } from "@/lib/API/products/products.api";

const ProductPage: FC = () => {
  const router = useRouter();
  const { addToCart } = useCart();

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    subcategory: [],
    priceRange: [0, 500000],
    rating: 0,
    caffeine: [],
    origin: [],
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: [], subcategory: [], priceRange: [0, 500000], rating: 0, caffeine: [], origin: [] });
    setSearchTerm("");
  };

  // Fetch products whenever filters or searchTerm change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          search: searchTerm || undefined,
          category: filters.category.length > 0 ? filters.category : undefined,
          subcategory: filters.subcategory.length > 0 ? filters.subcategory : undefined,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          // Tambahkan field filter lain sesuai ProductFilterDto
          origin: filters.origin.length > 0 ? filters.origin : undefined,
        };

        const data = await productsApi.getAll(params);
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchTerm]);

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
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <ProductGrid
              products={products}
              addToCart={addToCart}
              buyNow={handleBuyNow}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
