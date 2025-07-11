import { Product } from '@/types/product';

export const teaTools: Product[] = [
  {
    id: 'tea-tool-001',
    slug: 'glass-teapot-with-infuser',
    name: 'Glass Teapot with Infuser',
    description: 'Teko kaca premium dengan saringan stainless steel',
    price: 280000,
    image: '/api/placeholder/300/300',
    category: 'tea',
    subcategory: 'tool',
    stock: 15,
    rating: 4.9,
    reviews: 43,
    tags: ['glass', 'premium', 'infuser'],
    weight: '800ml'
  },
  {
    id: 'tea-tool-002',
    slug: 'bamboo-tea-strainer',
    name: 'Bamboo Tea Strainer',
    description: 'Saringan teh dari bambu natural untuk pengalaman tradisional',
    price: 45000,
    image: '/api/placeholder/300/300',
    category: 'tea',
    subcategory: 'tool',
    stock: 67,
    rating: 4.4,
    reviews: 91,
    tags: ['bamboo', 'eco-friendly', 'traditional']
  }
];