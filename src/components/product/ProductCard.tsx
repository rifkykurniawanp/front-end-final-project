"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Check } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useCartContext } from "@/context/CartContext"; // ✅ pakai context
import { usePayment } from "@/hooks/usePayment";
import { CartItemType, PaymentStatus, PayableType } from "@/types/enum";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const { addToCart, cart, cartId, refreshCart } = useCartContext(); // ✅ context global
  const { createPayment } = usePayment(localStorage.getItem("token") || "");

  const handleAddToCartClick = async () => {
    try {
      await addToCart(product, CartItemType.PRODUCT, quantity);
      await refreshCart(); // ✅ sinkronisasi
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    } catch (err) {
      console.error("Gagal tambah ke cart:", err);
    }
  };

  const handleBuyNowClick = async () => {
    try {
      if (isBuying) return;
      setIsBuying(true);

      await addToCart(product, CartItemType.PRODUCT, quantity);
      await refreshCart();

      if (!cartId) throw new Error("Cart ID tidak tersedia");

      const cartItems = cart.filter((c) => c.itemId === product.id && c.itemType === CartItemType.PRODUCT);
      const totalAmount = cartItems.reduce((sum, c) => sum + c.price * c.quantity, 0);

      const payment = await createPayment({
        cartId,
        amount: totalAmount,
        status: PaymentStatus.PENDING,
        paymentMethod: "online",
        payableType: PayableType.PRODUCT,
        payableId: cartId,
      });

      if (payment?.id) window.location.href = `/payment/${payment.id}`;
    } catch (err) {
      console.error("Gagal beli sekarang:", err);
    } finally {
      setIsBuying(false);
    }
  };

  const hasValidImage = product.image && product.image.trim() !== "";

  return (
    <Card className="overflow-hidden shadow-sm border border-amber-100 hover:shadow-md transition-shadow flex flex-col bg-white">
      <Link href={`/product/${product.slug}`} aria-label={`Lihat detail untuk ${product.name}`}>
        <div className="relative w-full h-48 bg-amber-50">
          {hasValidImage ? (
            <Image src={product.image!} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-amber-100">
              <div className="text-amber-400 text-4xl">📦</div>
            </div>
          )}
        </div>
      </Link>

      <CardHeader>
        <CardTitle className="truncate text-amber-700">
          <Link href={`/product/${product.slug}`} className="hover:underline text-amber-700">
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10 text-muted-foreground">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-2xl font-semibold text-amber-600">{formatCurrency(product.price)}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 mt-auto pt-4">
        <div className="flex items-center justify-center gap-4 w-full">
          <Button size="sm" variant="outline" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-bold text-lg w-8 text-center">{quantity}</span>
          <Button size="sm" variant="outline" onClick={() => setQuantity((q) => q + 1)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex w-full gap-2">
          <Button
            onClick={handleAddToCartClick}
            disabled={isAdded}
            size="sm"
            className={cn(
              "flex-1 transition-all",
              isAdded ? "bg-green-500 text-white" : "border border-amber-600 text-amber-700 bg-white"
            )}
          >
            {isAdded ? (
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-2" /> Ditambahkan!
              </span>
            ) : (
              "Tambah Keranjang"
            )}
          </Button>
          <Button onClick={handleBuyNowClick} size="sm" disabled={isBuying} className="flex-1 bg-amber-600 text-white">
            {isBuying ? "Memproses..." : "Beli Sekarang"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
