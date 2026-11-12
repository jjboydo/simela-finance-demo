import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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

interface ProfitabilityChartProps {
  data: MonthlyFinancialPoint[];
  className?: string;
}

export function ProfitabilityChart({ data, className }: ProfitabilityChartProps) {
  return (
    <ChartCard
      title="Ingresos, costos y margen"
      description="Evolución de los últimos 12 meses. El margen se calcula sobre los ingresos."
      className={className}
      contentClassName="flex flex-col"
      footer={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
          <span className="text-slate-500">Facturación menos costos = resultado operativo.</span>
          <span className="font-medium text-slate-600">
            Resultado / facturación = margen operativo.
          </span>
        </div>
      }
    >
      <div className="min-h-[320px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
              dy={8}
            />
            <YAxis
              yAxisId="money"
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
              width={72}
            />
            <YAxis
              yAxisId="margin"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(value: number) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
              width={40}
            />
            <Tooltip
              content={<ChartTooltip percentKeys={['margin']} />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ paddingTop: 18, fontSize: 12, color: '#64748b' }}
            />
            <Bar
              yAxisId="money"
              name="Ingresos"
              dataKey="revenue"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Bar
              yAxisId="money"
              name="Costos"
              dataKey="costs"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Line
              yAxisId="margin"
              type="monotone"
              name="Margen"
              dataKey="margin"
              stroke={CHART_COLORS.margen}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Margen promedio del período:{' '}
        {formatPercent(
          data.reduce((sum, point) => sum + point.revenue, 0)
            ? (data.reduce((sum, point) => sum + point.result, 0) /
                data.reduce((sum, point) => sum + point.revenue, 0)) *
                100
            : 0,
          1,
        )}
      </p>
    </ChartCard>
  );
}
