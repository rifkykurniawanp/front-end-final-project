"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CartItemType } from "@/types/enum";
import type { CartItemWithDetails } from "@/types/cart";
import { useCartContext } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemWithDetails;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCartContext();
  const quantity = item.quantity;

  const handleIncrease = async () => {
    if (item.itemType !== CartItemType.PRODUCT) return;
    await updateItemQuantity(item.itemId, quantity + 1, item.itemType);
  };

  const handleDecrease = async () => {
    if (item.itemType !== CartItemType.PRODUCT || quantity <= 1) return;
    await updateItemQuantity(item.itemId, quantity - 1, item.itemType);
  };

  const handleRemove = async () => {
    await removeItem(item.id);
  };

  const itemName =
    item.itemType === CartItemType.PRODUCT
      ? item.product?.name
      : item.course?.title;
  const itemPrice =
    item.itemType === CartItemType.PRODUCT
      ? item.product?.price
      : item.course?.price;
  const itemImage =
    item.itemType === CartItemType.PRODUCT ? item.product?.image : undefined;
  const itemLink =
    item.itemType === CartItemType.PRODUCT
      ? `/product/${item.product?.slug}`
      : `/course/${item.course?.slug}`;

  return (
    <Card className="flex items-start gap-4 p-4 hover:shadow-xl transition-shadow duration-200 rounded-2xl border border-orange-200 bg-orange-50">
      {itemImage && (
        <div className="w-24 h-24 relative rounded overflow-hidden border border-orange-300">
          <Image
            src={itemImage}
            alt={itemName!}
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardContent className="flex-1 p-0 space-y-2">
        <Link
          href={itemLink}
          className="text-lg font-semibold text-orange-800 hover:underline"
        >
          {itemName}
        </Link>
        {itemPrice && (
          <p className="text-orange-700 font-bold">
            {formatCurrency(itemPrice)}
          </p>
        )}

        {item.itemType === CartItemType.PRODUCT && (
          <div className="flex items-center gap-2 mt-2">
            <Button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              variant="outline"
              size="sm"
              className="bg-orange-100 hover:bg-orange-200 text-orange-800 shadow-sm transform hover:scale-110 transition-all duration-150"
            >
              -
            </Button>
            <span className="px-2 font-medium">{quantity}</span>
            <Button
              onClick={handleIncrease}
              variant="outline"
              size="sm"
              className="bg-orange-100 hover:bg-orange-200 text-orange-800 shadow-sm transform hover:scale-110 transition-all duration-150"
            >
              +
            </Button>
          </div>
        )}

        <Button
          onClick={handleRemove}
          variant="destructive"
          size="sm"
          className="bg-orange-200 hover:bg-orange-300 text-orange-800 shadow-sm transform hover:scale-105 transition-all duration-150 mt-2"
        >
          Hapus
        </Button>
      </CardContent>
    </Card>
  );
};
