"use client";

import { Button } from "@/components/ui/button";
import { CartItemType } from "@/types/enum";
import type { AddToCartDto } from "@/types/cart";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface AddToCartButtonProps {
  itemId: number;
  itemType: CartItemType;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary";
}

export const AddToCartButton = ({
  itemId,
  itemType,
  quantity = 1,
  disabled = false,
  className = "",
  size = "sm",
  variant = "default",
}: AddToCartButtonProps) => {
  const { addItem, loading: cartLoading, error, clearError } = useCartContext();
  const router = useRouter();
  const { token, isInitialized } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);

  const isDisabled = disabled || !isInitialized || !token || cartLoading || localLoading;

  const handleAdd = async () => {
    // Clear any previous errors
    clearError();

    if (!token) {
      router.push("/login");
      return;
    }

    const data: AddToCartDto = { 
      itemId, 
      itemType, 
      quantity 
    };

    setLocalLoading(true);
    try {
      await addItem(data);
      
      // Success feedback
      const itemTypeName = itemType === CartItemType.PRODUCT ? 'produk' : 'kursus';
      alert(`Berhasil menambahkan ${itemTypeName} ke keranjang!`);
      
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      
      // Handle specific error cases
      if (error.status === 401) {
        router.push("/login");
      } else if (error.status === 404) {
        alert("Item tidak ditemukan");
      } else if (error.status === 400) {
        alert(error.message || "Data tidak valid");
      } else {
        alert(error.message || "Gagal menambah item ke keranjang");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const getButtonText = () => {
    if (localLoading || cartLoading) return "...";
    if (!token) return "Login untuk Add to Cart";
    return "Add to Cart";
  };

  const getButtonTitle = () => {
    if (!token) return "Login terlebih dahulu untuk menambah ke keranjang";
    if (disabled) return "Item tidak tersedia";
    return `Tambah ${itemType === CartItemType.PRODUCT ? 'produk' : 'kursus'} ke keranjang`;
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        size={size}
        variant={variant}
        onClick={handleAdd}
        disabled={isDisabled}
        title={getButtonTitle()}
        className={`
          ${variant === "default" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        {getButtonText()}
      </Button>
      
      {/* Show error if any */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};