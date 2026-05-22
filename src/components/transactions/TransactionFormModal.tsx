'use client';

import { FormEvent, useEffect, useState, useMemo } from 'react';
import { Loader2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, type SelectOption } from '@/components/ui/Select';
import { CategoryIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useEnvelopes } from '@/hooks/useEnvelopes';
import { useCategories } from '@/hooks/useCategories';
import { useT } from '@/lib/i18n';
import type { CreateTransactionPayload } from '@/types/transaction';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
  defaultEnvelopeId?: string;
  currency: string;
  onSubmit: (payload: CreateTransactionPayload) => Promise<unknown>;
}

export function TransactionFormModal({
  open,
  onClose,
  defaultType = 'expense',
  defaultEnvelopeId,
  currency,
  onSubmit,
}: Props) {
  const t = useT();
  const { envelopes } = useEnvelopes();
  const [type, setType] = useState<'income' | 'expense'>(defaultType);
  const { categories, loading: catLoading } = useCategories(type);

  const activeEnvelopes = useMemo(() => envelopes.filter((e) => !e.archivedAt), [envelopes]);

  const [amount, setAmount] = useState('');
  const [envelopeId, setEnvelopeId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [occurredAt, setOccurredAt] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset al abrir
  useEffect(() => {
    if (!open) return;
    setType(defaultType);
    const main = activeEnvelopes.find((e) => e.isMain);
    setEnvelopeId(defaultEnvelopeId ?? main?.id ?? activeEnvelopes[0]?.id ?? '');
    setAmount('');
    setCategoryId('');
    setDescription('');
    setOccurredAt(toLocalISO(new Date()));
    setError(null);
  }, [open, defaultType, defaultEnvelopeId, activeEnvelopes]);

  // Si se cambia el tipo, limpiar la categoría seleccionada (para evitar mismatch)
  useEffect(() => {
    setCategoryId('');
  }, [type]);

  const selectedEnvelope = activeEnvelopes.find((e) => e.id === envelopeId);
  const numericAmount = parseFloat(amount);
  const insufficient =
    type === 'expense' &&
    selectedEnvelope &&
    !Number.isNaN(numericAmount) &&
    numericAmount > selectedEnvelope.currentBalance;

  // Opciones del Listbox para sobres
  const envelopeOptions: SelectOption<string>[] = activeEnvelopes.map((e) => ({
    value: e.id,
    label: e.name,
    leading: (
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
        style={{ background: `${e.color}1A` }}
      >
        <CategoryIcon name={e.icon} className="h-3.5 w-3.5" />
      </span>
    ),
    trailing: formatCurrency(e.currentBalance, currency),
  }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!envelopeId) {
      setError(t('validation.requiredFields'));
      return;
    }
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError(t('validation.amountPositive'));
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: numericAmount,
        envelopeId,
        categoryId: categoryId || undefined,
        description: description.trim() || undefined,
        occurredAt: occurredAt ? new Date(occurredAt).toISOString() : undefined,
      });
      toast.success(t('transactions.created'));
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('common.error');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('transactions.add')}
      description={undefined}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Toggle tipo */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
          <TypeToggle
            active={type === 'expense'}
            onClick={() => setType('expense')}
            label={t('transactions.expense')}
            icon={<ArrowUpRight className="h-4 w-4" />}
            color="danger"
          />
          <TypeToggle
            active={type === 'income'}
            onClick={() => setType('income')}
            label={t('transactions.income')}
            icon={<ArrowDownLeft className="h-4 w-4" />}
            color="success"
          />
        </div>

        {/* Monto grande, foco principal */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            {t('common.amount')}
          </label>
          <div className="rounded-xl border surface px-4 py-3 border-ink-200 dark:border-ink-700">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-muted">{symbolFor(currency)}</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-ink-300"
                required
              />
            </div>
          </div>
          {insufficient && (
            <p className="mt-1.5 text-xs text-amber-600">
              ⚠️ {t('envelopes.transferInsufficient')}
            </p>
          )}
        </div>

        {/* Sobre — Listbox custom */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            {t('common.envelope')}
          </label>
          <Select
            options={envelopeOptions}
            value={envelopeId}
            onChange={setEnvelopeId}
            placeholder={t('envelopes.empty')}
            ariaLabel={t('common.envelope')}
          />
        </div>

        {/* Categorías como grilla visual */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            {t('common.category')}
          </label>
          {catLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {categories.map((c) => {
                const selected = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(selected ? '' : c.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border p-2 transition-all',
                      selected
                        ? 'border-brand-500 ring-2 ring-brand-300 bg-brand-50 dark:bg-brand-500/10'
                        : 'border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600',
                    )}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
                      style={{ background: `${c.color}1A`, color: c.color }}
                    >
                      <CategoryIcon name={c.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-medium text-center line-clamp-1">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Descripción + fecha */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label={t('common.descriptionOptional')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('transactions.descriptionPlaceholder')}
            maxLength={255}
          />
          <Input
            label={t('common.date')}
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={submitting}>
            {type === 'income' ? t('transactions.addIncome') : t('transactions.addExpense')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function TypeToggle({
  active,
  onClick,
  label,
  icon,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  color: 'danger' | 'success';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all',
        active
          ? color === 'danger'
            ? 'bg-white text-danger shadow-soft dark:bg-ink-700'
            : 'bg-white text-brand-600 shadow-soft dark:bg-ink-700'
          : 'text-muted hover:text-ink-700 dark:hover:text-ink-200',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function symbolFor(currency: string): string {
  const map: Record<string, string> = { GTQ: 'Q', USD: '$', EUR: '€', MXN: '$' };
  return map[currency] ?? currency;
}

function toLocalISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
