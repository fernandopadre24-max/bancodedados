import { Utensils, Car, Home, Film, HeartPulse, ShoppingCart, Lightbulb, DollarSign, Tag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const categoryIcons: { [key: string]: LucideIcon } = {
  'Alimentação': Utensils,
  'Transporte': Car,
  'Moradia': Home,
  'Entretenimento': Film,
  'Saúde': HeartPulse,
  'Compras': ShoppingCart,
  'Serviços': Lightbulb,
  'Renda': DollarSign,
  'default': Tag,
};
