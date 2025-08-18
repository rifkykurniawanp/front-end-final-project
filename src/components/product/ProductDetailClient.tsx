"use client"; 

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/fetch-API/utils';
import { cn } from '@/fetch-API/utils';
import { Minus, Plus, Check, ArrowLeft, Star } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCartClick = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNowClick = () => {
    router.push(`/checkout?productId=${product.id}&quantity=${quantity}`);
  };


  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
       <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke semua produk
       </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="capitalize">{product.category}</Badge>
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews} ulasan)</span>
          </div>
          <p className="text-2xl lg:text-3xl font-semibold text-primary mt-4">{formatCurrency(product.price)}</p>
          <Separator className="my-6" />
          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          <div className="mt-4 text-sm space-y-2">
            {product.origin && <p><span className="font-semibold text-foreground">Asal:</span> {product.origin}</p>}
            {product.roastLevel && <p><span className="font-semibold text-foreground">Tingkat Sangrai:</span> <span className="capitalize">{product.roastLevel}</span></p>}
            {product.caffeine && <p><span className="font-semibold text-foreground">Kafein:</span> <span className="capitalize">{product.caffeine}</span></p>}
            <p><span className="font-semibold text-foreground">Stok:</span> {product.stock > 0 ? `${product.stock} item` : 'Habis'}</p>
          </div>
          <div className="mt-auto pt-8">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-sm font-medium">Kuantitas:</h3>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-bold text-lg w-10 text-center">{quantity}</span>
                <Button size="icon" variant="outline" onClick={() => setQuantity(q => q + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleAddToCartClick}
                disabled={isAdded || product.stock === 0}
                size="lg"
                variant="secondary"
                className={cn("transition-all duration-300", isAdded && "bg-green-500 hover:bg-green-600 text-white")}
              >
                {product.stock === 0 ? "Stok Habis" : isAdded ? "Ditambahkan" : "Add to Cart"}
              </Button>
              <Button onClick={handleBuyNowClick} size="lg" disabled={product.stock === 0}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};