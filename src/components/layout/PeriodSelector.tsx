import { CalendarDays, ChevronDown } from 'lucide-react';
import { usePeriod } from '@/context/PeriodContext';
import type { PeriodKey } from '@/types';

const PERIOD_OPTIONS: { value: PeriodKey; label: string }[] = [
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '2026', label: 'Año 2026' },
  { value: '2025', label: 'Año 2025' },
];

export function PeriodSelector() {
  const { period, setPeriod } = usePeriod();

  return (
    <div className="relative flex shrink-0 items-center">
      <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
      <select
        aria-label="Seleccionar período"
        value={period}
        onChange={(event) => setPeriod(event.target.value as PeriodKey)}
        className="h-9 w-[158px] appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-[184px]"
      >
        {PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-slate-400" />
    </div>
  );
}
