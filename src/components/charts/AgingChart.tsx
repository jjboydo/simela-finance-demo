import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCompactCurrency } from '@/lib/formatters';
import type { AgingBucket } from '@/types';
import { CHART_COLORS } from '@/lib/chart-colors';
import { ChartTooltip } from './ChartTooltip';

interface AgingChartProps {
  data: AgingBucket[];
}

export function AgingChart({ data }: AgingChartProps) {
  const chartData = data.map((bucket) => ({
    name: bucket.label,
    amount: bucket.amount,
    color: bucket.color,
    invoices: bucket.invoices,
  }));

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barCategoryGap={12}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis
            type="number"
            tickFormatter={formatCompactCurrency}
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={105}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#475569', fontSize: 11 }}
          />
          <Tooltip
            content={<ChartTooltip heading="Antigüedad de la deuda" />}
            cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
          />
          <Bar dataKey="amount" name="Saldo pendiente" radius={[0, 6, 6, 0]} barSize={20}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
