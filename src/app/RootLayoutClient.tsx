// RootLayoutClient.tsx - Updated for alternative solution
"use client";

import { useEffect, useState, ReactNode } from "react";
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
  const [initialCart, setInitialCart] = useState<CartWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      fetchUserCart(token);
    } else {
      fetchGuestCart();
    }
  }, [token, user]);

  const fetchUserCart = async (token: string) => {
    try {
      const carts = await cartApi.getMyCart(token);
      setInitialCart(carts[0] || null);
    } catch (err) {
      console.error("Fetch user cart error:", err);
      setInitialCart(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestCart = async () => {
    try {
      const guestCart = localStorage.getItem("guestCart");
      setInitialCart(guestCart ? JSON.parse(guestCart) : null);
    } catch (err) {
      console.error("Fetch guest cart error:", err);
      setInitialCart(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartProvider initialCart={initialCart}>
      {loading ? (
        <div className="p-8 text-center">Loading layout...</div>
      ) : (
        <>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </>
      )}
    </CartProvider>
  );
}