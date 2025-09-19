
import { Utensils, Car, Home, Film, HeartPulse, ShoppingCart, Lightbulb, DollarSign, Tag, Receipt, Gift } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const categoryIcons: { [key: string]: LucideIcon } = {
  'Alimentação': Utensils,
  'Transporte': Car,
  'Moradia': Home,
  'Lazer': Film,
  'Saúde': HeartPulse,
  'Compras': ShoppingCart,
  'Serviços': Lightbulb,
  'Renda': DollarSign,
  'Contas': Receipt,
  'Presentes': Gift,
  'default': Tag,
};
