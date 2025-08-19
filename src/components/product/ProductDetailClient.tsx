"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/types/product"; // pakai ini
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, cn } from "@/lib/utils";
import { Minus, Plus, Check, ArrowLeft, Star } from "lucide-react";

interface ProductDetailClientProps {
  product: ProductWithRelations;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCartClick = () => {
    addToCart({
      itemType: "PRODUCT", // ✅ sesuai enum CartItemType
      itemId: product.id,
      quantity,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNowClick = () => {
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };

  const safeImage = product.image || "/placeholder.png";
  const safeTags = product.tags ?? [];

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke semua produk
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={safeImage}
            alt={product.name ?? "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            {product.category && (
              <Badge variant="outline" className="capitalize">
                {product.category}
              </Badge>
            )}
            {safeTags.length > 0 ? (
              safeTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary">General</Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.rating ?? 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount ?? 0} ulasan)
            </span>
          </div>

          {/* Price */}
          <p className="text-2xl lg:text-3xl font-semibold text-primary mt-4">
            {formatCurrency(product.price ?? 0)}
          </p>

          <Separator className="my-6" />

          {/* Description */}
          {product.description && (
            <p className="text-foreground/80 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Extra Info */}
          <div className="mt-4 text-sm space-y-2">
            {product.origin && (
              <p>
                <span className="font-semibold text-foreground">Asal:</span>{" "}
                {product.origin}
              </p>
            )}
            {product.weight && (
              <p>
                <span className="font-semibold text-foreground">Berat:</span>{" "}
                {product.weight}
              </p>
            )}
            <p>
              <span className="font-semibold text-foreground">Stok:</span>{" "}
              {product.stock && product.stock > 0
                ? `${product.stock} item`
                : "Habis"}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-8">
            {/* Quantity Control */}
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-sm font-medium">Kuantitas:</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-bold text-lg w-10 text-center">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleAddToCartClick}
                disabled={isAdded || product.stock === 0}
                size="lg"
                variant="secondary"
                className={cn(
                  "transition-all duration-300",
                  isAdded && "bg-green-500 hover:bg-green-600 text-white"
                )}
              >
                {product.stock === 0
                  ? "Stok Habis"
                  : isAdded
                  ? "Ditambahkan"
                  : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNowClick}
                size="lg"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
