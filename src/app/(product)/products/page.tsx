"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { productsApi } from "@/lib/API/products/products.api";
import { Product, FilterState, ProductFilterDto } from "@/types/product";
import { FilterSidebar } from "@/components/product/FilterSideBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useCartContext } from "@/context/CartContext";

const ProductPage: FC = () => {
  const router = useRouter();
  const { addItem } = useCartContext();

  const [filters, setFilters] = useState<FilterState>({
    category: [],
    origin: [],
    tags: [],
    priceRange: [0, 500000],
    status: [],
    minRating: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFilter = (key: keyof FilterState, value: FilterState[keyof FilterState]) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({
      category: [],
      origin: [],
      tags: [],
      priceRange: [0, 500000],
      status: [],
      minRating: 0,
    });
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: ProductFilterDto = {
          search: searchTerm || undefined,
          category: filters.category.length ? filters.category : undefined,
          origin: filters.origin.length ? filters.origin : undefined,
          tags: filters.tags.length ? filters.tags : undefined,
          status: filters.status.length ? filters.status : undefined,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          page: 1,
          limit: 50,
        };
        const data = await productsApi.getAll(params);
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, searchTerm]);

  const handleBuyNow = (product: Product, quantity: number) => {
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Produk Kami</h1>
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
          {loading && <p className="text-center py-10 text-gray-500">Loading...</p>}
          {error && <p className="text-center py-10 text-red-500">{error}</p>}
          {!loading && !error && (
            <ProductGrid
              products={products}
              addToCart={addItem}
              buyNow={handleBuyNow}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
