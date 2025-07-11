import { Product } from '@/types/product';

export const teaIngredients: Product[] = [
  {
    id: 'tea-001',
    slug: 'earl-grey-premium',
    name: 'Earl Grey Premium',
    description: 'Teh hitam klasik dengan aroma bergamot yang menyegarkan',
    price: 125000,
    image: '/api/placeholder/300/300',
    category: 'tea',
    subcategory: 'ingredient',
    stock: 45,
    rating: 4.8,
    reviews: 127,
    tags: ['premium', 'classic', 'bergamot'],
    origin: 'Ceylon',
    weight: '100g',
    caffeine: 'low',
    brewingMethod: ['hot', 'cold']
  },
  {
    id: 'tea-002',
    slug: 'jasmine-green-tea',
    name: 'Jasmine Green Tea',
    description: 'Teh hijau dengan bunga melati yang harum dan menenangkan',
    price: 98000,
    image: '/api/placeholder/300/300',
    category: 'tea',
    subcategory: 'ingredient',
    stock: 32,
    rating: 4.6,
    reviews: 89,
    tags: ['organic', 'floral', 'antioxidant'],
    origin: 'China',
    weight: '100g',
    caffeine: 'medium',
    brewingMethod: ['hot', 'cold']
  },
  {
    id: 'tea-003',
    slug: 'chamomile-tea',
    name: 'Chamomile Tea',
    description: 'Teh herbal chamomile untuk relaksasi dan tidur yang nyenyak',
    price: 85000,
    image: '/api/placeholder/300/300',
    category: 'tea',
    subcategory: 'ingredient',
    stock: 28,
    rating: 4.7,
    reviews: 56,
    tags: ['herbal', 'relaxing', 'caffeine-free'],
    origin: 'Egypt',
    weight: '50g',
    caffeine: 'none',
    brewingMethod: ['hot']
  }
];