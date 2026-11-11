import {
  differenceInCalendarDays,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  businessUnits,
  clientById,
  expenseCategories,
  expenses,
  invoices,
  referenceDate,
} from '@/data/mock-data';
import { capitalize, formatCurrency, formatDate, formatNumber } from './formatters';
import type {
  AgingBucket,
  BusinessUnit,
  ClientReceivable,
  DateRange,
  Expense,
  ExpenseCategory,
  FinancialAlert,
  Invoice,
  InvoiceDisplayStatus,
  MonthlyFinancialPoint,
  PeriodDefinition,
  PeriodKey,
  PeriodSummary,
  ReceivableStatus,
  UnitProfitability,
} from '@/types';

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const inRange = (date: string, range: DateRange) => {
  const value = parseISO(date);
  return value >= startOfDay(range.start) && value <= endOfDay(range.end);
};

export function getPeriodDefinition(period: PeriodKey): PeriodDefinition {
  if (period === '30d') {
    const start = startOfMonth(referenceDate);
    const end = endOfDay(referenceDate);
    const previous = {
      start: startOfMonth(subMonths(referenceDate, 1)),
      end: endOfMonth(subMonths(referenceDate, 1)),
    };
    return {
      key: period,
      start,
      end,
      previous,
      label: capitalize(formatDate(start, 'MMMM yyyy')),
      shortLabel: 'Últimos 30 días',
      comparisonLabel: capitalize(formatDate(previous.start, 'MMMM yyyy')),
      asOfLabel: `Al ${formatDate(end)}`,
    };
  }

  if (period === '90d') {
    const start = startOfMonth(subMonths(referenceDate, 2));
    const end = endOfDay(referenceDate);
    const previous = {
      start: startOfMonth(subMonths(referenceDate, 5)),
      end: endOfMonth(subMonths(referenceDate, 3)),
    };
    return {
      key: period,
      start,
      end,
      previous,
      label: `${capitalize(formatDate(start, 'MMMM'))} – ${formatDate(end, 'MMMM yyyy')}`,
      shortLabel: 'Últimos 90 días',
      comparisonLabel: `${capitalize(formatDate(previous.start, 'MMMM'))} – ${formatDate(previous.end, 'MMMM yyyy')}`,
      asOfLabel: `Al ${formatDate(end)}`,
    };
  }

  const year = period === '2026' ? 2026 : 2025;
  const start = startOfMonth(new Date(year, 0, 1));
  const end = endOfDay(new Date(year, 11, 31));
  const previousStart = startOfMonth(new Date(year - 1, 0, 1));
  const previousEnd = endOfDay(new Date(year - 1, 11, 31));

  return {
    key: period,
    start,
    end,
    previous: { start: previousStart, end: previousEnd },
    label: `Año ${year}`,
    shortLabel: `Año ${year}`,
    comparisonLabel: `Año ${year - 1}`,
    asOfLabel: `Al ${formatDate(end)}`,
  };
}

export function invoicesInRange(range: DateRange): Invoice[] {
  return invoices.filter((invoice) => inRange(invoice.issueDate, range));
}

export function expensesInRange(range: DateRange): Expense[] {
  return expenses.filter((expense) => inRange(expense.date, range));
}

