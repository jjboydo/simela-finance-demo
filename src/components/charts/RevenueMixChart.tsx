import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import type { UnitRevenueBreakdown } from '@/lib/calculations';
import { ChartTooltip } from './ChartTooltip';

interface RevenueMixChartProps {
  data: UnitRevenueBreakdown[];
  className?: string;
  accent?: string;
}

export function RevenueMixChart({ data, className, accent }: RevenueMixChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const chartData = data.map((item) => ({
    name: item.unit.shortName,
    amount: item.amount,
    color: item.unit.color,
    fullLabel: item.unit.name,
  }));

  return (
    <ChartCard
      title="Composición de ingresos"
      description="Distribución de la facturación por unidad de negocio."
      className={className}
      accent={accent}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-[190px] w-full max-w-[210px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                innerRadius="64%"
                outerRadius="88%"
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip heading="Ingresos por unidad" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Total</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900">
              {formatCompactCurrency(total)}
            </p>
          </div>
        </div>

        <div className="w-full space-y-4">
          {data.map((item) => (
            <div key={item.unit.id}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-700">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.unit.color }}
                  />
                  <span className="truncate">{item.unit.shortName}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.share}%`, backgroundColor: item.unit.color }}
                  />
                </div>
                <span className="w-12 text-right text-[11px] tabular-nums text-slate-500">
                  {formatPercent(item.share, 1)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                {formatNumber(item.invoiceCount)} facturas emitidas
              </p>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
