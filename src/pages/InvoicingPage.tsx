import { useMemo, useState } from 'react';
import {
  BadgeDollarSign,
  Download,
  FileText,
  ReceiptText,
  Users,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { MonthlyRevenueChart } from '@/components/charts/MonthlyRevenueChart';
import { RevenueMixChart } from '@/components/charts/RevenueMixChart';
import { InvoiceStatusBadge } from '@/components/common/StatusBadge';
import { SortableHeader } from '@/components/common/SortableHeader';
import { TablePagination } from '@/components/common/TablePagination';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { businessUnitById, clients, clientById } from '@/data/mock-data';
import { usePeriod } from '@/context/PeriodContext';
import {
  getInvoiceStatus,
  getMonthlyRevenueByUnit,
  getRevenueByUnit,
  invoicesInRange,
  STATUS_LABELS,
} from '@/lib/calculations';
import { downloadCsv } from '@/lib/csv';
import { formatCurrency, formatCsvNumber, formatDate, formatNumber } from '@/lib/formatters';
import type { Invoice, InvoiceDisplayStatus } from '@/types';

type InvoiceSortKey = 'number' | 'client' | 'date' | 'amount' | 'status';
type StatusFilter = 'todas' | InvoiceDisplayStatus;

const PAGE_SIZE = 10;

const statusOrder: Record<InvoiceDisplayStatus, number> = {
  pagada: 0,
  pendiente: 1,
  'por-vencer': 2,
  vencida: 3,
};

export function InvoicingPage() {
  const { period, definition } = usePeriod();
  const [clientId, setClientId] = useState('todos');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const [sort, setSort] = useState<{ key: InvoiceSortKey; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);

  const matchesFilters = useMemo(() => {
    return (invoice: Invoice) => {
      const matchesClient = clientId === 'todos' || invoice.clientId === clientId;
      const matchesStatus =
        statusFilter === 'todas' || getInvoiceStatus(invoice, definition.end) === statusFilter;
      return matchesClient && matchesStatus;
    };
  }, [clientId, statusFilter, definition.end]);

  const filteredInvoices = useMemo(
    () => invoicesInRange(definition).filter(matchesFilters),
    [definition, matchesFilters],
  );

  const monthlyChart = useMemo(
    () => getMonthlyRevenueByUnit(definition.end, 12, matchesFilters),
    [definition.end, matchesFilters],
  );
  const unitBreakdown = useMemo(
    () => getRevenueByUnit(definition, matchesFilters),
    [definition, matchesFilters],
  );

  const total = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const averageTicket = filteredInvoices.length ? total / filteredInvoices.length : 0;
  const uniqueClients = new Set(filteredInvoices.map((invoice) => invoice.clientId)).size;

  const sortedInvoices = useMemo(() => {
    const sorted = [...filteredInvoices];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sort.key) {
        case 'number':
          comparison = a.number.localeCompare(b.number);
          break;
        case 'client':
          comparison = (clientById[a.clientId]?.name ?? '').localeCompare(
            clientById[b.clientId]?.name ?? '',
          );
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison =
            statusOrder[getInvoiceStatus(a, definition.end)] -
            statusOrder[getInvoiceStatus(b, definition.end)];
          break;
        case 'date':
        default:
          comparison = a.issueDate.localeCompare(b.issueDate);
          break;
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredInvoices, sort, definition.end]);

  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedInvoices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = clientId !== 'todos' || statusFilter !== 'todas';

  const handleSort = (column: string) => {
    const key = column as InvoiceSortKey;
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'amount' || key === 'date' ? 'desc' : 'asc' },
    );
  };

  const clearFilters = () => {
    setClientId('todos');
    setStatusFilter('todas');
    setPage(1);
  };

  const handleExport = () => {
    downloadCsv(
      `simela-facturacion-${period}.csv`,
      ['Factura', 'Cliente', 'Fecha', 'Unidad de negocio', 'Importe (ARS)', 'Estado'],
      filteredInvoices.map((invoice) => [
        invoice.number,
        clientById[invoice.clientId]?.name ?? '',
        formatDate(invoice.issueDate),
        invoice.businessUnit,
        formatCsvNumber(invoice.amount),
        STATUS_LABELS[getInvoiceStatus(invoice, definition.end)],
      ]),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturación"
        description="Ingresos emitidos, ticket promedio y evolución de la facturación."
        meta={
          <>
            <Badge variant="outline" className="py-1">
              {definition.label}
            </Badge>
            <span className="text-[11px] text-slate-400">
              {formatNumber(filteredInvoices.length)} facturas en la vista actual
            </span>
          </>
        }
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        }
        footnote="Los filtros de cliente y estado afectan los indicadores, gráficos y la tabla."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total facturado"
          value={formatCurrency(total)}
          description="Importe total de las facturas filtradas."
          icon={ReceiptText}
          tone="blue"
        />
        <StatCard
          label="Facturas emitidas"
          value={formatNumber(filteredInvoices.length)}
          description="Comprobantes incluidos según los filtros."
          icon={FileText}
          tone="violet"
        />
        <StatCard
          label="Ticket promedio"
          value={formatCurrency(averageTicket)}
          description="Importe promedio por factura emitida."
          icon={BadgeDollarSign}
          tone="emerald"
        />
        <StatCard
          label="Clientes facturados"
          value={formatNumber(uniqueClients)}
          description="Clientes alcanzados por las facturas mostradas."
          icon={Users}
          tone="amber"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="w-full lg:w-72">
              <label htmlFor="client-filter" className="mb-1.5 block text-[11px] font-medium text-slate-600">
                Cliente
              </label>
              <Select
                id="client-filter"
                value={clientId}
                onChange={(event) => {
                  setClientId(event.target.value);
                  setPage(1);
                }}
              >
                <option value="todos">Todos los clientes</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full sm:w-56">
              <label htmlFor="status-filter" className="mb-1.5 block text-[11px] font-medium text-slate-600">
                Estado
              </label>
              <Select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  setPage(1);
                }}
              >
                <option value="todas">Todos los estados</option>
                <option value="pagada">Pagadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="por-vencer">Por vencer</option>
                <option value="vencida">Vencidas</option>
              </Select>
            </div>
            <div className="flex items-center gap-2 lg:ml-auto">
              <span className="text-xs text-slate-400">
                {formatNumber(filteredInvoices.length)} resultados
              </span>
              {hasFilters ? (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-3.5 w-3.5" />
                  Limpiar
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <MonthlyRevenueChart
          data={monthlyChart}
          className="xl:col-span-2"
          description={`Facturación de los últimos 12 meses${hasFilters ? ' con los filtros aplicados' : ' por unidad de negocio'}.`}
        />
        <RevenueMixChart data={unitBreakdown} />
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Facturas recientes</CardTitle>
            <CardDescription>
              Comprobantes emitidos en el período, ordenables por columna.
            </CardDescription>
          </div>
          <Badge variant="outline">{definition.label}</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-slate-100">
            {pageRows.length ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                      <SortableHeader
                        label="Factura"
                        column="number"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Cliente"
                        column="client"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Fecha"
                        column="date"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <TableHead>Unidad de negocio</TableHead>
                      <SortableHeader
                        label="Importe"
                        column="amount"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                        align="right"
                      />
                      <SortableHeader
                        label="Estado"
                        column="status"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="whitespace-nowrap text-xs font-medium text-slate-700">
                          {invoice.number}
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <p className="font-medium text-slate-800">
                            {clientById[invoice.clientId]?.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {clientById[invoice.clientId]?.industry}
                          </p>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-slate-500">
                          {formatDate(invoice.issueDate)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-slate-500">
                          {businessUnitById[invoice.businessUnit]?.shortName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right font-medium tabular-nums text-slate-900">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <InvoiceStatusBadge status={getInvoiceStatus(invoice, definition.end)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  page={currentPage}
                  pageSize={PAGE_SIZE}
                  totalItems={sortedInvoices.length}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <EmptyState description="No hay facturas que coincidan con el cliente y el estado seleccionados." />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
