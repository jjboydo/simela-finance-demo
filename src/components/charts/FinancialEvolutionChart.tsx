import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { CHART_COLORS } from '@/lib/chart-colors';
import { formatCompactCurrency, formatPercent } from '@/lib/formatters';
import type { MonthlyFinancialPoint } from '@/types';
import { ChartTooltip } from './ChartTooltip';

interface FinancialEvolutionChartProps {
  data: MonthlyFinancialPoint[];
  className?: string;
}

export function FinancialEvolutionChart({ data, className }: FinancialEvolutionChartProps) {
  const totalRevenue = data.reduce((total, point) => total + point.revenue, 0);
  const totalCosts = data.reduce((total, point) => total + point.costs, 0);
  const totalResult = totalRevenue - totalCosts;
  const averageMargin = totalRevenue ? (totalResult / totalRevenue) * 100 : 0;

  return (
    <ChartCard
      title="Evolución financiera"
      description="Ingresos, costos y resultado operativo de los últimos 12 meses."
      className={className}
      contentClassName="flex flex-col"
      footer={
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Ingresos acumulados
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">
              {formatCompactCurrency(totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Costos acumulados
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">
              {formatCompactCurrency(totalCosts)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              Margen promedio
            </p>
            <p className="mt-0.5 text-sm font-semibold text-emerald-600">
              {formatPercent(averageMargin, 1)}
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-[300px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
              dy={8}
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
              width={64}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ paddingTop: 18, fontSize: 12, color: '#64748b' }}
            />
            <Line
              type="monotone"
              name="Ingresos"
              dataKey="revenue"
              stroke={CHART_COLORS.ingresos}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              name="Costos"
              dataKey="costs"
              stroke={CHART_COLORS.costos}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              name="Resultado operativo"
              dataKey="result"
              stroke={CHART_COLORS.resultado}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Valores en pesos argentinos. El resultado surge de ingresos menos costos.
      </p>
    </ChartCard>
  );
}
