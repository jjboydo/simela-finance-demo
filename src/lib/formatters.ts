import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('es-AR');

export function formatCurrency(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)} %`;
}

export function formatSignedPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatNumber(value, decimals)} %`;
}

export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}$ ${formatNumber(abs / 1_000_000, 0)} M`;
  if (abs >= 1_000_000) return `${sign}$ ${formatNumber(abs / 1_000_000, 1)} M`;
  if (abs >= 1_000) return `${sign}$ ${formatNumber(abs / 1_000, 0)} K`;
  return `${sign}$ ${formatNumber(abs, 0)}`;
}

export function formatDate(value: string | Date, pattern = 'dd/MM/yyyy'): string {
  const date = typeof value === 'string' ? parseISO(value) : value;
  if (!isValid(date)) return '—';
  return format(date, pattern, { locale: es });
}

export function formatLongDate(value: string | Date): string {
  return formatDate(value, "d 'de' MMMM 'de' yyyy");
}

export function formatMonthShort(value: string | Date): string {
  return formatDate(value, 'MMM');
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatCount(value: number): string {
  return numberFormatter.format(Number.isFinite(value) ? value : 0);
}

/** Número con coma decimal, listo para abrir un CSV en Excel en español. */
export function formatCsvNumber(value: number): string {
  return (Number.isFinite(value) ? value : 0).toFixed(2).replace('.', ',');
}
