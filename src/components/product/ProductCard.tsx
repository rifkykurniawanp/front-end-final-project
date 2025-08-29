"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CartItemType } from "@/types/enum";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { useCartContext } from "@/context/CartContext";
import { AddItemToCartDto } from "@/types/cart";

interface ProductCardProps {
  product: Product;
  addToCart?: (data: AddItemToCartDto) => Promise<void>;
  buyNow?: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  addToCart,
  buyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { cart } = useCartContext();

  const hasValidImage = !!product.image?.trim();

  const handleAddToCart = async () => {
    if (!addToCart) return;
    const payload: AddItemToCartDto = {
      itemId: product.id,
      itemType: CartItemType.PRODUCT,
      quantity,
      price: product.price,
    };
    await addToCart(payload);
  };

  const handleBuyNow = () => {
    if (!buyNow) return;
    buyNow(product, quantity);
  };

  return (
    <Card className="overflow-hidden shadow-sm border border-amber-100 hover:shadow-md transition-shadow flex flex-col bg-white">
      <Link
        href={`/product/${product.slug}`}
        aria-label={`Lihat detail untuk ${product.name}`}
      >
        <div className="relative w-full h-48 bg-amber-50">
          {hasValidImage ? (
            <Image
              src={product.image!}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-amber-100">
              <div className="text-amber-400 text-4xl">📦</div>
            </div>
          )}
        </div>
      </Link>

      <CardHeader>
        <CardTitle className="truncate text-amber-700">
          <Link
            href={`/product/${product.slug}`}
            className="hover:underline text-amber-700"
          >
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10 text-muted-foreground">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-2xl font-semibold text-amber-600">
          {formatCurrency(product.price)}
        </p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 mt-auto pt-4">
        {/* Quantity Controller */}
        <div className="flex items-center justify-center gap-4 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-bold text-lg w-8 text-center">{quantity}</span>
          <Button size="sm" variant="outline" onClick={() => setQuantity((q) => q + 1)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-2">
          {addToCart && (
            <Button className="flex-1" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
          {buyNow && (
            <Button className="flex-1" variant="secondary" onClick={handleBuyNow}>
              Buy Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
