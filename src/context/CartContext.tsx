"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types/cart";
import { CartItemType } from "@/types/enum";
import { Product } from "@/types/product";
import { Course } from "@/types/course";

// --- Context Types ---
interface CartContextType {
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

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider Props ---
interface CartProviderProps {
  children: React.ReactNode;
  userId?: string;
  token?: string;
  userRole?: string;
}

// --- Provider Component ---
export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  userId,
  token,
  userRole,
}) => {
  const {
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
    refreshCart,
  } = useCart(userId, token, userRole);

  // Memoize context value supaya tidak re-render berlebihan
  const value = useMemo<CartContextType>(
    () => ({
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
      refreshCart,
    }),
    [
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
      refreshCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- Hook untuk akses context ---
export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("❌ useCartContext must be used within a CartProvider");
  }
  return context;
};
