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
  addToCart: (
    item: Product | Course,
    type: CartItemType,
    quantity?: number
  ) => Promise<void>;
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

  const isGuest = !userId || userId === "guest";
  const isUserRole = userRole === "USER";

  // ---------- Helpers ----------
  const saveGuestCart = (items: CartItem[], currentCartId?: number | null) => {
    if (isGuest) {
      localStorage.setItem("guestCart", JSON.stringify(items));
      if (!currentCartId) {
        const newId = Date.now();
        localStorage.setItem("guestCartId", newId.toString());
        setCartId(newId);
      }
    }
  };

  // ---------- Cart Initialization ----------
  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isUserRole) {
        setCart([]);
        setCartId(null);
        return;
      }

      if (isGuest) {
        const guestCart = localStorage.getItem("guestCart");
        const guestCartId = localStorage.getItem("guestCartId");
        setCart(guestCart ? JSON.parse(guestCart) : []);
        setCartId(guestCartId ? parseInt(guestCartId) : null);
        return;
      }

      if (!token) {
        setCart([]);
        return;
      }

      const response: CartWithItems = await cartApi.getMyCart(token);
      setCartId(response.id);
      setCart(response.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load cart");
      console.error("Error loading cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isGuest, isUserRole, token]);

  // ---------- Mutations ----------
  const addToCart = async (
    item: Product | Course,
    type: CartItemType,
    quantity = 1
  ) => {
    try {
      setError(null);

      if (isGuest) {
        const existingIndex = cart.findIndex(
          (c) => c.itemId === item.id && c.itemType === type
        );

        let updatedCart: CartItem[];
        if (existingIndex > -1) {
          updatedCart = cart.map((c, i) =>
            i === existingIndex
              ? { ...c, quantity: c.quantity + quantity }
              : c
          );
        } else {
          updatedCart = [
            ...cart,
            {
              id: Date.now(),
              cartId: cartId || Date.now(),
              itemType: type,
              itemId: item.id,
              quantity,
              price: item.price,
              product: type === CartItemType.PRODUCT ? (item as Product) : null,
              course: type === CartItemType.COURSE ? (item as Course) : null,
            },
          ];
        }

        setCart(updatedCart);
        saveGuestCart(updatedCart, cartId);
        return;
      }

      if (!isUserRole) throw new Error("Only USER role can use cart");
      if (!token) throw new Error("Authentication required");
      if (!cartId) throw new Error("Cart ID not available");

      const dto: AddToCartDto = { itemType: type, itemId: item.id, quantity };
      await cartApi.addItem(cartId, dto, token);
      await loadCart();
    } catch (err: any) {
      setError(err.message || "Failed to add item");
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setError(null);

      if (isGuest) {
        const updatedCart = cart.filter((c) => c.id !== itemId);
        setCart(updatedCart);
        saveGuestCart(updatedCart, cartId);
        return;
      }

      if (!isUserRole) throw new Error("Only USER role can use cart");
      if (!token) throw new Error("Authentication required");
      if (!cartId) throw new Error("Cart ID not available");

      await cartApi.removeItem(cartId, itemId, token);
      await loadCart();
    } catch (err: any) {
      setError(err.message || "Failed to remove item");
      console.error("Error removing from cart:", err);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setError(null);
      if (quantity <= 0) return removeFromCart(itemId);

      if (isGuest) {
        const updatedCart = cart.map((c) =>
          c.id === itemId ? { ...c, quantity } : c
        );
        setCart(updatedCart);
        saveGuestCart(updatedCart, cartId);
        return;
      }

      if (!isUserRole) throw new Error("Only USER role can use cart");
      if (!token) throw new Error("Authentication required");
      if (!cartId) throw new Error("Cart ID not available");

      const dto: UpdateCartItemDto = { quantity };
      await cartApi.updateItem(cartId, itemId, dto, token);
      await loadCart();
    } catch (err: any) {
      setError(err.message || "Failed to update quantity");
      console.error("Error updating quantity:", err);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      if (isGuest) {
        setCart([]);
        localStorage.removeItem("guestCart");
        localStorage.removeItem("guestCartId");
        setCartId(null);
        return;
      }

      if (!isUserRole) throw new Error("Only USER role can use cart");
      if (!token || !cartId) return;

      // Clear cart by removing all items individually
      for (const item of cart) {
        await cartApi.removeItem(cartId, item.id, token);
      }
      await loadCart();
    } catch (err: any) {
      setError(err.message || "Failed to clear cart");
      console.error("Error clearing cart:", err);
    }
  };

  // ---------- Lifecycle ----------
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
