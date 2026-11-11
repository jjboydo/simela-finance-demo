import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface SortableHeaderProps {
  label: string;
  column: string;
  sortKey: string;
  direction: 'asc' | 'desc';
  onSort: (column: string) => void;
  align?: 'left' | 'right';
  className?: string;
}

export function SortableHeader({
  label,
  column,
  sortKey,
  direction,
  onSort,
  align = 'left',
  className,
}: SortableHeaderProps) {
  const active = sortKey === column;

  return (
    <TableHead className={cn(align === 'right' && 'text-right', className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors hover:text-slate-700',
          align === 'right' && 'flex-row-reverse',
          active ? 'text-slate-700' : 'text-slate-500',
        )}
      >
        {label}
        {active ? (
          direction === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 text-slate-300" />
        )}
      </button>
    </TableHead>
  );
}
