import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { getPeriodDefinition } from '@/lib/calculations';
import type { PeriodDefinition, PeriodKey } from '@/types';

interface PeriodContextValue {
  period: PeriodKey;
  setPeriod: (period: PeriodKey) => void;
  definition: PeriodDefinition;
}

const PeriodContext = createContext<PeriodContextValue | undefined>(undefined);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<PeriodKey>('2026');
  const definition = useMemo(() => getPeriodDefinition(period), [period]);

  return (
    <PeriodContext.Provider value={{ period, setPeriod, definition }}>
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error('usePeriod debe utilizarse dentro de PeriodProvider');
  }
  return context;
}