export function percentChange(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

export function isInvoicePaid(invoice: Invoice, asOf: Date): boolean {
  if (!invoice.paidDate) return false;
  return parseISO(invoice.paidDate) <= endOfDay(asOf);
}

export function getInvoiceStatus(invoice: Invoice, asOf: Date): InvoiceDisplayStatus {
  if (isInvoicePaid(invoice, asOf)) return 'pagada';
  const daysUntilDue = differenceInCalendarDays(parseISO(invoice.dueDate), startOfDay(asOf));
  if (daysUntilDue < 0) return 'vencida';
  if (daysUntilDue <= 15) return 'por-vencer';
  return 'pendiente';
}

export interface ReceivablesSnapshot {
  total: number;
  overdue: number;
  upcoming: number;
  clientsCount: number;
  invoices: Invoice[];
  aging: AgingBucket[];
}

export function getReceivables(asOf: Date): ReceivablesSnapshot {
  const asOfEnd = endOfDay(asOf);
  const open = invoices.filter(
    (invoice) => parseISO(invoice.issueDate) <= asOfEnd && !isInvoicePaid(invoice, asOfEnd),
  );
  const total = sum(open.map((invoice) => invoice.amount));
  const overdue = sum(
    open
      .filter((invoice) => differenceInCalendarDays(asOfEnd, parseISO(invoice.dueDate)) > 0)
      .map((invoice) => invoice.amount),
  );

  const bucketDefinitions = [
    { label: '0 a 30 días', color: '#2563eb', min: 0, max: 30 },
    { label: '31 a 60 días', color: '#f59e0b', min: 31, max: 60 },
    { label: '61 a 90 días', color: '#f97316', min: 61, max: 90 },
    { label: 'Más de 90 días', color: '#e11d48', min: 91, max: Number.POSITIVE_INFINITY },
  ];

  const aging = bucketDefinitions.map((bucket) => {
    const bucketInvoices = open.filter((invoice) => {
      const days = Math.max(0, differenceInCalendarDays(asOfEnd, parseISO(invoice.dueDate)));
      return days >= bucket.min && days <= bucket.max;
    });
    return {
      label: bucket.label,
      color: bucket.color,
      amount: sum(bucketInvoices.map((invoice) => invoice.amount)),
      invoices: bucketInvoices.length,
    };
  });

  return {
    total,
    overdue,
    upcoming: total - overdue,
    clientsCount: new Set(open.map((invoice) => invoice.clientId)).size,
    invoices: open,
    aging,
  };
}

export function getClientReceivables(asOf: Date): ClientReceivable[] {
  const open = getReceivables(asOf).invoices;
  const grouped = new Map<string, Invoice[]>();

  open.forEach((invoice) => {
    const list = grouped.get(invoice.clientId) ?? [];
    list.push(invoice);
    grouped.set(invoice.clientId, list);
  });

  const asOfStart = startOfDay(asOf);

  return Array.from(grouped.entries())
    .map(([clientId, clientInvoices]) => {
      const overdueInvoices = clientInvoices.filter(
        (invoice) => differenceInCalendarDays(asOfStart, parseISO(invoice.dueDate)) > 0,
      );
      const overdueBalance = sum(overdueInvoices.map((invoice) => invoice.amount));
      const maxDaysOverdue = overdueInvoices.length
        ? Math.max(
            ...overdueInvoices.map((invoice) =>
              differenceInCalendarDays(asOfStart, parseISO(invoice.dueDate)),
            ),
          )
        : 0;
      const hasDueSoon = clientInvoices.some((invoice) => {
        const days = differenceInCalendarDays(parseISO(invoice.dueDate), asOfStart);
        return days >= 0 && days <= 15;
      });
      const status: ReceivableStatus =
        overdueBalance > 0 ? 'vencido' : hasDueSoon ? 'por-vencer' : 'pendiente';

      return {
        client: clientById[clientId],
        openInvoices: clientInvoices,
        invoicesCount: clientInvoices.length,
        balance: sum(clientInvoices.map((invoice) => invoice.amount)),
        overdueBalance,
        maxDaysOverdue,
        status,
      };
    })
    .sort((a, b) => b.balance - a.balance);
}

export function getCollectionRate(asOf: Date): number {
  const start = startOfMonth(subMonths(asOf, 11));
  const end = endOfDay(asOf);
  const periodInvoices = invoices.filter((invoice) => inRange(invoice.issueDate, { start, end }));
  const total = sum(periodInvoices.map((invoice) => invoice.amount));
  if (!total) return 0;
  const collected = sum(
    periodInvoices.filter((invoice) => isInvoicePaid(invoice, end)).map((invoice) => invoice.amount),
  );
  return (collected / total) * 100;
}

export function getSummary(period: PeriodKey): PeriodSummary {
  const definition = getPeriodDefinition(period);
  const periodInvoices = invoicesInRange(definition);
  const periodExpenses = expensesInRange(definition);
  const previousInvoices = invoicesInRange(definition.previous);
  const previousExpenses = expensesInRange(definition.previous);

  const revenue = sum(periodInvoices.map((invoice) => invoice.amount));
  const costs = sum(periodExpenses.map((expense) => expense.amount));
  const previousRevenue = sum(previousInvoices.map((invoice) => invoice.amount));
  const previousCosts = sum(previousExpenses.map((expense) => expense.amount));
  const receivables = getReceivables(definition.end);
  const previousReceivables = getReceivables(definition.previous.end);
  const result = revenue - costs;

  return {
    revenue,
    costs,
    result,
    margin: revenue ? (result / revenue) * 100 : 0,
    invoiceCount: periodInvoices.length,
    averageTicket: periodInvoices.length ? revenue / periodInvoices.length : 0,
    pending: receivables.total,
    overdue: receivables.overdue,
    previous: {
      revenue: previousRevenue,
      costs: previousCosts,
      result: previousRevenue - previousCosts,
      margin: previousRevenue ? ((previousRevenue - previousCosts) / previousRevenue) * 100 : 0,
      pending: previousReceivables.total,
    },
  };
}

export function getTrailingMonths(end: Date, months = 12): Date[] {
  const start = startOfMonth(subMonths(end, months - 1));
  return eachMonthOfInterval({ start, end: startOfMonth(end) });
}

export function getMonthlyFinancials(end: Date, months = 12): MonthlyFinancialPoint[] {
  return getTrailingMonths(end, months).map((monthStart) => {
    const monthEnd = endOfMonth(monthStart);
    const monthInvoices = invoices.filter((invoice) => inRange(invoice.issueDate, { start: monthStart, end: monthEnd }));
    const monthExpenses = expenses.filter((expense) => inRange(expense.date, { start: monthStart, end: monthEnd }));
    const revenue = sum(monthInvoices.map((invoice) => invoice.amount));
    const costs = sum(monthExpenses.map((expense) => expense.amount));
    const result = revenue - costs;

    return {
      key: format(monthStart, 'yyyy-MM'),
      label: format(monthStart, 'MMM', { locale: es }),
      fullLabel: capitalize(formatDate(monthStart, 'MMMM yyyy')),
      revenue,
      costs,
      result,
      margin: revenue ? (result / revenue) * 100 : 0,
      invoiceCount: monthInvoices.length,
    };
  });
}

export interface MonthlyUnitRevenuePoint {
  key: string;
  label: string;
  fullLabel: string;
  total: number;
  'salud-laboral': number;
  'medicina-laboral': number;
  'otros-servicios': number;
}

export function getMonthlyRevenueByUnit(
  end: Date,
  months = 12,
  predicate?: (invoice: Invoice) => boolean,
): MonthlyUnitRevenuePoint[] {
  return getTrailingMonths(end, months).map((monthStart) => {
    const monthEnd = endOfMonth(monthStart);
    const monthInvoices = invoices.filter(
      (invoice) => inRange(invoice.issueDate, { start: monthStart, end: monthEnd }) && (!predicate || predicate(invoice)),
    );
    const amounts = businessUnits.map((unit) =>
      sum(monthInvoices.filter((invoice) => invoice.businessUnit === unit.id).map((invoice) => invoice.amount)),
    );

    return {
      key: format(monthStart, 'yyyy-MM'),
      label: format(monthStart, 'MMM', { locale: es }),
      fullLabel: capitalize(formatDate(monthStart, 'MMMM yyyy')),
      total: sum(amounts),
      'salud-laboral': amounts[0],
      'medicina-laboral': amounts[1],
      'otros-servicios': amounts[2],
    };
  });
}

export interface MonthlyCostPoint {
  key: string;
  label: string;
  fullLabel: string;
  fijo: number;
  variable: number;
  total: number;
}

export function getMonthlyCostsByType(
  end: Date,
  months = 12,
  predicate?: (expense: Expense) => boolean,
): MonthlyCostPoint[] {
  return getTrailingMonths(end, months).map((monthStart) => {
    const monthEnd = endOfMonth(monthStart);
    const monthExpenses = expenses.filter(
      (expense) => inRange(expense.date, { start: monthStart, end: monthEnd }) && (!predicate || predicate(expense)),
    );
    const fijo = sum(monthExpenses.filter((expense) => expense.type === 'fijo').map((expense) => expense.amount));
    const variable = sum(
      monthExpenses.filter((expense) => expense.type === 'variable').map((expense) => expense.amount),
    );

    return {
      key: format(monthStart, 'yyyy-MM'),
      label: format(monthStart, 'MMM', { locale: es }),
      fullLabel: capitalize(formatDate(monthStart, 'MMMM yyyy')),
      fijo,
      variable,
      total: fijo + variable,
    };
  });
}

export interface UnitRevenueBreakdown {
  unit: BusinessUnit;
  amount: number;
  share: number;
  invoiceCount: number;
}

export function getRevenueByUnit(
  range: DateRange,
  predicate?: (invoice: Invoice) => boolean,
): UnitRevenueBreakdown[] {
  const periodInvoices = invoicesInRange(range).filter((invoice) => !predicate || predicate(invoice));
  const total = sum(periodInvoices.map((invoice) => invoice.amount));

  return businessUnits.map((unit) => {
    const unitInvoices = periodInvoices.filter((invoice) => invoice.businessUnit === unit.id);
    const amount = sum(unitInvoices.map((invoice) => invoice.amount));
    return {
      unit,
      amount,
      share: total ? (amount / total) * 100 : 0,
      invoiceCount: unitInvoices.length,
    };
  });
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  share: number;
  count: number;
}

export function getCostsByCategory(range: DateRange): CategoryBreakdown[] {
  const periodExpenses = expensesInRange(range);
  const total = sum(periodExpenses.map((expense) => expense.amount));

  return expenseCategories.map((category) => {
    const categoryExpenses = periodExpenses.filter((expense) => expense.category === category.id);
    const amount = sum(categoryExpenses.map((expense) => expense.amount));
    return {
      category,
      amount,
      share: total ? (amount / total) * 100 : 0,
      count: categoryExpenses.length,
    };
  });
}

export function getUnitProfitability(range: DateRange): UnitProfitability[] {
  const periodInvoices = invoicesInRange(range);
  const periodExpenses = expensesInRange(range);
  const totalRevenue = sum(periodInvoices.map((invoice) => invoice.amount));
  const sharedCosts = sum(
    periodExpenses.filter((expense) => expense.businessUnit === 'compartido').map((expense) => expense.amount),
  );

  return businessUnits.map((unit) => {
    const revenue = sum(
      periodInvoices.filter((invoice) => invoice.businessUnit === unit.id).map((invoice) => invoice.amount),
    );
    const directCosts = sum(
      periodExpenses.filter((expense) => expense.businessUnit === unit.id).map((expense) => expense.amount),
    );
    const allocatedCosts = totalRevenue ? sharedCosts * (revenue / totalRevenue) : 0;
    const totalCosts = directCosts + allocatedCosts;
    const result = revenue - totalCosts;

    return {
      unit,
      revenue,
      directCosts,
      allocatedCosts,
      totalCosts,
      result,
      margin: revenue ? (result / revenue) * 100 : 0,
      revenueShare: totalRevenue ? (revenue / totalRevenue) * 100 : 0,
    };
  });
}

export function getTopPendingClients(asOf: Date, limit = 3): ClientReceivable[] {
  return getClientReceivables(asOf).slice(0, limit);
}

export function getFinancialAlerts(period: PeriodKey): FinancialAlert[] {
  const definition = getPeriodDefinition(period);
  const summary = getSummary(period);
  const receivables = getReceivables(definition.end);
  const overdueClients = getClientReceivables(definition.end).filter(
    (item) => item.status === 'vencido',
  ).length;
  const costDelta = percentChange(summary.costs, summary.previous.costs);
  const revenueDelta = percentChange(summary.revenue, summary.previous.revenue);

  const currentUnits = getRevenueByUnit(definition);
  const previousUnits = getRevenueByUnit(definition.previous);
  const unitGrowth = currentUnits
    .map((current) => {
      const previous = previousUnits.find((item) => item.unit.id === current.unit.id);
      return {
        ...current,
        growth: previous ? percentChange(current.amount, previous.amount) : 0,
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.growth - a.growth)[0];

  const topClients = getTopPendingClients(definition.end, 3);
  const topBalance = sum(topClients.map((item) => item.balance));
  const concentration = receivables.total ? (topBalance / receivables.total) * 100 : 0;

  const alerts: FinancialAlert[] = [];

  if (receivables.overdue > 0) {
    const share = receivables.total ? (receivables.overdue / receivables.total) * 100 : 0;
    alerts.push({
      id: 'overdue',
      severity: share >= 35 ? 'critica' : 'advertencia',
      title: `Cuentas vencidas por ${formatCurrency(receivables.overdue)}`,
      description: `Representa el ${formatNumber(share, 1)} % del saldo pendiente y afecta a ${overdueClients} clientes.`,
      href: '/cuentas-por-cobrar',
    });
  }

  alerts.push({
    id: 'costs',
    severity: costDelta > revenueDelta + 1 ? 'advertencia' : costDelta < 0 ? 'positiva' : 'info',
    title: `Los costos operativos ${costDelta >= 0 ? 'aumentaron' : 'disminuyeron'} ${formatNumber(Math.abs(costDelta), 1)} %`,
    description: `La facturación ${revenueDelta >= 0 ? 'creció' : 'cayó'} ${formatNumber(Math.abs(revenueDelta), 1)} % respecto del período anterior (${definition.comparisonLabel}).`,
    href: '/costos',
  });

  if (unitGrowth) {
    alerts.push({
      id: 'unit-growth',
      severity: unitGrowth.growth > 0 ? 'positiva' : 'info',
      title: `La facturación de ${unitGrowth.unit.shortName} ${unitGrowth.growth >= 0 ? 'creció' : 'cayó'} ${formatNumber(Math.abs(unitGrowth.growth), 1)} %`,
      description: `Aporta ${formatCurrency(unitGrowth.amount)} al período, el ${formatNumber(unitGrowth.share, 0)} % del total facturado.`,
      href: '/facturacion',
    });
  }

  if (topClients.length) {
    alerts.push({
      id: 'concentration',
      severity: concentration >= 50 ? 'advertencia' : 'info',
      title: `Tres clientes concentran el ${formatNumber(concentration, 0)} % de las cuentas pendientes`,
      description: `${topClients.map((item) => item.client.name).join(', ')}. Conviene priorizar su seguimiento.`,
      href: '/cuentas-por-cobrar',
    });
  }

  return alerts;
}

export interface KpiSparklines {
  revenue: number[];
  costs: number[];
  result: number[];
  pending: number[];
}

export function getKpiSparklines(period: PeriodKey): KpiSparklines {
  const definition = getPeriodDefinition(period);
  const monthly = getMonthlyFinancials(definition.end);
  const monthStarts = getTrailingMonths(definition.end);

  return {
    revenue: monthly.map((point) => point.revenue),
    costs: monthly.map((point) => point.costs),
    result: monthly.map((point) => point.result),
    pending: monthStarts.map((month) => getReceivables(endOfMonth(month)).total),
  };
}

export const STATUS_LABELS: Record<InvoiceDisplayStatus, string> = {
  pagada: 'Pagada',
  pendiente: 'Pendiente',
  'por-vencer': 'Por vencer',
  vencida: 'Vencida',
};

export const RECEIVABLE_STATUS_LABELS: Record<ReceivableStatus, string> = {
  pendiente: 'Pendiente',
  'por-vencer': 'Por vencer',
  vencido: 'Vencido',
};

export function getCostTypeTotals(range: DateRange) {
  const periodExpenses = expensesInRange(range);
  const fijo = sum(periodExpenses.filter((expense) => expense.type === 'fijo').map((expense) => expense.amount));
  const variable = sum(
    periodExpenses.filter((expense) => expense.type === 'variable').map((expense) => expense.amount),
  );
  return { fijo, variable, total: fijo + variable };
}
