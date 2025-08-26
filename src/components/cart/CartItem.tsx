"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CartItemWithDetails } from "@/types/cart";
import { CartItemType } from "@/types/enum";
import { useCartContext } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps { 
  item: CartItemWithDetails;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeItem, loading } = useCartContext();
  
  const handleIncrease = async () => {
    if (item.itemType === CartItemType.PRODUCT) {
      try {
        await updateItemQuantity(item.cartId, item.itemId, item.quantity + 1, item.itemType);
      } catch (error) {
        console.error("Error increasing quantity:", error);
      }
    }
  };

  const handleDecrease = async () => {
    if (item.itemType === CartItemType.PRODUCT && item.quantity > 1) {
      try {
        await updateItemQuantity(item.cartId, item.itemId, item.quantity - 1, item.itemType);
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    }
  };

  const handleRemove = async () => {
    try {
      // FIXED: Use CartItem.id (not itemId) - this is what backend expects
      await removeItem(item.cartId, item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Get item details based on type - synced with backend response structure
  const itemName = item.itemType === CartItemType.PRODUCT 
    ? item.product?.name 
    : item.course?.title;
    
  const itemPrice = item.itemType === CartItemType.PRODUCT 
    ? item.product?.price 
    : item.course?.price;
    
  const itemImage = item.itemType === CartItemType.PRODUCT 
    ? item.product?.image 
    : undefined; // Backend courses don't have image field
    
  const itemLink = item.itemType === CartItemType.PRODUCT 
    ? `/product/${item.product?.slug}` 
    : `/course/${item.course?.slug}`;

  // Use backend calculated subtotal if available, fallback to calculation
  const totalItemPrice = item.subtotal || ((itemPrice || 0) * item.quantity);

  return (
    <div className="flex items-start gap-4 p-4 hover:shadow-xl transition-shadow rounded-2xl border border-orange-200 bg-orange-50">
      {itemImage && (
        <div className="w-24 h-24 relative rounded overflow-hidden border border-orange-300">
          <Image 
            src={itemImage} 
            alt={itemName || "Product image"} 
            fill 
            className="object-cover"
          />
        </div>
      )}
      
      <div className="flex-1 space-y-2">
        <Link 
          href={itemLink} 
          className="text-lg font-semibold text-orange-800 hover:underline"
        >
          {itemName}
        </Link>
        
        {itemPrice && (
          <div className="space-y-1">
            <p className="text-orange-700 font-bold">
              {formatCurrency(itemPrice)} {item.quantity > 1 && "/ pcs"}
            </p>
            {item.quantity > 1 && (
              <p className="text-sm text-orange-600">
                Total: {formatCurrency(totalItemPrice)}
              </p>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          {/* Quantity controls for products only */}
          {item.itemType === CartItemType.PRODUCT && (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleDecrease} 
                disabled={item.quantity <= 1 || loading} 
                size="sm" 
                variant="outline"
                className="w-8 h-8 p-0"
              >
                -
              </Button>
              <span className="min-w-[2rem] text-center font-medium">
                {item.quantity}
              </span>
              <Button 
                onClick={handleIncrease} 
                disabled={loading}
                size="sm" 
                variant="outline"
                className="w-8 h-8 p-0"
              >
                +
              </Button>
            </div>
          )}
          
          {/* For courses, just show quantity (courses typically quantity = 1) */}
          {item.itemType === CartItemType.COURSE && (
            <span className="text-sm text-gray-600">
              Qty: {item.quantity}
            </span>
          )}
          
          <Button 
            onClick={handleRemove} 
            disabled={loading}
            size="sm" 
            variant="destructive" 
            className="ml-auto"
          >
            {loading ? "..." : "Hapus"}
          </Button>
        </div>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 border-t pt-2">
            CartItem ID: {item.id} | Item ID: {item.itemId} | Type: {item.itemType}
          </div>
        )}
      </div>
    </div>
  );
};