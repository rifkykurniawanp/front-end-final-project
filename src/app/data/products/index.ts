import { teaIngredients } from './tea/ingredients';
import { teaTools } from './tea/tools';
import { coffeeIngredients } from './coffee/ingredients';
import { coffeeTools } from './coffee/tools';
import { herbalIngredients } from './herbal/ingredients';
import { herbalTools } from './herbal/tools';
import { supportIngredients } from './support/ingredients';
import { supportTools } from './support/tools';
import { Product } from '@/types/product';

export const allProducts: Product[] = [
  ...teaIngredients,
  ...teaTools,
  ...coffeeIngredients,
  ...coffeeTools,
  ...herbalIngredients,
  ...herbalTools,
  ...supportIngredients,
  ...supportTools
];