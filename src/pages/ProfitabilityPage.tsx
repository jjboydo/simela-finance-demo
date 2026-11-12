import { useMemo } from 'react';
import {
  ArrowRight,
  CircleDollarSign,
  Download,
  Percent,
  ReceiptText,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ProfitabilityChart } from '@/components/charts/ProfitabilityChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePeriod } from '@/context/PeriodContext';
import { getMonthlyFinancials, getSummary, getUnitProfitability, percentChange } from '@/lib/calculations';
import { downloadCsv } from '@/lib/csv';
import {
  formatCompactCurrency,
  formatCurrency,
  formatCsvNumber,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from '@/lib/formatters';
import { cn } from '@/lib/utils';

export function ProfitabilityPage() {
  const { period, definition } = usePeriod();
  const summary = useMemo(() => getSummary(period), [period]);
  const monthly = useMemo(() => getMonthlyFinancials(definition.end), [definition.end]);
  const units = useMemo(() => getUnitProfitability(definition), [definition]);
  const rankedUnits = useMemo(() => [...units].sort((a, b) => b.margin - a.margin), [units]);

  const resultDelta = percentChange(summary.result, summary.previous.result);
  const revenueDelta = percentChange(summary.revenue, summary.previous.revenue);
  const costsDelta = percentChange(summary.costs, summary.previous.costs);
  const marginDelta = summary.margin - summary.previous.margin;

  const handleExport = () => {
    downloadCsv(
      `simela-rentabilidad-${period}.csv`,
      ['Unidad de negocio', 'Facturación (ARS)', 'Costos directos (ARS)', 'Costos asignados (ARS)', 'Resultado (ARS)', 'Margen (%)'],
      rankedUnits.map((item) => [
        item.unit.name,
        formatCsvNumber(item.revenue),
        formatCsvNumber(item.directCosts),
        formatCsvNumber(item.allocatedCosts),
        formatCsvNumber(item.result),
        formatCsvNumber(item.margin),
      ]),
    );
  };

  const explainer = [
    {
      icon: ReceiptText,
      label: 'Facturación',
      value: formatCurrency(summary.revenue),
      description: 'Todo lo que la empresa emitió en el período, antes de descontar costos.',
      wrapper: 'bg-blue-50 text-blue-600',
    },
    {
      icon: CircleDollarSign,
      label: 'Resultado operativo',
      value: formatCurrency(summary.result),
      description: 'Lo que queda después de cubrir todos los costos y gastos operativos.',
      wrapper: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Percent,
      label: 'Margen operativo',
      value: formatPercent(summary.margin, 1),
      description: 'La parte de cada peso facturado que se convierte en resultado.',
      wrapper: 'bg-violet-50 text-violet-600',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rentabilidad"
        description="Resultado operativo, márgenes y desempeño de cada unidad de negocio."
        meta={
          <>
            <Badge variant="outline" className="py-1">
              {definition.label}
            </Badge>
            <span className="text-[11px] text-slate-400">
              Comparativo: {definition.comparisonLabel}
            </span>
          </>
        }
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Descargar CSV
          </Button>
        }
        footnote="Los costos compartidos se asignan a cada unidad según su participación en la facturación."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Resultado operativo"
          value={formatCurrency(summary.result)}
          description="Ingresos menos costos operativos del período."
          hint={
            <span
              className={cn(
                'text-[11px] font-medium',
                resultDelta >= 0 ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              {formatSignedPercent(resultDelta, 1)} frente al período anterior
            </span>
          }
          icon={CircleDollarSign}
          tone="emerald"
        />
        <StatCard
          label="Margen operativo"
          value={formatPercent(summary.margin, 1)}
          description="Resultado operativo sobre ingresos totales."
          hint={
            <span
              className={cn(
                'text-[11px] font-medium',
                marginDelta >= 0 ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              {marginDelta >= 0 ? '+' : ''}
              {formatNumber(marginDelta, 1)} pp frente al período anterior
            </span>
          }
          icon={Percent}
          tone="violet"
        />
        <StatCard
          label="Ingresos"
          value={formatCurrency(summary.revenue)}
          description="Facturación acumulada del período."
          hint={
            <span
              className={cn(
                'text-[11px] font-medium',
                revenueDelta >= 0 ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              {formatSignedPercent(revenueDelta, 1)} frente al período anterior
            </span>
          }
          icon={TrendingUp}
          tone="blue"
        />
        <StatCard
          label="Costos"
          value={formatCurrency(summary.costs)}
          description="Costos fijos y variables del período."
          hint={
            <span
              className={cn(
                'text-[11px] font-medium',
                costsDelta <= 0 ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              {formatSignedPercent(costsDelta, 1)} frente al período anterior
            </span>
          }
          icon={ReceiptText}
          tone="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ProfitabilityChart data={monthly} className="xl:col-span-2" />

        <Card className="relative flex flex-col overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400" />
          <CardHeader className="pb-4">
            <CardTitle>Orden de rentabilidad</CardTitle>
            <CardDescription>Unidades ordenadas por margen operativo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-5 pt-0">
            {rankedUnits.map((item, index) => (
              <div key={item.unit.id}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                        index === 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="truncate text-xs font-medium text-slate-800">
                      {item.unit.shortName}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900">
                    {formatPercent(item.margin, 1)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, item.margin))}%`,
                      backgroundColor: item.unit.color,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                  <span>Resultado {formatCompactCurrency(item.result)}</span>
                  <span>Facturación {formatCompactCurrency(item.revenue)}</span>
                </div>
              </div>
            ))}
            <div className="mt-auto rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-slate-600">Margen promedio del período</p>
                <p className="text-xs font-semibold tabular-nums text-slate-900">
                  {formatPercent(summary.margin, 1)}
                </p>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                Resultado operativo sobre la facturación total.
              </p>
            </div>
          </CardContent>
          <div className="border-t border-slate-100 p-4">
            <p className="text-[10px] leading-relaxed text-slate-400">
              El margen se calcula sobre la facturación de cada unidad después de asignar los costos
              compartidos.
            </p>
          </div>
        </Card>
      </div>

      <Card className="relative overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400" />
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Rentabilidad por unidad de negocio</CardTitle>
            <CardDescription>
              Facturación, costos asignados y resultado de cada unidad en el período.
            </CardDescription>
          </div>
          <Badge variant="outline">{definition.label}</Badge>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="border-t border-slate-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-violet-50/50 hover:bg-violet-50/50">
                  <TableHead>Unidad de negocio</TableHead>
                  <TableHead className="text-right">Facturación</TableHead>
                  <TableHead className="text-right">Costos directos</TableHead>
                  <TableHead className="text-right">Costos asignados</TableHead>
                  <TableHead className="text-right">Resultado</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((item) => (
                  <TableRow key={item.unit.id}>
                    <TableCell className="min-w-[240px]">
                      <div className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: item.unit.color }}
                        />
                        <div>
                          <p className="font-medium text-slate-800">{item.unit.name}</p>
                          <p className="text-[11px] text-slate-400">{item.unit.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums text-slate-700">
                      {formatCurrency(item.revenue)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums text-slate-500">
                      {formatCurrency(item.directCosts)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums text-slate-500">
                      {formatCurrency(item.allocatedCosts)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(item.result)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <Badge
                        variant={
                          item.margin >= 40 ? 'success' : item.margin >= 20 ? 'warning' : 'danger'
                        }
                      >
                        {formatPercent(item.margin, 1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ChartCard
        title="Cómo leer la rentabilidad"
        description="Facturación, resultado y margen explican la misma historia desde tres ángulos."
        accent="from-violet-500 via-purple-500 to-fuchsia-400"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {explainer.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-1 items-stretch gap-3">
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', item.wrapper)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900 tabular-nums">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
                {index < explainer.length - 1 ? (
                  <ArrowRight className="mt-10 hidden h-4 w-4 shrink-0 text-slate-300 md:block" />
                ) : null}
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
