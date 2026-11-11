import {
  Area,
  AreaChart,
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
import type { MonthlyCostPoint } from '@/lib/calculations';
import { ChartTooltip } from './ChartTooltip';

interface MonthlyCostChartProps {
  data: MonthlyCostPoint[];
  title?: string;
  description?: string;
  className?: string;
}

export function MonthlyCostChart({
  data,
  title = 'Evolución mensual de costos',
  description = 'Costos fijos y variables de los últimos 12 meses.',
  className,
}: MonthlyCostChartProps) {
  return (
    <ChartCard
      title={title}
      description={description}
      className={className}
      contentClassName="flex flex-col"
      footer={
        <span>
          Los costos fijos incluyen estructura y servicios; los variables, insumos y gastos
          operativos.
        </span>
      }
    >
      <div className="min-h-[290px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cost-fixed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="cost-variable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              width={60}
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
            <Area
              type="monotone"
              name="Costos fijos"
              dataKey="fijo"
              stackId="costos"
              stroke="#1d4ed8"
              strokeWidth={2}
              fill="url(#cost-fixed)"
            />
            <Area
              type="monotone"
              name="Costos variables"
              dataKey="variable"
              stackId="costos"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#cost-variable)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
