"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { productsApi } from "@/fetch-API/API/products.api";
import { coursesApi } from "@/fetch-API/API/courses.api";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/fetch-API/utils";
import { CartItemType } from "@/types/enum";

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isLoading,
    error,
  } = useCart();

  const [enrichedCart, setEnrichedCart] = useState(cart);

  useEffect(() => {
    const enrichItems = async () => {
      const updated = await Promise.all(
        cart.map(async (item) => {
          // Jika sudah ada product/course, tidak perlu fetch lagi
          if (item.product || item.course) return item;

          if (item.itemType === CartItemType.PRODUCT) {
            try {
              const product = await productsApi.getById(item.itemId);
              return { ...item, product };
            } catch (err) {
              console.error("Failed to fetch product", item.itemId, err);
              return item;
            }
          }

          if (item.itemType === CartItemType.COURSE) {
            try {
              const course = await coursesApi.getById(item.itemId);
              return { ...item, course };
            } catch (err) {
              console.error("Failed to fetch course", item.itemId, err);
              return item;
            }
          }

          return item;
        })
      );

      setEnrichedCart(updated);
    };

    enrichItems();
  }, [cart]);

  if (isLoading) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">Error: {error}</p>;
  }

  if (!cart || cart.length === 0) {
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

      {enrichedCart.map((item) => {
        const name = item.product?.name || item.course?.title || "Unknown Item";
        const description = item.product?.description || item.course?.description || "";
        const image = item.product?.image || item.course?.duration || "";
        const price = item.product?.price || item.course?.price || 0;

        const link = item.product
          ? `/product/${item.product.slug}`
          : item.course
          ? `/course/${item.course.slug}`
          : "#";

        return (
          <Card key={item.id} className="flex items-start gap-4">
            {image && (
              <Image
                src={image}
                alt={name}
                width={120}
                height={120}
                className="rounded-md object-cover"
              />
            )}
            <CardContent className="flex-1 p-4 space-y-2">
              <Link href={link} legacyBehavior>
                <a className="hover:underline">
                  <h2 className="text-lg font-semibold">{name}</h2>
                </a>
              </Link>
              <p className="text-sm text-gray-600">{description}</p>
              <p className="text-primary font-bold">{formatCurrency(price)}</p>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  variant="outline"
                  size="sm"
                >
                  -
                </Button>
                <span className="px-2">{item.quantity}</span>
                <Button
                  onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                  variant="outline"
                  size="sm"
                >
                  +
                </Button>
                <Button
                  onClick={() => removeFromCart(item.itemId)}
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
