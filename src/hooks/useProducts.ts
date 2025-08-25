// hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '@/lib/API/products';
import { useAuth } from './useAuth';
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
  FilterState,
  ProductCategory,
  ProductOrigin,
  ProductStatus,
  ProductTagName,
} from '@/types';

interface UseProductsOptions extends ProductFilterDto {
  autoFetch?: boolean;
  supplierOnly?: boolean; // For SUPPLIER role to show only their products
}

interface UseProductsReturn {
  products: ProductResponseDto[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  filters: ProductFilterDto;

  // Actions
  refetch: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilterDto>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;

  // CRUD operations
  createProduct: (data: CreateProductDto) => Promise<ProductResponseDto | null>;
  updateProduct: (id: number, data: UpdateProductDto) => Promise<ProductResponseDto | null>;
  deleteProduct: (id: number) => Promise<boolean>;

  // Utility functions
  getProductById: (id: number) => Promise<ProductResponseDto | null>;
  getProductBySlug: (slug: string) => Promise<ProductResponseDto | null>;
  searchProducts: (query: string) => Promise<ProductResponseDto[]>;
  updateStock: (id: number, stock: number) => Promise<boolean>;
  bulkUpdateStatus: (ids: number[], status: ProductStatus) => Promise<boolean>;
}

const defaultFilters: ProductFilterDto = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { token, user } = useAuth();
  const { autoFetch = true, supplierOnly = false, ...initialFilters } = options;

  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFiltersState] = useState<ProductFilterDto>({
    ...defaultFilters,
    ...initialFilters,
    ...(supplierOnly && user?.role === 'SUPPLIER' && user.id
      ? { supplierId: user.id }
      : {}),
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsApi.getAll(filters); // always array
      setProducts(response);
      setTotalItems(response.length);

      // manual pagination client-side
      const limit = filters.limit ?? 10;
      setTotalPages(Math.ceil(response.length / limit));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters: Partial<ProductFilterDto>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      ...(newFilters.page === undefined ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({
      ...defaultFilters,
      ...(supplierOnly && user?.role === 'SUPPLIER' && user.id
        ? { supplierId: user.id }
        : {}),
    });
  }, [supplierOnly, user]);

  const setPage = useCallback(
    (page: number) => {
      setFilters({ page });
    },
    [setFilters]
  );

  const createProduct = async (data: CreateProductDto): Promise<ProductResponseDto | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    if (user?.role === 'SUPPLIER' && user.id) {
      data.supplierId = user.id;
    }

    try {
      const response = await productsApi.create(data, token);
      await refetch();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      return null;
    }
  };

  const updateProduct = async (id: number, data: UpdateProductDto): Promise<ProductResponseDto | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    try {
      const response = await productsApi.update(id, data, token);
      await refetch();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      return null;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      return false;
    }

    try {
      await productsApi.delete(id, token);
      await refetch();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      return false;
    }
  };

  const getProductById = async (id: number): Promise<ProductResponseDto | null> => {
    try {
      return await productsApi.getById(id);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      return null;
    }
  };

  const getProductBySlug = async (slug: string): Promise<ProductResponseDto | null> => {
    try {
      return await productsApi.getBySlug(slug);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      return null;
    }
  };

  const searchProducts = async (query: string): Promise<ProductResponseDto[]> => {
    try {
      return await productsApi.search(query, filters);
    } catch (err: any) {
      setError(err.message || 'Failed to search products');
      return [];
    }
  };

  const updateStock = async (id: number, stock: number): Promise<boolean> => {
    return (await updateProduct(id, { stock })) !== null;
  };

  const bulkUpdateStatus = async (ids: number[], status: ProductStatus): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      return false;
    }

    try {
      const promises = ids.map((id) => productsApi.update(id, { status }, token));
      await Promise.all(promises);
      await refetch();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to bulk update products');
      return false;
    }
  };

  const refetch = async () => {
    await fetchProducts();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    products,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage: filters.page || 1,
    filters,

    // Actions
    refetch,
    setFilters,
    resetFilters,
    setPage,

    // CRUD
    createProduct,
    updateProduct,
    deleteProduct,

    // Utility
    getProductById,
    getProductBySlug,
    searchProducts,
    updateStock,
    bulkUpdateStatus,
  };
}

// Specialized hooks
export function useSupplierProducts() {
  const { user } = useAuth();
  return useProducts({
    supplierOnly: true,
    autoFetch: user?.role === 'SUPPLIER',
  });
}

export function useProductCategories() {
  return {
    categories: Object.values(ProductCategory),
    origins: Object.values(ProductOrigin),
    statuses: Object.values(ProductStatus),
    tags: Object.values(ProductTagName),
  };
}

export function useProductFilters() {
  const [filterState, setFilterState] = useState<FilterState>({
    category: [],
    origin: [],
    tags: [],
    priceRange: [0, 1000000],
    status: [],
    minRating: 0,
  });

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState({
      category: [],
      origin: [],
      tags: [],
      priceRange: [0, 1000000],
      status: [],
      minRating: 0,
    });
  }, []);

  const convertToApiFilters = useCallback((): ProductFilterDto => {
    return {
      category: filterState.category.length > 0 ? filterState.category : undefined,
      origin: filterState.origin.length > 0 ? filterState.origin : undefined,
      tags: filterState.tags.length > 0 ? filterState.tags : undefined,
      minPrice: filterState.priceRange[0] > 0 ? filterState.priceRange[0] : undefined,
      maxPrice: filterState.priceRange[1] < 1000000 ? filterState.priceRange[1] : undefined,
      status: filterState.status.length > 0 ? filterState.status : undefined,
    };
  }, [filterState]);

  return {
    filterState,
    updateFilter,
    resetFilters,
    convertToApiFilters,
  };
}
