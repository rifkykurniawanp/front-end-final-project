import { Product } from '@/types/product';

export const coffeeTools: Product[] = [
  {
    id: 'coffee-tool-001',
    slug: 'v60-dripper-set',
    name: 'V60 Dripper Set',
    description: 'Set lengkap V60 dengan server dan filter untuk pour over',
    price: 320000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'tool',
    stock: 23,
    rating: 4.8,
    reviews: 134,
    tags: ['v60', 'pour-over', 'complete-set'],
    brewingMethod: ['pour-over']
  },
  {
    id: 'coffee-tool-002',
    slug: 'french-press-350ml',
    name: 'French Press 350ml',
    description: 'French press dengan konstruksi stainless steel yang tahan lama',
    price: 185000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'tool',
    stock: 31,
    rating: 4.6,
    reviews: 78,
    tags: ['french-press', 'stainless-steel', 'durable'],
    brewingMethod: ['french-press']
  },
  {
    id: 'coffee-tool-003',
    slug: 'manual-coffee-grinder',
    name: 'Manual Coffee Grinder',
    description: 'Grinder manual dengan burr ceramic untuk hasil yang konsisten',
    price: 275000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'tool',
    stock: 19,
    rating: 4.9,
    reviews: 92,
    tags: ['manual', 'ceramic-burr', 'consistent']
  }
];