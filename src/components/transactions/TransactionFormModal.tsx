'use client';

import { FormEvent, useEffect, useState, useMemo } from 'react';
import { Loader2, Wallet, ArrowDownLeft, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useEnvelopes } from '@/hooks/useEnvelopes';
import { useCategories } from '@/hooks/useCategories';
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!envelopeId) {
      setError('Seleccioná un sobre.');
      return;
    }
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Ingresá un monto válido.');
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
      toast.success(type === 'income' ? '¡Ingreso registrado!' : '¡Gasto registrado!');
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'No pudimos guardar el movimiento.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo movimiento"
      description="Registrá tu gasto o ingreso en pocos segundos."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Toggle tipo */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
          <TypeToggle
            active={type === 'expense'}
            onClick={() => setType('expense')}
            label="Gasto"
            icon={<ArrowUpRight className="h-4 w-4" />}
            color="danger"
          />
          <TypeToggle
            active={type === 'income'}
            onClick={() => setType('income')}
            label="Ingreso"
            icon={<ArrowDownLeft className="h-4 w-4" />}
            color="success"
          />
        </div>

        {/* Monto grande, foco principal */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Monto
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
              ⚠️ Excede el saldo del sobre. Se permitirá pero quedará en negativo.
            </p>
          )}
        </div>

        {/* Sobre */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Sobre
          </label>
          <div className="rounded-xl border surface px-3 py-2.5 border-ink-200 dark:border-ink-700">
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-base shrink-0"
                style={{
                  background: selectedEnvelope ? `${selectedEnvelope.color}1A` : '#f1f5f9',
                }}
              >
                {selectedEnvelope ? (
                  <CategoryIcon name={selectedEnvelope.icon} className="h-4 w-4" />
                ) : (
                  <Wallet className="h-4 w-4 text-muted" />
                )}
              </span>
              <select
                value={envelopeId}
                onChange={(e) => setEnvelopeId(e.target.value)}
                className="flex-1 appearance-none bg-transparent pr-6 text-sm font-medium outline-none [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
                required
              >
                {activeEnvelopes.length === 0 && <option value="">— Sin sobres —</option>}
                {activeEnvelopes.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none -ml-5 h-4 w-4 text-ink-400" />
              {selectedEnvelope && (
                <span className="text-xs text-muted shrink-0">
                  {formatCurrency(selectedEnvelope.currentBalance, currency)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Categorías como grilla visual */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Categoría
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
            label="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Almuerzo, Uber..."
            maxLength={255}
          />
          <Input
            label="Fecha y hora"
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
            Cancelar
          </Button>
          <Button type="submit" loading={submitting} variant={type === 'income' ? 'primary' : 'primary'}>
            Guardar {type === 'income' ? 'ingreso' : 'gasto'}
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
