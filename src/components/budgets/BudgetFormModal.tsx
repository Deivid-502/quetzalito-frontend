'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/lib/icons';
import { ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { formatCurrency } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { BudgetItem, UpsertBudgetPayload } from '@/types/budget';

interface Props {
  open: boolean;
  onClose: () => void;
  item: BudgetItem | null;
  year: number;
  month: number;
  currency: string;
  onSubmit: (payload: UpsertBudgetPayload) => Promise<void>;
  onRemove?: (budgetId: string) => Promise<void>;
}

export function BudgetFormModal({
  open,
  onClose,
  item,
  year,
  month,
  currency,
  onSubmit,
  onRemove,
}: Props) {
  const t = useT();
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !item) return;
    setAmount(item.limit > 0 ? String(item.limit) : '');
    setError(null);
  }, [open, item]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!item) return;
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) {
      setError(t('budgets.errorAmountInvalid'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        categoryId: item.category.id,
        amount: value,
        periodYear: year,
        periodMonth: month,
      });
      toast.success(item.budgetId ? t('budgets.updated') : t('budgets.created'));
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('budgets.errorSave');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    if (!item?.budgetId || !onRemove) return;
    setRemoving(true);
    try {
      await onRemove(item.budgetId);
      toast.success(t('budgets.deleted'));
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('budgets.errorRemove');
      setError(msg);
    } finally {
      setRemoving(false);
    }
  }

  if (!item) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item.budgetId ? t('budgets.edit') : t('budgets.create')}
      description={t('budgets.formDesc')}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cabecera con la categoría */}
        <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3 dark:bg-ink-800">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${item.category.color}1A`, color: item.category.color }}
          >
            <CategoryIcon name={item.category.icon} className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">{item.category.name}</p>
            <p className="text-xs text-muted">
              {t('budgets.alreadySpent', { amount: formatCurrency(item.spent, currency) })}
            </p>
          </div>
        </div>

        <Input
          label={t('budgets.amountLabel')}
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          autoFocus
          required
          hint={t('budgets.amountHint', { currency })}
        />

        {error && (
          <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2">
          {item.budgetId && onRemove ? (
            <Button type="button" variant="ghost" onClick={handleRemove} loading={removing} className="!text-danger">
              {t('common.delete')}
            </Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit" loading={submitting}>
              {item.budgetId ? t('common.save') : t('budgets.define')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
