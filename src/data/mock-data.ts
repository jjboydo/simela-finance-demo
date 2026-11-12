import { addDays, format, parseISO, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import type {
  BusinessUnit,
  BusinessUnitId,
  Client,
  Expense,
  ExpenseCategory,
  ExpenseCategoryId,
  ExpenseType,
  Invoice,
} from '@/types';

/** Fecha de cierre ficticia de la demo. Todos los indicadores se calculan contra este corte. */
export const REFERENCE_DATE = '2026-12-31';
export const DATA_UPDATED_AT = '2026-12-31T09:40:00';
export const referenceDate = parseISO(REFERENCE_DATE);
export const DATA_YEARS = [2024, 2025, 2026];

export const businessUnits: BusinessUnit[] = [
  {
    id: 'salud-laboral',
    name: 'Servicios de salud laboral',
    shortName: 'Salud laboral',
    description: 'Exámenes preocupacionales, controles periódicos y aptitud laboral.',
    color: '#4f46e5',
  },
  {
    id: 'medicina-laboral',
    name: 'Medicina laboral',
    shortName: 'Medicina laboral',
    description: 'Consultas médicas, seguimiento de ausentismo y telemedicina.',
    color: '#14b8a6',
  },
  {
    id: 'otros-servicios',
    name: 'Otros servicios',
    shortName: 'Otros servicios',
    description: 'Capacitaciones, asesoría preventiva y estudios complementarios.',
    color: '#d946ef',
  },
];

export const businessUnitById = businessUnits.reduce(
  (acc, unit) => ({ ...acc, [unit.id]: unit }),
  {} as Record<BusinessUnitId, BusinessUnit>,
);

export const expenseCategories: ExpenseCategory[] = [
  { id: 'recursos-humanos', name: 'Recursos humanos', color: '#4f46e5' },
  { id: 'insumos-medicos', name: 'Insumos médicos', color: '#06b6d4' },
  { id: 'servicios-mantenimiento', name: 'Servicios y mantenimiento', color: '#8b5cf6' },
  { id: 'administracion', name: 'Administración', color: '#f59e0b' },
  { id: 'otros-gastos', name: 'Otros gastos', color: '#f43f5e' },
];

export const expenseCategoryById = expenseCategories.reduce(
  (acc, category) => ({ ...acc, [category.id]: category }),
  {} as Record<ExpenseCategoryId, ExpenseCategory>,
);

export const clients: Client[] = [
  { id: 'cli-01', name: 'Centro Médico Aconcagua', industry: 'Salud privada', city: 'CABA', taxId: '30-71234561-4', paymentTermDays: 30, paymentRisk: 0.9 },
  { id: 'cli-02', name: 'Clínica San Rafael', industry: 'Salud privada', city: 'Rosario', taxId: '30-70987412-6', paymentTermDays: 45, paymentRisk: 1.15 },
  { id: 'cli-03', name: 'Grupo Salud del Plata', industry: 'Salud privada', city: 'La Plata', taxId: '30-71458963-1', paymentTermDays: 30, paymentRisk: 1.05 },
  { id: 'cli-04', name: 'Metalúrgica Pampeana S.R.L.', industry: 'Industria', city: 'Córdoba', taxId: '30-70845621-9', paymentTermDays: 60, paymentRisk: 1.35 },
  { id: 'cli-05', name: 'Transportes Ruta 8 S.A.', industry: 'Logística', city: 'Pilar', taxId: '30-71125874-3', paymentTermDays: 30, paymentRisk: 1.2 },
  { id: 'cli-06', name: 'Constructora del Litoral', industry: 'Construcción', city: 'Santa Fe', taxId: '30-70698547-2', paymentTermDays: 60, paymentRisk: 1.45 },
  { id: 'cli-07', name: 'Supermercados Norte Andino', industry: 'Retail', city: 'Mendoza', taxId: '30-71365498-7', paymentTermDays: 30, paymentRisk: 0.85 },
  { id: 'cli-08', name: 'Laboratorio Biotest del Sur', industry: 'Laboratorio', city: 'Bahía Blanca', taxId: '30-71045698-5', paymentTermDays: 45, paymentRisk: 0.95 },
  { id: 'cli-09', name: 'Estudio Contable Ferrer & Asoc.', industry: 'Servicios profesionales', city: 'CABA', taxId: '30-71587412-8', paymentTermDays: 30, paymentRisk: 0.9 },
  { id: 'cli-10', name: 'Textil Bonaerense S.A.', industry: 'Textil', city: 'Lanús', taxId: '30-70758963-4', paymentTermDays: 60, paymentRisk: 1.3 },
  { id: 'cli-11', name: 'Odontología Integral Belgrano', industry: 'Odontología', city: 'CABA', taxId: '30-71698547-0', paymentTermDays: 30, paymentRisk: 0.8 },
  { id: 'cli-12', name: 'Distribuidora Mediterránea', industry: 'Distribución', city: 'Rosario', taxId: '30-70963258-1', paymentTermDays: 45, paymentRisk: 1.1 },
  { id: 'cli-13', name: 'Frigorífico Patagonia Sur', industry: 'Alimentos', city: 'Neuquén', taxId: '30-70457896-3', paymentTermDays: 60, paymentRisk: 1.25 },
  { id: 'cli-14', name: 'Colegio San Martín', industry: 'Educación', city: 'Quilmes', taxId: '30-71298547-9', paymentTermDays: 30, paymentRisk: 0.95 },
  { id: 'cli-15', name: 'Agro Insumos del Oeste', industry: 'Agro', city: 'Junín', taxId: '30-70874125-6', paymentTermDays: 45, paymentRisk: 1.15 },
  { id: 'cli-16', name: 'Farmacéutica Vitalis', industry: 'Farmacéutica', city: 'CABA', taxId: '30-71369852-7', paymentTermDays: 30, paymentRisk: 0.85 },
  { id: 'cli-17', name: 'Seguros del Río', industry: 'Seguros', city: 'Paraná', taxId: '30-70587412-5', paymentTermDays: 45, paymentRisk: 1.0 },
  { id: 'cli-18', name: 'Fundación Horizonte', industry: 'Tercer sector', city: 'Mar del Plata', taxId: '30-71547896-2', paymentTermDays: 30, paymentRisk: 1.05 },
];

export const clientById = clients.reduce(
  (acc, client) => ({ ...acc, [client.id]: client }),
  {} as Record<string, Client>,
);

const CLIENT_UNITS: Record<string, BusinessUnitId[]> = {
  'cli-01': ['salud-laboral', 'medicina-laboral'],
  'cli-02': ['salud-laboral', 'medicina-laboral'],
  'cli-03': ['salud-laboral', 'medicina-laboral', 'otros-servicios'],
  'cli-04': ['salud-laboral', 'medicina-laboral'],
  'cli-05': ['salud-laboral'],
  'cli-06': ['salud-laboral'],
  'cli-07': ['salud-laboral', 'medicina-laboral'],
  'cli-08': ['salud-laboral', 'otros-servicios'],
  'cli-09': ['medicina-laboral', 'otros-servicios'],
  'cli-10': ['salud-laboral'],
  'cli-11': ['medicina-laboral', 'otros-servicios'],
  'cli-12': ['salud-laboral'],
  'cli-13': ['salud-laboral', 'medicina-laboral'],
  'cli-14': ['salud-laboral', 'medicina-laboral'],
  'cli-15': ['salud-laboral'],
  'cli-16': ['medicina-laboral', 'otros-servicios'],
  'cli-17': ['medicina-laboral', 'otros-servicios'],
  'cli-18': ['salud-laboral', 'otros-servicios'],
};

/** PRNG determinístico para que la demo siempre muestre el mismo set de datos. */
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20261231);
const roundTo = (value: number, step: number) => Math.round(value / step) * step;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const REVENUE_PLAN: Record<BusinessUnitId, { base: number; growth: number }> = {
  'salud-laboral': { base: 4_800_000, growth: 0.0075 },
  'medicina-laboral': { base: 1_950_000, growth: 0.0105 },
  'otros-servicios': { base: 820_000, growth: 0.0045 },
};

