import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Tone = 'blue' | 'rose' | 'emerald' | 'amber' | 'violet' | 'slate';

const toneClasses: Record<Tone, string> = {
  blue: 'bg-blue-50 text-blue-600',
  rose: 'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  violet: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
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
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', toneClasses[tone])}>
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
