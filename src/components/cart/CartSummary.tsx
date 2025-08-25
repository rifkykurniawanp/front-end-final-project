"use client";

import React, { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  onCheckout: () => Promise<void>;
  onClearCart: () => Promise<void>;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout, onClearCart }) => {
  const { cart } = useCartContext();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingClear, setLoadingClear] = useState(false);

  const totalItems = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalAmount = cart?.items.reduce((acc, item) => {
    const price = item.itemType === "PRODUCT" ? item.product?.price || 0 : item.course?.price || 0;
    return acc + price * item.quantity;
  }, 0) || 0;

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    try {
      await onCheckout();
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleClear = async () => {
    setLoadingClear(true);
    try {
      await onClearCart();
    } finally {
      setLoadingClear(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg"><strong>Total Item:</strong> {totalItems}</p>
      <p className="text-xl font-bold text-orange-800">Total: {formatCurrency(totalAmount)}</p>

      <div className="flex flex-col gap-3 mt-4">
        <Button
          variant="default"
          onClick={handleCheckout}
          disabled={loadingCheckout}
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg transform hover:scale-105 transition-all duration-150"
        >
          {loadingCheckout ? "Memproses..." : "Checkout"}
        </Button>

        <Button
          variant="destructive"
          onClick={handleClear}
          disabled={loadingClear}
          className="bg-orange-100 hover:bg-orange-200 text-orange-800 shadow-md transform hover:scale-105 transition-all duration-150"
        >
          {loadingClear ? "Menghapus..." : "Hapus Semua"}
        </Button>
      </div>
    </div>
  );
};
