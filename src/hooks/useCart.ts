// =================== useCart.ts (extended) ===================
import { useState, useEffect, useCallback } from "react";
import { cartApi } from "@/lib/API/core/carts.api";
import type { CartWithItems, AddToCartDto, UpdateCartDto } from "@/types/cart";

export function useCart(token: string) {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const carts = await cartApi.getMyCart(token);
      setCart(carts[0] || null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addItem = useCallback(
    async (cartId: number, data: AddToCartDto) => {
      setLoading(true);
      try {
        const updatedCart = await cartApi.addItem(cartId, data, token);
        setCart(updatedCart);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const removeItem = useCallback(
    async (cartId: number, itemId: number) => {
      setLoading(true);
      try {
        await cartApi.removeItem(cartId, itemId, token);
        if (cart) {
          setCart({
            ...cart,
            items: cart.items.filter((item) => item.id !== itemId),
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [cart, token]
  );

  const updateCart = useCallback(
    async (cartId: number, data: UpdateCartDto) => {
      setLoading(true);
      try {
        const updatedCart = await cartApi.updateCart(cartId, data, token);
        setCart(updatedCart);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { cart, loading, error, fetchCart, addItem, removeItem, updateCart };
}
