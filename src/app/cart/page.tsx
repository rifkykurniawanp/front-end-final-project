"use client";

import React from "react";
import { useCartContext } from "@/context/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { cartApi } from "@/lib/API/core/carts.api";
import { useAuthContext } from "@/context/AuthContext";

const CartPage = () => {
  const { carts, loading, error, fetchCarts, getActiveCart, getTotalItems, getTotalAmount } = useCartContext();
  const { token } = useAuthContext();
  
  const activeCart = getActiveCart();
  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();

  const handleCheckout = () => {
    if (!activeCart || !token) {
      alert("Tidak ada cart atau belum login");
      return;
    }
    
    // Use backend calculated values
    alert(`Checkout: ${activeCart.totalItems || totalItems} items, total Rp ${(activeCart.totalAmount || totalAmount).toLocaleString()}`);
  };

  const handleClearCart = async () => {
    if (!activeCart || !token) {
      alert("Tidak ada cart untuk dihapus");
      return;
    }

    const confirm = window.confirm("Yakin ingin mengosongkan keranjang?");
    if (!confirm) return;

    try {
      // Delete the entire cart (backend will handle cascade delete of items)
      await cartApi.removeCart(activeCart.id, token);
      // Refresh carts
      await fetchCarts();
      alert("Keranjang berhasil dikosongkan");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      alert("Gagal mengosongkan keranjang: " + error.message);
    }
  };

  if (loading && !carts.length) {
    return (
      <div className="p-4 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchCarts}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (!activeCart || !activeCart.items || activeCart.items.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 15a1 1 0 001-1v-3a1 1 0 00-2 0v3a1 1 0 001 1zm4 0a1 1 0 001-1v-3a1 1 0 00-2 0v3a1 1 0 001 1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-600 mb-4">Belum ada item di keranjang Anda</p>
          <button 
            onClick={() => window.location.href = '/products'}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-orange-800">Keranjang Belanja</h1>
        <p className="text-gray-600">
          {activeCart.totalItems || totalItems} item dalam keranjang
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {activeCart.items.map(item => (
            <CartItem key={`${item.id}-${item.itemType}-${item.itemId}`} item={item} />
          ))}
        </div>
        
        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <CartSummary 
              onCheckout={handleCheckout} 
              onClearCart={handleClearCart} 
            />
          </div>
        </div>
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
          <h3 className="font-bold">Debug Info:</h3>
          <pre>{JSON.stringify({ 
            cartCount: carts.length, 
            activeCartId: activeCart?.id,
            backendTotalItems: activeCart?.totalItems,
            backendTotalAmount: activeCart?.totalAmount,
            calculatedTotalItems: totalItems,
            calculatedTotalAmount: totalAmount
          }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CartPage