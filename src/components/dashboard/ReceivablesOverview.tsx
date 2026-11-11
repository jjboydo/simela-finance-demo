import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, CircleDollarSign, HandCoins, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvoiceStatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { clientById, clients } from '@/data/mock-data';
import { getInvoiceStatus, type ReceivablesSnapshot } from '@/lib/calculations';
import { formatCurrency, formatDate, formatNumber, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface ReceivablesOverviewProps {
  receivables: ReceivablesSnapshot;
  asOf: Date;
  rangeLabel: string;
}

export function ReceivablesOverview({ receivables, asOf, rangeLabel }: ReceivablesOverviewProps) {
  const overdueShare = receivables.total ? (receivables.overdue / receivables.total) * 100 : 0;
  const upcomingShare = receivables.total ? (receivables.upcoming / receivables.total) * 100 : 0;
  const rows = [...receivables.invoices]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  const stats = [
    {
      label: 'Total pendiente',
      value: formatCurrency(receivables.total),
      hint: `${formatNumber(receivables.invoices.length)} facturas abiertas`,
      icon: HandCoins,
      wrapper: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Deuda vencida',
      value: formatCurrency(receivables.overdue),
      hint: `${formatPercent(overdueShare, 1)} del saldo`,
      icon: CalendarClock,
      wrapper: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Deuda a vencer',
      value: formatCurrency(receivables.upcoming),
      hint: `${formatPercent(upcomingShare, 1)} del saldo`,
      icon: CircleDollarSign,
      wrapper: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Clientes con saldo',
      value: formatNumber(receivables.clientsCount),
      hint: `de ${formatNumber(clients.length)} clientes activos`,
      icon: Users,
      wrapper: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Cuentas por cobrar</CardTitle>
          <CardDescription>
            Saldo abierto al {formatDate(asOf)} · {rangeLabel}
          </CardDescription>
        </div>
        <Link
          to="/cuentas-por-cobrar"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          Ver detalle
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                  <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', stat.wrapper)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900 tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">{stat.hint}</p>
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          {rows.length ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Emisión</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="max-w-[220px] truncate font-medium text-slate-800">
                      {clientById[invoice.clientId]?.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-500">
                      {formatDate(invoice.issueDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-500">
                      {formatDate(invoice.dueDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-medium tabular-nums text-slate-900">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={getInvoiceStatus(invoice, asOf)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title="Sin cuentas pendientes" description="Todas las facturas del período están cobradas." />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
