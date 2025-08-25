import { OrderStatus } from './enum';
import type { User } from './user';
import type { Payment } from './payment';
import type { Product } from './product';

// ================= ORDER TYPES =================

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

export interface ProductOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceEach: number;
  order?: ProductOrder;
  product?: Product;
}

export interface CreateProductOrderDto {
  paymentId: number;
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

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  buyerId?: number;
  supplierId?: number;
  dateFrom?: string;
  dateTo?: string;
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

export interface ProductOrderWithDetails extends ProductOrder {
  buyer: User;
  payment: Payment;
  items: ProductOrderItemWithDetails[];
}

export interface ProductOrderItemWithDetails extends ProductOrderItem {
  product: Product;
}

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

// ================= PRODUCT ORDER RESPONSE TYPES =================

export interface ProductOrderResponseDto {
  id: number;
  buyerId: number;
  paymentId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  buyer?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    address?: string;
  };
  payment?: {
    id: number;
    amount: number;
    paymentMethod: string;
    status: string;
    paidAt?: string;
  };
  items?: ProductOrderItemResponseDto[];
}

export interface ProductOrderItemResponseDto {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceEach: number;
  product?: {
    id: number;
    name: string;
    slug: string;
    image?: string;
    category: string;
    supplierId: number;
  };
}