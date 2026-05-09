'use client';

import { CategoryIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import type { BudgetItem } from '@/types/budget';

interface Props {
  item: BudgetItem;
  currency: string;
  onClick: () => void;
}

const STATUS_STYLES: Record<BudgetItem['status'], { bar: string; text: string; tone: string }> = {
  unset:    { bar: 'bg-ink-300',     text: 'text-muted',         tone: '' },
  ok:       { bar: 'bg-brand-500',    text: 'text-brand-600',    tone: 'border-ink-200 dark:border-ink-700' },
  warning:  { bar: 'bg-amber-400',    text: 'text-amber-600',    tone: 'border-amber-200 bg-amber-50/40 dark:bg-amber-900/10 dark:border-amber-800/50' },
  alert:    { bar: 'bg-amber-500',    text: 'text-amber-700',    tone: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700' },
  exceeded: { bar: 'bg-danger',       text: 'text-danger',       tone: 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700' },
};

const STATUS_LABEL: Record<BudgetItem['status'], string> = {
  unset:    'Sin presupuesto',
  ok:       'Vas bien',
  warning:  'Atento',
  alert:    'Cerca del límite',
  exceeded: 'Excedido',
};

export function BudgetCard({ item, currency, onClick }: Props) {
  const styles = STATUS_STYLES[item.status];
  const widthPercent = Math.min(100, item.percent);

  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-full rounded-2xl border surface p-4 text-left transition-all',
        'hover:shadow-card hover:-translate-y-0.5',
        styles.tone,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${item.category.color}1A`, color: item.category.color }}
        >
          <CategoryIcon name={item.category.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{item.category.name}</p>
          <p className={cn('text-[11px] font-semibold', styles.text)}>
            {STATUS_LABEL[item.status]}
          </p>
        </div>
        <p className="text-right text-sm font-semibold">
          {item.limit > 0 ? (
            <>
              <span>{formatCurrency(item.spent, currency)}</span>
              <span className="text-muted"> / {formatCurrency(item.limit, currency)}</span>
            </>
          ) : (
            <span className="text-muted text-xs font-medium">Sin definir</span>
          )}
        </p>
      </div>

      {item.limit > 0 ? (
        <>
          <div className="mt-3 h-2 w-full rounded-full bg-ink-100 dark:bg-ink-700">
            <div
              className={cn('h-full rounded-full transition-all', styles.bar)}
              style={{ width: `${widthPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className={cn('font-semibold', styles.text)}>
              {Math.round(item.percent)}% usado
            </span>
            <span className="text-muted">
              {item.remaining > 0
                ? `Te quedan ${formatCurrency(item.remaining, currency)}`
                : `Excediste por ${formatCurrency(item.spent - item.limit, currency)}`}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-3 text-xs text-muted">
          Tocá para definir un presupuesto mensual para esta categoría.
        </p>
      )}
    </button>
  );
}
