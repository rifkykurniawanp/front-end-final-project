// =================== cart.utils.ts - HELPER FUNCTIONS ===================

import type { CartWithItems, CartItemWithDetails } from "@/types/cart";
import { CartItemType } from "@/types/enum";

/**
 * Calculate total items in a cart (fallback if backend doesn't provide)
 */
export const calculateCartTotalItems = (cart: CartWithItems): number => {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Calculate total amount in a cart (fallback if backend doesn't provide)
 */
export const calculateCartTotalAmount = (cart: CartWithItems): number => {
  return cart.items.reduce((sum, item) => {
    // Use backend subtotal if available, otherwise calculate
    const itemTotal = item.subtotal || (item.price * item.quantity);
    return sum + itemTotal;
  }, 0);
};

/**
 * Get item name based on type
 */
export const getItemName = (item: CartItemWithDetails): string => {
  if (item.itemType === CartItemType.PRODUCT) {
    return item.product?.name || 'Unknown Product';
  }
  return item.course?.title || 'Unknown Course';
};

/**
 * Get item price based on type
 */
export const getItemPrice = (item: CartItemWithDetails): number => {
  if (item.itemType === CartItemType.PRODUCT) {
    return item.product?.price || 0;
  }
  return item.course?.price || 0;
};

/**
 * Get item image based on type
 */
export const getItemImage = (item: CartItemWithDetails): string | undefined => {
  if (item.itemType === CartItemType.PRODUCT) {
    return item.product?.image;
  }
  // Courses don't have images in backend structure
  return undefined;
};

/**
 * Get item slug based on type
 */
export const getItemSlug = (item: CartItemWithDetails): string => {
  if (item.itemType === CartItemType.PRODUCT) {
    return item.product?.slug || '';
  }
  return item.course?.slug || '';
};

/**
 * Get item link based on type
 */
export const getItemLink = (item: CartItemWithDetails): string => {
  if (item.itemType === CartItemType.PRODUCT) {
    return `/product/${item.product?.slug || item.itemId}`;
  }
  return `/course/${item.course?.slug || item.itemId}`;
};

/**
 * Check if item can have quantity changes (only products)
 */
export const canChangeQuantity = (item: CartItemWithDetails): boolean => {
  return item.itemType === CartItemType.PRODUCT;
};

/**
 * Format cart summary for display
 */
export const formatCartSummary = (carts: CartWithItems[]) => {
  const totalItems = carts.reduce((sum, cart) => 
    sum + (cart.totalItems || calculateCartTotalItems(cart)), 0
  );
  
  const totalAmount = carts.reduce((sum, cart) => 
    sum + (cart.totalAmount || calculateCartTotalAmount(cart)), 0
  );

  const allItems = carts.flatMap(cart => cart.items);

  return {
    totalItems,
    totalAmount,
    cartCount: carts.length,
    itemCount: allItems.length,
    items: allItems,
  };
};

/**
 * Validate cart item before adding
 */
export const validateCartItem = (
  itemId: number, 
  itemType: CartItemType, 
  quantity: number
): { isValid: boolean; error?: string } => {
  if (!itemId || itemId <= 0) {
    return { isValid: false, error: "Invalid item ID" };
  }
  
  if (!Object.values(CartItemType).includes(itemType)) {
    return { isValid: false, error: "Invalid item type" };
  }
  
  if (!quantity || quantity <= 0) {
    return { isValid: false, error: "Quantity must be greater than 0" };
  }
  
  if (quantity > 1000) {
    return { isValid: false, error: "Quantity too large" };
  }
  
  return { isValid: true };
};

/**
 * Check if cart is empty
 */
export const isCartEmpty = (cart: CartWithItems | null): boolean => {
  if (!cart || !cart.items) return true;
  return cart.items.length === 0;
};

/**
 * Find item in cart by itemId and itemType
 */
export const findCartItem = (
  cart: CartWithItems, 
  itemId: number, 
  itemType: CartItemType
): CartItemWithDetails | undefined => {
  return cart.items.find(item => 
    item.itemId === itemId && item.itemType === itemType
  );
};

/**
 * Get cart item count for specific item
 */
export const getItemQuantityInCart = (
  carts: CartWithItems[], 
  itemId: number, 
  itemType: CartItemType
): number => {
  let totalQuantity = 0;
  
  carts.forEach(cart => {
    const item = findCartItem(cart, itemId, itemType);
    if (item) {
      totalQuantity += item.quantity;
    }
  });
  
  return totalQuantity;
};

/**
 * Format error messages for user display
 */
export const formatCartError = (error: any): string => {
  if (typeof error === 'string') return error;
  
  // Handle common HTTP errors
  switch (error.status) {
    case 401:
      return "Anda perlu login untuk menggunakan keranjang";
    case 403:
      return "Anda tidak memiliki akses ke keranjang ini";
    case 404:
      return "Keranjang atau item tidak ditemukan";
    case 400:
      return error.message || "Data tidak valid";
    case 500:
      return "Terjadi kesalahan server, coba lagi nanti";
    default:
      return error.message || "Terjadi kesalahan tidak terduga";
  }
};