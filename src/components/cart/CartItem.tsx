import React from 'react';
import { CartItemType } from '@/types/enum';
import { CartItem as CartItemInterface } from '@/types/cart';
import { Trash2, Plus, Minus, Package, BookOpen, Loader2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemInterface;
  onQuantityChange?: (itemId: number, quantity: number) => void;
  onRemove?: (itemId: number) => void;
  isUpdating?: boolean;
  className?: string;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  isUpdating = false,
  className = ""
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getItemIcon = (itemType: CartItemType) => {
    return itemType === CartItemType.PRODUCT ? 
      <Package className="w-5 h-5 text-blue-600" /> : 
      <BookOpen className="w-5 h-5 text-green-600" />;
  };

  const getItemName = (item: CartItemInterface) => {
    return item.itemType === CartItemType.PRODUCT 
      ? item.product?.name || 'Unknown Product'
      : item.course?.title || 'Unknown Course';
  };

  const getItemDetails = (item: CartItemInterface) => {
    if (item.itemType === CartItemType.PRODUCT) {
      return item.product ? (
        <div className="text-sm text-gray-600">
          <p>Stock: {item.product.stock}</p>
        </div>
      ) : null;
    } else {
      return item.course ? (
        <div className="text-sm text-gray-600">
          <p>Level: {item.course.level}</p>
          <p>Category: {item.course.category}</p>
        </div>
      ) : null;
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && onQuantityChange) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <div className={`flex items-center space-x-4 p-4 border border-gray-200 rounded-lg transition-opacity ${
      isUpdating ? 'opacity-50' : ''
    } ${className}`}>
      {/* Item Type Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          {getItemIcon(item.itemType)}
        </div>
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {getItemName(item)}
        </h3>
        {getItemDetails(item)}
        <div className="mt-1">
          <span className="text-sm text-gray-600">
            {formatPrice(item.price)} each
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1 || isUpdating}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <span className="w-12 text-center font-medium">
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            item.quantity
          )}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-0">
        <div className="text-lg font-medium text-gray-900">
          {formatPrice(item.subtotal)}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isUpdating}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartItem;