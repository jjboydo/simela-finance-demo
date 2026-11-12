import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getSectionTheme } from '@/components/layout/navigation';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  footnote?: ReactNode;
}

export function PageHeader({ title, description, meta, actions, footnote }: PageHeaderProps) {
  const location = useLocation();
  const theme = getSectionTheme(location.pathname);

  return (
    <div>
      <span className={cn('mb-4 block h-1.5 w-16 rounded-full bg-gradient-to-r', theme.gradient)} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {meta ? <div className="mb-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
          <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[32px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {footnote ? (
        <div className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400">
          {footnote}
        </div>
      ) : null}
    </div>
  );
}
