// hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import {
  CartItem,
  Cart,
  AddToCartDto,
  UpdateCartItemDto,
} from '@/types/cart';
import {
  Product
} from '@/types/product';
import {
  Course } from '@/types/course';
import { CartItemType } from '@/types/enum';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://final-project-be-rifkykurniawanp-production.up.railway.app';

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

export const useCart = (userId?: string, token?: string): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ---------- API helper ----------
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  };

  // ---------- Cart initialization ----------
  const getOrCreateCart = async (): Promise<number> => {
    if (!userId || userId === 'guest') {
      const guestCartId = localStorage.getItem('guestCartId');
      if (guestCartId) return parseInt(guestCartId);

      const mockCartId = Date.now();
      localStorage.setItem('guestCartId', mockCartId.toString());
      return mockCartId;
    }

    const response: Cart = await apiCall(`/users/${userId}/cart`);
    return response.id;
  };

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!userId || userId === 'guest') {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          const parsedCart: CartItem[] = JSON.parse(guestCart);
          setCart(parsedCart);
          setCartId(parseInt(localStorage.getItem('guestCartId') || '0'));
        } else {
          setCart([]);
          setCartId(null);
        }
        return;
      }

      if (!token) {
        setCart([]);
        return;
      }

      const cartResponse: Cart = await apiCall(`/users/${userId}/cart`);
      setCartId(cartResponse.id);
      setCart(cartResponse.items || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, token]);

  const saveGuestCart = (cartItems: CartItem[]) => {
    if (!userId || userId === 'guest') {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  };

  // ---------- Mutations ----------
  const addToCart = async (item: Product | Course, type: CartItemType, quantity = 1) => {
    try {
      setError(null);

      if (!userId || userId === 'guest') {
        const existingIndex = cart.findIndex(
          (c) => c.itemId === item.id && c.itemType === type,
        );

        let updatedCart: CartItem[];

        if (existingIndex > -1) {
          updatedCart = cart.map((c, i) =>
            i === existingIndex ? { ...c, quantity: c.quantity + quantity } : c,
          );
        } else {
          const newCartItem: CartItem = {
            id: Date.now(),
            cartId: cartId || Date.now(),
            itemType: type,
            itemId: item.id,
            quantity,
            price: item.price,
            product: type === CartItemType.PRODUCT ? (item as Product) : null,
            course: type === CartItemType.COURSE ? (item as Course) : null,
          };
          updatedCart = [...cart, newCartItem];
        }

        setCart(updatedCart);
        saveGuestCart(updatedCart);
        return;
      }

      if (!token) throw new Error('Authentication required');
      const currentCartId = cartId || (await getOrCreateCart());

      const dto: AddToCartDto = {
        itemType: type,
        itemId: item.id,
        quantity,
      };

      await apiCall(`/cart/${currentCartId}/items`, {
        method: 'POST',
        body: JSON.stringify(dto),
      });

      await loadCart();
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setError(null);

      if (!userId || userId === 'guest') {
        const updatedCart = cart.filter((c) => c.id !== itemId);
        setCart(updatedCart);
        saveGuestCart(updatedCart);
        return;
      }

      if (!token) throw new Error('Authentication required');
      await apiCall(`/cart/items/${itemId}`, { method: 'DELETE' });
      await loadCart();
    } catch (err: any) {
      setError(err.message);
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setError(null);
      if (quantity <= 0) return removeFromCart(itemId);

      if (!userId || userId === 'guest') {
        const updatedCart = cart.map((c) =>
          c.id === itemId ? { ...c, quantity } : c,
        );
        setCart(updatedCart);
        saveGuestCart(updatedCart);
        return;
      }

      if (!token) throw new Error('Authentication required');
      const dto: UpdateCartItemDto = { quantity };

      await apiCall(`/cart/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(dto),
      });

      await loadCart();
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating quantity:', err);
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      if (!userId || userId === 'guest') {
        setCart([]);
        localStorage.removeItem('guestCart');
        localStorage.removeItem('guestCartId');
        setCartId(null);
        return;
      }

      if (!token || !cartId) {
        setCart([]);
        return;
      }

      await apiCall(`/cart/${cartId}/clear`, { method: 'DELETE' });
      setCart([]);
    } catch (err: any) {
      setError(err.message);
      console.error('Error clearing cart:', err);
    }
  };

  const refreshCart = loadCart;

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
    refreshCart,
  };
};
