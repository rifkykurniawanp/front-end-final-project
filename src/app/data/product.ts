// data/products.ts
import { Product } from '@/types/product';
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const teaIngredients: Product[] = [
  {
   id: 'tea-001',
    slug: generateSlug('Earl Grey Premium'),
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
    slug: generateSlug('Jasmine Green Tea'),
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
    slug: generateSlug('Chamomile Tea'),
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

export const teaTools: Product[] = [
  {
    id: 'tea-tool-001',
    slug: generateSlug('Glass Teapot with Infuser'),
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
    slug: generateSlug('Bamboo Tea Strainer'),
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

export const coffeeIngredients: Product[] = [
  {
    id: 'coffee-001',
    slug: generateSlug('Ethiopian Yirgacheffe'),
    name: 'Ethiopian Yirgacheffe',
    description: 'Kopi single origin dengan rasa fruity dan floral yang kompleks',
    price: 165000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'ingredient',
    stock: 38,
    rating: 4.9,
    reviews: 156,
    tags: ['single-origin', 'fruity', 'premium'],
    origin: 'Ethiopia',
    weight: '200g',
    roastLevel: 'light',
    caffeine: 'high',
    brewingMethod: ['pour-over', 'french-press', 'espresso']
  },
  {
    id: 'coffee-002',
    slug: generateSlug('Colombian Supremo'),
    name: 'Colombian Supremo',
    description: 'Kopi Colombia dengan body yang seimbang dan rasa cokelat',
    price: 145000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'ingredient',
    stock: 52,
    rating: 4.7,
    reviews: 203,
    tags: ['balanced', 'chocolate', 'smooth'],
    origin: 'Colombia',
    weight: '200g',
    roastLevel: 'medium',
    caffeine: 'high',
    brewingMethod: ['espresso', 'drip', 'french-press']
  },
  {
     id: 'coffee-003',
    slug: generateSlug('Java Robusta'),
    name: 'Java Robusta',
    description: 'Kopi robusta dari Jawa dengan rasa yang kuat dan bold',
    price: 95000,
    image: '/api/placeholder/300/300',
    category: 'coffee',
    subcategory: 'ingredient',
    stock: 41,
    rating: 4.5,
    reviews: 87,
    tags: ['bold', 'strong', 'local'],
    origin: 'Indonesia',
    weight: '200g',
    roastLevel: 'dark',
    caffeine: 'high',
    brewingMethod: ['espresso', 'turkish', 'moka-pot']
  }
];

export const coffeeTools: Product[] = [
  {
    id: 'coffee-tool-001',
    slug: generateSlug('V60 Dripper Set'),
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
    slug: generateSlug('French Press 350ml'),
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
    slug: generateSlug('Manual Coffee Grinder'),
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

export const herbalIngredients: Product[] = [
  {
    id: 'herbal-001',
    slug: generateSlug('Lemon Balm'),
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
    slug: generateSlug('Peppermint Leaves'),
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
    slug: generateSlug('Ginger Root'),
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

export const herbalTools: Product[] = [
  {
    id: 'herbal-tool-001',
    slug: generateSlug('Herbal Tea Infuser Ball'),
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
    slug: generateSlug('Mortar and Pestle Set'),
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

export const supportTools: Product[] = [
  {
     id: 'support-001',
    slug: generateSlug('Digital Scale'),
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
    slug: generateSlug('Gooseneck Kettle'),
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
    slug: generateSlug('Temperature Thermometer'),
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

export const supportIngredients: Product[] = [
  {
    id: 'support-ing-001',
    slug: generateSlug('Organic Honey'),
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
    slug: generateSlug('Coconut Sugar'),
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
    slug: generateSlug('Cinnamon Sticks'),
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

export const allProducts: Product[] = [
  ...teaIngredients,
  ...teaTools,
  ...coffeeIngredients,
  ...coffeeTools,
  ...herbalIngredients,
  ...herbalTools,
  ...supportTools,
  ...supportIngredients
];