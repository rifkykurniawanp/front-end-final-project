import { useState, useCallback } from "react";
import { productsApi } from "@/lib/API/products";
import { useAuth } from "./useAuth";
import type {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
} from "@/types";
import { ProductStatus } from "@/types/enum";

interface UseProductReturn {
  product: ProductResponseDto | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchById: (id: number) => Promise<ProductResponseDto | null>;
  fetchBySlug: (slug: string) => Promise<ProductResponseDto | null>;
  reset: () => void;

  // CRUD
  createProduct: (data: CreateProductDto) => Promise<ProductResponseDto | null>;
  updateProduct: (
    id: number,
    data: UpdateProductDto
  ) => Promise<ProductResponseDto | null>;
  deleteProduct: (id: number) => Promise<boolean>;

  // Utility
  updateStock: (id: number, stock: number) => Promise<boolean>;
  updateStatus: (id: number, status: ProductStatus) => Promise<boolean>;
}

export function useProduct(): UseProductReturn {
  const { token, user } = useAuth();
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getById(id);
      setProduct(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch product");
      setProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.getBySlug(slug);
      setProduct(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to fetch product");
      setProduct(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setProduct(null);
    setError(null);
  };

  const createProduct = async (
    data: CreateProductDto
  ): Promise<ProductResponseDto | null> => {
    if (!token) {
      setError("Authentication required");
      return null;
    }

    // Auto-assign supplierId kalau user adalah SUPPLIER
    if (user?.role === "SUPPLIER" && user.id) {
      data.supplierId = user.id;
    }

    try {
      const res = await productsApi.create(data, token);
      setProduct(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      return null;
    }
  };

  const updateProduct = async (
    id: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto | null> => {
    if (!token) {
      setError("Authentication required");
      return null;
    }
    try {
      const res = await productsApi.update(id, data, token);
      setProduct(res);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update product");
      return null;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    if (!token) {
      setError("Authentication required");
      return false;
    }
    try {
      await productsApi.delete(id, token);
      setProduct(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
      return false;
    }
  };

  const updateStock = async (id: number, stock: number): Promise<boolean> => {
    return (await updateProduct(id, { stock })) !== null;
  };

  const updateStatus = async (
    id: number,
    status: ProductStatus
  ): Promise<boolean> => {
    return (await updateProduct(id, { status })) !== null;
  };

  return {
    product,
    loading,
    error,

    fetchById,
    fetchBySlug,
    reset,

    createProduct,
    updateProduct,
    deleteProduct,

    updateStock,
    updateStatus,
  };
}
