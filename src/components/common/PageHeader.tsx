import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  footnote?: ReactNode;
}

export function PageHeader({ title, description, meta, actions, footnote }: PageHeaderProps) {
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {meta ? <div className="mb-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
          <h1 className="text-[27px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[30px]">
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
