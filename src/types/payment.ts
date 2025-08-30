import { PayableType, PaymentStatus } from './enum';
import type { User } from './user';
import type { CartItem } from './cart';
import type { ProductOrder } from './order';
import type { CourseEnrollment } from './course-enrollment';

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
  cart?: CartItem;
  productOrders?: ProductOrder[];
  courseEnrollments?: CourseEnrollment[];
}

export interface CreatePaymentDto {
  userId: number;
  cartId: number;
  amount: number;
  paymentMethod: string;
  status?: PaymentStatus;
  payableType: PayableType;
  payableId: number;
  paidAt?: Date;
}

export interface UpdatePaymentDto {
  amount?: number;
  paymentMethod?: string;
  status?: PaymentStatus;
  paidAt?: Date;
}

export interface CancelPaymentDto {
  reason?: string;
}

export interface PaymentStatsDto {
  totalPayments: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  totalRevenue: number;
  pendingAmount: number;
  completedAmount: number;
  successRate: number;
}

// ================= PAYMENT RESPONSE TYPES =================

export interface UserBasicDto {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface CartBasicDto {
  id: number;
  totalItems: number;
  totalAmount: number;
}

export interface ProductOrderDto {
  id: number;
  totalPrice: number;
  status: string;
  itemCount: number;
}

export interface CourseEnrollmentDto {
  id: number;
  courseId: number;
  courseName?: string;
  pricePaid: number;
  progress: number;
}

export interface PaymentResponseDto {
  id: number;
  userId: number;
  cartId: number;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  payableType: PayableType;
  payableId: number;
  paidAt?: Date;
  createdAt: Date;
  user?: UserBasicDto;
  cart?: CartBasicDto;
  productOrders: ProductOrderDto[];
  courseEnrollments: CourseEnrollmentDto[];
}

// ================= PAYMENT METHOD TYPE =================
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}