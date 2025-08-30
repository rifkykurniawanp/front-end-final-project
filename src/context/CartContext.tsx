'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { cartsApi } from "@/lib/API/core/carts.api";
import type {
  CartResponse,
  CartItem,
  AddItemToCartDto,
  UpdateCartItemDto,
} from "@/types/cart";
import { useAuthContext } from "./AuthContext";

interface CartContextType {
  cart: CartResponse | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItem: (data: AddItemToCartDto) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateItem: (itemId: number, data: UpdateCartItemDto) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialCart?: CartResponse | null;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, initialCart = null }) => {
  const { token, user } = useAuthContext();

  const [cart, setCart] = useState<CartResponse | null>(initialCart);
  const [items, setItems] = useState<CartItem[]>(initialCart?.items || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapCart = (data: CartResponse): CartResponse => ({
    ...data,
    id: Number(data.id),
    userId: Number(data.userId),
    items: (data.items || []).map(item => ({
      ...item,
      id: Number(item.id),
      cartId: Number(item.cartId),
      itemId: Number(item.itemId),
      quantity: Number(item.quantity),
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
  });

  // ===== Memoized refreshCart =====
  const refreshCart = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const data = await cartsApi.findAll(1, 10, token);
      const myCart = data[0] || null;
      const safeCart = myCart ? mapCart(myCart) : null;
      setCart(safeCart);
      setItems(safeCart?.items || []);
      setError(null);
    } catch (err: any) {
      console.error("Failed to refresh cart:", err);
      setError(err?.message || "Failed to refresh cart");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const addItem = async (data: AddItemToCartDto) => {
    if (!token || !user) return;
    setLoading(true);
    try {
      let activeCart = cart;

      if (!activeCart) {
        const newCart = await cartsApi.create({ userId: user.id }, token);
        activeCart = mapCart(newCart);
        setCart(activeCart);
      }

      // Ensure addItem uses correct API signature
      const updatedCart = await cartsApi.addItem(data, token);
      const safeCart = mapCart(updatedCart);
      setCart(safeCart);
      setItems(safeCart.items);
      setError(null);
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError(err?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!cart || !token) return;
    setLoading(true);
    try {
      const updatedCart = await cartsApi.removeItem(cart.id, itemId, token);
      const safeCart = mapCart(updatedCart);
      setCart(safeCart);
      setItems(safeCart.items);
      setError(null);
    } catch (err: any) {
      console.error("Failed to remove item:", err);
      setError(err?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: number, data: UpdateCartItemDto) => {
    if (!cart || !token) return;
    setLoading(true);
    try {
      const updatedCart = await cartsApi.updateItem(itemId, data, token);
      const safeCart = mapCart(updatedCart);
      setCart(safeCart);
      setItems(safeCart.items);
      setError(null);
    } catch (err: any) {
      console.error("Failed to update item:", err);
      setError(err?.message || "Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cart || !token) return;
    setLoading(true);
    try {
      const updatedCart = await cartsApi.update(cart.id, { items: [] }, token);
      const safeCart = mapCart(updatedCart);
      setCart(safeCart);
      setItems([]);
      setError(null);
    } catch (err: any) {
      console.error("Failed to clear cart:", err);
      setError(err?.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  // ===== Initial cart load =====
  useEffect(() => {
    if (!initialCart && token && user) {
      refreshCart();
    }
  }, [token, user, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        loading,
        error,
        refreshCart,
        addItem,
        removeItem,
        updateItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within CartProvider");
  return context;
};
