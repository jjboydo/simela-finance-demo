import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Tone = 'blue' | 'rose' | 'emerald' | 'amber' | 'violet' | 'slate';

const toneStyles: Record<Tone, { surface: string; icon: string; accent: string }> = {
  blue: {
    surface: 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/30',
    icon: 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/25',
    accent: 'from-blue-500 via-indigo-400 to-cyan-300',
  },
  rose: {
    surface: 'bg-gradient-to-br from-rose-50/80 via-white to-orange-50/30',
    icon: 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-sm shadow-rose-500/25',
    accent: 'from-rose-500 via-orange-400 to-amber-300',
  },
  emerald: {
    surface: 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/30',
    icon: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/25',
    accent: 'from-emerald-500 via-teal-400 to-cyan-300',
  },
  amber: {
    surface: 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/30',
    icon: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25',
    accent: 'from-amber-500 via-orange-400 to-yellow-300',
  },
  violet: {
    surface: 'bg-gradient-to-br from-violet-50/80 via-white to-fuchsia-50/30',
    icon: 'bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-sm shadow-violet-500/25',
    accent: 'from-violet-500 via-purple-400 to-fuchsia-300',
  },
  slate: {
    surface: 'bg-gradient-to-br from-slate-50/80 via-white to-slate-100/30',
    icon: 'bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-sm shadow-slate-500/20',
    accent: 'from-slate-400 via-slate-300 to-slate-200',
  },
};

interface StatCardProps {
  label: string;
  value: string;
  description?: string;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
}

export function StatCard({ label, value, description, hint, icon: Icon, tone = 'blue' }: StatCardProps) {
  return (
    <Card className={cn('relative overflow-hidden transition-shadow duration-200 hover:shadow-md', toneStyles[tone].surface)}>
      <span className={cn('absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r', toneStyles[tone].accent)} />
      <CardContent className="flex h-full flex-col p-5 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', toneStyles[tone].icon)}>
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 whitespace-nowrap text-[20px] font-semibold leading-tight tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
        <div className="mt-auto pt-3">
          {hint ? <div className="mb-2">{hint}</div> : null}
          {description ? (
            <p className="text-xs leading-relaxed text-slate-500">{description}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
