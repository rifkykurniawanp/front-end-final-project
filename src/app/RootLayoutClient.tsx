"use client";
import { ReactNode, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "@/components/layout/header/Index"; // Changed to default import
import Footer from "@/components/layout/footer/index";
import { CartProvider } from "@/context/CartContext";
import { cartsApi } from "@/lib/API/core/carts.api";
import type { CartResponse } from "@/types/cart";
import { useAuthContext } from "@/context/AuthContext";

interface RootLayoutClientProps {
  children: ReactNode;
}

// -------------------- CartInitializer --------------------
const CartInitializer = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [initialCart, setInitialCart] = useState<CartResponse | null>(null);

  const mapCartData = (cartData: any): CartResponse => ({
    ...cartData,
    id: Number(cartData.id),
    userId: Number(cartData.userId),
    totalItems: Number(cartData.totalItems || 0),
    totalAmount: Number(cartData.totalAmount || 0),
    items: (cartData.items || []).map((item: any) => ({
      ...item,
      id: Number(item.id),
      cartId: Number(item.cartId),
      itemId: Number(item.itemId),
      quantity: Number(item.quantity),
      price: Number(item.price),
      subtotal: Number(item.subtotal || item.price * item.quantity),
    })),
  });

  const getGuestCart = (): CartResponse | null => {
    if (typeof window === "undefined") return null;
    try {
      const guestCart = localStorage.getItem("guestCart");
      if (!guestCart) return null;
      return mapCartData(JSON.parse(guestCart));
    } catch (err) {
      console.error("Failed to parse guest cart:", err);
      localStorage.removeItem("guestCart");
      return null;
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      setLoading(true);
      try {
        if (token && user) {
          const carts = await cartsApi.findAll(1, 10, token);
          const myCart = carts?.[0] || null;
          setInitialCart(myCart ? mapCartData(myCart) : null);
        } else {
          const guestCart = getGuestCart();
          setInitialCart(guestCart);
        }
      } catch (err) {
        console.error("Failed to initialize cart:", err);
        setInitialCart(null);
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, [token, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// -------------------- RootLayoutClient --------------------
export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) return false;
              return failureCount < 2;
            },
          },
          mutations: { retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <CartInitializer>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartInitializer>
      </CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}