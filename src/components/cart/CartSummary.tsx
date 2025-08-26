"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  onCheckout: () => void;
  onClearCart: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ 
  onCheckout, 
  onClearCart 
}) => {
  const { getTotalItems, getTotalAmount, loading, getActiveCart } = useCartContext();
  
  // Use backend calculated values from context
  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();
  const activeCart = getActiveCart();
  
  const isDisabled = loading || !activeCart || totalItems === 0;

  return (
    <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
      <h3 className="text-lg font-semibold text-orange-800">
        Ringkasan Pesanan
      </h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Item:</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        
        <div className="flex justify-between text-lg font-bold text-orange-800">
          <span>Total Harga:</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
      
      {/* Show breakdown by cart if multiple carts */}
      {activeCart && activeCart.items && activeCart.items.length > 0 && (
        <div className="space-y-1 text-sm text-gray-600 border-t pt-2">
          <div className="font-medium">Detail Cart:</div>
          {activeCart.items.map((item) => {
            const itemName = item.itemType === 'PRODUCT' 
              ? item.product?.name 
              : item.course?.title;
            const subtotal = item.subtotal || (item.price * item.quantity);
            
            return (
              <div key={item.id} className="flex justify-between">
                <span>{itemName} (x{item.quantity})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="space-y-2">
        <Button 
          onClick={onCheckout} 
          disabled={isDisabled}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
        >
          {loading ? "Loading..." : `Checkout (${totalItems} items)`}
        </Button>
        
        <Button 
          onClick={onClearCart} 
          disabled={isDisabled}
          variant="outline"
          className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          Kosongkan Keranjang
        </Button>
      </div>
      
      {totalItems === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Keranjang masih kosong
        </p>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && activeCart && (
        <div className="text-xs text-gray-500 border-t pt-2">
          <div>Cart ID: {activeCart.id}</div>
          <div>Backend Total Items: {activeCart.totalItems || 'N/A'}</div>
          <div>Backend Total Amount: {activeCart.totalAmount || 'N/A'}</div>
        </div>
      )}
    </div>
  );
};