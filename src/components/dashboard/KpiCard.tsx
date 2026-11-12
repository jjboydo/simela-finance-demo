import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkline } from '@/components/charts/Sparkline';
import { formatSignedPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

type Tone = 'blue' | 'rose' | 'emerald' | 'amber';
type TrendTone = 'positive' | 'negative' | 'neutral';

const iconToneClasses: Record<Tone, string> = {
  blue: 'bg-blue-50 text-blue-600',
  rose: 'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
};

const accentClasses: Record<Tone, string> = {
  blue: 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300',
  rose: 'bg-gradient-to-r from-rose-500 via-rose-400 to-rose-300',
  emerald: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300',
  amber: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300',
};

const trendClasses: Record<TrendTone, string> = {
  positive: 'bg-emerald-50 text-emerald-700',
  negative: 'bg-rose-50 text-rose-700',
  neutral: 'bg-slate-100 text-slate-600',
};

interface KpiCardProps {
  id: string;
  label: string;
  value: string;
  delta: number | null;
  positiveWhen: 'up' | 'down';
  description: string;
  icon: LucideIcon;
  tone: Tone;
  sparkline: number[];
  sparklineColor: string;
}

export function KpiCard({
  id,
  label,
  value,
  delta,
  positiveWhen,
  description,
  icon: Icon,
  tone,
  sparkline,
  sparklineColor,
}: KpiCardProps) {
  const trendTone: TrendTone =
    delta === null || Math.abs(delta) < 0.05
      ? 'neutral'
      : (delta > 0) === (positiveWhen === 'up')
        ? 'positive'
        : 'negative';
  const TrendIcon = delta === null || Math.abs(delta) < 0.05 ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <span className={cn('absolute inset-x-0 top-0 h-[3px]', accentClasses[tone])} />
      <CardContent className="flex h-full flex-col p-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconToneClasses[tone])}>
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2.5 text-[24px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
              trendClasses[trendTone],
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {delta === null ? '—' : formatSignedPercent(delta, 1)}
          </span>
          <span className="text-[10px] text-slate-400">vs. período anterior</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{description}</p>
        <div className="mt-auto pt-4">
          <Sparkline data={sparkline} color={sparklineColor} id={id} />
        </div>
      </CardContent>
    </Card>
  );
}