const REVENUE_SEASONALITY = [1.02, 0.93, 1.0, 1.01, 1.02, 1.03, 0.96, 1.01, 1.02, 1.03, 1.05, 1.07];
const COST_SEASONALITY = [1.01, 0.98, 1.0, 1.0, 1.01, 1.02, 1.0, 1.01, 1.01, 1.02, 1.02, 1.03];
const INVOICE_DAYS = [4, 9, 14, 19, 24, 28];

/**
 * Modelo de cobranza: cada factura recibe una fecha de pago simulada. La mayoría se cobra
 * alrededor del vencimiento y una pequeña porción queda impaga. Esto permite calcular cortes
 * históricos coherentes para cualquier período.
 */
const NEVER_PAID_PROBABILITY = 0.006;

interface ExpenseLinePlan {
  label: string;
  provider: string;
  unit: BusinessUnitId | 'compartido';
  type: ExpenseType;
  share: number;
}

interface ExpensePlan {
  category: ExpenseCategoryId;
  base: number;
  growth: number;
  lines: ExpenseLinePlan[];
}

const EXPENSE_PLAN: ExpensePlan[] = [
  {
    category: 'recursos-humanos',
    base: 2_750_000,
    growth: 0.0085,
    lines: [
      { label: 'Sueldos y cargas sociales', provider: 'Nómina interna', unit: 'compartido', type: 'fijo', share: 0.62 },
      { label: 'Honorarios profesionales', provider: 'Plantel médico', unit: 'medicina-laboral', type: 'fijo', share: 0.26 },
      { label: 'Capacitación y beneficios', provider: 'Varios proveedores', unit: 'compartido', type: 'fijo', share: 0.12 },
    ],
  },
  {
    category: 'insumos-medicos',
    base: 850_000,
    growth: 0.0095,
    lines: [
      { label: 'Insumos para exámenes preocupacionales', provider: 'MedPro Insumos', unit: 'salud-laboral', type: 'variable', share: 0.55 },
      { label: 'Insumos de consultorio', provider: 'Clínica Supply', unit: 'medicina-laboral', type: 'variable', share: 0.45 },
    ],
  },
  {
    category: 'servicios-mantenimiento',
    base: 520_000,
    growth: 0.007,
    lines: [
      { label: 'Alquiler y expensas', provider: 'Edificio Rivadavia', unit: 'compartido', type: 'fijo', share: 0.55 },
      { label: 'Mantenimiento de equipos', provider: 'TecnoMed Servicios', unit: 'compartido', type: 'fijo', share: 0.25 },
      { label: 'Servicios públicos', provider: 'Edenor / Metrogas', unit: 'compartido', type: 'fijo', share: 0.2 },
    ],
  },
  {
    category: 'administracion',
    base: 430_000,
    growth: 0.0075,
    lines: [
      { label: 'Sistemas y software', provider: 'CloudOps', unit: 'compartido', type: 'fijo', share: 0.45 },
      { label: 'Servicios contables y legales', provider: 'Estudio Ferrer & Asoc.', unit: 'compartido', type: 'fijo', share: 0.35 },
      { label: 'Seguros', provider: 'Seguros del Río', unit: 'compartido', type: 'fijo', share: 0.2 },
    ],
  },
  {
    category: 'otros-gastos',
    base: 260_000,
    growth: 0.008,
    lines: [
      { label: 'Logística y traslados', provider: 'Logística Norte', unit: 'salud-laboral', type: 'variable', share: 0.4 },
      { label: 'Gastos bancarios', provider: 'Banco del Plata', unit: 'compartido', type: 'variable', share: 0.35 },
      { label: 'Viáticos y representación', provider: 'Varios proveedores', unit: 'otros-servicios', type: 'variable', share: 0.25 },
    ],
  },
];

