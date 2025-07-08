"use client";

import React from "react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
  } = useCart();

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
      {cart.map(({ product, quantity }) => (
        <Card key={product.id} className="flex items-start gap-4">
          <Image
            src={product.image}
            alt={product.name}
            width={120}
            height={120}
            className="rounded-md object-cover"
          />
          <CardContent className="flex-1 p-4 space-y-2">
            <Link href={`/product/${product.slug}`} legacyBehavior>
              <a className="hover:underline">
                <h2 className="text-lg font-semibold">{product.name}</h2>
              </a>
            </Link>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                disabled={quantity <= 1}
                variant="outline"
                size="sm"
              >
                -
              </Button>
              <span className="px-2">{quantity}</span>
              <Button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                variant="outline"
                size="sm"
              >
                +
              </Button>
              <Button
                onClick={() => removeFromCart(product.id)}
                variant="destructive"
                size="sm"
              >
                Hapus
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

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
