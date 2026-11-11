import assert from 'node:assert/strict';
import { parseISO } from 'date-fns';
import { clients, expenses, invoices } from '../src/data/mock-data';
import {
  getClientReceivables,
  getCollectionRate,
  getFinancialAlerts,
  getMonthlyFinancials,
  getPeriodDefinition,
  getReceivables,
  getSummary,
  getUnitProfitability,
  isInvoicePaid,
} from '../src/lib/calculations';
import type { PeriodKey } from '../src/types';
import { formatCurrency, formatPercent } from '../src/lib/formatters';

const periods: PeriodKey[] = ['30d', '90d', '2026', '2025'];
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const closeTo = (actual: number, expected: number, tolerance = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

assert.ok(clients.length >= 15, 'Se requieren al menos 15 clientes');
assert.ok(invoices.length >= 30, 'Se requieren al menos 30 facturas');
assert.ok(expenses.length >= 20, 'Se requieren al menos 20 registros de gastos');
assert.ok(invoices.every((invoice) => invoice.amount > 0), 'Toda factura debe tener importe positivo');
assert.ok(expenses.every((expense) => expense.amount > 0), 'Todo gasto debe tener importe positivo');
assert.ok(
  invoices.every((invoice) => parseISO(invoice.dueDate) > parseISO(invoice.issueDate)),
  'Toda factura debe vencer después de su emisión',
);

for (const period of periods) {
  const definition = getPeriodDefinition(period);
  const summary = getSummary(period);
  const receivables = getReceivables(definition.end);

  const independentInvoices = invoices.filter((invoice) => {
    const date = parseISO(invoice.issueDate);
    return date >= definition.start && date <= definition.end;
  });
  const independentExpenses = expenses.filter((expense) => {
    const date = parseISO(expense.date);
    return date >= definition.start && date <= definition.end;
  });

  closeTo(summary.revenue, sum(independentInvoices.map((invoice) => invoice.amount)));
  closeTo(summary.costs, sum(independentExpenses.map((expense) => expense.amount)));
  closeTo(summary.result, summary.revenue - summary.costs);
  if (summary.revenue) {
    closeTo(summary.margin, (summary.result / summary.revenue) * 100, 1e-9);
  }
  closeTo(receivables.overdue + receivables.upcoming, receivables.total);
  closeTo(sum(receivables.aging.map((bucket) => bucket.amount)), receivables.total, 0.01);
  closeTo(
    sum(getClientReceivables(definition.end).map((item) => item.balance)),
    receivables.total,
    0.01,
  );

  const openIndependent = invoices.filter(
    (invoice) => parseISO(invoice.issueDate) <= definition.end && !isInvoicePaid(invoice, definition.end),
  );
  closeTo(summary.pending, sum(openIndependent.map((invoice) => invoice.amount)));

  const collectionRate = getCollectionRate(definition.end);
  assert.ok(collectionRate >= 0 && collectionRate <= 100, 'La tasa de cobranza debe estar entre 0 y 100');

  const units = getUnitProfitability(definition);
  closeTo(sum(units.map((unit) => unit.revenue)), summary.revenue);
  closeTo(sum(units.map((unit) => unit.totalCosts)), summary.costs, 0.5);
  closeTo(sum(units.map((unit) => unit.result)), summary.result, 0.5);
  closeTo(sum(units.map((unit) => unit.revenueShare)), 100, 0.001);

  const alerts = getFinancialAlerts(period);
  assert.ok(alerts.length >= 3, 'Debe haber al menos tres alertas');

  const monthly = getMonthlyFinancials(definition.end);
  assert.equal(monthly.length, 12);
  if (period === '2026' || period === '2025') {
    closeTo(sum(monthly.map((point) => point.revenue)), summary.revenue);
    closeTo(sum(monthly.map((point) => point.costs)), summary.costs);
  }

  console.log(
    `${definition.label.padEnd(26)} Ingresos ${formatCurrency(summary.revenue).padEnd(18)} Costos ${formatCurrency(summary.costs).padEnd(18)} Resultado ${formatCurrency(summary.result).padEnd(18)} Margen ${formatPercent(summary.margin, 1).padEnd(8)} Pendiente ${formatCurrency(receivables.total)}`,
  );
}

console.log(`\nOK · ${clients.length} clientes · ${invoices.length} facturas · ${expenses.length} gastos`);
console.log('Todas las validaciones de coherencia pasaron.');
