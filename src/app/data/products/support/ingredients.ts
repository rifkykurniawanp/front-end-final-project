import {Product} from '@/types/product';

export const supportIngredients: Product[] = [
  {
    id: 'support-ing-001',
    slug: 'organic-honey',
    name: 'Organic Honey',
    description: 'Madu organik murni sebagai pemanis alami untuk teh dan herbal',
    price: 95000,
    image: '/api/placeholder/300/300',
    category: 'herbal',
    subcategory: 'support',
    stock: 67,
    rating: 4.6,
    reviews: 78,
    tags: ['organic', 'sweetener', 'natural'],
    weight: '250g'
  },
  {
    id: 'support-ing-002',
    slug: 'coconut-sugar',
    name: 'Coconut Sugar',
    description: 'Gula kelapa organik sebagai alternatif pemanis yang sehat',
    price: 45000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'support',
    stock: 89,
    rating: 4.4,
    reviews: 134,
    tags: ['organic', 'healthy', 'coconut'],
    weight: '200g'
  },
  {
    id: 'support-ing-003',
    slug: 'cinnamon-sticks',
    name: 'Cinnamon Sticks',
    description: 'Batang kayu manis berkualitas tinggi untuk menambah aroma',
    price: 65000,
    image: '/api/placeholder/300/300',
    category: 'herbal',
    subcategory: 'support',
    stock: 54,
    rating: 4.7,
    reviews: 67,
    tags: ['spice', 'aromatic', 'natural'],
    weight: '50g'
  }
];
