"use client";

import React from "react";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartContext } from "@/context/CartContext";

const CartPage: React.FC = () => {
  const { cart, loading, removeItem } = useCartContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-orange-600">
        <p className="text-xl font-semibold animate-pulse">Loading keranjang...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-orange-600">
        <h1 className="text-3xl font-bold mb-4">Keranjang Anda Kosong</h1>
        <a
          href="/products"
          className="text-lg underline hover:text-orange-700 transition"
        >
          Kembali ke Produk
        </a>
      </div>
    );
  }

  const handleCheckout = async () => {
    window.location.href = `/checkout?cartId=${cart.id}`;
  };

  const handleClearCart = async () => {
    for (const item of cart.items) {
      await removeItem(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-8">
      <h1 className="text-4xl font-extrabold text-orange-800 mb-8 text-center md:text-left">
        Keranjang Belanja
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="bg-orange-100 rounded-2xl shadow-lg p-6 sticky top-8">
          <CartSummary onCheckout={handleCheckout} onClearCart={handleClearCart} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
