"use client";

import { useState, useEffect, useCallback } from "react";
import { productOrdersApi } from "@/lib/API/products";
import { usersApi } from "@/lib/API/auth";
import type {
  ProductOrderResponseDto,
  OrderFilterDto,
  OrderSummary,
  ProductOrderItemResponseDto,
  UserWithRelations,
} from "@/types";
import { OrderStatus, RoleName } from "@/types/enum";
import { useAuth } from "../useAuth";

interface UseUniversalOrdersOptions extends OrderFilterDto {
  userId?: number;         // optional: lihat user tertentu (ADMIN)
  userOnly?: boolean;      // jika USER hanya ingin data sendiri
  supplierOnly?: boolean;  // jika SUPPLIER hanya ingin data produknya
  autoFetch?: boolean;
}

interface UseUniversalOrdersReturn {
  orders: ProductOrderResponseDto[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  filters: OrderFilterDto;
  summary: OrderSummary | null;
  userProfile: UserWithRelations | null;

  // Actions
  refetch: () => Promise<void>;
  setFilters: (filters: Partial<OrderFilterDto>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;

  // Order management
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (id: number) => Promise<boolean>;
  getOrderItems: (orderId: number) => ProductOrderItemResponseDto[];
}

const defaultFilters: OrderFilterDto = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useUniversalOrders(options: UseUniversalOrdersOptions = {}): UseUniversalOrdersReturn {
  const { token, user } = useAuth();
  const {
    userId,
    userOnly = false,
    supplierOnly = false,
    autoFetch = true,
    ...initialFilters
  } = options;

  const [orders, setOrders] = useState<ProductOrderResponseDto[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [filters, setFiltersState] = useState<OrderFilterDto>({
    ...defaultFilters,
    ...initialFilters,
    ...(userOnly && user?.role === RoleName.USER && user.id ? { buyerId: user.id } : {}),
    ...(supplierOnly && user?.role === RoleName.SUPPLIER && user.id ? { supplierId: user.id } : {}),
  });
  const [userProfile, setUserProfile] = useState<UserWithRelations | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      let response: ProductOrderResponseDto[] = [];

      if (userOnly && user?.id) {
        response = await productOrdersApi.getByUserId(user.id, token, filters);
      } else if (supplierOnly && user?.id) {
        response = await productOrdersApi.getBySupplierId(user.id, token, filters);
      } else if (userId) {
        response = await productOrdersApi.getByUserId(userId, token, filters);
      } else {
        response = await productOrdersApi.getAll(token, filters);
      }

      setOrders(response);
      setTotalItems(response.length);
      setTotalPages(1);

      // hitung summary
      const summary: OrderSummary = {
        totalOrders: response.length,
        totalAmount: response.reduce((sum, o) => sum + o.totalPrice, 0),
        totalItems: response.reduce((sum, o) => sum + (o.items?.length || 0), 0),
        statusBreakdown: {
          [OrderStatus.PENDING]: { count: 0, amount: 0 },
          [OrderStatus.PROCESSING]: { count: 0, amount: 0 },
          [OrderStatus.COMPLETED]: { count: 0, amount: 0 },
          [OrderStatus.CANCELLED]: { count: 0, amount: 0 },
        },
      };
      response.forEach((order) => {
        const s = order.status;
        summary.statusBreakdown[s].count += 1;
        summary.statusBreakdown[s].amount += order.totalPrice;
      });
      setSummary(summary);

      // fetch user profile jika userId diberikan
      if (userId) {
        try {
          const profileData = await usersApi.getById(userId, token);
          setUserProfile(profileData);
        } catch (err) {
          console.warn("Failed to fetch user profile", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(user ? { ...user } as UserWithRelations : null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [token, user, userId, userOnly, supplierOnly, filters]);

  const refetch = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  const setFilters = useCallback((newFilters: Partial<OrderFilterDto>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      ...(newFilters.page === undefined ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({
      ...defaultFilters,
      ...(userOnly && user?.role === RoleName.USER && user.id ? { buyerId: user.id } : {}),
      ...(supplierOnly && user?.role === RoleName.SUPPLIER && user.id ? { supplierId: user.id } : {}),
    });
  }, [userOnly, supplierOnly, user]);

  const setPage = useCallback((page: number) => setFilters({ page }), [setFilters]);

  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    if (!token) return false;
    try {
      await productOrdersApi.updateStatus(id, { status }, token);
      await refetch();
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
      return false;
    }
  };

  const cancelOrder = async (id: number) => {
    if (!token) return false;
    try {
      await productOrdersApi.cancel(id, token);
      await refetch();
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to cancel order");
      return false;
    }
  };

  const getOrderItems = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    return order?.items || [];
  };

  useEffect(() => {
    if (autoFetch) fetchOrders();
  }, [fetchOrders, autoFetch]);

  return {
    orders,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage: filters.page || 1,
    filters,
    summary,
    userProfile,
    refetch,
    setFilters,
    resetFilters,
    setPage,
    updateOrderStatus,
    cancelOrder,
    getOrderItems,
  };
}
