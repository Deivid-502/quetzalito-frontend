'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Wallet, ChevronDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import type { Envelope, TransferPayload } from '@/types/envelope';

interface Props {
  open: boolean;
  onClose: () => void;
  envelopes: Envelope[];
  defaultSourceId?: string | null;
  currency: string;
  onSubmit: (payload: TransferPayload) => Promise<unknown>;
}

export function TransferModal({
  open,
  onClose,
  envelopes,
  defaultSourceId,
  currency,
  onSubmit,
}: Props) {
  const active = useMemo(() => envelopes.filter((e) => !e.archivedAt), [envelopes]);

  const [sourceId, setSourceId] = useState<string>('');
  const [destinationId, setDestinationId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const main = active.find((e) => e.isMain);
    setSourceId(defaultSourceId ?? main?.id ?? active[0]?.id ?? '');
    setDestinationId(active.find((e) => e.id !== (defaultSourceId ?? main?.id))?.id ?? '');
    setAmount('');
    setDescription('');
    setError(null);
  }, [open, defaultSourceId, active]);

  const source = active.find((e) => e.id === sourceId);
  const destination = active.find((e) => e.id === destinationId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!sourceId || !destinationId) {
      setError('Seleccioná origen y destino.');
      return;
    }
    if (sourceId === destinationId) {
      setError('Origen y destino no pueden ser el mismo sobre.');
      return;
    }
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) {
      setError('Ingresá un monto válido.');
      return;
    }
    if (source && value > source.currentBalance) {
      setError('No tenés suficiente saldo en el sobre origen.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        sourceEnvelopeId: sourceId,
        destinationEnvelopeId: destinationId,
        amount: value,
        description: description.trim() || undefined,
      });
      toast.success('Transferencia realizada.');
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'No pudimos hacer la transferencia.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transferir entre sobres"
      description="Movés dinero de un sobre a otro sin afectar tu saldo total."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Visual flow source → destination */}
        <div className="flex items-center justify-between gap-2">
          <EnvelopeSelect
            label="Desde"
            value={sourceId}
            onChange={setSourceId}
            envelopes={active}
            currency={currency}
          />
          <ArrowRight className="mt-6 h-5 w-5 shrink-0 text-muted" />
          <EnvelopeSelect
            label="A"
            value={destinationId}
            onChange={setDestinationId}
            envelopes={active.filter((e) => e.id !== sourceId)}
            currency={currency}
          />
        </div>

        <Input
          label="Monto"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          hint={source ? `Disponible: ${formatCurrency(source.currentBalance, currency)}` : undefined}
          required
        />

        <Input
          label="Descripción (opcional)"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Por qué hacés esta transferencia?"
        />

        {/* Resumen */}
        {source && destination && amount && parseFloat(amount) > 0 && (
          <div className="rounded-xl bg-ink-50 p-3 text-sm dark:bg-ink-800">
            <p className="text-muted text-xs uppercase tracking-wide">Resumen</p>
            <p className="mt-1">
              <span className="font-semibold">{formatCurrency(parseFloat(amount), currency)}</span>{' '}
              de <span className="font-medium">{source.name}</span> →{' '}
              <span className="font-medium">{destination.name}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            Transferir
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function EnvelopeSelect({
  label,
  value,
  onChange,
  envelopes,
  currency,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  envelopes: Envelope[];
  currency: string;
}) {
  const selected = envelopes.find((e) => e.id === value);
  return (
    <div className="flex-1 min-w-0">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className={cn(
        'rounded-xl border surface px-3 py-2.5',
        'border-ink-200 dark:border-ink-700',
      )}>
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-base shrink-0"
            style={{ background: selected ? `${selected.color}1A` : '#f1f5f9' }}
          >
            {selected ? (
              <CategoryIcon name={selected.icon} className="h-4 w-4" />
            ) : (
              <Wallet className="h-4 w-4 text-muted" />
            )}
          </span>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 min-w-0 appearance-none bg-transparent pr-6 text-sm font-medium outline-none [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
          >
            {envelopes.length === 0 && <option value="">— Sin sobres —</option>}
            {envelopes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none -ml-5 h-4 w-4 text-ink-400" />
        </div>
        {selected && (
          <p className="mt-1 text-[11px] text-muted">
            Saldo: {formatCurrency(selected.currentBalance, currency)}
          </p>
        )}
      </div>
    </div>
  );
}
