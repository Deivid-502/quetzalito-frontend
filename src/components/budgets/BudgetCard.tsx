'use client';

import { CategoryIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';
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

const STATUS_KEYS: Record<BudgetItem['status'], TranslationKey> = {
  unset:    'budgets.status.unset',
  ok:       'budgets.status.ok',
  warning:  'budgets.status.warning',
  alert:    'budgets.status.alert',
  exceeded: 'budgets.status.exceeded',
};

export function BudgetCard({ item, currency, onClick }: Props) {
  const t = useT();
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
            {t(STATUS_KEYS[item.status])}
          </p>
        </div>
        <p className="text-right text-sm font-semibold">
          {item.limit > 0 ? (
            <>
              <span>{formatCurrency(item.spent, currency)}</span>
              <span className="text-muted"> / {formatCurrency(item.limit, currency)}</span>
            </>
          ) : (
            <span className="text-muted text-xs font-medium">{t('budgets.undefined')}</span>
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
              {t('budgets.percentUsed', { n: Math.round(item.percent) })}
            </span>
            <span className="text-muted">
              {item.remaining > 0
                ? t('budgets.remainingAmount', {
                    amount: formatCurrency(item.remaining, currency),
                  })
                : t('budgets.exceededAmount', {
                    amount: formatCurrency(item.spent - item.limit, currency),
                  })}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-3 text-xs text-muted">{t('budgets.tapToDefine')}</p>
      )}
    </button>
  );
}
