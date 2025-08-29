"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { AddItemToCartDto } from "@/types/cart";

interface ProductGridProps {
  products: Product[];
  addToCart?: (data: AddItemToCartDto) => Promise<void>;
  buyNow?: (product: Product, quantity: number) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, addToCart, buyNow }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Produk tidak tersedia
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id ?? `${product.name}-${Math.random()}`}
          product={product}
          addToCart={addToCart}
          buyNow={buyNow}
        />
      ))}
    </div>
  );
};
