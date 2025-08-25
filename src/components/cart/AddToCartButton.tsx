"use client";
import { Button } from "@/components/ui/button";
import { CartItemType } from "@/types/enum";
import type { AddToCartDto } from "@/types/cart";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AddToCartButtonProps {
  itemId: number;
  itemType: CartItemType;
  quantity?: number;
}

export const AddToCartButton = ({ itemId, itemType, quantity = 1 }: AddToCartButtonProps) => {
  const { addItem, fetchCart } = useCartContext();
  const router = useRouter();
  const { token, isInitialized } = useAuth();

  // Tombol disable jika auth belum inisialisasi atau token tidak ada
  const isDisabled = !isInitialized || !token;

  const handleAdd = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    const data: AddToCartDto = { itemId, itemType, quantity };

    try {
      await addItem(data); // Sesuai signature CartContext
      await fetchCart();
    } catch (error: any) {
      console.error("Error adding item to cart:", error);

      // Optional: UX feedback
      if (error.status === 401) {
        router.push("/login");
      } else {
        alert(error.message || "Gagal menambah item ke cart");
      }
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleAdd}
      disabled={isDisabled}
      title={!token ? "Login dulu untuk menambah ke cart" : ""}
      className={`bg-amber-600 hover:bg-amber-700 text-white ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      Add to Cart
    </Button>
  );
};
