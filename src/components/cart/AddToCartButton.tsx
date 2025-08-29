"use client";

import React, { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';
import { CartItemType } from '@/types/enum';
import { Plus, Minus, Loader2, ShoppingBag } from 'lucide-react';

interface AddToCartProps {
  itemType: CartItemType;
  itemId: number;
  price: number;
  itemName: string;
  stock?: number;
  maxQuantity?: number;
  disabled?: boolean;
  className?: string;
}

export const AddToCart: React.FC<AddToCartProps> = ({
  itemType,
  itemId,
  price,
  itemName,
  stock,
  maxQuantity,
  disabled = false,
  className = ""
}) => {
  const { addItem, loading } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [animateQty, setAnimateQty] = useState(false);

  const maxAllowed = maxQuantity || stock || 99;
  const isOutOfStock = stock !== undefined && stock <= 0;
  const isDisabled = disabled || isOutOfStock || loading;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem({ itemType, itemId, quantity, price });
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxAllowed) {
      setQuantity(prev => prev + 1);
      setAnimateQty(true);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      setAnimateQty(true);
    }
  };

  useEffect(() => {
    if (animateQty) {
      const timeout = setTimeout(() => setAnimateQty(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [animateQty]);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-[color:var(--foreground)]">Quantity:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isDisabled}
            className="w-8 h-8 flex items-center justify-center border rounded-full 
                       border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-[color:var(--secondary)]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className={`w-12 text-center font-bold text-lg text-[color:var(--foreground)]
                           transition-transform ${animateQty ? 'scale-110' : 'scale-100'}`}>
            {quantity}
          </span>

          <button
            onClick={incrementQuantity}
            disabled={quantity >= maxAllowed || isDisabled}
            className="w-8 h-8 flex items-center justify-center border rounded-full 
                       border-[color:var(--border)] text-[color:var(--foreground)] hover:bg-[color:var(--secondary)]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stock Info */}
      {stock !== undefined && (
        <div className={`text-sm ${isOutOfStock ? 'text-[color:var(--destructive)] font-medium' : 'text-[color:var(--muted-foreground)]'}`}>
          {isOutOfStock ? 'Out of Stock' : `${stock} items available`}
        </div>
      )}

      {/* Price Display */}
      <div className="text-lg font-bold text-[color:var(--primary)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
        {formatPrice(price * quantity)}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isDisabled || isAdding}
        className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2
                   bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)]
                   text-[color:var(--primary-foreground)] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isAdding ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AddToCart;
