"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { cartApi } from "@/lib/API/core/carts.api";
import { useAuthContext } from "@/context/AuthContext";
import type {
  CartWithItems,
  AddToCartDto,
  UpdateCartDto,
  CartItemType,
} from "@/types";

interface CartContextValue {
  cart: CartWithItems | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (data: AddToCartDto) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateCart: (data: UpdateCartDto) => Promise<void>;
  updateItemQuantity: (
    itemId: number,
    quantity: number,
    itemType: CartItemType
  ) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialCart?: CartWithItems | null;
}

export const CartProvider = ({
  children,
  initialCart = null,
}: CartProviderProps) => {
  const { token } = useAuthContext();
  
  const [cart, setCart] = useState<CartWithItems | null>(initialCart);
  const [loading, setLoading] = useState(initialCart === undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const carts = await cartApi.getMyCart(token);
      setCart(carts[0] || null);
    } catch (err: any) {
      console.error("Fetch cart error:", err);
      setError(err.message || "Failed to fetch cart");
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addItem = useCallback(
    async (data: AddToCartDto) => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        let currentCart = cart ?? (await cartApi.getMyCart(token).then(c => c[0] ?? cartApi.createCart(token)));

        if (!currentCart) return;

        // ✅ Cek item sudah ada
        const existingItem = currentCart.items.find(
          (i) => i.itemId === data.itemId && i.itemType === data.itemType
        );

        if (existingItem) {
          // update quantity jika sudah ada
          const updatedCart = await cartApi.addItem(currentCart.id, {
            ...data,
            quantity: existingItem.quantity + data.quantity,
          }, token);
          setCart(updatedCart);
        } else {
          const updatedCart = await cartApi.addItem(currentCart.id, data, token);
          setCart(updatedCart);
        }
      } catch (err: any) {
        console.error("Add item error:", err);
        setError(err.message || "Failed to add item to cart");
      } finally {
        setLoading(false);
      }
    },
    [cart, token]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      if (!cart || !token) return;
      setLoading(true);
      try {
        await cartApi.removeItem(cart.id, itemId, token);
        setCart({
          ...cart,
          items: cart.items.filter((item) => item.id !== itemId),
        });
      } catch (err: any) {
        console.error("Remove item error:", err);
        setError(err.message || "Failed to remove item from cart");
      } finally {
        setLoading(false);
      }
    },
    [cart, token]
  );

  const updateCart = useCallback(
    async (data: UpdateCartDto) => {
      if (!cart || !token) return;
      setLoading(true);
      try {
        const updatedCart = await cartApi.updateCart(cart.id, data, token);
        setCart(updatedCart);
      } catch (err: any) {
        console.error("Update cart error:", err);
        setError(err.message || "Failed to update cart");
      } finally {
        setLoading(false);
      }
    },
    [cart, token]
  );

  const updateItemQuantity = useCallback(
    async (itemId: number, quantity: number, itemType: CartItemType) => {
      if (!cart || !token) return;
      if (quantity < 1) return;

      setLoading(true);
      setError(null);
      try {
        const cartItem = cart.items.find(i => i.itemId === itemId && i.itemType === itemType);
        if (!cartItem) throw new Error("CartItem not found");

        // ✅ langsung update quantity tanpa remove
        const updatedCart = await cartApi.addItem(cart.id, {
          itemId,
          itemType,
          quantity,
        }, token);

        setCart(updatedCart);
      } catch (err: any) {
        console.error("Update item quantity error:", err);
        setError(err.message || "Failed to update item quantity");
      } finally {
        setLoading(false);
      }
    },
    [cart, token]
  );

  useEffect(() => {
    if (token && !cart) fetchCart();
    else if (!token) {
      setCart(null);
      setLoading(false);
    }
  }, [token, cart, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addItem,
        removeItem,
        updateCart,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCartContext must be used within a CartProvider");
  return context;
};
