import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { DATA_UPDATED_AT } from '@/data/mock-data';
import { formatDate } from '@/lib/formatters';
import { PeriodSelector } from './PeriodSelector';
import { getSectionName, getSectionTheme } from './navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  const location = useLocation();
  const section = getSectionName(location.pathname);
  const theme = getSectionTheme(location.pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMenu}
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', theme.dot)} />
            <p className="truncate text-xs font-semibold text-slate-900 sm:text-sm">{section}</p>
          </div>
          <p className="hidden text-[11px] text-slate-500 sm:block">
            Simela Salud Laboral · Información de demostración
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Actualizado {formatDate(DATA_UPDATED_AT, 'dd/MM/yyyy HH:mm')}
          </div>
          <PeriodSelector />
        </div>
      </div>
      <span
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r opacity-60',
          theme.gradient,
        )}
      />
    </header>
  );
}
