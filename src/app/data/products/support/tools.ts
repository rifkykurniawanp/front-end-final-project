import { Product } from '@/types/product';  

export const supportTools: Product[] = [
  {
    id: 'support-001',
    slug: 'digital-scale',
    name: 'Digital Scale',
    description: 'Timbangan digital presisi untuk mengukur bahan dengan akurat',
    price: 195000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'support',
    stock: 29,
    rating: 4.7,
    reviews: 156,
    tags: ['precision', 'digital', 'essential']
  },
  {
    id: 'support-002',
    slug: 'gooseneck-kettle',
    name: 'Gooseneck Kettle',
    description: 'Ketel leher angsa untuk kontrol tuang yang presisi',
    price: 285000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'support',
    stock: 18,
    rating: 4.9,
    reviews: 87,
    tags: ['gooseneck', 'precision', 'pour-control']
  },
  {
    id: 'support-003',
    slug: 'temperature-thermometer',
    name: 'Temperature Thermometer',
    description: 'Termometer digital untuk mengukur suhu air dengan akurat',
    price: 85000,
    image: '/api/placeholder/300/300',
    category: 'tea',
    subcategory: 'support',
    stock: 43,
    rating: 4.5,
    reviews: 92,
    tags: ['digital', 'temperature', 'accuracy']
  }
];
