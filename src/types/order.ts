import { OrderStatus } from './enum';
import type { User } from './user';
import type { Payment } from './payment';
import type { Product } from './product';

export interface ProductOrder {
  id: number;
  buyerId: number;
  paymentId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  buyer?: User;
  payment?: Payment;
  items?: ProductOrderItem[];
}

export interface ProductOrderResponseDto extends ProductOrder {
  buyer: User;
  payment: Payment;
  items: ProductOrderItem[];
}

export interface ProductOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceEach: number;
  order?: ProductOrder;
  product?: Product;
}

// For creating orders
export interface CreateProductOrderDto {
  buyerId: number;
  paymentId: number;
  totalPrice: number;
  items: CreateProductOrderItemDto[];
}

export interface CreateProductOrderItemDto {
  productId: number;
  quantity: number;
  priceEach: number;
}

export interface UpdateProductOrderDto {
  status?: OrderStatus;
}

export interface ProductOrderWithDetails extends ProductOrder {
  buyer: User;
  payment: Payment;
  items: ProductOrderItemWithDetails[];
}

export interface ProductOrderItemWithDetails extends ProductOrderItem {
  product: Product;
}

// For order summary and reports
export interface OrderSummary {
  totalOrders: number;
  totalAmount: number;
  totalItems: number;
  statusBreakdown: {
    [key in OrderStatus]: {
      count: number;
      amount: number;
    };
  };
}

export interface OrderFilterDto {
  buyerId?: number;
  status?: OrderStatus[];
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  productId?: number;
  supplierId?: number;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'totalPrice' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// For order tracking
export interface OrderTracking {
  orderId: number;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}