import { Sparkles } from 'lucide-react';
import { formatCompactCurrency, formatCurrency, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface PeriodInsightProps {
  revenue: number;
  result: number;
  margin: number;
  revenueDelta: number;
  comparisonLabel: string;
  overdue: number;
  overdueShare: number;
}

export function PeriodInsight({
  revenue,
  result,
  margin,
  revenueDelta,
  comparisonLabel,
  overdue,
  overdueShare,
}: PeriodInsightProps) {
  const positive = revenueDelta >= 0;
  const nearlyFlat = Math.abs(revenueDelta) < 0.05;

  return (
    <div className="rounded-xl bg-gradient-to-r from-indigo-500/70 via-cyan-400/50 to-emerald-400/60 p-[1px] shadow-lg shadow-indigo-500/10">
      <div className="relative overflow-hidden rounded-[11px] bg-[linear-gradient(120deg,#0b1120_0%,#171a3a_50%,#0b1120_100%)] px-5 py-5 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Lectura del período
            </div>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-100 sm:text-[15px]">
              La facturación alcanzó{' '}
              <span className="font-semibold text-white">{formatCurrency(revenue)}</span>,{' '}
              {nearlyFlat ? (
                'sin cambios relevantes'
              ) : (
                <>
                  {positive ? 'un crecimiento de' : 'una caída de'}{' '}
                  <span
                    className={cn(
                      'font-semibold',
                      positive ? 'text-emerald-300' : 'text-rose-300',
                    )}
                  >
                    {formatPercent(Math.abs(revenueDelta), 1)}
                  </span>{' '}
                  frente al período anterior
                </>
              )}
              , con un margen operativo de{' '}
              <span className="font-semibold text-white">{formatPercent(margin, 1)}</span>.
            </p>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Comparativo: {comparisonLabel}. Los importes están expresados en pesos argentinos.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 xl:w-[380px] xl:shrink-0">
            <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2.5">
              <p className="text-[9px] font-medium uppercase tracking-wide text-emerald-200/70">
                Resultado
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-emerald-200">
                {formatCompactCurrency(result)}
              </p>
              <p className="mt-0.5 text-[9px] text-emerald-200/50">operativo</p>
            </div>
            <div className="rounded-lg border border-violet-400/25 bg-violet-500/10 px-3 py-2.5">
              <p className="text-[9px] font-medium uppercase tracking-wide text-violet-200/70">
                Margen
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-violet-200">
                {formatPercent(margin, 1)}
              </p>
              <p className="mt-0.5 text-[9px] text-violet-200/50">sobre ingresos</p>
            </div>
            <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2.5">
              <p className="text-[9px] font-medium uppercase tracking-wide text-rose-200/70">
                Vencido
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-rose-200">
                {formatCompactCurrency(overdue)}
              </p>
              <p className="mt-0.5 text-[9px] text-rose-200/50">
                {formatPercent(overdueShare, 1)} del saldo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
