"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { cartApi } from "@/lib/API/core/carts.api";
import { useAuthContext } from "@/context/AuthContext";
import type { CartWithItems, AddToCartDto, UpdateCartDto, CartItemType } from "@/types";

interface CartContextValue {
  carts: CartWithItems[];
  loading: boolean;
  error: string | null;
  fetchCarts: () => Promise<void>;
  addItem: (data: AddToCartDto) => Promise<void>;
  removeItem: (cartId: number, cartItemId: number) => Promise<void>;
  updateItemQuantity: (cartId: number, itemId: number, quantity: number, itemType: CartItemType) => Promise<void>;
  updateCart: (cartId: number, data: UpdateCartDto) => Promise<void>;
  clearError: () => void;
  // Helper functions - use backend calculated values
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getActiveCart: () => CartWithItems | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialCart?: CartWithItems | null;
}

export const CartProvider = ({ children, initialCart = null }: CartProviderProps) => {
  const { token } = useAuthContext();
  const [carts, setCarts] = useState<CartWithItems[]>(initialCart ? [initialCart] : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchCarts = useCallback(async () => {
    if (!token) {
      setCarts(initialCart ? [initialCart] : []);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Backend returns array of carts filtered by user
      const fetchedCarts = await cartApi.getMyCart(token);
      setCarts(fetchedCarts);
    } catch (err: any) {
      setError(err.message || "Failed to fetch carts");
    } finally {
      setLoading(false);
    }
  }, [token, initialCart]);

  const addItem = useCallback(async (data: AddToCartDto) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      let targetCart = carts[0];
      
      // Create cart if none exists
      if (!targetCart) {
        targetCart = await cartApi.createCart(token);
        setCarts([targetCart]);
      }

      // Check if item already exists in cart
      const existingItem = targetCart.items.find(
        (i) => i.itemId === data.itemId && i.itemType === data.itemType
      );

      let updatedCart: CartWithItems;

      if (existingItem) {
        // Item exists, update quantity (backend will replace, not add)
        updatedCart = await cartApi.addItem(
          targetCart.id,
          { 
            itemType: data.itemType,
            itemId: data.itemId,
            quantity: existingItem.quantity + data.quantity 
          },
          token
        );
      } else {
        // Add new item
        updatedCart = await cartApi.addItem(targetCart.id, data, token);
      }

      setCarts((prev) =>
        prev.map((c) => (c.id === updatedCart.id ? updatedCart : c))
      );
    } catch (err: any) {
      setError(err.message || "Failed to add item to cart");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [carts, token]);

  const removeItem = useCallback(async (cartId: number, cartItemId: number) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      // Backend expects CartItem.id, not itemId
      await cartApi.removeItem(cartId, cartItemId, token);
      
      // Update local state
      setCarts((prev) =>
        prev.map((c) =>
          c.id === cartId 
            ? { 
                ...c, 
                items: c.items.filter((i) => i.id !== cartItemId),
                // Recalculate totals locally (or refetch)
                totalItems: c.items.filter((i) => i.id !== cartItemId)
                  .reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: c.items.filter((i) => i.id !== cartItemId)
                  .reduce((sum, item) => sum + (item.price * item.quantity), 0)
              } 
            : c
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to remove item");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateItemQuantity = useCallback(
    async (cartId: number, itemId: number, quantity: number, itemType: CartItemType) => {
      if (!token || quantity < 1) return;

      setLoading(true);
      setError(null);
      try {
        // Since backend doesn't have update endpoint, use addItem with exact quantity
        // This will replace the existing item with new quantity
        const updatedCart = await cartApi.updateItemQuantity(
          cartId, 
          { itemId, itemType, quantity }, 
          token
        );
        
        setCarts((prev) =>
          prev.map((c) => (c.id === updatedCart.id ? updatedCart : c))
        );
      } catch (err: any) {
        setError(err.message || "Failed to update item quantity");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateCart = useCallback(async (cartId: number, data: UpdateCartDto) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartApi.updateCart(cartId, data, token);
      setCarts((prev) =>
        prev.map((c) => (c.id === cartId ? updatedCart : c))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update cart");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Helper functions - use backend calculated values when available
  const getTotalItems = useCallback(() => {
    return carts.reduce((total, cart) => total + (cart.totalItems || 0), 0);
  }, [carts]);

  const getTotalAmount = useCallback(() => {
    return carts.reduce((total, cart) => total + (cart.totalAmount || 0), 0);
  }, [carts]);

  const getActiveCart = useCallback(() => {
    return carts[0] || null;
  }, [carts]);

  useEffect(() => {
    if (token) {
      fetchCarts();
    } else {
      setCarts(initialCart ? [initialCart] : []);
    }
  }, [token, fetchCarts, initialCart]);

  return (
    <CartContext.Provider
      value={{ 
        carts, 
        loading, 
        error, 
        fetchCarts, 
        addItem, 
        removeItem, 
        updateItemQuantity, 
        updateCart,
        clearError,
        getTotalItems,
        getTotalAmount,
        getActiveCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within CartProvider");
  return context;
};