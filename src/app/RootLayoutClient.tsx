"use client";

import { useEffect, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Header from "@/components/layout/header/Index";
import Footer from "@/components/layout/footer/index";
import { CartProvider } from "@/context/CartContext";
import { cartApi } from "@/lib/API/core/carts.api";
import type { CartWithItems } from "@/types/cart";
import { useAuthContext } from "@/context/AuthContext";

interface RootLayoutClientProps { 
  children: ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { token, user } = useAuthContext();

  // QueryClient disimpan di state biar persistent
  const [queryClient] = useState(() => new QueryClient());
  const [initialCart, setInitialCart] = useState<CartWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (token && user) {
          const carts = await cartApi.getMyCart(token);
          setInitialCart(carts[0] || null);
        } else {
          const guestCart = localStorage.getItem("guestCart");
          setInitialCart(guestCart ? JSON.parse(guestCart) : null);
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
        setInitialCart(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider initialCart={initialCart}>
        {loading ? (
          <div className="p-8 text-center font-body">Loading layout...</div>
        ) : (
          <>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </>
        )}
      </CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
