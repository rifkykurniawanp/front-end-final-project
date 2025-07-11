import { Product } from '@/types/product';

export const herbalIngredients: Product[] = [
  {
    id: 'herbal-001',
    slug: 'lemon-balm',
    name: 'Lemon Balm',
    description: 'Daun lemon balm kering untuk teh herbal yang menenangkan',
    price: 75000,
    image: '/api/placeholder/300/300',
    category: 'herbal',
    subcategory: 'ingredient',
    stock: 34,
    rating: 4.5,
    reviews: 67,
    tags: ['calming', 'citrus', 'organic'],
    origin: 'Local',
    weight: '50g',
    caffeine: 'none',
    brewingMethod: ['hot', 'cold']
  },
  {
    id: 'herbal-002',
    slug: 'peppermint-leaves',
    name: 'Peppermint Leaves',
    description: 'Daun peppermint segar untuk minuman herbal yang menyegarkan',
    price: 65000,
    image: '/api/placeholder/300/300',
    category: 'herbal',
    subcategory: 'ingredient',
    stock: 48,
    rating: 4.6,
    reviews: 89,
    tags: ['refreshing', 'digestive', 'cooling'],
    origin: 'Local',
    weight: '50g',
    caffeine: 'none',
    brewingMethod: ['hot', 'cold']
  },
  {
    id: 'herbal-003',
    slug: 'ginger-root',
    name: 'Ginger Root',
    description: 'Jahe kering berkualitas tinggi untuk minuman hangat yang menyehatkan',
    price: 55000,
    image: '/api/placeholder/300/300',
    category: 'herbal',
    subcategory: 'ingredient',
    stock: 56,
    rating: 4.7,
    reviews: 123,
    tags: ['warming', 'digestive', 'immunity'],
    origin: 'Local',
    weight: '100g',
    caffeine: 'none',
    brewingMethod: ['hot']
    }
  ];
