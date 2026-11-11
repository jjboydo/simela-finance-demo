import { Badge, type BadgeProps } from '@/components/ui/badge';
import { RECEIVABLE_STATUS_LABELS, STATUS_LABELS } from '@/lib/calculations';
import type { InvoiceDisplayStatus, ReceivableStatus } from '@/types';
import { cn } from '@/lib/utils';

const invoiceConfig: Record<InvoiceDisplayStatus, { variant: BadgeProps['variant']; dot: string }> = {
  pagada: { variant: 'success', dot: 'bg-emerald-500' },
  pendiente: { variant: 'info', dot: 'bg-blue-500' },
  'por-vencer': { variant: 'warning', dot: 'bg-amber-500' },
  vencida: { variant: 'danger', dot: 'bg-rose-500' },
};

const receivableConfig: Record<ReceivableStatus, { variant: BadgeProps['variant']; dot: string }> = {
  pendiente: { variant: 'info', dot: 'bg-blue-500' },
  'por-vencer': { variant: 'warning', dot: 'bg-amber-500' },
  vencido: { variant: 'danger', dot: 'bg-rose-500' },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceDisplayStatus }) {
  const config = invoiceConfig[status];
  return (
    <Badge variant={config.variant}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function ReceivableStatusBadge({ status }: { status: ReceivableStatus }) {
  const config = receivableConfig[status];
  return (
    <Badge variant={config.variant}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {RECEIVABLE_STATUS_LABELS[status]}
    </Badge>
  );
}
