"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CartItemType } from "@/types/enum";
import { cartApi } from "@/lib/API/core/carts.api";

interface CartPageProps {
  userId?: string;
  token?: string;
  userRole?: string;
}

const CartPage: React.FC<CartPageProps> = ({ userId, token, userRole }) => {
  const {
    cart,
    cartId,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isLoading,
    error,
    refreshCart,
  } = useCart(userId, token, userRole);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!cartId || !token) return;
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      await cartApi.checkout(cartId, token);
      await refreshCart();
      alert("Checkout berhasil!");
    } catch (err: any) {
      console.error("Checkout error:", err);
      setCheckoutError(err.message || "Terjadi kesalahan saat checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading keranjang...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (cart.length === 0)
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Keranjang Anda Kosong</h1>
        <Link href="/products">
          <Button variant="outline">Kembali ke Produk</Button>
        </Link>
      </div>
    );

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Keranjang Belanja</h1>

      {cart.map((item) => {
        if (item.itemType === CartItemType.PRODUCT && item.product) {
          const product = item.product;
          return (
            <Card key={item.id} className="flex items-start gap-4">
              {product.image && (
                <div className="w-24 h-24 relative">
                  <Image src={product.image} alt={product.name} fill className="object-cover rounded" />
                </div>
              )}
              <CardContent className="flex-1 p-4 space-y-2">
                <Link href={`/product/${product.slug}`} className="text-lg font-semibold hover:underline">
                  {product.name}
                </Link>
                {product.description && <p className="text-sm text-gray-600">{product.description}</p>}
                <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} variant="outline" size="sm">
                    -
                  </Button>
                  <span className="px-2">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} variant="outline" size="sm">
                    +
                  </Button>
                  <Button onClick={() => removeFromCart(item.id)} variant="destructive" size="sm">
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }

        if (item.itemType === CartItemType.COURSE && item.course) {
          const course = item.course;
          return (
            <Card key={item.id} className="flex items-start gap-4">
              <CardContent className="flex-1 p-4 space-y-2">
                <Link href={`/course/${course.slug}`} className="text-lg font-semibold hover:underline">
                  {course.title}
                </Link>
                {course.description && <p className="text-sm text-gray-600">{course.description}</p>}
                <p className="text-primary font-bold">{formatCurrency(course.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} variant="outline" size="sm">
                    -
                  </Button>
                  <span className="px-2">{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} variant="outline" size="sm">
                    +
                  </Button>
                  <Button onClick={() => removeFromCart(item.id)} variant="destructive" size="sm">
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }

        return null;
      })}

      <div className="text-right space-y-2">
        <p className="text-lg">
          <strong>Total Item:</strong> {itemCount}
        </p>
        <p className="text-xl font-bold text-primary">Total: {formatCurrency(total)}</p>

        {checkoutError && <p className="text-red-600">{checkoutError}</p>}

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={clearCart}>
            Hapus Semua
          </Button>
          <Button onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? "Memproses..." : "Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
