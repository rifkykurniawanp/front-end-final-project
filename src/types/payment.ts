import { PayableType, PaymentStatus } from './enum';
import type { User } from './user';
import type { Cart } from './cart';
import type { ProductOrder } from './order';
import type { CourseEnrollment } from './course';

// ================= PAYMENT TYPES =================

export interface Payment {
  id: number;
  userId: number;
  cartId: number;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  payableType: PayableType;
  payableId: number;
  paidAt?: Date | null;
  createdAt: Date;
  user?: User;
  cart?: Cart;
  productOrders?: ProductOrder[];
  courseEnrollments?: CourseEnrollment[];
}

// For creating payments
export interface CreatePaymentDto {
  cartId: number;
  amount: number;
  paymentMethod: string;
  payableType: PayableType;
  payableId: number;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  paidAt?: Date;
}

// Payment methods
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'debit_card';
  description?: string;
  fee?: number;
  isActive: boolean;
}

// For payment processing
export interface PaymentRequest {
  paymentId: number;
  paymentMethod: string;
  amount: number;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  returnUrl?: string;
  callbackUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  message?: string;
  error?: string;
}

// For payment history and reports
export interface PaymentHistory {
  payments: Payment[];
  totalAmount: number;
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentFilterDto {
  userId?: number;
  status?: PaymentStatus[];
  paymentMethod?: string[];
  payableType?: PayableType[];
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'amount' | 'paidAt';
  sortOrder?: 'asc' | 'desc';
}