import { useMemo, useState } from 'react';
import { ArrowLeftRight, Download, Percent, PieChart, Wallet, X } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { MonthlyCostChart } from '@/components/charts/MonthlyCostChart';
import { CostBreakdownChart } from '@/components/charts/CostBreakdownChart';
import { SortableHeader } from '@/components/common/SortableHeader';
import { TablePagination } from '@/components/common/TablePagination';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePeriod } from '@/context/PeriodContext';
import { expenseCategories, expenseCategoryById } from '@/data/mock-data';
import type { Expense, ExpenseCategoryId } from '@/types';
import {
  expensesInRange,
  getCostsByCategory,
  getMonthlyCostsByType,
  invoicesInRange,
} from '@/lib/calculations';
import { downloadCsv } from '@/lib/csv';
import { formatCurrency, formatCsvNumber, formatDate, formatNumber, formatPercent } from '@/lib/formatters';

type CategoryFilter = 'todas' | ExpenseCategoryId;
type ExpenseSortKey = 'date' | 'description' | 'category' | 'type' | 'amount';

const PAGE_SIZE = 10;

export function CostsPage() {
  const { period, definition } = usePeriod();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('todas');
  const [sort, setSort] = useState<{ key: ExpenseSortKey; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);

  const matchesCategory = useMemo(() => {
    return (expense: Expense) => categoryFilter === 'todas' || expense.category === categoryFilter;
  }, [categoryFilter]);

  const filteredExpenses = useMemo(
    () => expensesInRange(definition).filter(matchesCategory),
    [definition, matchesCategory],
  );
  const allCategories = useMemo(() => getCostsByCategory(definition), [definition]);
  const monthlyChart = useMemo(
    () => getMonthlyCostsByType(definition.end, 12, matchesCategory),
    [definition.end, matchesCategory],
  );

  const revenue = invoicesInRange(definition).reduce((sum, invoice) => sum + invoice.amount, 0);
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const fixed = filteredExpenses
    .filter((expense) => expense.type === 'fijo')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const variable = filteredExpenses
    .filter((expense) => expense.type === 'variable')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const costRatio = revenue ? (total / revenue) * 100 : 0;

  const sortedExpenses = useMemo(() => {
    const sorted = [...filteredExpenses];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sort.key) {
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          comparison = expenseCategoryById[a.category].name.localeCompare(
            expenseCategoryById[b.category].name,
          );
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
        default:
          comparison = a.date.localeCompare(b.date);
          break;
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredExpenses, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedExpenses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (column: string) => {
    const key = column as ExpenseSortKey;
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'amount' || key === 'date' ? 'desc' : 'asc' },
    );
  };

  const handleExport = () => {
    downloadCsv(
      `simela-costos-${period}.csv`,
      ['Fecha', 'Descripción', 'Categoría', 'Proveedor', 'Tipo', 'Importe (ARS)'],
      filteredExpenses.map((expense) => [
        formatDate(expense.date),
        expense.description,
        expenseCategoryById[expense.category].name,
        expense.provider,
        expense.type === 'fijo' ? 'Fijo' : 'Variable',
        formatCsvNumber(expense.amount),
      ]),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Costos y gastos"
        description="Estructura de costos, evolución mensual y detalle de los gastos registrados."
        meta={
          <>
            <Badge variant="outline" className="py-1">
              {definition.label}
            </Badge>
            <span className="text-[11px] text-slate-400">
              {formatNumber(filteredExpenses.length)} registros en la vista actual
            </span>
          </>
        }
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Descargar CSV
          </Button>
        }
        footnote="Los costos compartidos se asignan a las unidades de negocio según su participación en la facturación."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total de costos"
          value={formatCurrency(total)}
          description="Costos y gastos incluidos según el filtro."
          icon={Wallet}
          tone="blue"
        />
        <StatCard
          label="Costos fijos"
          value={formatCurrency(fixed)}
          description="Estructura, servicios y administración."
          icon={PieChart}
          tone="violet"
        />
        <StatCard
          label="Costos variables"
          value={formatCurrency(variable)}
          description="Insumos y gastos operativos variables."
          icon={ArrowLeftRight}
          tone="amber"
        />
        <StatCard
          label="Costo / facturación"
          value={formatPercent(costRatio, 1)}
          description="Peso de los costos sobre los ingresos."
          icon={Percent}
          tone="rose"
        />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-80">
              <label htmlFor="category-filter" className="mb-1.5 block text-[11px] font-medium text-slate-600">
                Categoría
              </label>
              <Select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value as CategoryFilter);
                  setPage(1);
                }}
              >
                <option value="todas">Todas las categorías</option>
                {expenseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="text-xs text-slate-400">
                {formatNumber(filteredExpenses.length)} resultados
              </span>
              {categoryFilter !== 'todas' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategoryFilter('todas');
                    setPage(1);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  Limpiar
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <MonthlyCostChart
          data={monthlyChart}
          className="xl:col-span-2"
          description={`Costos de los últimos 12 meses${categoryFilter !== 'todas' ? ' filtrados por categoría' : ', separados en fijos y variables'}.`}
        />
        <CostBreakdownChart
          data={allCategories}
          selectedCategory={categoryFilter === 'todas' ? undefined : categoryFilter}
          accent="from-orange-500 via-amber-500 to-yellow-400"
        />
      </div>

      <Card className="relative overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400" />
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Gastos recientes</CardTitle>
            <CardDescription>Detalle de los registros del período seleccionado.</CardDescription>
          </div>
          <Badge variant="outline">{definition.label}</Badge>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="border-t border-slate-100">
            {pageRows.length ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50/50 hover:bg-orange-50/50">
                      <SortableHeader
                        label="Fecha"
                        column="date"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Descripción"
                        column="description"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Categoría"
                        column="category"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        label="Tipo"
                        column="type"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                      />
                      <TableHead>Proveedor</TableHead>
                      <SortableHeader
                        label="Importe"
                        column="amount"
                        sortKey={sort.key}
                        direction={sort.direction}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((expense) => {
                      const category = expenseCategoryById[expense.category];
                      return (
                        <TableRow key={expense.id}>
                          <TableCell className="whitespace-nowrap text-slate-500">
                            {formatDate(expense.date)}
                          </TableCell>
                          <TableCell className="min-w-[240px] font-medium text-slate-800">
                            {expense.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={expense.type === 'fijo' ? 'default' : 'info'}>
                              {expense.type === 'fijo' ? 'Fijo' : 'Variable'}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-slate-500">
                            {expense.provider}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right font-medium tabular-nums text-slate-900">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <TablePagination
                  page={currentPage}
                  pageSize={PAGE_SIZE}
                  totalItems={sortedExpenses.length}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <EmptyState description="No hay gastos registrados para la categoría seleccionada." />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
