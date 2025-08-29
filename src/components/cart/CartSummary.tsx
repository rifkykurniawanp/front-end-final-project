"use client";

import React, { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import CartItem from "./CartItem";
import { useCartContext } from "@/context/CartContext";

interface CartSummaryProps {
  showTitle?: boolean;
  showItemsList?: boolean;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  onClearCart?: () => void;
  className?: string;
  checkoutLabel?: string;
  continueShoppingLabel?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showTitle = true,
  showItemsList = true,
  onCheckout,
  onContinueShopping,
  onClearCart,
  className = "",
  checkoutLabel = "Proceed to Checkout",
  continueShoppingLabel = "Continue Shopping",
}) => {
  const { cart, items, loading, error, updateItem, removeItem, clearCart } = useCartContext();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await updateItem(itemId, { quantity: newQuantity });
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await removeItem(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await clearCart();
      onClearCart?.();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const handleCheckout = () => onCheckout?.();
  const handleContinueShopping = () => onContinueShopping?.();

  if (loading && (!items || items.length === 0)) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      {showTitle && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              {cart?.totalItems != null && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {cart.totalItems} items
                </span>
              )}
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={loading}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 mx-6 mt-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Cart Items List */}
      {showItemsList && (
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add some products or courses to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  isUpdating={updatingItems.has(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart Summary */}
      {cart && items.length > 0 && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-medium">{cart.totalItems}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-blue-600">{formatPrice(cart.totalAmount)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {checkoutLabel}
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              {continueShoppingLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
