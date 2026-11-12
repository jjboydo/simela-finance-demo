import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  accent?: string;
}

export function ChartCard({
  title,
  description,
  action,
  footer,
  children,
  className,
  contentClassName,
  accent = 'from-indigo-500 via-cyan-400 to-emerald-400',
}: ChartCardProps) {
  return (
    <Card className={cn('relative flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md', className)}>
      <span className={cn('absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r', accent)} />
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="min-w-0 space-y-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className={cn('flex-1', contentClassName)}>{children}</CardContent>
      {footer ? (
        <CardFooter className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6 sm:py-4">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
