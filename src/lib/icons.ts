import { Utensils, Car, Home, Film, HeartPulse, ShoppingCart, Lightbulb, DollarSign } from 'lucide-react';
import type { CategoryIconMap } from './types';

export const categoryIcons: CategoryIconMap = {
  'Food': Utensils,
  'Transportation': Car,
  'Housing': Home,
  'Entertainment': Film,
  'Health': HeartPulse,
  'Shopping': ShoppingCart,
  'Utilities': Lightbulb,
  'Income': DollarSign,
};
