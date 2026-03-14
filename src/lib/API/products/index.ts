// src/lib/API/products/index.ts

// import spesifik dari masing-masing file
// import { productOrdersApi } from './product-orders.api'; // kalau nanti dibutuhkan
import { productOrdersApi } from './product-order-items.api';
import { productReviewsApi } from './product-reviews.api';
import { productsApi } from './products.api';

// export spesifik
export {
  // productOrdersApi, // jangan di-export kalau tidak digunakan
  productOrdersApi,
  productReviewsApi,
  productsApi
};