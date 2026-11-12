import {
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface SectionTheme {
  gradient: string;
  icon: string;
  active: string;
  hover: string;
  dot: string;
}

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  theme: SectionTheme;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Resumen general',
    description: 'Visión consolidada',
    icon: LayoutDashboard,
    theme: {
      gradient: 'from-indigo-500 via-blue-500 to-cyan-400',
      icon: 'text-indigo-500',
      active: 'bg-indigo-50 text-indigo-700',
      hover: 'hover:bg-indigo-50/70 hover:text-indigo-700',
      dot: 'bg-indigo-500',
    },
  },
  {
    href: '/facturacion',
    label: 'Facturación',
    description: 'Ingresos emitidos',
    icon: ReceiptText,
    theme: {
      gradient: 'from-teal-500 via-cyan-500 to-sky-500',
      icon: 'text-teal-500',
      active: 'bg-teal-50 text-teal-700',
      hover: 'hover:bg-teal-50/70 hover:text-teal-700',
      dot: 'bg-teal-500',
    },
  },
  {
    href: '/costos',
    label: 'Costos y gastos',
    description: 'Estructura de costos',
    icon: Wallet,
    theme: {
      gradient: 'from-orange-500 via-amber-500 to-yellow-400',
      icon: 'text-orange-500',
      active: 'bg-orange-50 text-orange-700',
      hover: 'hover:bg-orange-50/70 hover:text-orange-700',
      dot: 'bg-orange-500',
    },
  },
  {
    href: '/cuentas-por-cobrar',
    label: 'Cuentas por cobrar',
    description: 'Cobranzas y morosidad',
    icon: HandCoins,
    theme: {
      gradient: 'from-amber-500 via-orange-500 to-rose-400',
      icon: 'text-amber-500',
      active: 'bg-amber-50 text-amber-700',
      hover: 'hover:bg-amber-50/70 hover:text-amber-700',
      dot: 'bg-amber-500',
    },
  },
  {
    href: '/rentabilidad',
    label: 'Rentabilidad',
    description: 'Resultado y márgenes',
    icon: TrendingUp,
    theme: {
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-400',
      icon: 'text-violet-500',
      active: 'bg-violet-50 text-violet-700',
      hover: 'hover:bg-violet-50/70 hover:text-violet-700',
      dot: 'bg-violet-500',
    },
  },
];

export function getSectionName(pathname: string): string {
  const item = NAV_ITEMS.find((navItem) => navItem.href === pathname);
  return item?.label ?? 'Panel financiero';
}

export function getSectionTheme(pathname: string): SectionTheme {
  const item = NAV_ITEMS.find((navItem) => navItem.href === pathname);
  return item?.theme ?? NAV_ITEMS[0].theme;
}
