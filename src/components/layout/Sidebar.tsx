import { NavLink } from 'react-router-dom';
import { Activity, Building2 } from 'lucide-react';
import { NAV_ITEMS } from './navigation';
import { cn } from '@/lib/utils';

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white shadow-sm shadow-indigo-500/20">
          <Activity className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-[15px] font-semibold tracking-[0.15em] text-slate-900">SIMELA</p>
          <p className="text-[11px] text-slate-500">Gestión financiera</p>
        </div>
      </div>

      <nav className="flex-1 px-3" aria-label="Navegación principal">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Panel
        </p>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive ? cn('font-medium', item.theme.active) : cn('text-slate-600', item.theme.hover),
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-opacity',
                        isActive ? 'text-current' : item.theme.icon,
                        !isActive && 'opacity-75 group-hover:opacity-100',
                      )}
                    />
                    <span className="min-w-0 flex-1">{item.label}</span>
                    {isActive ? (
                      <span className={cn('h-1.5 w-1.5 rounded-full', item.theme.dot)} />
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-3">
        <div className="rounded-xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/80 via-white to-cyan-50/50 p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-indigo-400" />
            <p className="text-sm font-medium text-slate-800">Simela Salud Laboral</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <p className="text-[11px] font-medium text-slate-500">Demo de presentación</p>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            Datos ficticios con fines ilustrativos.
          </p>
        </div>
        <p className="mt-4 px-1 text-[10px] text-slate-400">© 2026 · Entorno de demostración</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-gradient-to-b from-white via-white to-slate-50/80 lg:block">
      <SidebarContent />
    </aside>
  );
}
