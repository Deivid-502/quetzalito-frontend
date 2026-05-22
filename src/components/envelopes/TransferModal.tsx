'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Wallet } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, type SelectOption } from '@/components/ui/Select';
import { CategoryIcon } from '@/lib/icons';
import { formatCurrency } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useT } from '@/lib/i18n';
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
  const t = useT();
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

  // Mapeo a opciones del Listbox: enriquecemos con el ícono coloreado del sobre.
  const sourceOptions: SelectOption<string>[] = active.map((e) => ({
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
  const destinationOptions = sourceOptions.filter((o) => o.value !== sourceId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!sourceId || !destinationId) {
      setError(t('validation.requiredFields'));
      return;
    }
    if (sourceId === destinationId) {
      setError(t('envelopes.transferSameError'));
      return;
    }
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) {
      setError(t('validation.amountPositive'));
      return;
    }
    if (source && value > source.currentBalance) {
      setError(t('envelopes.transferInsufficient'));
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
      toast.success(t('envelopes.transferSuccess'));
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
      title={t('envelopes.transferTitle')}
      description={undefined}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Visual flow source → destination */}
        <div className="flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              {t('envelopes.transferFrom')}
            </label>
            <Select
              options={sourceOptions}
              value={sourceId}
              onChange={setSourceId}
              ariaLabel={t('envelopes.transferFrom')}
            />
            {source && (
              <p className="mt-1 text-[11px] text-muted">
                {t('common.balance')}: {formatCurrency(source.currentBalance, currency)}
              </p>
            )}
          </div>
          <ArrowRight className="mb-3 h-5 w-5 shrink-0 text-muted" />
          <div className="flex-1 min-w-0">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              {t('envelopes.transferTo')}
            </label>
            <Select
              options={destinationOptions}
              value={destinationId}
              onChange={setDestinationId}
              ariaLabel={t('envelopes.transferTo')}
            />
            {destination && (
              <p className="mt-1 text-[11px] text-muted">
                {t('common.balance')}: {formatCurrency(destination.currentBalance, currency)}
              </p>
            )}
          </div>
        </div>

        <Input
          label={t('common.amount')}
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          hint={
            source
              ? `${t('common.available')}: ${formatCurrency(source.currentBalance, currency)}`
              : undefined
          }
          required
        />

        <Input
          label={t('common.descriptionOptional')}
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('envelopes.transferReason')}
        />

        {source && destination && amount && parseFloat(amount) > 0 && (
          <div className="rounded-xl bg-ink-50 p-3 text-sm dark:bg-ink-800">
            <p className="text-muted text-xs uppercase tracking-wide">
              {t('envelopes.transferSummary')}
            </p>
            <p className="mt-1">
              <span className="font-semibold">{formatCurrency(parseFloat(amount), currency)}</span>{' '}
              <Wallet className="inline h-3 w-3 text-muted" /> <span className="font-medium">{source.name}</span> →{' '}
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
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={submitting}>
            {t('envelopes.transferDoIt')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
