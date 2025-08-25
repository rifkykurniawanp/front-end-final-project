// hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react';
import { productOrdersApi } from '@/lib/API/products';
import { useAuth } from '../useAuth';
import type { 
  ProductOrderResponseDto,
  OrderFilterDto,
  UpdateProductOrderDto,
  OrderSummary,
  ProductOrderItemResponseDto
} from '@/types/order';
import { OrderStatus } from '@/types/enum';

interface UseOrdersOptions extends OrderFilterDto {
  autoFetch?: boolean;
  userOnly?: boolean; // For USER role to show only their orders
  supplierOnly?: boolean; // For SUPPLIER role to show orders with their products
}

interface UseOrdersReturn {
  orders: ProductOrderResponseDto[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  filters: OrderFilterDto;
  summary: OrderSummary | null;
  
  // Actions
  refetch: () => Promise<void>;
  setFilters: (filters: Partial<OrderFilterDto>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  
  // Order management
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (id: number) => Promise<boolean>;
  getOrderById: (id: number) => Promise<ProductOrderResponseDto | null>;
  getOrderItems: (orderId: number) => Promise<ProductOrderItemResponseDto[]>;
  
  // Utility functions
  calculateOrderSummary: () => OrderSummary;
  getOrdersByStatus: (status: OrderStatus) => ProductOrderResponseDto[];
  bulkUpdateStatus: (ids: number[], status: OrderStatus) => Promise<boolean>;
}

const defaultFilters: OrderFilterDto = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const { token, user } = useAuth();
  const { 
    autoFetch = true, 
    userOnly = false, 
    supplierOnly = false, 
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
    // Auto-set buyerId for USER role
    ...(userOnly && user?.role === 'USER' && user.id ? { buyerId: user.id } : {}),
    // Auto-set supplierId for SUPPLIER role  
    ...(supplierOnly && user?.role === 'SUPPLIER' && user.id ? { supplierId: user.id } : {}),
  });

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response: ProductOrderResponseDto[] | { data: ProductOrderResponseDto[]; pagination?: any } | any;
      
      // Role-based API calls
      if (userOnly && user?.id) {
        response = await productOrdersApi.getByUserId(user.id, token, filters);
      } else if (supplierOnly && user?.id) {
        response = await productOrdersApi.getBySupplierId(user.id, token, filters);
      } else {
        response = await productOrdersApi.getAll(token, filters);
      }
      
      // Handle different response formats
      if (Array.isArray(response)) {
        setOrders(response);
        setTotalItems(response.length);
        setTotalPages(1);
      } else if (response && typeof response === 'object' && 'data' in response) {
        setOrders(response.data || []);
        setTotalItems(response.pagination?.totalItems || response.data?.length || 0);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setOrders([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token, user, filters, userOnly, supplierOnly]);

  const setFilters = useCallback((newFilters: Partial<OrderFilterDto>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when only page changes)
      ...(newFilters.page === undefined ? { page: 1 } : {}),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({
      ...defaultFilters,
      // Preserve role-based filters
      ...(userOnly && user?.role === 'USER' && user.id ? { buyerId: user.id } : {}),
      ...(supplierOnly && user?.role === 'SUPPLIER' && user.id ? { supplierId: user.id } : {}),
    });
  }, [userOnly, supplierOnly, user]);

  const setPage = useCallback((page: number) => {
    setFilters({ page });
  }, [setFilters]);

