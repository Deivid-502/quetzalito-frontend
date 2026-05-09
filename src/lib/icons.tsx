import {
  Utensils, Bus, BookOpen, Gamepad2, HeartPulse, PlugZap, Home, Shirt,
  Smartphone, CircleDot, Briefcase, PiggyBank, Laptop, Gift, ArrowDownCircle,
  Wallet, Coffee, Car, Fuel, ShoppingCart, ShoppingBag, Pizza, Beer, Music,
  Film, Dumbbell, Plane, Baby, Stethoscope, Pill, GraduationCap, Pencil,
  Building, Wrench, Wifi, Tv, Banknote, CreditCard, TrendingUp, Sparkles,
  Heart, PawPrint, type LucideIcon,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  // Originales del seed
  utensils: Utensils,
  bus: Bus,
  'book-open': BookOpen,
  'gamepad-2': Gamepad2,
  'heart-pulse': HeartPulse,
  'plug-zap': PlugZap,
  home: Home,
  shirt: Shirt,
  smartphone: Smartphone,
  'circle-dot': CircleDot,
  briefcase: Briefcase,
  'piggy-bank': PiggyBank,
  laptop: Laptop,
  gift: Gift,
  'arrow-down-circle': ArrowDownCircle,
  wallet: Wallet,
  // Extras curados para categorías personalizadas
  coffee: Coffee,
  car: Car,
  fuel: Fuel,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  pizza: Pizza,
  beer: Beer,
  music: Music,
  film: Film,
  dumbbell: Dumbbell,
  plane: Plane,
  baby: Baby,
  stethoscope: Stethoscope,
  pill: Pill,
  'graduation-cap': GraduationCap,
  pencil: Pencil,
  building: Building,
  wrench: Wrench,
  wifi: Wifi,
  tv: Tv,
  banknote: Banknote,
  'credit-card': CreditCard,
  'trending-up': TrendingUp,
  sparkles: Sparkles,
  heart: Heart,
  'paw-print': PawPrint,
};

/** Lista curada para el picker de categorías */
export const CATEGORY_ICON_NAMES: string[] = [
  // Comida
  'utensils', 'pizza', 'coffee', 'beer', 'shopping-cart',
  // Transporte
  'bus', 'car', 'fuel', 'plane',
  // Hogar y servicios
  'home', 'building', 'plug-zap', 'wifi', 'tv', 'wrench',
  // Personal
  'shirt', 'shopping-bag', 'sparkles',
  // Salud
  'heart-pulse', 'pill', 'stethoscope', 'dumbbell', 'baby', 'paw-print',
  // Educación / trabajo
  'book-open', 'graduation-cap', 'pencil', 'briefcase', 'laptop',
  // Ocio
  'gamepad-2', 'film', 'music', 'gift', 'heart',
  // Tecnología
  'smartphone',
  // Dinero
  'banknote', 'credit-card', 'piggy-bank', 'wallet', 'trending-up',
  // Otros
  'circle-dot',
];

export function resolveIcon(name: string): LucideIcon | string {
  return map[name] ?? name;
}

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const resolved = resolveIcon(name);
  if (typeof resolved === 'string') {
    return <span className={className}>{resolved}</span>;
  }
  const Icon = resolved;
  return <Icon className={className} />;
}

/**
 * Versión inline pequeña para usar dentro de <p> u otros contenedores de texto.
 * Renderiza un ícono Lucide pequeño o el emoji tal cual.
 */
export function InlineIcon({ icon }: { icon: string }) {
  const resolved = resolveIcon(icon);
  if (typeof resolved === 'string') {
    return <>{resolved}</>;
  }
  const Icon = resolved;
  return <Icon className="inline h-3 w-3 mr-0.5 -mt-0.5" />;
}
