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
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Activity className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold tracking-[0.13em] text-slate-900">SIMELA FINANCE</p>
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
                    isActive
                      ? 'bg-blue-50 font-medium text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600',
                      )}
                    />
                    <span className="min-w-0 flex-1">{item.label}</span>
                    {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
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
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
      <SidebarContent />
    </aside>
  );
}
