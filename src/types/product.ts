export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'tea' | 'coffee' | 'herbal';
  subcategory: 'ingredient' | 'tool' | 'support';
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  origin?: string;
  weight?: string;
  roastLevel?: 'light' | 'medium' | 'dark';
  brewingMethod?: string[];
  caffeine?: 'none' | 'low' | 'medium' | 'high';
  slug: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  products: Product[];
}

export interface FilterState {
  category: string[];
  subcategory: string[];
  priceRange: [number, number];
  rating: number;
  caffeine: string[];
  origin: string[];
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string; 
  slug: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}