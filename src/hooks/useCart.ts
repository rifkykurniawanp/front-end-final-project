"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CartItem,
  CartWithItems,
  AddToCartDto,
  UpdateCartItemDto,
} from "@/types/cart";
import { Product } from "@/types/product";
import { Course } from "@/types/course";
import { CartItemType } from "@/types/enum";
import { cartApi } from "@/lib/API/core/carts.api";

interface UseCartReturn {
  cart: CartItem[];
  cartId: number | null;
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (item: Product | Course, type: CartItemType, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const useCart = (
  userId?: string,
  token?: string,
  userRole?: string
): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ---------- Cart Initialization ----------
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Role bukan USER → kosongkan cart
      if (userRole !== "USER") {
        setCart([]);
        setCartId(null);
        return;
      }

      // Guest cart via localStorage
      if (!userId || userId === "guest") {
        const guestCart = localStorage.getItem("guestCart");
        const guestCartId = localStorage.getItem("guestCartId");
        setCart(guestCart ? JSON.parse(guestCart) : []);
        setCartId(guestCartId ? parseInt(guestCartId) : null);
        return;
      }

      // Authenticated USER
      if (!token) {
        setCart([]);
        return;
      }

      const response: CartWithItems = await cartApi.getMyCart(token);
      setCartId(response.id);
      setCart(response.items || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, token, userRole]);

  const saveGuestCart = (items: CartItem[]) => {
    if (!userId || userId === "guest") {
      localStorage.setItem("guestCart", JSON.stringify(items));
      if (!cartId) localStorage.setItem("guestCartId", Date.now().toString());
    }
  };

  // ---------- Mutations ----------
  const addToCart = async (item: Product | Course, type: CartItemType, quantity = 1) => {
    try {
      setError(null);

      // Guest logic
      if (!userId || userId === "guest") {
        const existingIndex = cart.findIndex(c => c.itemId === item.id && c.itemType === type);
        let updatedCart: CartItem[];
        if (existingIndex > -1) {
          updatedCart = cart.map((c, i) => i === existingIndex ? { ...c, quantity: c.quantity + quantity } : c);
        } else {
          updatedCart = [...cart, {
            id: Date.now(),
            cartId: cartId || Date.now(),
            itemType: type,
            itemId: item.id,
            quantity,
            price: item.price,
            product: type === CartItemType.PRODUCT ? (item as Product) : null,
            course: type === CartItemType.COURSE ? (item as Course) : null,
          }];
        }
        setCart(updatedCart);
        saveGuestCart(updatedCart);
        return;
      }

      if (userRole !== "USER") throw new Error("Only USER role can use cart");
      if (!token) throw new Error("Authentication required");

      const dto: AddToCartDto = { itemType: type, itemId: item.id, quantity };
      await cartApi.addItem(dto, token);
      await loadCart();
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setError(null);

      if (!userId || userId === "guest") {
        const updatedCart = cart.filter(c => c.id !== itemId);
        setCart(updatedCart);
        saveGuestCart(updatedCart);
        return;
      }

      if (userRole !== "USER") throw new Error("Only USER role can use cart");
      if (!token) throw new Error("Authentication required");

      await cartApi.removeItem(itemId, token);
      await loadCart();
    } catch (err: any) {
      setError(err.message);
      console.error("Error removing from cart:", err);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setError(null);
      if (quantity <= 0) return removeFromCart(itemId);

      if (!userId || userId === "guest") {
        const updatedCart = cart.map(c => c.id === itemId ? { ...c, quantity } : c);
        setCart(updatedCart);
        saveGuestCart(updatedCart);
        return;
      }

      if (userRole !== "USER") throw new Error("Only USER role can use cart");
      if (!token) throw new Error("Authentication required");

      const dto: UpdateCartItemDto = { quantity };
      await cartApi.updateItem(itemId, dto, token);
      await loadCart();
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating quantity:", err);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      if (!userId || userId === "guest") {
        setCart([]);
        localStorage.removeItem("guestCart");
        localStorage.removeItem("guestCartId");
        setCartId(null);
        return;
      }

      if (userRole !== "USER") throw new Error("Only USER role can use cart");
      if (!token || !cartId) return;

      await cartApi.clear(token);
      setCart([]);
    } catch (err: any) {
      setError(err.message);
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cart,
    cartId,
    total,
    itemCount,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: loadCart,
  };
};
