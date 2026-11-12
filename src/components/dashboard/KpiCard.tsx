import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkline } from '@/components/charts/Sparkline';
import { formatSignedPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

type Tone = 'blue' | 'rose' | 'emerald' | 'amber';
type TrendTone = 'positive' | 'negative' | 'neutral';

const toneStyles: Record<Tone, { surface: string; icon: string; accent: string }> = {
  blue: {
    surface: 'bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40',
    icon: 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/25',
    accent: 'from-blue-500 via-indigo-400 to-cyan-300',
  },
  rose: {
    surface: 'bg-gradient-to-br from-rose-50/90 via-white to-orange-50/40',
    icon: 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm shadow-rose-500/25',
    accent: 'from-rose-500 via-orange-400 to-amber-300',
  },
  emerald: {
    surface: 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40',
    icon: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/25',
    accent: 'from-emerald-500 via-teal-400 to-cyan-300',
  },
  amber: {
    surface: 'bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/40',
    icon: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25',
    accent: 'from-amber-500 via-orange-400 to-yellow-300',
  },
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
    <Card className={cn('relative overflow-hidden transition-shadow duration-200 hover:shadow-md', toneStyles[tone].surface)}>
      <span className={cn('absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r', toneStyles[tone].accent)} />
      <CardContent className="flex h-full flex-col p-5 pt-6 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', toneStyles[tone].icon)}>
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
          <span className="text-[10px] text-slate-400">frente al anterior</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{description}</p>
        <div className="mt-auto pt-4">
          <Sparkline data={sparkline} color={sparklineColor} id={id} />
        </div>
      </CardContent>
    </Card>
  );
}
