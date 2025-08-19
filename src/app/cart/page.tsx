"use client";

import React from "react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CartItemType } from "@/types/enum";

interface CartPageProps {
  userId?: string;
  token?: string;
  userRole?: string;
}

const CartPage: React.FC<CartPageProps> = ({ userId, token, userRole }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isLoading,
    error,
  } = useCart(userId, token, userRole);

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Keranjang Anda Kosong</h1>
        <Link href="/products">
          <Button variant="outline">Kembali ke Produk</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Keranjang Belanja</h1>

      {cart.map((item) => {
        const productOrCourse = item.itemType === CartItemType.PRODUCT ? item.product : item.course;
        if (!productOrCourse) return null;

        return (
          <Card key={item.id} className="flex items-start gap-4">
            <CardContent className="flex-1 p-4 space-y-2">
              <Link
                href={
                  item.itemType === CartItemType.PRODUCT
                    ? `/product/${productOrCourse.slug}`
                    : `/course/${productOrCourse.slug}`
                }
                legacyBehavior
              >
              </Link>
              {productOrCourse.description && (
                <p className="text-sm text-gray-600">{productOrCourse.description}</p>
              )}
              <p className="text-primary font-bold">
                {formatCurrency(productOrCourse.price)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  variant="outline"
                  size="sm"
                >
                  -
                </Button>
                <span className="px-2">{item.quantity}</span>
                <Button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  variant="outline"
                  size="sm"
                >
                  +
                </Button>
                <Button
                  onClick={() => removeFromCart(item.id)}
                  variant="destructive"
                  size="sm"
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="text-right space-y-2">
        <p className="text-lg">
          <strong>Total Item:</strong> {itemCount}
        </p>
        <p className="text-xl font-bold text-primary">
          Total: {formatCurrency(total)}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={clearCart}>
            Hapus Semua
          </Button>
          <Link href="/checkout">
            <Button>Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
