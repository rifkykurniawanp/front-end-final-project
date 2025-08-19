export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

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

export interface CreateProductOrderDto {
  paymentId: number;
  items: {
    productId: number;
    quantity: number;
    priceEach: number;
  }[];
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