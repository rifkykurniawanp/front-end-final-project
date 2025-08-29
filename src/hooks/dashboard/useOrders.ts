// hooks/useUserOrders.ts
import { useState, useEffect, useCallback } from 'react';
import { productOrdersApi } from '@/lib/API/products';
import { useAuth } from '../useAuth';
import type { ProductOrderResponseDto } from '@/types/order';
import { OrderStatus } from '@/types/enum';

export function useUserOrders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<ProductOrderResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!token || !user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const data = await productOrdersApi.getByUserId(user.id, token);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    if (!token) return false;
    try {
      await productOrdersApi.updateStatus(orderId, { status }, token);
      await fetchOrders();
      return true;
    } catch {
      return false;
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!token) return false;
    try {
      await productOrdersApi.cancel(orderId, token);
      await fetchOrders();
      return true;
    } catch {
      return false;
    }
  };

  const getOrderItems = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    return order?.items || [];
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderItems,
  };
}
