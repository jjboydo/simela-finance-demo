import {
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Resumen general',
    description: 'Visión consolidada',
    icon: LayoutDashboard,
  },
  {
    href: '/facturacion',
    label: 'Facturación',
    description: 'Ingresos emitidos',
    icon: ReceiptText,
  },
  {
    href: '/costos',
    label: 'Costos y gastos',
    description: 'Estructura de costos',
    icon: Wallet,
  },
  {
    href: '/cuentas-por-cobrar',
    label: 'Cuentas por cobrar',
    description: 'Cobranzas y morosidad',
    icon: HandCoins,
  },
  {
    href: '/rentabilidad',
    label: 'Rentabilidad',
    description: 'Resultado y márgenes',
    icon: TrendingUp,
  },
];

export function getSectionName(pathname: string): string {
  const item = NAV_ITEMS.find((navItem) => navItem.href === pathname);
  return item?.label ?? 'Panel financiero';
}
