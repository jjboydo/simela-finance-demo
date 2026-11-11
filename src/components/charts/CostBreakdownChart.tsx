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
import { ChartCard } from '@/components/dashboard/ChartCard';
import { formatCompactCurrency, formatPercent } from '@/lib/formatters';
import type { CategoryBreakdown } from '@/lib/calculations';
import { CHART_COLORS } from '@/lib/chart-colors';
import { ChartTooltip } from './ChartTooltip';

interface CostBreakdownChartProps {
  data: CategoryBreakdown[];
  selectedCategory?: string;
  className?: string;
}

export function CostBreakdownChart({ data, selectedCategory, className }: CostBreakdownChartProps) {
  const chartData = data.map((item) => ({
    id: item.category.id,
    name: item.category.name,
    amount: item.amount,
    color: item.category.color,
  }));
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const topCategory = [...data].sort((a, b) => b.amount - a.amount)[0];

  return (
    <ChartCard
      title="Distribución de costos"
      description="Peso de cada categoría dentro del total del período."
      className={className}
      contentClassName="flex flex-col"
      footer={
        topCategory ? (
          <>
            Mayor peso: <span className="ml-1 font-medium text-slate-700">{topCategory.category.name}</span>
            <span className="ml-1 text-slate-400">· {formatPercent(topCategory.share, 1)} del total</span>
          </>
        ) : null
      }
    >
      <div className="min-h-[260px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
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
              width={148}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#475569', fontSize: 11 }}
            />
            <Tooltip
              content={<ChartTooltip heading="Costos por categoría" />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
            />
            <Bar dataKey="amount" name="Costo" radius={[0, 6, 6, 0]} barSize={18}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={entry.color}
                  fillOpacity={selectedCategory && selectedCategory !== entry.id ? 0.25 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {selectedCategory ? (
        <p className="mt-2 text-[11px] text-slate-400">
          Las demás categorías se muestran atenuadas por el filtro aplicado.
        </p>
      ) : null}
      {total === 0 ? <p className="mt-2 text-xs text-slate-500">Sin costos en el período.</p> : null}
    </ChartCard>
  );
}
