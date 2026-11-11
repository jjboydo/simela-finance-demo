import { useMemo, useState } from 'react';
import { AlertTriangle, Clock3, Download, HandCoins, Percent, Search, X } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { AgingChart } from '@/components/charts/AgingChart';
import { ReceivableStatusBadge } from '@/components/common/StatusBadge';
import { SortableHeader } from '@/components/common/SortableHeader';
import { TablePagination } from '@/components/common/TablePagination';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePeriod } from '@/context/PeriodContext';
import {
  getClientReceivables,
  getCollectionRate,
  getReceivables,
  RECEIVABLE_STATUS_LABELS,
} from '@/lib/calculations';
import { downloadCsv } from '@/lib/csv';
import {
  formatCurrency,
  formatCsvNumber,
  formatDate,
  formatNumber,
  formatPercent,
} from '@/lib/formatters';
import type { ClientReceivable, ReceivableStatus } from '@/types';
import { cn } from '@/lib/utils';

type StatusFilter = 'todos' | ReceivableStatus;
type ClientSortKey = 'client' | 'invoices' | 'balance' | 'overdue' | 'days';

const PAGE_SIZE = 10;

export function ReceivablesPage() {
  const { period, definition } = usePeriod();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [sort, setSort] = useState<{ key: ClientSortKey; direction: 'asc' | 'desc' }>({
    key: 'balance',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);

  const receivables = useMemo(() => getReceivables(definition.end), [definition.end]);
  const allClients = useMemo(() => getClientReceivables(definition.end), [definition.end]);
  const collectionRate = useMemo(() => getCollectionRate(definition.end), [definition.end]);

  const overdueClients = allClients.filter((item) => item.status === 'vencido').length;
  const overdueShare = receivables.total ? (receivables.overdue / receivables.total) * 100 : 0;
  const upcomingShare = receivables.total ? (receivables.upcoming / receivables.total) * 100 : 0;

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allClients.filter((item) => {
      const matchesSearch = !query || item.client.name.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allClients, search, statusFilter]);

  const sortedClients = useMemo(() => {
    const sorted = [...filteredClients];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sort.key) {
        case 'client':
          comparison = a.client.name.localeCompare(b.client.name);
          break;
        case 'invoices':
          comparison = a.invoicesCount - b.invoicesCount;
          break;
        case 'overdue':
          comparison = a.overdueBalance - b.overdueBalance;
          break;
        case 'days':
          comparison = a.maxDaysOverdue - b.maxDaysOverdue;
          break;
        case 'balance':
        default:
          comparison = a.balance - b.balance;
          break;
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredClients, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedClients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (column: string) => {
    const key = column as ClientSortKey;
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'client' ? 'asc' : 'desc' },
    );
  };

  const handleExport = () => {
    downloadCsv(
      `simela-cuentas-por-cobrar-${period}.csv`,
      ['Cliente', 'Facturas pendientes', 'Saldo total (ARS)', 'Saldo vencido (ARS)', 'Días de atraso', 'Estado'],
      sortedClients.map((item: ClientReceivable) => [
        item.client.name,
        item.invoicesCount,
        formatCsvNumber(item.balance),
        formatCsvNumber(item.overdueBalance),
        item.maxDaysOverdue,
        RECEIVABLE_STATUS_LABELS[item.status],
      ]),
    );
  };

  const hasFilters = search.trim().length > 0 || statusFilter !== 'todos';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cuentas por cobrar"
        description="Situación de cobranzas, antigüedad de la deuda y clientes con saldo pendiente."
        meta={
          <>
            <Badge variant="outline" className="py-1">
              {definition.label}
            </Badge>
            <span className="text-[11px] text-slate-400">
              {definition.asOfLabel} · Corte de cartera
            </span>
          </>
        }
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        }
        footnote="La antigüedad se mide desde la fecha de vencimiento de cada factura. El tramo de 0 a 30 días incluye facturas aún no vencidas."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total pendiente de cobro"
          value={formatCurrency(receivables.total)}
          description={`${formatNumber(receivables.invoices.length)} facturas abiertas al cierre.`}
          icon={HandCoins}
          tone="blue"
        />
        <StatCard
          label="Total vencido"
          value={formatCurrency(receivables.overdue)}
          description={`${formatNumber(overdueClients)} clientes con deuda vencida.`}
          hint={
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
              <AlertTriangle className="h-3 w-3" />
              {formatPercent(overdueShare, 1)} del saldo
            </span>
          }
          icon={AlertTriangle}
          tone="rose"
        />
        <StatCard
          label="Total a vencer"
          value={formatCurrency(receivables.upcoming)}
          description="Facturas con vencimiento posterior al corte."
          hint={
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
              <Clock3 className="h-3 w-3" />
              {formatPercent(upcomingShare, 1)} del saldo
            </span>
          }
          icon={Clock3}
          tone="amber"
        />
        <StatCard
          label="Tasa de cobranza"
          value={formatPercent(collectionRate, 1)}
          description="Cobrado sobre facturado en los últimos 12 meses."
          icon={Percent}
          tone="emerald"
        />
      </div>

      <ChartCard
        title="Antigüedad de la deuda"
        description="Distribución del saldo pendiente según los días transcurridos desde el vencimiento."
        footer={
          <span>
            El saldo total de la cartera es {formatCurrency(receivables.total)} al{' '}
            {formatDate(definition.end)}.
          </span>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <AgingChart data={receivables.aging} />
          <div className="space-y-3">
            {receivables.aging.map((bucket) => {
              const share = receivables.total ? (bucket.amount / receivables.total) * 100 : 0;
              return (
                <div key={bucket.label} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: bucket.color }}
                      />
                      {bucket.label}
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-900">
                      {formatCurrency(bucket.amount)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${share}%`, backgroundColor: bucket.color }}
                      />
                    </div>
                    <span className="w-12 text-right text-[10px] tabular-nums text-slate-500">
                      {formatPercent(share, 1)}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {formatNumber(bucket.invoices)} facturas
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </ChartCard>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Clientes con saldo pendiente</CardTitle>
            <CardDescription>
              {formatNumber(allClients.length)} clientes con facturas abiertas al cierre.
            </CardDescription>
          </div>
          <Badge variant="outline">{formatNumber(receivables.invoices.length)} facturas</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-slate-100 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="client-search" className="mb-1.5 block text-[11px] font-medium text-slate-600">
                  Buscar cliente
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="client-search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Nombre del cliente"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-full sm:w-52">
                <label htmlFor="receivable-status" className="mb-1.5 block text-[11px] font-medium text-slate-600">
                  Estado
                </label>
                <Select
                  id="receivable-status"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as StatusFilter);
                    setPage(1);
                  }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="vencido">Vencido</option>
                  <option value="por-vencer">Por vencer</option>
                  <option value="pendiente">Pendiente</option>
                </Select>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-xs text-slate-400">
                  {formatNumber(filteredClients.length)} resultados
                </span>
                {hasFilters ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('todos');
                      setPage(1);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpiar
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100">
            {pageRows.length ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                      <SortableHeader
                        label="Cliente"
                        column="client"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Facturas"
                        column="invoices"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                        align="right"
                      />
                      <SortableHeader
                        label="Saldo total"
                        column="balance"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                        align="right"
                      />
                      <SortableHeader
                        label="Vencido"
                        column="overdue"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                        align="right"
                      />
                      <SortableHeader
                        label="Días de atraso"
                        column="days"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                        align="right"
                      />
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((item) => (
                      <TableRow key={item.client.id}>
                        <TableCell className="min-w-[220px]">
                          <p className="font-medium text-slate-800">{item.client.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {item.client.industry} · {item.client.city}
                          </p>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-slate-600">
                          {formatNumber(item.invoicesCount)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right font-medium tabular-nums text-slate-900">
                          {formatCurrency(item.balance)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'whitespace-nowrap text-right font-medium tabular-nums',
                            item.overdueBalance > 0 ? 'text-rose-600' : 'text-slate-400',
                          )}
                        >
                          {item.overdueBalance > 0 ? formatCurrency(item.overdueBalance) : '—'}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right tabular-nums',
                            item.maxDaysOverdue > 0 ? 'font-medium text-rose-600' : 'text-slate-400',
                          )}
                        >
                          {item.maxDaysOverdue > 0 ? formatNumber(item.maxDaysOverdue) : '—'}
                        </TableCell>
                        <TableCell>
                          <ReceivableStatusBadge status={item.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  page={currentPage}
                  pageSize={PAGE_SIZE}
                  totalItems={sortedClients.length}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <EmptyState description="No hay clientes que coincidan con la búsqueda y el estado seleccionados." />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
