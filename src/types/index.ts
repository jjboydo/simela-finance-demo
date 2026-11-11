export type BusinessUnitId = 'salud-laboral' | 'medicina-laboral' | 'otros-servicios';

export type ExpenseCategoryId =
  | 'recursos-humanos'
  | 'insumos-medicos'
  | 'servicios-mantenimiento'
  | 'administracion'
  | 'otros-gastos';

export type ExpenseType = 'fijo' | 'variable';

export type InvoiceDisplayStatus = 'pagada' | 'pendiente' | 'por-vencer' | 'vencida';

export type ReceivableStatus = 'pendiente' | 'por-vencer' | 'vencido';

export type PeriodKey = '30d' | '90d' | '2026' | '2025';

export type AlertSeverity = 'critica' | 'advertencia' | 'positiva' | 'info';

export interface Client {
  id: string;
  name: string;
  industry: string;
  city: string;
  taxId: string;
  paymentTermDays: number;
  /** Factor de comportamiento de pago: valores mayores implican mayor morosidad. */
  paymentRisk: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  businessUnit: BusinessUnitId;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  amount: number;
}

export interface Expense {
  id: string;
  category: ExpenseCategoryId;
  businessUnit: BusinessUnitId | 'compartido';
  type: ExpenseType;
  date: string;
  amount: number;
  description: string;
  provider: string;
}

export interface BusinessUnit {
  id: BusinessUnitId;
  name: string;
  shortName: string;
  description: string;
  color: string;
}

export interface ExpenseCategory {
  id: ExpenseCategoryId;
  name: string;
  color: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PeriodDefinition extends DateRange {
  key: PeriodKey;
  label: string;
  shortLabel: string;
  comparisonLabel: string;
  previous: DateRange;
  asOfLabel: string;
}

export interface MonthlyFinancialPoint {
  key: string;
  label: string;
  fullLabel: string;
  revenue: number;
  costs: number;
  result: number;
  margin: number;
  invoiceCount: number;
}

export interface AgingBucket {
  label: string;
  amount: number;
  invoices: number;
  color: string;
}

export interface ClientReceivable {
  client: Client;
  openInvoices: Invoice[];
  invoicesCount: number;
  balance: number;
  overdueBalance: number;
  maxDaysOverdue: number;
  status: ReceivableStatus;
}

export interface UnitProfitability {
  unit: BusinessUnit;
  revenue: number;
  directCosts: number;
  allocatedCosts: number;
  totalCosts: number;
  result: number;
  margin: number;
  revenueShare: number;
}

export interface FinancialAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  href: string;
}

export interface PeriodSummary {
  revenue: number;
  costs: number;
  result: number;
  margin: number;
  invoiceCount: number;
  averageTicket: number;
  pending: number;
  overdue: number;
  previous: {
    revenue: number;
    costs: number;
    result: number;
    margin: number;
    pending: number;
  };
}
