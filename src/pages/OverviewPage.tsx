import { useMemo } from 'react';
import {
  CalendarRange,
  CircleDollarSign,
  Download,
  HandCoins,
  Info,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { PeriodInsight } from '@/components/dashboard/PeriodInsight';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { ReceivablesOverview } from '@/components/dashboard/ReceivablesOverview';
import { FinancialEvolutionChart } from '@/components/charts/FinancialEvolutionChart';
import { RevenueMixChart } from '@/components/charts/RevenueMixChart';
import { CostBreakdownChart } from '@/components/charts/CostBreakdownChart';
import { usePeriod } from '@/context/PeriodContext';
import { DATA_UPDATED_AT } from '@/data/mock-data';
import {
  getCostsByCategory,
  getFinancialAlerts,
  getKpiSparklines,
  getMonthlyFinancials,
  getReceivables,
  getRevenueByUnit,
  getSummary,
  percentChange,
} from '@/lib/calculations';
import { downloadCsv } from '@/lib/csv';
import { formatCurrency, formatCsvNumber, formatDate } from '@/lib/formatters';

export function OverviewPage() {
  const { period, definition } = usePeriod();
  const summary = useMemo(() => getSummary(period), [period]);
  const sparklines = useMemo(() => getKpiSparklines(period), [period]);
  const monthly = useMemo(() => getMonthlyFinancials(definition.end), [definition.end]);
  const units = useMemo(() => getRevenueByUnit(definition), [definition]);
  const categories = useMemo(() => getCostsByCategory(definition), [definition]);
  const receivables = useMemo(() => getReceivables(definition.end), [definition.end]);
  const alerts = useMemo(() => getFinancialAlerts(period), [period]);

  const handleExport = () => {
    downloadCsv(
      `simela-resumen-${period}.csv`,
      ['Mes', 'Ingresos (ARS)', 'Costos (ARS)', 'Resultado operativo (ARS)', 'Margen (%)', 'Facturas'],
      monthly.map((point) => [
        point.fullLabel,
        formatCsvNumber(point.revenue),
        formatCsvNumber(point.costs),
        formatCsvNumber(point.result),
        formatCsvNumber(point.margin),
        point.invoiceCount,
      ]),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumen financiero"
        description="Una visión consolidada del estado económico de la empresa."
        meta={
          <>
            <Badge variant="outline" className="gap-1.5 py-1">
              <CalendarRange className="h-3.5 w-3.5 text-slate-400" />
              {definition.label}
            </Badge>
            <span className="text-[11px] text-slate-400 md:hidden">
              Actualizado el {formatDate(DATA_UPDATED_AT, 'dd/MM/yyyy')} a las{' '}
              {formatDate(DATA_UPDATED_AT, 'HH:mm')} hs
            </span>
          </>
        }
        actions={
          <Button onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar informe
          </Button>
        }
        footnote={
          <>
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Información de demostración con datos ficticios. No representa datos reales de Simela
              Salud Laboral ni una integración con sus sistemas.
            </span>
          </>
        }
      />

      <PeriodInsight
        revenue={summary.revenue}
        result={summary.result}
        margin={summary.margin}
        revenueDelta={percentChange(summary.revenue, summary.previous.revenue)}
        comparisonLabel={definition.comparisonLabel}
        overdue={receivables.overdue}
        overdueShare={receivables.total ? (receivables.overdue / receivables.total) * 100 : 0}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          id="revenue"
          label="Ingresos totales"
          value={formatCurrency(summary.revenue)}
          delta={percentChange(summary.revenue, summary.previous.revenue)}
          positiveWhen="up"
          description="Facturación acumulada del período."
          icon={TrendingUp}
          tone="blue"
          sparkline={sparklines.revenue}
          sparklineColor="#2563eb"
        />
        <KpiCard
          id="costs"
          label="Costos y gastos"
          value={formatCurrency(summary.costs)}
          delta={percentChange(summary.costs, summary.previous.costs)}
          positiveWhen="down"
          description="Costos fijos y variables del período."
          icon={Wallet}
          tone="rose"
          sparkline={sparklines.costs}
          sparklineColor="#e11d48"
        />
        <KpiCard
          id="pending"
          label="Cuentas por cobrar"
          value={formatCurrency(summary.pending)}
          delta={percentChange(summary.pending, summary.previous.pending)}
          positiveWhen="down"
          description="Saldo pendiente al cierre del período."
          icon={HandCoins}
          tone="amber"
          sparkline={sparklines.pending}
          sparklineColor="#f59e0b"
        />
        <KpiCard
          id="result"
          label="Resultado operativo"
          value={formatCurrency(summary.result)}
          delta={percentChange(summary.result, summary.previous.result)}
          positiveWhen="up"
          description="Ingresos menos costos operativos."
          icon={CircleDollarSign}
          tone="emerald"
          sparkline={sparklines.result}
          sparklineColor="#059669"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <FinancialEvolutionChart data={monthly} className="xl:col-span-2" />
        <AlertsPanel alerts={alerts} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <RevenueMixChart data={units} />
        <CostBreakdownChart data={categories} className="xl:col-span-2" />
      </div>

      <ReceivablesOverview receivables={receivables} asOf={definition.end} rangeLabel={definition.label} />
    </div>
  );
}
