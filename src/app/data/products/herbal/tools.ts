import {Product} from '@/types/product';

export const herbalTools: Product[] = [
  {
    id: 'herbal-tool-001',
    slug: 'herbal-tea-infuser-ball',
    name: 'Herbal Tea Infuser Ball',
    description: 'Bola infuser stainless steel untuk menyeduh teh herbal',
    price: 35000,
    image: '/api/placeholder/300/300',
    category: 'herbal',
    subcategory: 'tool',
    stock: 78,
    rating: 4.3,
    reviews: 45,
    tags: ['infuser', 'stainless-steel', 'easy-clean']
  },
  {
    id: 'herbal-tool-002',
    slug: 'mortar-and-pestle-set',
    name: 'Mortar and Pestle Set',
    description: 'Set lumpang dan alu dari batu granit untuk menggiling herbal',
    price: 125000,
    image: '/api/placeholder/300/300',
    category: 'herbal',
    subcategory: 'tool',
    stock: 22,
    rating: 4.8,
    reviews: 34,
    tags: ['granite', 'traditional', 'grinding']
  }
];