  const updateOrderStatus = async (id: number, status: OrderStatus): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      return false;
    }

    try {
      await productOrdersApi.updateStatus(id, { status }, token);
      await refetch(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      return false;
    }
  };

  const cancelOrder = async (id: number): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      return false;
    }

    try {
      await productOrdersApi.cancel(id, token);
      await refetch(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
      return false;
    }
  };

  const getOrderById = async (id: number): Promise<ProductOrderResponseDto | null> => {
    if (!token) return null;

    try {
      // Since there's no getById in the API, find from current orders or refetch
      const existingOrder = orders.find(order => order.id === id);
      if (existingOrder) return existingOrder;
      
      // If not found, could implement a specific getById API call
      setError('Order not found in current list');
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to get order');
      return null;
    }
  };

  const getOrderItems = async (orderId: number): Promise<ProductOrderItemResponseDto[]> => {
    try {
      const order = await getOrderById(orderId);
      return order?.items || [];
    } catch (err: any) {
      setError(err.message || 'Failed to get order items');
      return [];
    }
  };

  const calculateOrderSummary = useCallback((): OrderSummary => {
    const summary: OrderSummary = {
      totalOrders: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      totalItems: orders.reduce((sum, order) => sum + (order.items?.length || 0), 0),
      statusBreakdown: {
        [OrderStatus.PENDING]: { count: 0, amount: 0 },
        [OrderStatus.PROCESSING]: { count: 0, amount: 0 },
        [OrderStatus.COMPLETED]: { count: 0, amount: 0 },
        [OrderStatus.CANCELLED]: { count: 0, amount: 0 },
      },
    };

    orders.forEach(order => {
      const status = order.status;
      summary.statusBreakdown[status].count += 1;
      summary.statusBreakdown[status].amount += order.totalPrice;
    });

    return summary;
  }, [orders]);

  const getOrdersByStatus = useCallback((status: OrderStatus): ProductOrderResponseDto[] => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  const bulkUpdateStatus = async (ids: number[], status: OrderStatus): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      return false;
    }

    try {
      // Update orders one by one since no bulk API
      const promises = ids.map(id => productOrdersApi.updateStatus(id, { status }, token));
      await Promise.all(promises);
      await refetch(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to bulk update orders');
      return false;
    }
  };

  const refetch = async () => {
    await fetchOrders();
  };

  // Update summary when orders change
  useEffect(() => {
    if (orders.length > 0) {
      setSummary(calculateOrderSummary());
    }
  }, [orders, calculateOrderSummary]);

  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
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
    
    // Actions
    refetch,
    setFilters,
    resetFilters,
    setPage,
    
    // Order management
    updateOrderStatus,
    cancelOrder,
    getOrderById,
    getOrderItems,
    
    // Utility functions
    calculateOrderSummary,
    getOrdersByStatus,
    bulkUpdateStatus,
  };
}

// Specialized hooks for different roles
export function useUserOrders() {
  const { user } = useAuth();
  
  return useOrders({
    userOnly: true,
    autoFetch: user?.role === 'USER',
  });
}

export function useSupplierOrders() {
  const { user } = useAuth();
  
  return useOrders({
    supplierOnly: true,
    autoFetch: user?.role === 'SUPPLIER',
  });
}

export function useAdminOrders() {
  const { user } = useAuth();
  
  return useOrders({
    autoFetch: user?.role === 'ADMIN',
  });
}

// Hook for order status management
export function useOrderStatuses() {
  return {
    statuses: Object.values(OrderStatus),
    statusColors: {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800', 
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    },
    canUpdateStatus: (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
      // Define business logic for status transitions
      const validTransitions: { [key in OrderStatus]: OrderStatus[] } = {
        [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
        [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        [OrderStatus.COMPLETED]: [], // Cannot change from completed
        [OrderStatus.CANCELLED]: [], // Cannot change from cancelled
      };
      
      return validTransitions[currentStatus].includes(newStatus);
    },
  };
}

// Hook for order filtering
export function useOrderFilters() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus[]>([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000000]);

  const convertToApiFilters = useCallback((): OrderFilterDto => {
    return {
      startDate: dateRange[0] || undefined,
      endDate: dateRange[1] || undefined,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      minAmount: amountRange[0] > 0 ? amountRange[0] : undefined,
      maxAmount: amountRange[1] < 10000000 ? amountRange[1] : undefined,
    };
  }, [dateRange, statusFilter, amountRange]);

  const resetFilters = useCallback(() => {
    setDateRange([null, null]);
    setStatusFilter([]);
    setAmountRange([0, 10000000]);
  }, []);

  return {
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    amountRange,
    setAmountRange,
    convertToApiFilters,
    resetFilters,
  };
}