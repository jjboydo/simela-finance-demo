import { Link } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Info,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AlertSeverity, FinancialAlert } from '@/types';
import { cn } from '@/lib/utils';

const severityConfig: Record<
  AlertSeverity,
  { icon: LucideIcon; wrapper: string; label: string; badge: 'danger' | 'warning' | 'success' | 'info' }
> = {
  critica: {
    icon: AlertTriangle,
    wrapper: 'bg-rose-50 text-rose-600',
    label: 'Crítica',
    badge: 'danger',
  },
  advertencia: {
    icon: AlertCircle,
    wrapper: 'bg-amber-50 text-amber-600',
    label: 'Atención',
    badge: 'warning',
  },
  positiva: {
    icon: TrendingUp,
    wrapper: 'bg-emerald-50 text-emerald-600',
    label: 'Positiva',
    badge: 'success',
  },
  info: {
    icon: Info,
    wrapper: 'bg-blue-50 text-blue-600',
    label: 'Informativa',
    badge: 'info',
  },
};

interface AlertsPanelProps {
  alerts: FinancialAlert[];
  className?: string;
}

export function AlertsPanel({ alerts, className }: AlertsPanelProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Alertas financieras</CardTitle>
            <CardDescription>Señales automáticas calculadas sobre los datos del período.</CardDescription>
          </div>
          <Badge variant="outline">{alerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 pt-0">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <Link
              key={alert.id}
              to={alert.href}
              className="group flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
            >
              <span
                className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                  config.wrapper,
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {config.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-900">{alert.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{alert.description}</p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
            </Link>
          );
        })}
      </CardContent>
      <CardFooter className="border-t border-slate-100 px-5 py-4 sm:px-6 sm:py-4">
        <Link
          to="/cuentas-por-cobrar"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          Revisar cuentas por cobrar
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
