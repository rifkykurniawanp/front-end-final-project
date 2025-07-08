"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Plus, Minus, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  addToCart: (product: Product, quantity: number) => void;
  buyNow: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, buyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCartClick = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-lg flex flex-col">
      <Link href={`/product/${product.slug}`} aria-label={`Lihat detail untuk ${product.name}`}>
        <div className="relative w-full h-48">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover" 
          />
        </div>
      </Link>
      
      <CardHeader>
        <CardTitle className="truncate">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10">{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4 mt-auto pt-4">
        <div className="flex items-center justify-center gap-4 w-full">
          <Button size="sm" variant="outline" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="transition-transform active:scale-90">
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-bold text-lg w-8 text-center" aria-live="polite">{quantity}</span>
          <Button size="sm" variant="outline" onClick={() => setQuantity(q => q + 1)} className="transition-transform active:scale-90">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex w-full gap-2">
          <Button 
            onClick={handleAddToCartClick} 
            disabled={isAdded}
            size="sm" 
            className={cn(
              "flex-1 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95",
              isAdded 
                ? "bg-green-500 hover:bg-green-600"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {isAdded ? (
              <span className="flex items-center"><Check className="w-4 h-4 mr-2" /> Ditambahkan!</span>
            ) : (
              "Tambah Keranjang"
            )}
          </Button>
          <Button 
            onClick={() => buyNow(product, quantity)} 
            size="sm" 
            className="flex-1 transition-transform hover:scale-105 active:scale-95"
          >
            Beli Sekarang
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;