import { capitalize, formatCurrency, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface TooltipItem {
  name?: string | number;
  value?: string | number;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string | number;
  heading?: string;
  percentKeys?: string[];
}

export function ChartTooltip({ active, payload, label, heading, percentKeys = [] }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const fullLabel = payload[0]?.payload?.fullLabel;
  const title =
    (typeof fullLabel === 'string' ? fullLabel : undefined) ??
    (typeof label === 'string' ? capitalize(label) : label) ??
    heading;

  return (
    <div className="min-w-[190px] rounded-lg border border-slate-200 bg-white/95 p-3 shadow-popover backdrop-blur">
      {title ? <p className="mb-2 text-xs font-semibold text-slate-900">{title}</p> : null}
      <div className="space-y-1.5">
        {payload.map((item, index) => {
          const isPercent = percentKeys.includes(String(item.dataKey));
          const numericValue = typeof item.value === 'number' ? item.value : Number(item.value ?? 0);
          return (
            <div key={`${String(item.dataKey ?? item.name ?? index)}`} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex min-w-0 items-center gap-2 text-slate-500">
                <span
                  className={cn('h-2 w-2 shrink-0 rounded-full bg-slate-300')}
                  style={item.color ? { backgroundColor: item.color } : undefined}
                />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="shrink-0 font-medium tabular-nums text-slate-900">
                {isPercent ? formatPercent(numericValue, 1) : formatCurrency(numericValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
