"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/context/CartContext";
import CartSummary from "@/components/cart/CartSummary";
import { useAuthContext } from "@/context/AuthContext";
import { ShoppingCart, ShoppingBag } from "lucide-react";

const CartPage = () => {
  const router = useRouter();
  const { cart, items, loading, error, refreshCart } = useCartContext();
  const { token, user } = useAuthContext();

  const handleCheckout = () => {
    if (!cart || items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    if (!token || !user) {
      router.push("/auth/login?returnUrl=/cart");
      return;
    }
    
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleClearCart = () => {
    console.log("Cart cleared successfully");
  };

  const handleRetry = async () => {
    try {
      await refreshCart();
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  };

  if (loading && !items.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 font-medium">Error loading cart</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button 
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start exploring our products and courses!
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button 
                onClick={handleContinueShopping}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop Products</span>
              </button>
              <button 
                onClick={() => router.push("/courses")}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">Review your items and proceed to checkout</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold text-blue-600">{cart.totalItems}</p>
          </div>
        </div>

        <CartSummary
          showTitle={false}
          showItemsList={true}
          onCheckout={handleCheckout}
          onContinueShopping={handleContinueShopping}
          onClearCart={handleClearCart}
          checkoutLabel={`Checkout (${cart.totalItems} items)`}
          continueShoppingLabel="Continue Shopping"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CartPage;