const invoices: Invoice[] = [];
const expenses: Expense[] = [];

for (const year of DATA_YEARS) {
  let invoiceSequence = 1;
  let expenseSequence = 1;

  for (let month = 0; month < 12; month += 1) {
    const monthStart = startOfMonth(new Date(year, month, 1));
    const monthIndex = (year - DATA_YEARS[0]) * 12 + month;

    businessUnits.forEach((unit, unitIndex) => {
      const plan = REVENUE_PLAN[unit.id];
      const target = roundTo(
        plan.base * Math.pow(1 + plan.growth, monthIndex) * REVENUE_SEASONALITY[month] * (0.985 + random() * 0.03),
        1_000,
      );

      const pool = clients.filter((client) => CLIENT_UNITS[client.id]?.includes(unit.id));
      const parts = unit.id === 'otros-servicios' ? 2 + Math.floor(random() * 2) : 3 + Math.floor(random() * 2);
      const weights = Array.from({ length: parts }, () => 0.75 + random() * 0.5);
      const weightTotal = sum(weights);
      const amounts = weights.map((weight) => roundTo((target * weight) / weightTotal, 1_000));
      amounts[amounts.length - 1] += target - sum(amounts);

      amounts.forEach((amount, partIndex) => {
        const client = pool[(month + unitIndex + partIndex) % pool.length];
        const issue = new Date(year, month, INVOICE_DAYS[(partIndex * 2 + unitIndex) % INVOICE_DAYS.length]);
        const due = addDays(issue, client.paymentTermDays);
        const neverPaid = random() < NEVER_PAID_PROBABILITY;
        const paymentRoll = random();
        let delay: number;
        if (paymentRoll < 0.5) {
          delay = -(1 + Math.floor(random() * 15));
        } else if (paymentRoll < 0.75) {
          delay = Math.floor(random() * 10);
        } else if (paymentRoll < 0.9) {
          delay = 10 + Math.floor(random() * 20);
        } else if (paymentRoll < 0.975) {
          delay = 30 + Math.floor(random() * 50);
        } else {
          delay = 80 + Math.floor(random() * 60);
        }
        const adjustedDelay =
          delay > 0 ? Math.round(delay * client.paymentRisk) : Math.round(delay / client.paymentRisk);
        let paymentDate = addDays(due, adjustedDelay);
        if (paymentDate <= issue) {
          paymentDate = addDays(issue, 2);
        }

        invoices.push({
          id: `fac-${year}-${String(invoiceSequence).padStart(4, '0')}`,
          number: `FAC-${year}-${String(invoiceSequence).padStart(4, '0')}`,
          clientId: client.id,
          businessUnit: unit.id,
          issueDate: format(issue, 'yyyy-MM-dd'),
          dueDate: format(due, 'yyyy-MM-dd'),
          paidDate: neverPaid ? null : format(paymentDate, 'yyyy-MM-dd'),
          amount,
        });
        invoiceSequence += 1;
      });
    });

    EXPENSE_PLAN.forEach((plan) => {
      const target = roundTo(
        plan.base * Math.pow(1 + plan.growth, monthIndex) * COST_SEASONALITY[month] * (0.99 + random() * 0.02),
        1_000,
      );
      const amounts = plan.lines.map((line) => roundTo(target * line.share, 1_000));
      amounts[amounts.length - 1] += target - sum(amounts);

      plan.lines.forEach((line, lineIndex) => {
        expenses.push({
          id: `gto-${year}-${String(expenseSequence).padStart(4, '0')}`,
          category: plan.category,
          businessUnit: line.unit,
          type: line.type,
          date: format(new Date(year, month, [3, 10, 17, 24, 27][lineIndex % 5]), 'yyyy-MM-dd'),
          amount: amounts[lineIndex],
          description: `${line.label} · ${format(monthStart, 'MMMM yyyy', { locale: es })}`,
          provider: line.provider,
        });
        expenseSequence += 1;
      });
    });
  }
}

export { invoices, expenses };
export const clientBusinessUnits = CLIENT_UNITS;

/**
 * Refuerza la cartera con algunos saldos impagos de distintos meses para que la demo muestre
 * una distribución de antigüedad completa (0-30, 31-60, 61-90 y más de 90 días).
 */
const FORCED_OPEN_CLIENTS = new Set(['cli-02', 'cli-05', 'cli-06', 'cli-12', 'cli-15']);
const FORCED_OPEN_MONTHS = ['2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];

FORCED_OPEN_MONTHS.forEach((month) => {
  const candidate = invoices
    .filter(
      (invoice) =>
        invoice.issueDate.startsWith(month) && FORCED_OPEN_CLIENTS.has(invoice.clientId),
    )
    .sort((a, b) => a.amount - b.amount)[0];
  if (candidate) {
    candidate.paidDate = null;
  }
});
