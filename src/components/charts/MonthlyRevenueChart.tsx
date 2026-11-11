import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { CHART_COLORS } from '@/lib/chart-colors';
import { formatCompactCurrency } from '@/lib/formatters';
import type { MonthlyUnitRevenuePoint } from '@/lib/calculations';
import { ChartTooltip } from './ChartTooltip';

interface MonthlyRevenueChartProps {
  data: MonthlyUnitRevenuePoint[];
  title?: string;
  description?: string;
  className?: string;
}

export function MonthlyRevenueChart({
  data,
  title = 'Evolución mensual de facturación',
  description = 'Facturación de los últimos 12 meses por unidad de negocio.',
  className,
}: MonthlyRevenueChartProps) {
  return (
    <ChartCard
      title={title}
      description={description}
      className={className}
      contentClassName="flex flex-col"
      footer={
        <span>
          Cada barra representa la facturación emitida en el mes. La altura total equivale a los
          ingresos del período.
        </span>
      }
    >
      <div className="min-h-[290px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              width={68}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ paddingTop: 18, fontSize: 12, color: '#64748b' }}
            />
            <Bar
              name="Salud laboral"
              dataKey="salud-laboral"
              stackId="facturacion"
              fill="#2563eb"
              barSize={22}
            />
            <Bar
              name="Medicina laboral"
              dataKey="medicina-laboral"
              stackId="facturacion"
              fill="#10b981"
              barSize={22}
            />
            <Bar
              name="Otros servicios"
              dataKey="otros-servicios"
              stackId="facturacion"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
